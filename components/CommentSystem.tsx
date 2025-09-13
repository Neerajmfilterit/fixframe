'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, CheckCircle, Circle } from 'lucide-react';

interface Comment {
  _id: string;
  authorEmail: string;
  authorName: string;
  content: string;
  position?: {
    x: number;
    y: number;
    pageId: string;
  };
  chartId?: string;
  isResolved: boolean;
  createdAt: string;
}

interface CommentSystemProps {
  projectId: string;
  isDarkMode: boolean;
  isViewOnly: boolean;
  isPublicAccess: boolean;
  permission?: string;
  currentPageId: string;
  selectedChart?: string | null;
}

export default function CommentSystem({
  projectId,
  isDarkMode,
  isViewOnly,
  isPublicAccess,
  permission,
  currentPageId,
  selectedChart
}: CommentSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Load comments when component mounts or project changes
  useEffect(() => {
    if (projectId) {
      loadComments();
    }
  }, [projectId, permission]);

  // Auto-scroll to bottom when new comments are added
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const baseUrl = isPublicAccess 
        ? `/api/projects/${projectId}/comments/public?permission=${permission}`
        : `/api/projects/${projectId}/comments`;
      
      const response = await fetch(baseUrl);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !authorEmail.trim()) return;

    try {
      setIsLoading(true);
      const baseUrl = isPublicAccess 
        ? `/api/projects/${projectId}/comments/public?permission=${permission}`
        : `/api/projects/${projectId}/comments`;

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          authorEmail,
          authorName: authorName || authorEmail.split('@')[0],
          position: {
            x: 0,
            y: 0,
            pageId: currentPageId
          },
          chartId: selectedChart || null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
        setShowCommentForm(false);
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredComments = comments.filter(comment => 
    comment.position?.pageId === currentPageId && 
    (!selectedChart || comment.chartId === selectedChart)
  );

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputClass = isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';

  return (
    <>
      {/* Comment Button */}
      

      {/* Comment Panel */}
      {isOpen && (
        <div className={`fixed bottom-20 right-4 w-80 h-96 ${bgClass} ${borderClass} border rounded-lg shadow-xl z-40 flex flex-col`}>
          {/* Header */}
          <div className={`p-3 border-b ${borderClass} flex items-center justify-between`}>
            <h3 className={`font-semibold ${textClass}`}>
              Comments ({filteredComments.length})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {isLoading && comments.length === 0 ? (
              <div className={`text-center ${textClass} opacity-60`}>
                Loading comments...
              </div>
            ) : filteredComments.length === 0 ? (
              <div className={`text-center ${textClass} opacity-60`}>
                No comments yet. Be the first to comment!
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div key={comment._id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={`font-medium text-sm ${textClass}`}>
                          {comment.authorName}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {comment.isResolved ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  <div className={`text-sm ${textClass}`}>
                    {comment.content}
                  </div>
                </div>
              ))
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Comment Form */}
          {!isViewOnly && (
            <div className={`p-3 border-t ${borderClass}`}>
              {!showCommentForm ? (
                <button
                  onClick={() => setShowCommentForm(true)}
                  className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Add Comment
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputClass}`}
                  />
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputClass}`}
                  />
                  <textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border resize-none ${inputClass}`}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim() || !authorEmail.trim() || isLoading}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        !newComment.trim() || !authorEmail.trim() || isLoading
                          ? isDarkMode 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : isDarkMode 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      {isLoading ? 'Sending...' : 'Send'}
                    </button>
                    <button
                      onClick={() => {
                        setShowCommentForm(false);
                        setNewComment('');
                        setAuthorEmail('');
                        setAuthorName('');
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isViewOnly && (
            <div className={`p-3 border-t ${borderClass} text-center`}>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                👁️ View Only - You can add comments but cannot edit the project
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
