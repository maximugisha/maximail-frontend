// components/EmailListItem.tsx
import { useState } from 'react';
import { Mail, Paperclip, Trash2 } from 'lucide-react';
import type { Email } from '@/types/email';

interface EmailListItemProps {
    email: Email;
    onSelect: (email: Email) => void;
    isSelected: boolean;
    onDelete: (id: string) => void;
}

export function EmailListItem({ email, onSelect, isSelected, onDelete }: EmailListItemProps) {
    const [isLeaving, setIsLeaving] = useState(false);
    const hasAttachments = email.attachments && email.attachments.length > 0;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLeaving(true);
        setTimeout(() => onDelete(email.id), 300);
    };

    return (
        <div
            className={`
        p-4 cursor-pointer border-l-4 hover:bg-blue-50/50
        transition-all duration-300 ease-in-out
        ${isSelected ? 'bg-blue-50 border-l-blue-500' : 'border-l-transparent'}
        ${isLeaving ? 'opacity-0 transform -translate-x-full' : 'opacity-100 transform translate-x-0'}
      `}
            onClick={() => onSelect(email)}
        >
            <div className="flex items-center justify-between group">
                <div className="flex items-start space-x-4 flex-grow min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="font-medium text-gray-900 mb-0.5 truncate">{email.subject}</div>
                        <div className="text-sm text-gray-600 truncate">{email.from}</div>
                        <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs text-gray-400">
                                {new Date(email.date).toLocaleString('en-US', {
                                    weekday: 'short',
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                })}
                            </span>
                            {hasAttachments && (
                                <div className="flex items-center text-gray-400">
                                    <Paperclip className="w-3 h-3 mr-1" />
                                    <span className="text-xs">{email.attachments?.length ?? 0}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-full transition-all duration-200"
                >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
                </button>
            </div>
        </div>
    );
}
