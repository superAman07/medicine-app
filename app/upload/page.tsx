'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadPage() { 
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      router.push("/"); 
    } else {
      setError("Please upload a valid Excel file (.xlsx)");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
        <input type="file" accept=".xlsx" onChange={handleFileChange} className="border p-2 w-full" />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
