import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Different data format - wrapped in results
    const salesData = {
      results: [
        {
          name: "Q1 Sales",
          value: 45000,
          color: "#8884d8"
        },
        {
          name: "Q2 Sales", 
          value: 52000,
          color: "#82ca9d"
        },
        {
          name: "Q3 Sales",
          value: 48000,
          color: "#ffc658"
        },
        {
          name: "Q4 Sales",
          value: 61000,
          color: "#ff7300"
        }
      ],
      summary: {
        total: 206000,
        average: 51500,
        growth: 12.5
      }
    };

    return NextResponse.json(salesData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Error in test-sales-data API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sales data'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
