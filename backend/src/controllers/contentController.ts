import { Request, Response } from 'express';
import prisma from '../config/db';

// --- Public: Get All Content ---
export const getSiteContent = async (req: Request, res: Response) => {
  try {
    const heroSlides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
    const sections = await prisma.siteSection.findMany();
    const socialLinks = await prisma.socialLink.findMany();
    const staticPages = await prisma.staticPage.findMany();

    res.json({ heroSlides, sections, socialLinks, staticPages });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- Admin: Hero Slides ---
export const updateHeroSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, image, align, order } = req.body;
    
    // If ID is 'new', create it
    if (id === 'new') {
        const newSlide = await prisma.heroSlide.create({
            data: { title, subtitle, image, align, order: Number(order) }
        });
        return res.json(newSlide);
    }

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: { title, subtitle, image, align, order: Number(order) },
    });
    res.json(slide);
  } catch (error) {
    res.status(500).json({ message: 'Error updating slide' });
  }
};

export const deleteHeroSlide = async (req: Request, res: Response) => {
    try {
        await prisma.heroSlide.delete({ where: { id: req.params.id } });
        res.json({ message: 'Slide deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting slide' });
    }
}

// --- Admin: Sections (Upsert based on identifier) ---
export const updateSection = async (req: Request, res: Response) => {
  try {
    const { identifier, title, description, image, link } = req.body;
    
    // Upsert: Create if identifier doesn't exist, update if it does
    const section = await prisma.siteSection.upsert({
      where: { identifier },
      update: { title, description, image, link },
      create: { identifier, title, description, image, link },
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating section' });
  }
};

// --- Admin: Social Links ---
export const updateSocialLink = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { platform, url } = req.body;

        if (id === 'new') {
            const newLink = await prisma.socialLink.create({
                data: { platform, url }
            });
            return res.json(newLink);
        }

        const link = await prisma.socialLink.update({
            where: { id },
            data: { platform, url }
        });
        res.json(link);
    } catch (error) {
        res.status(500).json({ message: 'Error updating link' });
    }
};

export const deleteSocialLink = async (req: Request, res: Response) => {
    try {
        await prisma.socialLink.delete({ where: { id: req.params.id } });
        res.json({ message: 'Link deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting link' });
    }
}

// --- Admin: Static Pages ---
export const updateStaticPage = async (req: Request, res: Response) => {
    try {
        const { slug, title, content } = req.body;
        
        const page = await prisma.staticPage.upsert({
            where: { slug },
            update: { title, content },
            create: { slug, title, content }
        });
        res.json(page);
    } catch (error) {
        res.status(500).json({ message: 'Error updating page' });
    }
}