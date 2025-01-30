// types/email.ts
export interface Attachment {
    filename: string;
    content_type: string;
    size: number;
}

export interface Email {
    id: string;
    subject: string;
    from: string;
    to: string[];
    date: string;
    content_html?: string;
    content_text?: string;
    attachments?: Attachment[];
}