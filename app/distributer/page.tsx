"use client";

import { useState } from "react";

const Distributer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [gst, setGst] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file || !name || !company || !contact) {
      alert("Please fill all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("company", company);
    formData.append("contact", contact);
    formData.append("gst", gst);

    try {
      const response = await fetch("/api/distributor", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const timeStamp = new Date();
        const formattedTime = `${timeStamp.getHours()}:${timeStamp.getMinutes()}:${timeStamp.getSeconds()}`;
        a.download = `${file.name.split(".")[0]} ${timeStamp.getDate()}-${timeStamp.getMonth()+1}-${timeStamp.getFullYear()} ${formattedTime}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // a.click();
        // window.URL.revokeObjectURL(url);
        alert("Distributor added successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="pt-24">
        <div className="max-w-lg mx-auto p-6 bg-[#252525] shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Add Distributor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Distributor Name" className="border p-2 w-full" />
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" className="border p-2 w-full" />
                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Number" className="border p-2 w-full" />
                <input type="text" value={gst} onChange={(e) => setGst(e.target.value)} placeholder="GST Number" className="border p-2 w-full" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Distributor</button>
            </form>
        </div>
    </div>
  );
};

export default Distributer;
