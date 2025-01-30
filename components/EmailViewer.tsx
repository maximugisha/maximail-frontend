// components/EmailViewer.tsx

import { useEffect, useState } from 'react';
import { Mail, Paperclip } from 'lucide-react';
import type { Email } from '@/types/email';

interface EmailViewerProps {
    email: Email | null;
}

export function EmailViewer({ email }: EmailViewerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(false);
        if (email) {
            setTimeout(() => setIsVisible(true), 50);
        }
    }, [email]);

    if (!email) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>Select an email to view its contents</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`
      h-full space-y-6 transition-all duration-300 ease-in-out
      ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}
    `}>
            <div className="border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{email.subject}</h2>
                <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center">
                        <span className="w-16 font-medium text-gray-900">From:</span>
                        <span>{email.from}</span>
                    </p>
                    <p className="flex items-center">
                        <span className="w-16 font-medium text-gray-900">To:</span>
                        <span>{email.to.join(', ')}</span>
                    </p>
                    <p className="flex items-center">
                        <span className="w-16 font-medium text-gray-900">Date:</span>
                        <span>{new Date(email.date).toLocaleString('en-US', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                        })}</span>
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {email.content_html ? (
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: email.content_html }}
                    />
                ) : (
                    <pre className="whitespace-pre-wrap text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {email.content_text}
                    </pre>
                )}
            </div>

            {email.attachments && email.attachments.length > 0 && (
                <div className="border-t pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">Attachments ({email.attachments.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {email.attachments.map((attachment, index) => (
                            <div
                                key={index}
                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                                <Paperclip className="w-4 h-4 text-blue-500 mr-3" />
                                <span className="text-sm text-gray-600 truncate">
                                    {attachment.filename}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}