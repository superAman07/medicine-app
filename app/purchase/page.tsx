'use client';
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectExcelData } from '@/lib/features/pharma/pharmaSlice';

const PurchasePage = () => {
    const [distributorID, setDistributorID] = useState<any>('');
    const [medicineID, setMedicineID] = useState<any>('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const excelData = useAppSelector(selectExcelData);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!excelData || !excelData.stock) {
      alert('No Stock data found. Please upload the file first.');
      return;
    } 
    const distributor = excelData.distributor.find((item: any) => item.ID === parseInt(distributorID));
    if (!distributor) {
      alert(`Distributor with ID ${distributorID} does not exist.`);
      return;
    }
    
    const stockItem = excelData.stock.find((item: any) => item.ID === parseInt(medicineID));
    let updatedStock;
    if(stockItem){
      updatedStock = excelData.stock.map((item: any) => {
        if (item.ID === parseInt(medicineID)) {
          return {
            ...item,
            Stock_Quantity: item.Stock_Quantity + parseInt(quantity),
          };
        }
        return item;
      });
    }else{
      const newStockEntry = {
        ID: parseInt(medicineID),
        MedicineID : medicineID,
        Medicine_Name: excelData.medicine[medicineID - 1]?.Name || 'Unknown Medicine',
        Stock_Quantity: quantity,
        Purchase_Price: price,
        Sale_Price: 0,     
      };
      updatedStock = [...excelData.stock, newStockEntry];
    }
    const updatedData = {
      ...excelData,
      stock: updatedStock,
    };
    const payload = {
        updatedData,
        distributorID,
        distributorName: excelData.distributor[distributorID-1].Name,
        medicineID,
        medicineName: excelData.medicine[medicineID-1].Name || 'Unknown Medicine',
        quantity,
        price,
        date
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
    <main className="flex flex-col medicineIDs-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Update Purchase Data</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          value={distributorID}
          placeholder="Enter Distributor ID"
          onChange={(e) => setDistributorID(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={medicineID}
          placeholder="Enter medicineID"
          onChange={(e) => setMedicineID(e.target.value)}
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
        <input
          type="date"
          value={date}
          placeholder="Enter Price"
          onChange={(e) => setDate(e.target.value)}
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