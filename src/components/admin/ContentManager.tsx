import React, { useState } from 'react';
import { useStore } from '../../store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, Trash2, Edit2, Save, Plus, Image as ImageIcon } from 'lucide-react';
import { HeroSlide, SiteSection, SocialLink, StaticPage } from '../../types';

export const ContentManager = () => {
  const { 
    heroSlides, sections, socialLinks, staticPages,
    updateHeroSlide, deleteHeroSlide,
    updateSection,
    updateSocialLink, deleteSocialLink,
    updateStaticPage,
    uploadImage 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'pages' | 'social'>('hero');
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [editingPage, setEditingPage] = useState<Partial<StaticPage> | null>(null);
  const [editingSocial, setEditingSocial] = useState<Partial<SocialLink> | null>(null);
  const [editingSection, setEditingSection] = useState<Partial<SiteSection> | null>(null);

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    try {
      const url = await uploadImage(file);
      callback(url);
    } catch (e) {
      alert('Upload failed');
    }
  };

  const Tabs = () => (
    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {['hero', 'sections', 'pages', 'social'].map(t => (
            <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`px-6 py-3 text-sm font-medium capitalize whitespace-nowrap ${activeTab === t ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
            >
                {t}
            </button>
        ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold mb-6">Content Management</h2>
      <Tabs />

      {/* --- HERO SLIDES --- */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
           <Button onClick={() => setEditingSlide({})}>
               <Plus className="w-4 h-4 mr-2" /> Add Slide
           </Button>

           {editingSlide && (
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                   <h3 className="font-bold">{editingSlide.id ? 'Edit Slide' : 'New Slide'}</h3>
                   <div className="grid grid-cols-2 gap-4">
                       <Input label="Title" value={editingSlide.title || ''} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} />
                       <Input label="Subtitle" value={editingSlide.subtitle || ''} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <Input label="Image URL" value={editingSlide.image || ''} onChange={e => setEditingSlide({...editingSlide, image: e.target.value})} />
                       <div>
                           <label className="text-sm font-medium block mb-1">Upload Image</label>
                           <input type="file" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => setEditingSlide({...editingSlide, image: url}))} />
                       </div>
                   </div>
                   <div className="flex gap-4">
                       <select 
                        value={editingSlide.align || 'left'} 
                        onChange={e => setEditingSlide({...editingSlide, align: e.target.value as any})}
                        className="p-2 border rounded"
                       >
                           <option value="left">Left Align</option>
                           <option value="center">Center Align</option>
                           <option value="right">Right Align</option>
                       </select>
                       <Input type="number" label="Order" value={editingSlide.order || 0} onChange={e => setEditingSlide({...editingSlide, order: Number(e.target.value)})} />
                   </div>
                   <div className="flex gap-2">
                       <Button onClick={async () => { await updateHeroSlide(editingSlide); setEditingSlide(null); }}>Save</Button>
                       <Button variant="ghost" onClick={() => setEditingSlide(null)}>Cancel</Button>
                   </div>
               </div>
           )}

           <div className="grid gap-4">
               {heroSlides.map(slide => (
                   <div key={slide.id} className="flex items-center gap-4 border p-4 rounded-lg">
                       <img src={slide.image} className="w-24 h-16 object-cover rounded bg-gray-200" alt="" />
                       <div className="flex-1">
                           <h4 className="font-bold">{slide.title}</h4>
                           <p className="text-sm text-gray-500">{slide.subtitle}</p>
                       </div>
                       <div className="flex gap-2">
                           <button onClick={() => setEditingSlide(slide)} className="p-2 text-gray-500 hover:text-black"><Edit2 className="w-4 h-4"/></button>
                           <button onClick={() => deleteHeroSlide(slide.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                       </div>
                   </div>
               ))}
           </div>
        </div>
      )}

      {/* --- SITE SECTIONS --- */}
      {activeTab === 'sections' && (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Manage shop collection sections (e.g. Men, Women, Accessories).</p>
                  <Button size="sm" onClick={() => setEditingSection({})}>
                      <Plus className="w-4 h-4 mr-2" /> Add Section
                  </Button>
              </div>
              
              {editingSection && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                      <h3 className="font-bold">{editingSection.id ? 'Edit Section' : 'New Section'}</h3>
                       <Input label="Identifier (e.g. 'summer-collection')" value={editingSection.identifier || ''} onChange={e => setEditingSection({...editingSection, identifier: e.target.value})} />
                       <Input label="Title" value={editingSection.title || ''} onChange={e => setEditingSection({...editingSection, title: e.target.value})} />
                       <Input label="Description" value={editingSection.description || ''} onChange={e => setEditingSection({...editingSection, description: e.target.value})} />
                       <div className="grid grid-cols-2 gap-4">
                            <Input label="Image URL" value={editingSection.image || ''} onChange={e => setEditingSection({...editingSection, image: e.target.value})} />
                            <input type="file" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => setEditingSection({...editingSection, image: url}))} />
                       </div>
                       <div className="flex gap-2">
                           <Button onClick={async () => { await updateSection(editingSection); setEditingSection(null); }}>Save</Button>
                           <Button variant="ghost" onClick={() => setEditingSection(null)}>Cancel</Button>
                       </div>
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sections.map(section => (
                      <div key={section.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow relative group">
                          <div className="h-32 bg-gray-200 rounded mb-3 overflow-hidden">
                              {section.image ? <img src={section.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon /></div>}
                          </div>
                          <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold">{section.title}</h4>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{section.identifier}</span>
                              </div>
                              <Button size="icon" variant="ghost" onClick={() => setEditingSection(section)} className="h-8 w-8">
                                  <Edit2 className="w-4 h-4" />
                              </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{section.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- SOCIAL LINKS --- */}
      {activeTab === 'social' && (
          <div className="space-y-6">
              <Button onClick={() => setEditingSocial({})}>
                   <Plus className="w-4 h-4 mr-2" /> Add Link
               </Button>

              {editingSocial && (
                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4 flex items-end gap-4">
                       <div className="flex-1">
                           <label className="block text-sm font-medium mb-1">Platform</label>
                           <select 
                            className="w-full p-2 border rounded"
                            value={editingSocial.platform || 'Facebook'}
                            onChange={e => setEditingSocial({...editingSocial, platform: e.target.value})}
                           >
                               {['Facebook', 'Twitter', 'Instagram', 'Github', 'Linkedin', 'Youtube'].map(p => <option key={p} value={p}>{p}</option>)}
                           </select>
                       </div>
                       <div className="flex-[2]">
                           <Input label="URL" value={editingSocial.url || ''} onChange={e => setEditingSocial({...editingSocial, url: e.target.value})} />
                       </div>
                       <Button onClick={async () => { await updateSocialLink(editingSocial); setEditingSocial(null); }}>Save</Button>
                   </div>
              )}

              <div className="space-y-2">
                  {socialLinks.map(link => (
                      <div key={link.id} className="flex justify-between items-center p-3 border rounded">
                          <span className="font-medium w-24">{link.platform}</span>
                          <span className="text-blue-600 truncate flex-1 mx-4">{link.url}</span>
                          <div className="flex gap-2">
                               <button onClick={() => setEditingSocial(link)}><Edit2 className="w-4 h-4 text-gray-500"/></button>
                               <button onClick={() => deleteSocialLink(link.id)}><Trash2 className="w-4 h-4 text-red-500"/></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- STATIC PAGES --- */}
      {activeTab === 'pages' && (
          <div className="space-y-6">
             <div className="flex flex-wrap gap-2">
                 {['about-us', 'sustainability', 'careers', 'contact-us', 'help-center'].map(slug => (
                     <button 
                        key={slug} 
                        onClick={() => {
                            const exists = staticPages.find(p => p.slug === slug);
                            setEditingPage(exists || { slug, title: slug.replace('-', ' '), content: '' });
                        }}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm capitalize"
                     >
                         {slug.replace('-', ' ')}
                     </button>
                 ))}
             </div>

             {editingPage && (
                 <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                     <div className="flex justify-between">
                        <h3 className="font-bold uppercase tracking-wider">{editingPage.slug}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingPage(null)}><Trash2 className="w-4 h-4"/></Button>
                     </div>
                     
                     <Input label="Page Title" value={editingPage.title || ''} onChange={e => setEditingPage({...editingPage, title: e.target.value})} />
                     
                     <div>
                         <label className="block text-sm font-medium mb-1">Content (HTML allowed)</label>
                         <textarea 
                            className="w-full h-64 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none font-mono text-sm"
                            value={editingPage.content || ''}
                            onChange={e => setEditingPage({...editingPage, content: e.target.value})}
                         />
                     </div>
                     
                     <Button onClick={async () => { await updateStaticPage(editingPage); setEditingPage(null); }} className="w-full">
                         <Save className="w-4 h-4 mr-2" /> Save Page Content
                     </Button>
                 </div>
             )}
          </div>
      )}
    </div>
  );
};