'use client';
 
import React, { useState } from 'react';
import { X, Mail, Eye, Edit, Copy, Check, Send } from 'lucide-react';
 
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  isDarkMode: boolean;
  projectId?: string;
}
 
interface SharePermission {
  email: string;
  permission: 'view' | 'edit';
}
 
export default function ShareModal({ isOpen, onClose, projectName, isDarkMode, projectId }: ShareModalProps) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [sharedUsers, setSharedUsers] = useState<SharePermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
 
  if (!isOpen) return null;
 
  const handleAddUser = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
 
    if (sharedUsers.some(user => user.email === email)) {
      alert('This email is already added');
      return;
    }
 
    setSharedUsers(prev => [...prev, { email, permission }]);
    setEmail('');
    setPermission('view');
  };
 
  const handleRemoveUser = (emailToRemove: string) => {
    setSharedUsers(prev => prev.filter(user => user.email !== emailToRemove));
  };
 
  const handlePermissionChange = (emailToUpdate: string, newPermission: 'view' | 'edit') => {
    setSharedUsers(prev =>
      prev.map(user =>
        user.email === emailToUpdate ? { ...user, permission: newPermission } : user
      )
    );
  };
 
  const handleShare = async () => {
    if (sharedUsers.length === 0) {
      alert('Please add at least one email address');
      return;
    }

    if (!projectId) {
      alert('Project ID is required for sharing');
      return;
    }

    setIsLoading(true);
    try {
      // First, create share records in the database
      const shareResponse = await fetch(`/api/projects/${projectId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: sharedUsers,
          permissions: sharedUsers.map(user => user.permission)
        }),
      });

      if (!shareResponse.ok) {
        const error = await shareResponse.json();
        throw new Error(error.error || 'Failed to create share records');
      }

      const shareResult = await shareResponse.json();
      const shareLinks = shareResult.shareLinks;
     
      // Send mFilterIt themed emails
      const response = await fetch('/api/send-mfilterit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: sharedUsers,
          shareLinks: shareLinks,
          projectName: projectName,
          senderName: 'mFilterIt User',
          projectId: projectId,
        }),
      });
 
      if (response.ok) {
        const result = await response.json();
        // show success toast
        setToastMsg(result.message || 'Emails sent successfully');
        setTimeout(() => setToastMsg(null), 4000);
        
        // Redirect to builder page with project ID after successful email sending
        if (result.redirectUrl) {
          setTimeout(() => {
            window.location.href = result.redirectUrl;
          }, 2000); // Wait 2 seconds to show the success message
        }
 
      } else {
        const error = await response.json();
       
        // If email service is not configured, fallback to mailto
        if (error.fallback && error.mailtoData) {
          console.log('Email service not configured, using mailto fallback');
         
          // Create mailto links with mFilterIt branding
          sharedUsers.forEach((user) => {
            const userLink = shareLinks.find((link: any) => link.email === user.email)?.link || window.location.href;
            const userPermission = user.permission || 'view';
            const subject = encodeURIComponent(`🎨 mFilterIt Project Shared: ${projectName} (${userPermission === 'view' ? 'View Only' : 'Can Edit'})`);
            const body = encodeURIComponent(`
Hello!
 
I've shared a wireframe project with you through mFilterIt's collaboration platform: "${projectName}"
 
You can access the project using this link:
${userLink}
 
Permission: ${userPermission === 'view' ? 'View Only - You can view and comment' : 'Can Edit - You can edit and comment'}
 
What you can do:
- View wireframe and dashboard designs
- Add comments and feedback in real-time
- Collaborate with team members
- Export projects as high-quality PDFs
- Track project progress and updates
 
Secured by mFilterIt's Trust & Transparency Framework
 
Best regards!
mFilterIt Team
            `.trim());
 
            const mailtoLink = `mailto:${user.email}?subject=${subject}&body=${body}`;
            window.open(mailtoLink, '_blank');
          });
 
          alert(`📧 Email service not configured.\n\nEmail clients opened for ${sharedUsers.length} recipients.\n\nTo enable automatic email sending, please configure email credentials in .env.local`);
        } else {
          alert(`❌ Failed to send emails: ${error.error}`);
        }
      }
    } catch (error) {
      console.error('Error sharing project:', error);
      alert('Failed to share project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
 
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-2xl mx-4 rounded-lg shadow-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">mF</span>
              </div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Share Project
              </h2>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              {projectName} • Powered by mFilterIt
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-20 ${
              isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
 
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Add User Section */}
          <div>
            <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Add People
            </h3>
           
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                className={`px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
 
          {/* Shared Users List */}
          {sharedUsers.length > 0 && (
            <div>
              <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Shared With
              </h3>
              <div className="space-y-3">
                {sharedUsers.map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-blue-600' : 'bg-blue-100'
                      }`}>
                        <Mail className={`h-4 w-4 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.email}
                      </span>
                    </div>
                   
                    <div className="flex items-center gap-2">
                      <select
                        value={user.permission}
                        onChange={(e) => handlePermissionChange(user.email, e.target.value as 'view' | 'edit')}
                        className={`px-3 py-1 rounded border text-sm ${
                          isDarkMode
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      >
                        <option value="view">Can view</option>
                        <option value="edit">Can edit</option>
                      </select>
                     
                      <button
                        onClick={() => handleRemoveUser(user.email)}
                        className={`p-1 rounded hover:bg-opacity-20 ${
                          isDarkMode ? 'text-red-400 hover:bg-red-600' : 'text-red-500 hover:bg-red-100'
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {/* Share Link Section */}
          {shareLink && (
            <div>
              <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Share Link
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    linkCopied
                      ? 'bg-green-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {linkCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
 
        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={isLoading || sharedUsers.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sharing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Share via mFilterIt
              </>
            )}
          </button>
        </div>
      </div>
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[60]">
          <div className={`rounded-md shadow-lg px-4 py-3 text-sm font-medium flex items-start gap-3 border ${
            isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white text-xs">✓</span>
            <div>
              <div>{toastMsg}</div>
              <div className="text-xs opacity-70">Your recipients should receive the email shortly.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
// Toast renderer is appended at portal-like fixed position
 
 