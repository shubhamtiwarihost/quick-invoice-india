import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required (name, email, subject, message)." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || "smtp.hostinger.com";
    const port = Number(process.env.SMTP_PORT) || 465;
    const secure = true; // SSL for port 465
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      console.error(
        "[Hostinger SMTP] Missing credentials: SMTP_USER and/or SMTP_PASS are not configured in environment variables."
      );
      return NextResponse.json(
        {
          error:
            "SMTP credentials not configured on server. Please set SMTP_USER and SMTP_PASS environment variables.",
          code: "SMTP_AUTH_CONFIG_MISSING",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    // Verify SMTP connection / authentication early
    try {
      await transporter.verify();
    } catch (verifyError: unknown) {
      const vError = verifyError as { message?: string; code?: string };
      console.error(
        "[Hostinger SMTP Auth Error] Failed to authenticate with Hostinger SMTP:",
        verifyError
      );
      return NextResponse.json(
        {
          error: `Hostinger SMTP Authentication Failed: ${vError?.message || "Invalid credentials"}`,
          code: vError?.code || "EAUTH",
        },
        { status: 500 }
      );
    }

    // Crucial Anti-Spam / Anti-Spoof Rule:
    // 'from': 'SwiftGST Contact Form <' + process.env.SMTP_USER + '>'
    // 'to': process.env.SMTP_USER (Hostinger webmail inbox)
    // 'replyTo': visitor's email entered in form
    const mailOptions = {
      from: `SwiftGST Contact Form <${user}>`,
      to: user,
      replyTo: email,
      subject: `[SwiftGST Contact] ${subject}`,
      text: `New contact form submission from ${name} (${email}):\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #a27b22; margin-top: 0; font-size: 20px;">New Contact Form Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; font-weight: 600; width: 90px; color: #64748b;">From:</td>
              <td style="padding: 6px 0;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; width: 90px; color: #64748b;">Reply-To:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #a27b22;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; width: 90px; color: #64748b;">Subject:</td>
              <td style="padding: 6px 0;">${subject}</td>
            </tr>
          </table>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <p style="font-weight: 600; color: #64748b; margin-bottom: 8px; font-size: 14px;">Message Body:</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; color: #334155;">${message}</div>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
            Delivered directly to Hostinger Webmail (${user}) via SwiftGST contact form.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[Hostinger SMTP] Email delivered successfully. Message ID:", info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error("[Hostinger SMTP Error]:", error);
    return NextResponse.json(
      {
        error: err?.message || "An unexpected error occurred while sending your message.",
        code: err?.code || "SMTP_ERROR",
      },
      { status: 500 }
    );
  }
}
