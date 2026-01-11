import { api } from '../api';
import { AppSlice, CMSSlice } from './types';

export const createCMSSlice: AppSlice<CMSSlice> = (set, get) => ({
  heroSlides: [],
  sections: [],
  socialLinks: [],
  staticPages: [],
  
  fetchSiteContent: async () => {
    try {
      const data = await api.get('/content');
      set({ 
        heroSlides: data.heroSlides, 
        sections: data.sections, 
        socialLinks: data.socialLinks,
        staticPages: data.staticPages || []
      });
    } catch (error) {
      console.error('Failed to fetch site content', error);
    }
  },

  updateHeroSlide: async (slide) => {
    try {
      const id = slide.id || 'new';
      await api.put(`/content/hero/${id}`, slide);
      get().fetchSiteContent();
      get().addToast({ type: 'success', message: 'Hero slide updated' });
    } catch (e) { console.error(e); }
  },

  deleteHeroSlide: async (id) => {
    try {
      await api.delete(`/content/hero/${id}`);
      get().fetchSiteContent();
      get().addToast({ type: 'info', message: 'Slide deleted' });
    } catch (e) { console.error(e); }
  },

  updateSection: async (section) => {
    try {
      await api.put(`/content/section`, section);
      get().fetchSiteContent();
      get().addToast({ type: 'success', message: 'Section updated' });
    } catch (e) { console.error(e); }
  },

  updateSocialLink: async (link) => {
    try {
      const id = link.id || 'new';
      await api.put(`/content/social/${id}`, link);
      get().fetchSiteContent();
      get().addToast({ type: 'success', message: 'Link updated' });
    } catch (e) { console.error(e); }
  },

  deleteSocialLink: async (id) => {
    try {
        await api.delete(`/content/social/${id}`);
        get().fetchSiteContent();
        get().addToast({ type: 'info', message: 'Link deleted' });
    } catch (e) { console.error(e); }
  },

  updateStaticPage: async (page) => {
    try {
        await api.put(`/content/page`, page);
        get().fetchSiteContent();
        get().addToast({ type: 'success', message: 'Page updated' });
    } catch (e) { console.error(e); }
  },
  
  getStaticPage: (slug) => {
      return get().staticPages.find(p => p.slug === slug);
  },
});