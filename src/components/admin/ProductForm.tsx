import React, { useState } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useStore } from '../../store';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const { uploadImage } = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    price: 0,
    category: 'Outerwear',
    gender: 'Men',
    subcategory: '',
    description: '',
    image: '',
    hoverImage: '',
    images: [],
    stock: 0,
    isNew: false,
    colors: ['#000000'],
    sizes: ['M']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure colors and sizes are arrays
    const finalData = {
        ...formData,
        colors: Array.isArray(formData.colors) ? formData.colors : [],
        sizes: Array.isArray(formData.sizes) ? formData.sizes : []
    };
    onSubmit(finalData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'image' | 'hoverImage' | 'gallery') => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(e.target.files[0]);
        
        if (targetField === 'gallery') {
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), imageUrl]
            }));
        } else {
            setFormData(prev => ({ ...prev, [targetField]: imageUrl }));
        }
      } catch (err) {
        alert('Upload failed');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
      setFormData(prev => ({
          ...prev,
          images: prev.images?.filter((_, i) => i !== index)
      }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col max-h-[90vh]">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add Product'}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Product Name" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input 
            label="Price ($)" 
            type="number"
            value={formData.price}
            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            required
          />
        </div>

        {/* Categorization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select 
              className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value as any})}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Unisex">Unisex</option>
            </select>
           </div>
           
           <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="Outerwear">Outerwear</option>
              <option value="Essentials">Essentials</option>
              <option value="Tailoring">Tailoring</option>
              <option value="Accessories">Accessories</option>
              <option value="Activewear">Activewear</option>
            </select>
           </div>

           <Input 
            label="Subcategory (e.g. Jeans)" 
            value={formData.subcategory || ''}
            onChange={e => setFormData({...formData, subcategory: e.target.value})}
            placeholder="T-Shirt, Jacket..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none min-h-[100px]"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        {/* Media Management */}
        <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-900">Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Display Image</label>
                    <div className="flex items-start gap-4">
                        <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            {formData.image ? (
                                <img src={formData.image} className="w-full h-full object-cover" alt="Main" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <Input 
                                value={formData.image} 
                                onChange={e => setFormData({...formData, image: e.target.value})}
                                placeholder="https://..." 
                            />
                            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs hover:bg-black transition-colors">
                                <Upload className="w-3 h-3" /> Upload Main
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} />
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hover Image (Optional)</label>
                    <div className="flex items-start gap-4">
                        <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            {formData.hoverImage ? (
                                <img src={formData.hoverImage} className="w-full h-full object-cover" alt="Hover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Same as Main</div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <Input 
                                value={formData.hoverImage || ''} 
                                onChange={e => setFormData({...formData, hoverImage: e.target.value})}
                                placeholder="https://..." 
                            />
                            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg text-xs hover:bg-gray-200 transition-colors">
                                <Upload className="w-3 h-3" /> Upload Hover
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hoverImage')} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                <div className="flex flex-wrap gap-4">
                    {formData.images?.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 group rounded-lg overflow-hidden border border-gray-200">
                            <img src={img} className="w-full h-full object-cover" alt="" />
                            <button 
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-900 hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-900">
                        <Plus className="w-6 h-6" />
                        <span className="text-[10px] mt-1">Add</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} />
                    </label>
                </div>
            </div>
        </div>

        {/* Stock & Status */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
           <div className="flex items-center gap-2">
             <input 
                type="checkbox" 
                id="isNew"
                checked={formData.isNew}
                onChange={e => setFormData({...formData, isNew: e.target.checked})}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
             />
             <label htmlFor="isNew" className="text-sm font-medium text-gray-700">New Arrival</label>
           </div>
           
           <div className="flex items-center gap-2 ml-4">
             <label className="text-sm font-medium text-gray-700">Stock:</label>
             <input 
               type="number" 
               className="w-20 h-9 rounded border border-gray-300 px-2 text-sm"
               value={formData.stock}
               onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
             />
           </div>
        </div>
      </form>

      <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} isLoading={isUploading}>
            {product ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </div>
  );
};