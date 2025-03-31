'use client';
import { selectExcelData } from '@/lib/features/pharma/pharmaSlice';
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Medicine() {
  const [name, setMedName] = useState('');
  const [distributorID, setDistributorID] = useState<any>('');
  const [salt, setSaltName] = useState('');
  const [category, setCategory] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [expiry, setExpiry] = useState('');

  const excelData = useAppSelector(selectExcelData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!excelData || !excelData.medicine) {
      alert('No Excel data found. Please upload the file first.');
      return;
    }
 
    const payload = {
      updatedData: excelData,  
      name,
      distributorID,
      maker: excelData.distributor[distributorID-1].Company,
      salt,
      category,
      batchNo,
      expiry,
    };

    try {
      const response = await fetch('/api/medicine', {
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
          <h1 className="text-3xl font-bold tracking-tight">Medicine Management</h1>
          <p className="text-muted-foreground mt-2">Add and manage your Medicine</p>
        </div>
      
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="add">Add Medicine</TabsTrigger>
            <TabsTrigger value="manage">Manage Medicine</TabsTrigger>
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
                            type="text"
                            value={distributorID}
                            placeholder="Enter Distributor ID"
                            onChange={(e) => setDistributorID(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                            required
                            />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor='Distributor ID'>Medicine Name <span className="text-red-500">*</span></Label>
                          <Input
                            type="text"
                            value={name}
                            placeholder="Enter Medicine Name"
                            onChange={(e) => setMedName(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                            required
                          /> 
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor='Distributor ID'>Salt Name <span className="text-red-500">*</span></Label>
                          <Input
                            type="text"
                            value={salt}
                            placeholder="Enter Salt Name"
                            onChange={(e) => setSaltName(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor='Distributor ID'>Category <span className="text-red-500">*</span></Label>
                          <Input
                            type="text"
                            value={category}
                            placeholder="Category"
                            onChange={(e) => setCategory(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor='Distributor ID'>Batch Number <span className="text-red-500">*</span></Label>
                          <Input
                            type="text"
                            value={batchNo}
                            placeholder="Batch No"
                            onChange={(e) => setBatchNo(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor='Distributor ID'>Expiry Date <span className="text-red-500">*</span></Label>
                          <Input
                            type="date"
                            value={expiry}
                            placeholder="Expiry Date"
                            onChange={(e) => setExpiry(e.target.value)}
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
                    <div className='grid grid-cols-7 gap-2 bg-gray-100 p-3 font-medium text-sm'>
                      <div>ID</div>
                      <div>Name</div>
                      <div>Maker</div>
                      <div>Salt</div>
                      <div>Category</div>
                      <div>Batch No.</div>
                      <div>Expiry</div>
                    </div>
                    <div className='divide-y'>
                      {excelData.medicine.map((value,key)=>(
                        <div key={key} className='grid grid-cols-7 gap-2 p-3 hover:bg-gray-50 text-sm'>
                          <div className='truncate'>{value.ID}</div>
                          <div className='truncate'>{value.Name}</div>
                          <div className='truncate'>{value.Maker}</div>
                          <div className='truncate'>{value.Salt}</div>
                          <div className='truncate'>{value.Category}</div>
                          <div className='truncate'>{value.BatchNo}</div>
                          <div className='truncate'>{value.Expiry}</div>
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
}

 