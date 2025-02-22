'use client';

import ItemManage from '@/components/item/itemManage';

export default function AddItemPage() {
 
  return (
    // <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
    <div className="container mx-auto p-6 bg-transparent rounded-lg">
      {/* <h1 className="text-2xl font-bold mb-4">Add New Item</h1> */}
      <ItemManage/>
    </div>
  );
}
