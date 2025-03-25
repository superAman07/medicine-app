'use client';
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectExcelData } from '@/lib/features/pharma/pharmaSlice';

const PurchasePage = () => {
    const [distributor, setDistributor] = useState('');
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const excelData = useAppSelector(selectExcelData);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!excelData || !excelData.purchase) {
      alert('No Purchase data found. Please upload the file first.');
      return;
    }
 
    // const updatedPurchase = [
    //   ...excelData.purchase,
    //   { Distributor: distributor, Item: item, Quantity: quantity, Price: price },
    // ];
 
    // const payload = {
    //   updatedData: { ...excelData, Purchase: updatedPurchase },  
    // };
    const payload = {
        updatedData: excelData,
        distributor,
        item,
        quantity,
        price
    }

    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'updated_data.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        alert('Updated Excel file downloaded.');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update Excel file.');
      }
    } catch (error) {
      console.error('Error updating Excel file:', error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Update Purchase Data</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={distributor}
          placeholder="Enter Distributor Name"
          onChange={(e) => setDistributor(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="text"
          value={item}
          placeholder="Enter Item Name"
          onChange={(e) => setItem(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={quantity}
          placeholder="Enter Quantity"
          onChange={(e) => setQuantity(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={price}
          placeholder="Enter Price"
          onChange={(e) => setPrice(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </main>
  );
};

export default PurchasePage;