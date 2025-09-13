import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
 
export async function POST(request: NextRequest) {
  try {
    const { emails, projectName, shareLink, shareLinks, senderName } = await request.json();
 
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'No emails provided' }, { status: 400 });
    }
 
    if (!projectName || (!shareLink && !shareLinks)) {
      return NextResponse.json({ error: 'Missing project name or share link' }, { status: 400 });
    }
 
    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const emailPort = parseInt(process.env.EMAIL_PORT || '587');
    const emailFrom = process.env.EMAIL_FROM || 'mFilterIt Wireframe Builder <noreply@mfilterit.com>';
 
    if (!emailUser || !emailPassword) {
      console.log('Email credentials not configured. Using mailto fallback.');
      return NextResponse.json({
        error: 'Email service not configured. Please set up EMAIL_USER and EMAIL_PASSWORD in .env.local',
        fallback: true,
        mailtoData: { emails, projectName, shareLink, shareLinks, senderName }
      }, { status: 400 });
    }
 
    // mFilterIt themed email template
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Shared - ${projectName}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f8f9fa;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
              opacity: 0.3;
            }
            .header-content {
              position: relative;
              z-index: 1;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .tagline {
              font-size: 14px;
              opacity: 0.9;
              margin-bottom: 20px;
            }
            .main-title {
              font-size: 24px;
              font-weight: 600;
              margin: 0;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              color: #1e40af;
              margin-bottom: 20px;
              font-weight: 600;
            }
            .project-info {
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border-left: 4px solid #3b82f6;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
            }
            .project-name {
              font-size: 20px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
            }
            .share-button {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
              transition: all 0.3s ease;
            }
            .share-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
            }
            .features {
              background: #f8fafc;
              padding: 25px;
              border-radius: 8px;
              margin: 25px 0;
            }
            .features h3 {
              color: #1e40af;
              margin-bottom: 15px;
              font-size: 18px;
            }
            .features ul {
              list-style: none;
              padding: 0;
            }
            .features li {
              padding: 8px 0;
              position: relative;
              padding-left: 25px;
            }
            .features li::before {
              content: '✓';
              position: absolute;
              left: 0;
              color: #10b981;
              font-weight: bold;
            }
            .footer {
              background: #1f2937;
              color: #d1d5db;
              padding: 30px;
              text-align: center;
            }
            .footer-logo {
              font-size: 20px;
              font-weight: bold;
              color: #3b82f6;
              margin-bottom: 10px;
            }
            .footer-text {
              font-size: 14px;
              line-height: 1.5;
            }
            .social-links {
              margin-top: 20px;
            }
            .social-links a {
              color: #3b82f6;
              text-decoration: none;
              margin: 0 10px;
              font-size: 14px;
            }
            .trust-badge {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 10px 20px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              display: inline-block;
              margin: 20px 0;
            }
            .link-fallback {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 6px;
              font-family: monospace;
              font-size: 12px;
              word-break: break-all;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="header-content">
                <div class="logo">mFilterIt</div>
                <div class="tagline">Adding Trust to Digital with Enhanced Transparency</div>
                <h1 class="main-title">🎨 Project Shared with You!</h1>
              </div>
            </div>
 
            <!-- Content -->
            <div class="content">
              <div class="greeting">Hello!</div>
             
              <p><strong>${senderName || 'A colleague'}</strong> has shared a wireframe project with you through mFilterIt's collaboration platform.</p>
 
              <div class="project-info">
                <div class="project-name">📊 ${projectName}</div>
                <p>Access this project to view, collaborate, and provide feedback on wireframe designs and dashboard layouts.</p>
              </div>
 
              <div style="text-align: center;">
                <a href="{{shareLink}}" class="share-button">Open Project</a>
              </div>
 
              <div class="features">
                <h3>🚀 What You Can Do:</h3>
                <ul>
                  <li>View wireframe and dashboard designs</li>
                  <li>Add comments and feedback in real-time</li>
                  <li>Collaborate with team members</li>
                  <li>Export projects as high-quality PDFs</li>
                  <li>Track project progress and updates</li>
                </ul>
              </div>
 
             
              <div class="link-fallback">{{shareLink}}</div>
            </div>
 
         
          </div>
        </body>
      </html>
    `;
 
    const emailText = `
      mFilterIt - Project Shared: ${projectName}
     
      Hello!
     
      ${senderName || 'A colleague'} has shared a wireframe project with you through mFilterIt's collaboration platform.
     
      Project: ${projectName}
      Access Link: {{shareLink}}
     
      What you can do:
      - View wireframe and dashboard designs
      - Add comments and feedback in real-time
      - Collaborate with team members
      - Export projects as high-quality PDFs
      - Track project progress and updates
     
      Secured by mFilterIt's Trust & Transparency Framework
     
      This email was sent from mFilterIt's Wireframe Builder.
      If you didn't expect this email, you can safely ignore it.
     
      ---
      mFilterIt - Adding Trust to Digital with Enhanced Transparency
      Website: https://www.mfilterit.com
    `;
 
    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
 
    // Send emails to each recipient with their specific link
    const emailPromises = emails.map(async (user) => {
      try {
        // Find the specific link for this user
        const userLink = shareLinks?.find(link => link.email === user.email)?.link || shareLink;
        const userPermission = user.permission || 'view';
       
        const mailOptions = {
          from: emailFrom,
          to: user.email,
          subject: `🎨 mFilterIt Project Shared: ${projectName} (${userPermission === 'view' ? 'View Only' : 'Can Edit'})`,
          html: emailHtml.replace(/{{shareLink}}/g, userLink),
          text: emailText.replace(/{{shareLink}}/g, userLink),
        };
 
        const result = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${user.email}:`, result.messageId);
        return { email: user.email, success: true, messageId: result.messageId };
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        return { email: user.email, success: false, error: error.message };
      }
    });
 
    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
   
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
 
    return NextResponse.json({
      message: `Emails sent successfully! ${successful.length} delivered, ${failed.length} failed`,
      results: {
        successful: successful.length,
        failed: failed.length,
        details: results
      },
      sentTo: emails.length
    });
 
  } catch (error) {
    console.error('Error preparing mFilterIt email:', error);
    return NextResponse.json(
      { error: 'Failed to prepare email' },
      { status: 500 }
    );
  }
}
 
 