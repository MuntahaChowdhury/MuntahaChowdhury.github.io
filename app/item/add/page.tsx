'use client';

import ItemManage from '@/components/item/itemManage';
// import { useRouter } from 'next/navigation';

export default function AddItemPage() {
  //   const router = useRouter();
  //   const handleCancel = () => {
  //     router.back(); // Navigate back when cancel is clicked
  //   };

  return (
    <div className='py-8'>
      <ItemManage p_itemmid={null} />
    </div>
  );
}
