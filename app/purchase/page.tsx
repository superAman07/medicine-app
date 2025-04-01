'use client';
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectExcelData } from '@/lib/features/pharma/pharmaSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      <div className="container mx-auto py-10 px-4 md:px-6"> 
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Purchase Management</h1>
            <p className="text-muted-foreground mt-2">Add and purchase your Medicine</p>
          </div>
        
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="add">Purchase</TabsTrigger>
              <TabsTrigger value="manage">Manage Purchase</TabsTrigger>
            </TabsList>
            <TabsContent value='add'>
              <Card>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className='font-medium mb-3'>Basic Information</h3>
                        <div className='grid gap-4 md:grid-cols-2'>
                          <div className="grid gap-2">
                            <Label htmlFor='Distributor ID'>Distributor ID <span className="text-red-500">*</span></Label>
                            <Input
                              type="number"
                              value={distributorID}
                              placeholder="Enter Distributor ID"
                              onChange={(e) => setDistributorID(e.target.value)}
                              className="border px-4 py-2 rounded-md"
                              required
                              />
                          </div>
                          <div className="grid gap-2">
                          <Label htmlFor='Distributor ID'>Medicine ID <span className="text-red-500">*</span></Label>
                            <Input
                              type="number"
                              value={medicineID}
                              placeholder="Enter Medicine ID"
                              onChange={(e) => setMedicineID(e.target.value)}
                              className="border px-4 py-2 rounded-md"
                              required
                            /> 
                          </div>
                          <div className="grid gap-2">
                          <Label htmlFor='Quantity'>Quantity <span className="text-red-500">*</span></Label>
                            <Input
                              type="number"
                              value={quantity}
                              placeholder="Enter Quantity"
                              onChange={(e) => setQuantity(e.target.value)}
                              className="border px-4 py-2 rounded-md"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                          <Label htmlFor='Price'>Price <span className="text-red-500">*</span></Label>
                            <Input
                              type="number"
                              value={price}
                              placeholder="Enter Price"
                              onChange={(e) => setPrice(e.target.value)}
                              className="border px-4 py-2 rounded-md"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                          <Label htmlFor='Date'>Date <span className="text-red-500">*</span></Label>
                            <Input
                              type="date"
                              value={date}
                              placeholder="Batch No"
                              onChange={(e) => setDate(e.target.value)}
                              className="border px-4 py-2 rounded-md"
                              required
                            />
                          </div>
                          </div>
                      </div>
                    </div>
                    <div className='flex justify-end'>
                      <Button
                        type="submit"
                        className="w-full md:w-auto"
                        >
                        Add Medicine
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='manage'>
              <Card>
                <CardHeader>
                  <CardTitle>Manage Medicines</CardTitle>
                  <CardDescription>View and manage your existing medicines</CardDescription>
                </CardHeader>
                <CardContent>
                  {!excelData ?(
                    <div className="flex items-center justify-center h-40 border rounded-md bg-gray-50">
                      <p className="text-muted-foreground">No medicine to manage yet. Please add some.</p>
                    </div>
                  ):(
                    <div className='border rounded-md overflow-x-auto'>
                      <div className='grid grid-cols-8 gap-2 bg-gray-100 p-3 font-medium text-sm'>
                        <div>ID</div>
                        <div>Distributor ID</div>
                        <div>Medicine ID</div>
                        <div>Distributor Name</div>
                        <div>Medicine Name</div>
                        <div>Quantity</div>
                        <div>Price</div>
                        <div>Date</div>
                      </div>
                      <div className='divide-y'>
                        {excelData.purchase.map((value,key)=>(
                          <div key={key} className='grid grid-cols-8 gap-2 p-3 hover:bg-gray-50 text-sm'>
                            <div className='truncate'>{value.ID}</div>
                            <div className='truncate'>{value.DistributorID}</div>
                            <div className='truncate'>{value.MedicineID}</div>
                            <div className='truncate'>{value.Distributor_Name}</div>
                            <div className='truncate'>{value.Medicine_Name}</div>
                            <div className='truncate'>{value.Quantity}</div>
                            <div className='truncate'>{value.Price}</div>
                            <div className='truncate'>{value.Date}</div>
                          </div>
                        ))}
  
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};

export default PurchasePage;