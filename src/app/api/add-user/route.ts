// src/app/api/add-user/route.ts
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    
    console.log('Received form data:', body);
    
    // Extract all form fields
    const { 
      username, 
      state, 
      plan, 
      additionalResources, 
      totalAmount,
      discount,
      piDate,
      invoiceDate
    } = body;
    
    // Execute the insert query with CAPITALIZED column names to match your table
    const [result] = await db.execute(
      `INSERT INTO users (
        USERNAME, 
        STATE, 
        PLAN, 
        ADDITIONAL_RESOURCES, 
        TOTAL_AMOUNT, 
        DISCOUNT, 
        PI_DATE, 
        INVOICE_DATE
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username, 
        state, 
        plan, 
        additionalResources, 
        totalAmount,
        discount,
        piDate,
        invoiceDate
      ]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'User added successfully',
      result 
    });
    
  } catch (error: any) {
    console.error('Error saving user:', error);
    
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to add user',
      error: error.message 
    }, { status: 500 });
  }
}