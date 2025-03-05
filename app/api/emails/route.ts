// app/api/emails/route.ts
import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}


export async function GET() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emails`);
        if (!response.ok) throw new Error('Failed to fetch emails here');
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { emailId } = await request.json();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emails/${emailId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete email');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}