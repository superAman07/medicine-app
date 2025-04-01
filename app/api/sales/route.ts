import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const { updatedData,medicineID,medicineName, quantitySold, salePrice,saleDate } = await req.json();
    
    if (!updatedData || typeof updatedData !== 'object' || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: 'Invalid or empty data' }, { status: 400 });
    }
    const workbook = XLSX.utils.book_new();
 
    for (const sheetName in updatedData) {
      if (Array.isArray(updatedData[sheetName])) { 
        let sheetData = [...updatedData[sheetName]]

        if(sheetName.toLowerCase()=== 'sales'){
          const nextID = sheetData.length>0?Math.max(...sheetData.map((row:any)=>row.ID))+1:1;
          sheetData.push({ID:nextID ,MedicineID: medicineID,Medicine_Name: medicineName, Quantity_Sold: quantitySold,Sale_Price:salePrice,Sale_Date: saleDate})
        }

        if (sheetName.toLowerCase() === 'stock') {
          const stockItem = sheetData.find((item: any) => item.MedicineID === medicineID);

          if (!stockItem) {
            return NextResponse.json({ error: `Medicine with ID ${medicineID} does not exist in stock.` }, { status: 400 });
          }

          if (stockItem.Stock_Quantity < quantitySold) {
            return NextResponse.json({ error: `Insufficient stock for Medicine ID ${medicineID}.` }, { status: 400 });
          }
 
          sheetData = sheetData.map((item: any) => {
            if (item.MedicineID === medicineID) {
              return {
                ...item,
                Stock_Quantity: parseInt(item.Stock_Quantity) - parseInt(quantitySold),
                Sale_Price: parseFloat(salePrice.toFixed(2)),  
              };
            }
            return item;
          });
        }

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook,worksheet,sheetName);
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