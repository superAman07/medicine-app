"use client";

import { useState } from "react";
import { selectExcelData } from "@/lib/features/pharma/pharmaSlice";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadPage from "@/components/uploadePage";

export default function DistributorPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    contact: "",
    gst: "",
    email: "",
    website: "",
  });

  const excelData = useAppSelector(selectExcelData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!excelData || !excelData.distributor) {
      alert("No Excel data found. Please upload the file first.");
      return;
    }

    const payload = {
      updatedData: excelData,
      ...formData,
    };

    try {
      const response = await fetch("/api/distributor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "updated_distributors.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        alert("Distributor added successfully!");
        setFormData({
          name: "",
          company: "",
          contact: "",
          gst: "",
          email: "",
          website: "",
        });
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to add distributor");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around items-center mb-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Distributor Management</h1>
            <p className="text-muted-foreground mt-2">Add and manage your product distributors</p>
          </div>
          <div>
            <UploadPage />
          </div>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="add">Add Distributor</TabsTrigger>
            <TabsTrigger value="manage">Manage Distributors</TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Distributor</CardTitle>
                <CardDescription>Enter distributor details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Basic Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Distributor Name <span className="text-red-500">*</span></Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="company">Company Name <span className="text-red-500">*</span></Label>
                          <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="contact">Contact Number <span className="text-red-500">*</span></Label>
                          <Input id="contact" name="contact" value={formData.contact} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="gst">GST Number <span className="text-red-500">*</span></Label>
                          <Input id="gst" name="gst" value={formData.gst} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" name="website" value={formData.website} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="w-full md:w-auto">Add Distributor</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Distributors</CardTitle>
                <CardDescription>View and manage your existing distributors</CardDescription>
              </CardHeader>
              <CardContent>
                {!excelData ? (
                  <div className="flex items-center justify-center h-40 border rounded-md bg-gray-50">
                    <p className="text-muted-foreground">No distributors to manage yet. Please add some.</p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-x-auto">
                    <div className="grid grid-cols-7 gap-2 bg-gray-100 p-3 font-medium text-sm">
                      <div>ID</div>
                      <div>Name</div>
                      <div>Company</div>
                      <div>Contact</div>
                      <div>GST</div>
                      <div>Email</div>
                      <div>Website</div>
                    </div>

                    <div className="divide-y">
                      {excelData.distributor.map((value, key) => (
                        <div key={key} className="grid grid-cols-7 gap-2 p-3 hover:bg-gray-50 text-sm">
                          <div className="truncate">{value.ID}</div>
                          <div className="truncate">{value.Name}</div>
                          <div className="truncate">{value.Company}</div>
                          <div className="truncate">{value.Contact}</div>
                          <div className="truncate">{value.GST}</div>
                          <div className="truncate">{value.Email || "-"}</div>
                          <div className="truncate">
                            {value.Website ? (
                              <a
                                href={value.Website.startsWith("http") ? value.Website : `https://${value.Website}|| ""`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {value.Website}
                              </a>
                            ) : (
                              "-"
                            )}
                          </div>
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
