'use client';
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectExcelData } from '@/lib/features/pharma/pharmaSlice';

const SalesPage = () => {
    const [medicineID, setMedicineID] = useState<any>(); 
    const [quantitySold, setQuantitySold] = useState<any>('');
    const [salePrice, setSalePrice] = useState(''); 
    const [saleDate, setSaleDate] = useState('');
    const excelData = useAppSelector(selectExcelData);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!excelData || !excelData.stock) {
      alert('No stock data found. Please upload the file first.');
      return;
    }
    const stockItem = excelData.stock.find((item: any) => item.ID === parseInt(medicineID));
    if (!stockItem) {
      alert(`Medicine with ID ${medicineID} does not exist in stock.`);
      return;
    }
    if (quantitySold > stockItem.Stock_Quantity) {
      alert(`Insufficient stock. Available quantity: ${stockItem.Stock_Quantity}`);
      return;
    }
   
    const updatedStock = excelData.stock.map((item: any) => {
      if (item.ID === parseInt(medicineID)) {
        return {
          ...item,
          Stock_Quantity: item.Stock_Quantity - parseInt(quantitySold),
        };
      }
      return item;
    });
    const updatedData = {
      ...excelData,
      stock: updatedStock,
    };
    const payload = {
        updatedData,
        medicineID,
        medicineName: excelData.medicine[medicineID-1].Name,
        quantitySold,
        salePrice, 
        saleDate
    }

    try {
      const response = await fetch('/api/sales', {
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
    <main className="flex flex-col quantitySolds-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Sales Data</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          value={medicineID}
          placeholder="Enter medicine ID"
          onChange={(e) => setMedicineID(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        /> 
        <input
          type="number"
          value={quantitySold}
          placeholder="Enter quantity Sold"
          onChange={(e) => setQuantitySold(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={salePrice}
          placeholder="Enter Sale Price"
          onChange={(e) => setSalePrice(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="date"
          value={saleDate}
          placeholder="Enter Sale Date"
          onChange={(e) => setSaleDate(e.target.value)}
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

export default SalesPage;