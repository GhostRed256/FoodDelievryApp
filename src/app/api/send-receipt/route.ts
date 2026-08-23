import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { toEmail, details } = body;

        if (!toEmail || !details) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        await sendOrderConfirmationEmail(toEmail, details);
        return NextResponse.json({ success: true, message: "Receipt sent successfully" });
    } catch (error: any) {
        console.error("Failed to send order email:", error);
        return NextResponse.json({ error: error.message || "Email dispatch failed" }, { status: 500 });
    }
}
