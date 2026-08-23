import nodemailer from "nodemailer";

// Google Gmail SMTP Transporter
export const mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export interface OrderEmailDetails {
    orderId: string;
    customerName: string;
    customerEmail?: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    address: string;
}

// Send automated luxury receipt & confirmation email to customer
export async function sendOrderConfirmationEmail(toEmail: string, details: OrderEmailDetails) {
    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
        console.warn("SMTP credentials not configured. Skipping email dispatch.");
        return;
    }

    const itemsHtml = details.items
        .map(
            (item) => `
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #f4f4f5; font-size: 14px;">${item.quantity}x ${item.name}</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #eab308; font-weight: bold; text-align: right; font-size: 14px;">₹${item.price * item.quantity}</td>
            </tr>`
        )
        .join("");

    const mailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070a07; margin: 0; padding: 20px; color: #f4f4f5; }
            .container { max-width: 540px; margin: 0 auto; background-color: #0c120c; border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 24px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .header { text-align: center; margin-bottom: 24px; }
            .logo-title { font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; margin: 0; }
            .logo-n { color: #eab308; }
            .tagline { color: #22c55e; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
            .order-pill { display: inline-block; background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); color: #fef08a; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 800; text-transform: uppercase; margin: 16px 0; }
            .details-box { background-color: #080c08; border-radius: 16px; padding: 16px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.05); }
            .total-row { display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(234, 179, 8, 0.3); font-size: 18px; font-weight: 900; }
            .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #71717a; border-top: 1px solid rgba(234, 179, 8, 0.15); padding-top: 16px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo-title">Food<span class="logo-n">N</span>Joy</h1>
                <div class="tagline">Taste • Hygiene • Value</div>
                <div class="order-pill">Order #${details.orderId.slice(-4).toUpperCase()} Confirmed</div>
            </div>

            <p style="font-size: 15px; line-height: 1.5; color: #d4d4d8;">
                Hi <strong>${details.customerName}</strong>,<br>
                Thank you for ordering with FoodNJoy! Your delicacies are now queued in our Tinsukia kitchen.
            </p>

            <div class="details-box">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; color: #a1a1aa; font-size: 11px; text-transform: uppercase; padding-bottom: 8px;">Item</th>
                            <th style="text-align: right; color: #a1a1aa; font-size: 11px; text-transform: uppercase; padding-bottom: 8px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #27272a; font-size: 13px; color: #a1a1aa;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span>Delivery (Tinsukia Local):</span>
                        <span style="color: #fff;">₹25</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span>Govt Taxes & Packaging:</span>
                        <span style="color: #fff;">₹10</span>
                    </div>
                </div>

                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(234,179,8,0.3); font-size: 16px; font-weight: bold; color: #fff;">
                    Total Paid: <span style="color: #eab308; float: right;">₹${details.total}</span>
                </div>
            </div>

            <p style="font-size: 12px; color: #a1a1aa;">
                📍 <strong>Delivery Address:</strong> ${details.address}
            </p>

            <div class="footer">
                <p style="font-style: italic; color: #eab308; font-weight: bold; margin-bottom: 4px;">"Good Food. Great Joy."</p>
                <p>FoodNJoy Tinsukia, Assam • Fresh Street Food Delivery</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return await mailTransporter.sendMail({
        from: process.env.EMAIL_FROM || `FoodNJoy <${process.env.EMAIL_SERVER_USER}>`,
        to: toEmail,
        subject: `Order #${details.orderId.slice(-4).toUpperCase()} Confirmed - FoodNJoy Tinsukia`,
        html: mailHtml,
    });
}
