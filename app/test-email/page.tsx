'use client';
 
import React, { useState } from 'react';
 
export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('Test Project');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
 
  const testEmail = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }
 
    setIsLoading(true);
    setResult(null);
 
    try {
      const response = await fetch('/api/send-mfilterit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: [{ email, permission: 'view' }],
          projectName: projectName,
          shareLink: 'http://localhost:3001/shared/test-123',
          senderName: 'Test User',
        }),
      });
 
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to send test email', details: error });
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Email Sending</h1>
       
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Send Test Email</h2>
         
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name:
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
           
            <button
              onClick={testEmail}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending Test Email...
                </>
              ) : (
                'Send Test Email'
              )}
            </button>
          </div>
        </div>
 
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
 
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold mb-2">Setup Required:</h3>
          <p className="text-yellow-700 text-sm mb-2">
            To send actual emails, you need to configure email credentials in your <code>.env.local</code> file:
          </p>
          <pre className="bg-yellow-100 p-3 rounded text-xs overflow-auto">
{`EMAIL_HOST='email-smtp.us-west-2.amazonaws.com'
EMAIL_PORT='465'
EMAIL_USER='AKIA2QJ7DS2HSDXKATO5'
EMAIL_PASS='BGmZg099na1bK6GFYrb0iglHLupHsYYFC3Syc92Tc/sp'
EMAIL_ID='fixframe@mfilterit.com'`}
          </pre>
          <p className="text-yellow-700 text-sm mt-2">
            See <code>EMAIL_SETUP_GUIDE.md</code> for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
 
 