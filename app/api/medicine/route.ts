import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const { updatedData, name, maker, salt,category, batchNo, expiry } = await req.json();

    console.log("Received Data:", updatedData);
    console.log("New Medicine Entry:", { name, maker, salt, category, batchNo, expiry });

    if (!updatedData || typeof updatedData !== 'object' || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: 'Invalid or empty data' }, { status: 400 });
    }

    const workbook = XLSX.utils.book_new();

    for (const sheetName in updatedData) {
      if (Array.isArray(updatedData[sheetName])) {
        let sheetData = [...updatedData[sheetName]];

        console.log(`Processing sheet: ${sheetName}`);
        console.log("Existing sheet data:", sheetData);
 
        if (sheetName.toLowerCase() === 'medicine') {
          const isDuplicate = sheetData.some(
            (row: any) =>
              row.Name.toLowerCase() === name.toLowerCase() &&
              row.Maker.toLowerCase() === maker.toLowerCase()
          );

          if (isDuplicate) {
            return NextResponse.json(
              { error: 'Medicine and maker already exists in the sheet' },
              { status: 409 }
            );
          }
          const nextID = sheetData.length>0? Math.max(...sheetData.map((row:any)=>row.ID))+1:1;

          sheetData.push({ ID: nextID ,Name: name, Maker: maker, Salt: salt, Category: category, BatchNo: batchNo, Expiry: expiry });

          console.log("Updated Medicine sheet data:", sheetData);
        }

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    }

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="updated_data.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error updating Excel file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

 