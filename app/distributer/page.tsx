"use client"

import type React from "react"
import { useState } from "react"
import { Upload, User, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" 

export default function DistributorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    contact: "",
    gst: "",
    email: "",
    website: "",
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Required field validation
    const requiredFields = ["name", "company", "contact"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (!file || missingFields.length > 0) {
      alert("Please fill all required fields and upload a file.")
      return
    }

    setIsSubmitting(true)

    const submitData = new FormData()
    submitData.append("file", file)

    // Append all form data to FormData
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value)
    })

    try {
      const response = await fetch("/api/distributor", {
        method: "POST",
        body: submitData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const timeStamp = new Date()
        const formattedTime = `${timeStamp.getHours()}:${timeStamp.getMinutes()}:${timeStamp.getSeconds()}`
        a.download = `${file.name.split(".")[0]} ${timeStamp.getDate()}-${timeStamp.getMonth() + 1}-${timeStamp.getFullYear()} ${formattedTime}.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        alert("Distributor added successfully!")

        // Reset form
        setFile(null)
        setFormData({
          name: "",
          company: "",
          contact: "",
          gst: "",
          email: "",
          website: ""
        })

        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Failed to add distributor")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Distributor Management</h1>
          <p className="text-muted-foreground mt-2">Add and manage your product distributors</p>
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
                <CardDescription>Enter distributor details and upload required documents</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Document Upload
                      </h3>
                      <div className="grid gap-2">
                        <Label htmlFor="file-upload" className="text-sm font-medium">
                          Upload File <span className="text-red-500">*</span>
                        </Label>
                        <div className="border-2 border-dashed rounded-md p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            {file ? file.name : "Drag and drop or click to upload"}
                          </p>
                          <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("file-upload")?.click()}
                          >
                            Select File
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Basic Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="name">
                            Distributor Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter distributor name"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="company">
                            Company Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Enter company name"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="contact">
                            Contact Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="Enter contact number"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="gst">GST Number <span className="text-red-500">*</span></Label>
                          <Input
                            id="gst"
                            name="gst"
                            value={formData.gst}
                            onChange={handleInputChange}
                            placeholder="Enter GST number"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="Enter website URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Add Distributor"
                      )}
                    </Button>
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
                <div className="flex items-center justify-center h-40 border rounded-md">
                  <p className="text-muted-foreground">Distributor management interface will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}