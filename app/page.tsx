// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, Search, AlertCircle } from 'lucide-react';
import { EmailListItem } from '@/components/EmailListItem';
import { EmailViewer } from '@/components/EmailViewer';
import type { Email } from '@/types/email';

export default function MailTrapPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEmails = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/emails');
      if (!response.ok) throw new Error('Failed to fetch emails');
      const data = await response.json();
      setEmails(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (emailId: string) => {
    try {
      const response = await fetch('/api/emails', {
        method: 'DELETE',
        body: JSON.stringify({ emailId }),
      });

      if (!response.ok) throw new Error('Failed to delete email');

      setEmails(emails.filter(email => email.id !== emailId));
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete email');
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.to.some(recipient => recipient.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Maximo Mail Trap</h1>
          <button
            onClick={fetchEmails}
            disabled={isRefreshing}
            className={`
              flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 transition-colors duration-200 shadow-sm
              disabled:opacity-75 disabled:cursor-not-allowed
            `}
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 text-red-900 bg-red-100 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="divide-y overflow-y-auto max-h-[calc(100vh-16rem)]">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No emails found</div>
              ) : (
                filteredEmails.map((email) => (
                  <EmailListItem
                    key={email.id}
                    email={email}
                    onSelect={setSelectedEmail}
                    isSelected={selectedEmail?.id === email.id}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 h-[calc(100vh-16rem)] overflow-y-auto">
              <EmailViewer email={selectedEmail} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
