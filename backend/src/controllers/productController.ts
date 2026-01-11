import { Request, Response } from 'express';
import prisma from '../config/db';
import { Prisma } from '@prisma/client';

// @desc    Fetch dynamic navigation structure based on available products
// @route   GET /api/products/navigation
// @access  Public
export const getNavigation = async (req: Request, res: Response) => {
  try {
    // Fetch all distinct combinations
    const products = await prisma.product.findMany({
      select: {
        gender: true,
        category: true,
        subcategory: true,
        isNew: true
      },
      where: {
        stock: { gt: 0 } // Only show categories with stock
      }
    });

    // Structure: Gender -> Category -> Subcategories
    const navMap: Record<string, Record<string, Set<string>>> = {};
    
    // Track new arrivals per gender
    const newArrivalsMap: Record<string, boolean> = {};

    products.forEach(p => {
      if (!p.gender || !p.category) return;
      
      const gender = p.gender; // e.g. "Men"
      const category = p.category; // e.g. "Outerwear"
      const sub = p.subcategory; // e.g. "Jacket"

      if (!navMap[gender]) navMap[gender] = {};
      if (!navMap[gender][category]) navMap[gender][category] = new Set();
      
      if (sub) {
        navMap[gender][category].add(sub);
      }

      if (p.isNew) {
          newArrivalsMap[gender] = true;
      }
    });

    // Define explicit type for Menu Items
    type MenuItem = {
        label: string;
        subcategory?: string;
        isNew?: boolean;
    };

    // Transform to frontend menu format
    const menu = Object.keys(navMap).map(gender => {
      const categories = navMap[gender];
      
      // Build columns
      const columns: { title: string; items: MenuItem[] }[] = Object.keys(categories).map(cat => ({
        title: cat,
        items: Array.from(categories[cat]).map(sub => ({
            label: sub,
            subcategory: sub
        }))
      }));

      // Add "New Arrivals" if applicable
      if (newArrivalsMap[gender]) {
          const newArrivalItem: MenuItem = { label: 'New Arrivals', isNew: true };

          if (columns.length > 0) {
              columns[0].items.unshift(newArrivalItem);
          } else {
              columns.push({
                  title: 'Collections',
                  items: [newArrivalItem]
              });
          }
      }

      return {
        label: gender,
        href: `#${gender.toLowerCase()}`,
        columns: columns
      };
    });

    // Ensure specific order if needed (Men, Women, Kids)
    const order = ['Men', 'Women', 'Kids', 'Unisex'];
    menu.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));

    // Add fixed Sale tab
    menu.push({
        label: 'Sale',
        href: '#sale',
        columns: [], 
        isHighlight: true
    } as any);

    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch all products with filtering, sorting and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      keyword, 
      category, 
      gender, 
      subcategory,
      isNew,
      minPrice, 
      maxPrice, 
      sort, 
      page = 1, 
      limit = 10,
      all = false 
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build Query
    const where: Prisma.ProductWhereInput = {};

    if (keyword) {
      where.OR = [
        { name: { contains: String(keyword), mode: 'insensitive' } },
        { description: { contains: String(keyword), mode: 'insensitive' } },
        { category: { contains: String(keyword), mode: 'insensitive' } },
        { subcategory: { contains: String(keyword), mode: 'insensitive' } },
      ];
    }

    if (category) {
      const categories = String(category).split(',');
      if (categories.length > 0) {
          // Use 'in' for multiple categories
          where.category = { in: categories, mode: 'insensitive' };
      }
    }

    if (subcategory) {
        where.subcategory = { contains: String(subcategory), mode: 'insensitive' };
    }

    if (gender) {
      if (String(gender).toLowerCase() !== 'all') {
          where.gender = { equals: String(gender), mode: 'insensitive' };
      }
    }

    if (isNew === 'true') {
        where.isNew = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };
    if (sort === 'popular') orderBy = { reviewCount: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const count = await prisma.product.count({ where });
    
    const take = all === 'true' ? undefined : limitNumber;
    const skipVal = all === 'true' ? undefined : skip;

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: skipVal,
      take: take,
    });

    res.json({
      products: products,
      page: pageNumber,
      pages: take ? Math.ceil(count / take) : 1,
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Fetch single product with reviews
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        reviews: {
          include: {
            user: { select: { name: true, avatar: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, price, description, image, hoverImage, images, category, gender, 
      stock, colors, sizes, subcategory, isNew 
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        image,
        hoverImage: hoverImage || image,
        images: images || [],
        category,
        gender,
        subcategory,
        stock: Number(stock) || 0,
        colors: colors || [],
        sizes: sizes || [],
        isNew: isNew || true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
      name, price, description, image, hoverImage, images, category, gender,
      stock, colors, sizes, subcategory, isNew, isSale, discountPrice
    } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        price,
        description,
        image,
        hoverImage,
        images,
        category,
        gender,
        subcategory,
        stock: Number(stock),
        colors,
        sizes,
        isNew,
        isSale,
        discountPrice
      },
    });

    res.json(product);
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = async (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await prisma.review.findFirst({
      where: {
        userId: req.user.id,
        productId: req.params.id
      }
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        userId: req.user.id,
        productId: req.params.id
      }
    });

    // Update product rating
    const reviews = await prisma.review.findMany({ where: { productId: req.params.id } });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await prisma.product.update({
      where: { id: req.params.id },
      data: {
        rating: avgRating,
        reviewCount: reviews.length
      }
    });

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};