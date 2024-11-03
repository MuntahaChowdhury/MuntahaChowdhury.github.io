"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Shuttle from '@/component/ui/shuttle'; // Adjust the import path as needed
import MultiSelectDropdown from '@/component/ui/msDropDown'; // Adjust the import path as needed

const apiEndpoint = '/api/item';
const lovCatClsUrl = '/api/lov/std/?stdlov=LOVCATCLS';
const lovStkUnitUrl = '/api/lov/std/?stdlov=LOVSTKUNIT';

type OptionType = {
  rval?: string;
  dval?: string;
  value: string;
  label: string;
};

const CreateItemCategoryPage = () => {
console.log('reachede');
  <Suspense fallback={<div>Loading...</div>}>
    <InnerCreateItemCategoryPage />
  </Suspense>
}

const InnerCreateItemCategoryPage = () => {
console.log('reacheded');

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCatCls = searchParams.get('catCls') || '';

  const [formData, setFormData] = useState({
    catcls: initialCatCls,
    catname: '',
    itemcat: '',
    stkunit: '',
    remarks: '',
    pcid: 0,
    hasitem: 'N',
    isactv: 'N',
    mastatr: [] as string[],
    skuatr: [] as string[],
    skuvar: [] as string[],
    invgrp: 'ECOMMERCE',
    cdomain: 'buyerpanda.com',
    mkrid: '',
    operation: 'ITEMCATINSERT',
  });

  const [lovc1ClsCat, setLovc1ClsCat] = useState<OptionType[]>([]);
  const [lovc1StkUnit, setLovc1StkUnit] = useState<OptionType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch LOV data for Category Class
  useEffect(() => {
    const fetchLovData = async () => {
      try {
        const response = await fetch(lovCatClsUrl);
        const data = await response.json();
        setLovc1ClsCat(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('CatCls: Error fetching LOV data');
      }
    };
    fetchLovData();
  }, []);

  // Fetch LOV data for Stock Unit
  useEffect(() => {
    const fetchLovData = async () => {
      try {
        const response = await fetch(lovStkUnitUrl);
        const data = await response.json();
        setLovc1StkUnit(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('StkUnit: Error fetching LOV data');
      }
    };
    fetchLovData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleMsDropDownChange = (selected: string[]) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     mastatr: selected, // Use rval here
  //   }));
  // };
  const handleMsDropDownChange = (selected: OptionType[]) => {
    setFormData((prevData) => ({
      ...prevData,
      mastatr: selected.map(option => option.value), // Use rval here
    }));
  };
  

  const handleShuttleChange = (selected: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      skuatr: selected,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedFormData = {
      ...formData,
      mastatr: formData.mastatr.join(':'),
    };

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedFormData),
      });

      if (!res.ok) throw new Error('Failed to create item category');
      alert('Item category created successfully!');
      router.push('/item/itemcat/add');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
console.log('reachedede');
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">Create New Item Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <table className="min-w-full border-collapse border border-gray-300 mt-4">
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="catcls" className="block text-white">Category Class</label>
                <select
                  id="catcls"
                  name="catcls"
                  value={formData.catcls}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full text-black"
                >
                  <option value="">Select Category Class</option>
                  {lovc1ClsCat.map((rc1) => (
                    <option key={rc1.rval} value={rc1.rval}>{rc1.dval}</option>
                  ))}
                </select>
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="catname" className="block text-white">Category Name</label>
                <input
                  type="text"
                  id="catname"
                  name="catname"
                  value={formData.catname}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full text-black"
                />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="itemcat" className="block text-white">Item Category</label>
                <input
                  type="text"
                  id="itemcat"
                  name="itemcat"
                  value={formData.itemcat}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full text-black"
                />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="stkunit" className="block text-white">Stock Unit</label>
                <select
                  id="stkunit"
                  name="stkunit"
                  value={formData.stkunit}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full text-black"
                >
                  <option value="">Select Stock Unit</option>
                  {lovc1StkUnit.map((rc1) => (
                    <option key={rc1.rval} value={rc1.rval}>{rc1.dval}</option>
                  ))}
                </select>
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="remarks" className="block text-white">Remarks</label>
                <input
                  type="text"
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full text-black"
                />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 px-4 py-2 ">
                <label htmlFor="mastatr" className="block text-white">MastAtr</label>
                <MultiSelectDropdown
                    options={[
                      { value: 'I', label: 'I' },
                      { value: 'N', label: 'N' },
                      { value: 'D', label: 'D' },
                      { value: 'L', label: 'L' },
                      { value: 'A', label: 'A' },
                      { value: '1', label: '1' },
                      { value: '3', label: '3' },
                      { value: '4', label: '4' },
                      { value: '8', label: '8' },
                      { value: '11', label: '11' },
                      { value: '12', label: '12' },
                    ]}
                  selectedOptions={formData.mastatr}
                  onChange={handleMsDropDownChange}
                />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="skuatr" className="block text-white">SkuAtr</label>
                <Shuttle
                  options={['InitStock', 'NoteRcv', 'NoteDlv', 'LeadDay']}
                  selectedOptions={formData.skuatr}
                  onChange={handleShuttleChange}
                />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="skuvar" className="block text-white">SkuVar</label>
                <Shuttle
                  options={['Size', 'Color', 'Age', 'Dimension']}
                  selectedOptions={formData.skuvar}
                  onChange={handleShuttleChange}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="invgrp" className="block text-white">InvGrp</label>
                <input
                  type="text"
                  id="invgrp"
                  name="invgrp"
                  value={formData.invgrp}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full text-black"
                />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="cdomain" className="block text-white">Cdomain</label>
                <input
                  type="text"
                  id="cdomain"
                  name="cdomain"
                  value={formData.cdomain}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full text-black"
                />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <label htmlFor="mkrid" className="block text-white">Mkrid</label>
                <input
                  type="text"
                  id="mkrid"
                  name="mkrid"
                  value={formData.mkrid}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full text-black"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {error && <div className="text-red-500">{error}</div>}
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Item Category
        </button>
      </form>
    </div>
  );
};

export default CreateItemCategoryPage;
