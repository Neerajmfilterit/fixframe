import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Sample chart data for testing
    const chartData = [
      {
        name: "January",
        value: 1200,
        color: "hsl(0, 70%, 50%)"
      },
      {
        name: "February", 
        value: 1900,
        color: "hsl(60, 70%, 50%)"
      },
      {
        name: "March",
        value: 3000,
        color: "hsl(120, 70%, 50%)"
      },
      {
        name: "April",
        value: 2800,
        color: "hsl(180, 70%, 50%)"
      },
      {
        name: "May",
        value: 1890,
        color: "hsl(240, 70%, 50%)"
      },
      {
        name: "June",
        value: 2390,
        color: "hsl(300, 70%, 50%)"
      }
    ];

    // Return the data with some metadata
    return NextResponse.json({
      success: true,
      message: "Chart data retrieved successfully",
      data: chartData,
      total: chartData.length,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Error in test-chart-data API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch chart data',
        message: 'Internal server error'
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Sample response for POST requests
    const responseData = {
      success: true,
      message: "Data processed successfully",
      receivedData: body,
      processedAt: new Date().toISOString(),
      result: {
        name: "Processed Item",
        value: Math.floor(Math.random() * 1000) + 500,
        color: "hsl(45, 70%, 50%)"
      }
    };

    return NextResponse.json(responseData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Error in test-chart-data POST API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process data',
        message: 'Invalid JSON or processing error'
      },
      { 
        status: 400,
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
