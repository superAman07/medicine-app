'use client';
import { useState } from 'react';

export default function Medicine() {
  const [name, setMedName] = useState('');
  const [maker, setMakerName] = useState('');
  const [salt, setSaltName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!file) {
      alert("Please upload an Excel file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('maker', maker);
    formData.append('salt', salt);
  
    try {
      const response = await fetch('/api/update-excel', {
        method: 'POST',
        body: formData,
      });
  
      if (response.status === 409) {
        alert('Medicine already exists in the sheet.');
        return;
      }
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        
        const timeStamp = new Date();  
        const formattedTime = `${timeStamp.getHours()}:${timeStamp.getMinutes()}:${timeStamp.getSeconds()}`;
        a.download = `${file.name.split(".")[0]} ${timeStamp.getDate()}-${timeStamp.getMonth() + 1}-${timeStamp.getFullYear()} ${formattedTime}.xlsx`;        

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  
        alert('Updated Excel file downloaded. Please save it in the same location.');
      } else {
        alert('Failed to update Excel file.');
      }
    } catch (error) {
      console.error('Error updating Excel file:', error);
    }
  };
  

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#252525]">
      <h1 className="text-3xl font-bold mb-4 text-white">Upload & Update Excel</h1> 
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 border px-4 py-2 rounded-md bg-white text-black"
      />
      

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          placeholder="Enter Medicine Name"
          onChange={(e) => setMedName(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="text"
          value={maker}
          placeholder="Enter Company"
          onChange={(e) => setMakerName(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="text"
          value={salt}
          placeholder="Enter Salt Name"
          onChange={(e) => setSaltName(e.target.value)}
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
}
