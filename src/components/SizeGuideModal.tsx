// import React from 'react';
import { Modal } from './ui/Modal';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal = ({ isOpen, onClose, category = 'General' }: SizeGuideModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Size Guide</h2>
        <p className="text-gray-500 mb-6">Measurements for {category}. Fits may vary by style.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Size</th>
                <th className="px-6 py-3">Chest (in)</th>
                <th className="px-6 py-3">Waist (in)</th>
                <th className="px-6 py-3">Hips (in)</th>
                <th className="px-6 py-3">Arm (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">XS</td>
                <td className="px-6 py-4">32 - 34</td>
                <td className="px-6 py-4">26 - 28</td>
                <td className="px-6 py-4">32 - 34</td>
                <td className="px-6 py-4">31.5</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">S</td>
                <td className="px-6 py-4">35 - 37</td>
                <td className="px-6 py-4">29 - 31</td>
                <td className="px-6 py-4">35 - 37</td>
                <td className="px-6 py-4">32</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">M</td>
                <td className="px-6 py-4">38 - 40</td>
                <td className="px-6 py-4">32 - 34</td>
                <td className="px-6 py-4">38 - 40</td>
                <td className="px-6 py-4">32.5</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">L</td>
                <td className="px-6 py-4">41 - 43</td>
                <td className="px-6 py-4">35 - 37</td>
                <td className="px-6 py-4">41 - 43</td>
                <td className="px-6 py-4">33</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">XL</td>
                <td className="px-6 py-4">44 - 46</td>
                <td className="px-6 py-4">38 - 40</td>
                <td className="px-6 py-4">44 - 46</td>
                <td className="px-6 py-4">33.5</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
          <strong>How to measure:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Chest: Measure around the fullest part of your chest.</li>
            <li>Waist: Measure around your natural waistline.</li>
            <li>Hips: Measure around the fullest part of your hips.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};