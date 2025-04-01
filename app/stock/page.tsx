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
    const [medicineID, setMedicineID] = useState<any>(''); 
    const [stockQuantity, setStockQuantity] = useState<any>('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [salePrice, setSalePrice] = useState(''); 
    const excelData = useAppSelector(selectExcelData);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!excelData || !excelData.stock) {
      alert('No stock data found. Please upload the file first.');
      return;
    }
  
    const payload = {
        updatedData: excelData,
        medicineID,
        medicineName:excelData.medicine[medicineID-1].Name,
        stockQuantity,
        salePrice,
        purchasePrice 
    }

    try {
      const response = await fetch('/api/stock', {
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
            <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
            <p className="text-muted-foreground mt-2">All Medicine Stocks</p>
          </div>
        
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-1 mb-8">
              <TabsTrigger value="manage">Available Stocks</TabsTrigger>
            </TabsList>
              {/* <TabsTrigger value="add">Sales</TabsTrigger> */}
            {/* <TabsContent value='add'>
              <Card>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className='font-medium mb-3'>Basic Information</h3>
                        <div className='grid gap-4 md:grid-cols-2'>
                          <div className="grid gap-2">
                            <Label htmlFor='Distributor ID'>Medicine ID <span className="text-red-500">*</span></Label>
                            <Input
                              type="number"
                              value={medicineID}
                              placeholder="Enter medicine ID"
                              onChange={(e) => setMedicineID(e.target.value)}
                              className="border px-4 py-2 rounded-md"
                              required
                              />
                          </div>
                          <div className="grid gap-2">
                          <Label htmlFor='Distributor ID'>Stock Quantity<span className="text-red-500">*</span></Label>
                            <Input
                              type="number"
                              value={stockQuantity}
                              placeholder="Enter stock quantity"
                              onChange={(e) => setStockQuantity(e.target.value)}
                              className="border px-4 py-2 rounded-md"
                              required
                            /> 
                          </div>
                          <div className="grid gap-2">
                          <Label htmlFor='Quantity'>Purchase Price <span className="text-red-500">*</span></Label>
                            <Input
                              type="number"
                              value={purchasePrice}
                              placeholder="Enter Purchase Price"
                              onChange={(e) => setPurchasePrice(e.target.value)}
                              className="border px-4 py-2 rounded-md"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor='Price'>Sale Price <span className="text-red-500">*</span></Label>
                              <Input
                                type="number"
                                value={salePrice}
                                placeholder="Enter Sale Price"
                                onChange={(e) => setSalePrice(e.target.value)}
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
                        Add in Stock
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent> */}
            <TabsContent value='manage'>
              <Card>
                <CardHeader>
                  <CardTitle>Stock</CardTitle>
                  <CardDescription>View your existing stocks</CardDescription>
                </CardHeader>
                <CardContent>
                  {!excelData ?(
                    <div className="flex items-center justify-center h-40 border rounded-md bg-gray-50">
                      <p className="text-muted-foreground">No Sake to manage yet. Please add some.</p>
                    </div>
                  ):(
                    <div className='border rounded-md overflow-x-auto'>
                      <div className='grid grid-cols-6 gap-2 bg-gray-100 p-3 font-medium text-sm'>
                        <div>ID</div>
                        <div>Medicine ID</div> 
                        <div>Medicine Name</div>
                        <div>Stock Quantity</div>
                        <div>Purchase Price</div>
                        <div>Sale Price</div>
                      </div>
                      <div className='divide-y'>
                        {excelData.stock.map((value,key)=>(
                          <div key={key} className='grid grid-cols-6 gap-2 p-3 hover:bg-gray-50 text-sm'>
                            <div className='truncate'>{value.ID}</div> 
                            <div className='truncate'>{value.MedicineID}</div> 
                            <div className='truncate'>{value.Medicine_Name}</div>
                            <div className='truncate'>{value.Stock_Quantity}</div>
                            <div className='truncate'>{value.Purchase_Price}</div>
                            <div className='truncate'>{value.Sale_Price}</div>
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