
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MOCK_PRODUCTS = [
  // ... (Existing Products would go here, omitting for brevity to focus on Static Pages change) ...
  {
    name: 'Minimalist Tech Parka',
    price: 245,
    category: 'Outerwear',
    gender: 'Men',
    subcategory: 'Jacket',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&q=80',
    isNew: true,
    rating: 4.8,
    reviewCount: 124,
    colors: ['#000000', '#565E63', '#9CA3AF'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Engineered for urban exploration. This parka features a water-resistant shell, breathable lining, and a modular hood system.',
    stock: 45
  },
  {
    name: 'Organic Cotton Basic Tee',
    price: 45,
    category: 'Essentials',
    gender: 'Women',
    subcategory: 'T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    isSale: true,
    discountPrice: 35,
    rating: 4.5,
    reviewCount: 89,
    colors: ['#FFFFFF', '#000000', '#D1D5DB'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'The perfect everyday tee. Made from 100% organic cotton with a relaxed fit and reinforced seams.',
    stock: 120
  },
  {
    name: 'Structure Wool Blazer',
    price: 350,
    category: 'Tailoring',
    gender: 'Men',
    subcategory: 'Jacket',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c472997?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    rating: 4.9,
    reviewCount: 56,
    colors: ['#1F2937', '#4B5563'],
    sizes: ['46', '48', '50', '52', '54'],
    description: 'Modern tailoring meets classic silhouette. Italian wool blend with a soft shoulder construction.',
    stock: 20
  },
  {
    name: 'Everyday Canvas Tote',
    price: 85,
    category: 'Accessories',
    gender: 'Unisex',
    subcategory: 'Bag',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    isNew: true,
    rating: 4.7,
    reviewCount: 230,
    colors: ['#E5E7EB', '#9CA3AF'],
    sizes: ['One Size'],
    description: 'Durable, spacious, and stylish. Fits a 16-inch laptop and all your daily essentials.',
    stock: 80
  },
  {
    name: 'Hybrid Puffer Vest',
    price: 160,
    category: 'Outerwear',
    gender: 'Men',
    subcategory: 'Vest',
    image: 'https://images.unsplash.com/photo-1618354691373-4ca1cba4df3e?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1618354752201-c94f572cca40?w=800&q=80',
    rating: 4.6,
    reviewCount: 98,
    colors: ['#000000','#4B5563','#9CA3AF'],
    sizes: ['S','M','L','XL'],
    description: 'Insulated core warmth with lightweight freedom of movement.',
    stock: 35
  },
  {
    name: 'Everyday Relaxed Hoodie',
    price: 90,
    category: 'Essentials',
    gender: 'Women',
    subcategory: 'Hoodie',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    rating: 4.7,
    reviewCount: 320,
    colors: ['#FFFFFF','#D1D5DB','#374151','#000000'],
    sizes: ['XS','S','M','L','XL'],
    description: 'Soft brushed fleece with a relaxed fit for daily comfort.',
    stock: 200
  },
  {
    name: 'Double-Breasted Wool Coat',
    price: 420,
    category: 'Tailoring',
    gender: 'Women',
    subcategory: 'Coat',
    image: 'https://images.unsplash.com/photo-1542060748-10c28b62716e?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80',
    rating: 4.9,
    reviewCount: 62,
    colors: ['#1F2937','#4B5563','#8B5E3C'],
    sizes: ['XS','S','M','L'],
    description: 'Structured silhouette crafted from premium wool blend.',
    stock: 28
  },
  {
    name: 'Compact Leather Crossbody',
    price: 150,
    category: 'Accessories',
    gender: 'Unisex',
    subcategory: 'Bag',
    image: 'https://images.unsplash.com/photo-1622441232628-6a0e5b1e81f9?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1526178613552-2f83a76019d3?w=800&q=80',
    rating: 4.5,
    reviewCount: 140,
    colors: ['#1E1E1E','#D1B89C'],
    sizes: ['One Size'],
    description: 'Minimal profile with just enough space for the essentials.',
    stock: 75
  },
  {
    name: 'Lightweight Trail Runner',
    price: 195,
    category: 'Footwear',
    gender: 'Unisex',
    subcategory: 'Sneakers',
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1575536129406-711f66d9dcd2?w=800&q=80',
    rating: 4.4,
    reviewCount: 215,
    colors: ['#000000','#FFFFFF','#6366F1'],
    sizes: ['6','7','8','9','10','11','12'],
    description: 'Responsive cushioning with rugged grip for mixed terrain.',
    stock: 65
  },
  {
    name: 'Relaxed Fit Cargo Pants',
    price: 110,
    category: 'Bottoms',
    gender: 'Men',
    subcategory: 'Cargo',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1582152629442-4eab8fc9a64d?w=800&q=80',
    rating: 4.3,
    reviewCount: 180,
    colors: ['#374151','#6B7280','#9CA3AF'],
    sizes: ['S','M','L','XL'],
    description: 'Military-inspired pockets with a modern relaxed taper.',
    stock: 90
  },
  {
    name: 'Cable Knit Wool Sweater',
    price: 160,
    category: 'Knitwear',
    gender: 'Women',
    subcategory: 'Sweater',
    image: 'https://images.unsplash.com/photo-1600481176431-d3bff56d2439?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    rating: 4.8,
    reviewCount: 110,
    colors: ['#FFFFFF','#E5E7EB','#8B5E3C'],
    sizes: ['XS','S','M','L','XL'],
    description: 'Classic cable texture with soft wool warmth.',
    stock: 48
  },
  {
    name: 'Urban Nylon Backpack',
    price: 120,
    category: 'Accessories',
    gender: 'Unisex',
    subcategory: 'Bag',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    rating: 4.7,
    reviewCount: 310,
    colors: ['#111827','#374151','#1E3A8A'],
    sizes: ['One Size'],
    description: 'Tech-ready compartments with water-repellent shell.',
    stock: 115
  },
  {
    name: 'Performance Compression Leggings',
    price: 95,
    category: 'Activewear',
    gender: 'Women',
    subcategory: 'Leggings',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1600180758890-6d8a6c3c8e09?w=800&q=80',
    rating: 4.5,
    reviewCount: 276,
    colors: ['#111827','#6B7280','#9CA3AF'],
    sizes: ['XS','S','M','L','XL'],
    description: 'Moisture-wicking fabric with high stretch support.',
    stock: 170
  },
  {
    name: 'Oxford Leather Derby Shoes',
    price: 280,
    category: 'Formal',
    gender: 'Men',
    subcategory: 'Shoes',
    image: 'https://images.unsplash.com/photo-1600180758890-6d8a6c3c8e09?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1600180759153-7d0d2658d809?w=800&q=80',
    rating: 4.9,
    reviewCount: 52,
    colors: ['#1F1F1F','#8B5E3C'],
    sizes: ['7','8','9','10','11','12'],
    description: 'Italian-inspired shape with hand-finished leather.',
    stock: 32
  },

  {
    name: 'Quilted Insulated Jacket',
    price: 210,
    category: 'Outerwear',
    gender: 'Women',
    subcategory: 'Jacket',
    image: 'https://images.unsplash.com/photo-1549209063-37bb0ba3c283?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1542060748-10c28b62716e?w=800&q=80',
    rating: 4.4,
    reviewCount: 102,
    colors: ['#4B5563','#1F2937','#F5F5F5'],
    sizes: ['XS','S','M','L','XL'],
    description: 'Lightweight insulation with a slightly cropped fit for colder days.',
    stock: 65
  },
  {
    name: 'Oversized Graphic Tee',
    price: 55,
    category: 'Essentials',
    gender: 'Unisex',
    subcategory: 'T-Shirt',
    image: 'https://images.unsplash.com/photo-1593032465171-8ab4bd55fce9?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    rating: 4.2,
    reviewCount: 188,
    colors: ['#000000','#F3F4F6'],
    sizes: ['S','M','L','XL','XXL'],
    description: 'Heavyweight cotton with a relaxed street-ready fit.',
    stock: 210
  },
  {
    name: 'Structured Linen Shirt',
    price: 95,
    category: 'Tailoring',
    gender: 'Men',
    subcategory: 'Shirt',
    image: 'https://images.unsplash.com/photo-1622441232628-6a0e5b1e81f9?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    rating: 4.6,
    reviewCount: 89,
    colors: ['#D1D5DB','#E5E7EB','#FFFFFF'],
    sizes: ['S','M','L','XL'],
    description: 'Breathable linen blend perfect for warm evenings.',
    stock: 44
  },
  {
    name: 'Premium Wool Beanie',
    price: 40,
    category: 'Accessories',
    gender: 'Unisex',
    subcategory: 'Headwear',
    image: 'https://images.unsplash.com/photo-1602330197427-41fe6c53cdc3?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1600481176431-d3bff56d2439?w=800&q=80',
    rating: 4.8,
    reviewCount: 250,
    colors: ['#1E1E1E','#4B5563','#6B7280','#FFFFFF'],
    sizes: ['One Size'],
    description: 'Soft ribbed merino wool to keep you warm without bulk.',
    stock: 150
  },
  {
    name: 'Retro Runner Sneakers',
    price: 165,
    category: 'Footwear',
    gender: 'Women',
    subcategory: 'Sneakers',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1600180758890-6d8a6c3c8e09?w=800&q=80',
    rating: 4.5,
    reviewCount: 198,
    colors: ['#FFFFFF','#C084FC','#000000'],
    sizes: ['5','6','7','8','9','10'],
    description: 'Classic silhouette with modern cushioning.',
    stock: 75
  },
  {
    name: 'Wide-Leg Work Pants',
    price: 115,
    category: 'Bottoms',
    gender: 'Unisex',
    subcategory: 'Trousers',
    image: 'https://images.unsplash.com/photo-1582152629442-4eab8fc9a64d?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80',
    rating: 4.1,
    reviewCount: 154,
    colors: ['#1F2937','#6B7280','#E5E7EB'],
    sizes: ['XS','S','M','L','XL','XXL'],
    description: 'Utility pockets and relaxed structure built for daily wear.',
    stock: 110
  },
  {
    name: 'Alpaca Blend Cardigan',
    price: 180,
    category: 'Knitwear',
    gender: 'Women',
    subcategory: 'Cardigan',
    image: 'https://images.unsplash.com/photo-1542060748-10c28b62716e?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80',
    rating: 4.9,
    reviewCount: 72,
    colors: ['#E5E7EB','#9CA3AF'],
    sizes: ['XS','S','M','L'],
    description: 'Lightweight warmth with an airy drape for cool days.',
    stock: 39
  },
  {
    name: 'Minimal Leather Tote',
    price: 220,
    category: 'Accessories',
    gender: 'Women',
    subcategory: 'Bag',
    image: 'https://images.unsplash.com/photo-1526178613552-2f83a76019d3?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    rating: 4.7,
    reviewCount: 133,
    colors: ['#1E1E1E','#8B5E3C','#E5E7EB'],
    sizes: ['One Size'],
    description: 'High-capacity carry piece made from smooth-grain leather.',
    stock: 58
  },
  {
    name: 'Breathable Training Shorts',
    price: 60,
    category: 'Activewear',
    gender: 'Men',
    subcategory: 'Shorts',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1582152629442-4eab8fc9a64d?w=800&q=80',
    rating: 4.3,
    reviewCount: 209,
    colors: ['#000000','#374151','#6B7280'],
    sizes: ['S','M','L','XL','XXL'],
    description: 'Quick-dry mesh fabric that moves with you.',
    stock: 145
  },
  {
    name: 'Flat Front Wool Trousers',
    price: 260,
    category: 'Formal',
    gender: 'Men',
    subcategory: 'Trousers',
    image: 'https://images.unsplash.com/photo-1600180759153-7d0d2658d809?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c472997?w=800&q=80',
    rating: 4.8,
    reviewCount: 63,
    colors: ['#1F2937','#000000'],
    sizes: ['S','M','L','XL'],
    description: 'Mid-weight wool blend with a crisp crease and tailored cut.',
    stock: 26
  }
];


const STATIC_PAGES = [
  {
    slug: 'about-us',
    title: 'About Lumina',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-xl leading-relaxed text-gray-600 mb-6">Born in 2024, Lumina was founded on a simple premise: functionality shouldn't compromise aesthetics.</p>
          <p class="text-gray-600 leading-relaxed mb-6">We are a design-led studio focused on creating the future of essentials. Our products are engineered with precision and crafted from sustainable materials.</p>
          <div class="grid grid-cols-2 gap-6 mt-8">
             <div>
                <h4 className="font-bold text-3xl mb-1">100k+</h4>
                <p className="text-sm text-gray-500">Happy Customers</p>
             </div>
             <div>
                <h4 className="font-bold text-3xl mb-1">50+</h4>
                <p className="text-sm text-gray-500">Design Awards</p>
             </div>
          </div>
        </div>
        <div class="rounded-2xl overflow-hidden shadow-xl">
           <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" class="w-full h-full object-cover" />
        </div>
      </div>
    `
  },
  {
    slug: 'sustainability',
    title: 'Sustainability',
    content: `
      <div class="space-y-12">
        <div class="text-center max-w-3xl mx-auto">
           <p class="text-xl text-gray-600">Our commitment to the planet is woven into every fabric we choose. We believe in transparency and ethical manufacturing.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div class="bg-green-50 p-8 rounded-2xl">
              <h3 class="font-bold text-xl mb-3 text-green-900">Materials</h3>
              <p class="text-green-800">100% Organic Cotton and Recycled Polyesters sourced from certified suppliers.</p>
           </div>
           <div class="bg-blue-50 p-8 rounded-2xl">
              <h3 class="font-bold text-xl mb-3 text-blue-900">Water</h3>
              <p class="text-blue-800">Our dyeing process uses 50% less water than industry standards.</p>
           </div>
           <div class="bg-orange-50 p-8 rounded-2xl">
              <h3 class="font-bold text-xl mb-3 text-orange-900">Packaging</h3>
              <p class="text-orange-800">Zero plastic. All shipping materials are biodegradable and compostable.</p>
           </div>
        </div>
      </div>
    `
  },
  {
    slug: 'contact-us',
    title: 'Contact Us',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
         <div class="space-y-8">
            <div>
               <h3 class="font-bold text-lg mb-2">Customer Support</h3>
               <p class="text-gray-600">Need help with an order? Our team is available 24/7.</p>
               <a href="mailto:support@lumina.com" class="text-blue-600 font-medium mt-2 block">support@lumina.com</a>
               <p class="text-gray-900 mt-1">+1 (555) 012-3456</p>
            </div>
            <div>
               <h3 class="font-bold text-lg mb-2">Press & Partnerships</h3>
               <p class="text-gray-600">For media inquiries and collaboration opportunities.</p>
               <a href="mailto:press@lumina.com" class="text-blue-600 font-medium mt-2 block">press@lumina.com</a>
            </div>
            <div>
               <h3 class="font-bold text-lg mb-2">Headquarters</h3>
               <p class="text-gray-600">123 Design District<br/>New York, NY 10013<br/>United States</p>
            </div>
         </div>
         <div class="bg-gray-100 rounded-2xl h-80 overflow-hidden relative">
             <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" class="w-full h-full object-cover" />
         </div>
      </div>
    `
  },
  {
    slug: 'help-center',
    title: 'Help Center',
    content: `
      <div class="space-y-8 max-w-3xl mx-auto">
         <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 class="font-bold text-lg mb-2">How do I track my order?</h3>
            <p class="text-gray-600">You will receive a tracking link via email once your order ships. You can also view it in your Order History.</p>
         </div>
         <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 class="font-bold text-lg mb-2">What is your return policy?</h3>
            <p class="text-gray-600">We accept returns within 30 days of purchase. Items must be unworn and in original packaging.</p>
         </div>
         <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 class="font-bold text-lg mb-2">Do you ship internationally?</h3>
            <p class="text-gray-600">Yes, we ship to over 100 countries. Shipping rates are calculated at checkout.</p>
         </div>
         <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 class="font-bold text-lg mb-2">Can I change my order?</h3>
            <p class="text-gray-600">Orders are processed quickly. Please contact support within 1 hour of placing your order to request changes.</p>
         </div>
      </div>
    `
  },
  {
    slug: 'shipping-returns',
    title: 'Shipping & Returns',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
         <div>
            <h3 class="font-bold text-2xl mb-4">Shipping</h3>
            <ul class="space-y-4 text-gray-600">
               <li class="flex items-start gap-3"><span class="w-2 h-2 mt-2 bg-black rounded-full"></span>Free standard shipping on orders over $200.</li>
               <li class="flex items-start gap-3"><span class="w-2 h-2 mt-2 bg-black rounded-full"></span>Standard shipping (3-5 business days): $15</li>
               <li class="flex items-start gap-3"><span class="w-2 h-2 mt-2 bg-black rounded-full"></span>Express shipping (1-2 business days): $25</li>
            </ul>
         </div>
         <div>
            <h3 class="font-bold text-2xl mb-4">Returns</h3>
            <p class="text-gray-600 mb-4">We want you to love your purchase. If you are not completely satisfied, you can return your item(s) for a full refund within 30 days.</p>
            <p class="text-gray-600">To start a return, visit our <a href="#" class="text-blue-600 underline">Returns Portal</a>.</p>
         </div>
      </div>
    `
  },
  {
    slug: 'size-guide',
    title: 'Size Guide',
    content: `<p>Our fits are true to size. If you prefer a loose fit, size up.</p><div class="overflow-x-auto mt-6"><table class="w-full text-sm text-left"><thead class="text-xs text-gray-500 uppercase bg-gray-50"><tr><th class="px-6 py-3">Size</th><th class="px-6 py-3">Chest (in)</th><th class="px-6 py-3">Waist (in)</th></tr></thead><tbody><tr class="bg-white border-b"><td class="px-6 py-4 font-medium">S</td><td class="px-6 py-4">36-38</td><td class="px-6 py-4">29-31</td></tr><tr class="bg-gray-50 border-b"><td class="px-6 py-4 font-medium">M</td><td class="px-6 py-4">39-41</td><td class="px-6 py-4">32-34</td></tr><tr class="bg-white"><td class="px-6 py-4 font-medium">L</td><td class="px-6 py-4">42-44</td><td class="px-6 py-4">35-37</td></tr></tbody></table></div>`
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    content: `<p>Your privacy is important to us. We do not sell your data to third parties.</p>`
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    content: `<p>By using our store, you agree to the following terms...</p>`
  }
];

// ... (Your MOCK_PRODUCTS and STATIC_PAGES arrays stay here) ...

async function main() {
  console.log('--- Start seeding ---');

  // 1. CLEARING DATA
  // Note: We avoid deleteMany({ }) on Product to prevent Foreign Key errors 
  // with existing orders. Instead, we skip or update.
  
  // 2. SEED PRODUCTS (Safe Method)
  console.log('Seeding products...');
  for (const product of MOCK_PRODUCTS) {
    // Check if product exists by name before creating
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  // 3. SEED STATIC PAGES
  console.log('Seeding static pages...');
  for (const page of STATIC_PAGES) {
    await prisma.staticPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content
      },
      create: page
    });
  }

  // 4. SEED ADMIN USER
  const adminExists = await prisma.user.findUnique({ 
    where: { email: 'admin@lumina.com' }
  });
  
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@lumina.com',
        password: hashedPassword,
        role: 'ADMIN',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff'
      }
    });
    console.log('Admin user created: admin@lumina.com / admin123');
  }

  console.log('--- Seeding finished successfully ---');
}

// THIS IS THE PART THAT "READS" MAIN AND RUNS IT
main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });