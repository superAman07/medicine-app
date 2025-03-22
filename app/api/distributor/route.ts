import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const contact = formData.get('contact') as string;
    const gst = formData.get('gst') as string;
    const email = formData.get('email') as string;
    const website = formData.get('website') as string;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    // Read uploaded file
    const fileBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Ensure "distributor" sheet exists
    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];

    // Convert Excel sheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Check if the distributor already exists
    const isDuplicate = data.some((row: any) => 
      row.Name?.toLowerCase() === name.toLowerCase() && 
      row.Company?.toLowerCase() === company.toLowerCase()
    );

    if (isDuplicate) {
      return NextResponse.json({ error: 'Distributor already exists' }, { status: 409 });
    }

    // Append new distributor data
    data.push({ Name: name, Company: company, Contact: contact, GST: gst, Email:email, Website: website });

    // Convert back to worksheet & update workbook
    const updatedWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = updatedWorksheet;

    // Generate buffer for response
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="updated_distributors.xlsx"',
      },
    });

  } catch (error) {
    console.error('Error updating Excel file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
