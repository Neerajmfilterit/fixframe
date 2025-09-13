import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Data wrapped in 'items' property
    const productData = {
      items: [
        {
          name: "Laptop",
          count: 150,
          color: "hsl(200, 70%, 50%)"
        },
        {
          name: "Phone",
          count: 320,
          color: "hsl(100, 70%, 50%)"
        },
        {
          name: "Tablet",
          count: 85,
          color: "hsl(300, 70%, 50%)"
        },
        {
          name: "Desktop",
          count: 45,
          color: "hsl(50, 70%, 50%)"
        },
        {
          name: "Monitor",
          count: 200,
          color: "hsl(150, 70%, 50%)"
        }
      ],
      metadata: {
        lastUpdated: new Date().toISOString(),
        source: "inventory_system"
      }
    };

    return NextResponse.json(productData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Error in test-products API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch product data'
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
