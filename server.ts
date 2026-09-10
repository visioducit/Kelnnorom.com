import express, { Request, Response } from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

interface MailAttachmentPayload {
  name?: string;
  type?: string;
  url?: string;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with size limits
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Webmail API Bridge Status
  app.get('/api/webmail/status', (req: Request, res: Response) => {
    const envUser = process.env.SMTP_USER || process.env.ZOHO_SMTP_USER || 'kel@kelnnorom.com';
    const hasEnvPass = Boolean(process.env.SMTP_PASS || process.env.ZOHO_SMTP_PASS);
    const host = process.env.SMTP_HOST || 'smtppro.zoho.com';
    const port = Number(process.env.SMTP_PORT || 465);

    res.json({
      active: true,
      bridgeType: 'Node.js Nodemailer TLS 1.3 Bridge',
      defaultHost: host,
      defaultPort: port,
      defaultUser: envUser,
      hasEnvCredentials: hasEnvPass,
      supportedPresets: ['zoho', 'cpanel', 'gmail', 'office365', 'ses', 'custom'],
      timestamp: new Date().toISOString(),
    });
  });

  // Webmail Verify Connection / Handshake
  app.post('/api/webmail/verify', async (req: Request, res: Response) => {
    try {
      const { config } = req.body || {};

      const host = config?.smtpHost || process.env.SMTP_HOST || 'smtppro.zoho.com';
      const port = Number(config?.smtpPort || process.env.SMTP_PORT || 465);
      const isSecure = config?.smtpSecurity === 'ssl' || port === 465;
      const user = config?.smtpUser || process.env.SMTP_USER || process.env.ZOHO_SMTP_USER || 'kel@kelnnorom.com';
      const pass = config?.smtpPass || process.env.SMTP_PASS || process.env.ZOHO_SMTP_PASS || '';

      if (!pass) {
        res.status(400).json({
          success: false,
          code: 'CREDENTIALS_REQUIRED',
          message:
            'SMTP password not provided. Enter your Zoho Account or App Password in Mail Server Settings, or configure the SMTP_PASS environment variable.',
        });
        return;
      }

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: isSecure,
        auth: {
          user,
          pass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        tls: {
          rejectUnauthorized: false, // Prevents self-signed cert failures on custom cPanel IPs
        },
      });

      await transporter.verify();

      res.json({
        success: true,
        message: `SMTP handshake and authentication verified with ${host}:${port}`,
        host,
        port,
        secure: isSecure,
        user,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      console.error('[Webmail Verify Error]:', err);
      const errorObj = err as Error & { code?: string };
      let userAdvice = errorObj.message || 'Verification failed';

      if (
        errorObj.message &&
        (errorObj.message.includes('Invalid login') ||
          errorObj.message.includes('535') ||
          errorObj.message.includes('Username and Password not accepted'))
      ) {
        userAdvice =
          'Zoho Mail authentication rejected the credentials. If Two-Factor Authentication (2FA) is enabled on your Zoho account, you must generate an App-Specific Password (in Zoho Accounts > Security > App Passwords) rather than using your master password.';
      } else if (errorObj.code === 'ETIMEDOUT' || errorObj.code === 'ECONNREFUSED') {
        userAdvice = `Could not connect to SMTP server. Ensure the host and port are correct and reachable.`;
      }

      res.status(500).json({
        success: false,
        code: errorObj.code || 'VERIFICATION_FAILED',
        error: userAdvice,
        rawError: errorObj.message,
      });
    }
  });

  // Webmail Send Email Bridge (Real Outbound Dispatch)
  app.post('/api/webmail/send', async (req: Request, res: Response) => {
    try {
      const {
        to,
        from,
        replyTo,
        cc,
        bcc,
        subject,
        text,
        html,
        priority = 'normal',
        attachments = [],
        config,
      } = req.body || {};

      if (!to || (Array.isArray(to) && to.length === 0)) {
        res.status(400).json({ success: false, error: 'Recipient email address (to) is required.' });
        return;
      }

      const host = config?.smtpHost || process.env.SMTP_HOST || 'smtppro.zoho.com';
      const port = Number(config?.smtpPort || process.env.SMTP_PORT || 465);
      const isSecure = config?.smtpSecurity === 'ssl' || port === 465;
      const user = config?.smtpUser || process.env.SMTP_USER || process.env.ZOHO_SMTP_USER || 'kel@kelnnorom.com';
      const pass = config?.smtpPass || process.env.SMTP_PASS || process.env.ZOHO_SMTP_PASS || '';

      if (!pass) {
        res.status(400).json({
          success: false,
          code: 'CREDENTIALS_REQUIRED',
          error:
            'SMTP password not found. Enter your Zoho Account Password or App Password in Mail Server Settings (or set the SMTP_PASS environment variable) to dispatch real external emails.',
        });
        return;
      }

      // Format recipient list
      const formatRecipients = (input: unknown): string => {
        if (!input) return '';
        if (Array.isArray(input)) {
          return input
            .map((item: { name?: string; email?: string } | string) =>
              typeof item === 'string' ? item : item.name ? `"${item.name}" <${item.email}>` : item.email || ''
            )
            .filter(Boolean)
            .join(', ');
        }
        return String(input);
      };

      const fromAddress = from?.email
        ? from.name
          ? `"${from.name}" <${from.email}>`
          : from.email
        : user
        ? `"${config?.fromName || process.env.SMTP_FROM_NAME || 'Kel Nnorom'}" <${user}>`
        : 'kel@kelnnorom.com';

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: isSecure,
        auth: {
          user,
          pass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 25000,
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Prepare mail options
      const mailOptions: nodemailer.SendMailOptions = {
        from: fromAddress,
        to: formatRecipients(to),
        subject: subject || '(No Subject)',
        text: text || '',
        html: html || (text ? text.replace(/\n/g, '<br/>') : ''),
        replyTo: replyTo || fromAddress,
        headers: {
          'X-Mailer': 'Kel Nnorom Executive Webmail Bridge/2.0',
          'X-Priority': priority === 'high' ? '1' : priority === 'low' ? '5' : '3',
        },
      };

      if (cc) mailOptions.cc = formatRecipients(cc);
      if (bcc) mailOptions.bcc = formatRecipients(bcc);

      // Map base64 or url attachments if present
      if (Array.isArray(attachments) && attachments.length > 0) {
        mailOptions.attachments = attachments.map((att: MailAttachmentPayload) => ({
          filename: att.name || 'attachment',
          contentType: att.type,
          path: att.url?.startsWith('data:') ? undefined : att.url,
          content: att.url?.startsWith('data:') ? att.url.split('base64,')[1] : undefined,
          encoding: att.url?.startsWith('data:') ? 'base64' : undefined,
        }));
      }

      // Dispatch mail
      const info = await transporter.sendMail(mailOptions);

      console.log(`[Webmail Dispatch Success] MessageId: ${info.messageId} to ${mailOptions.to} via ${host}:${port}`);

      res.json({
        success: true,
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
        host,
        port,
        from: fromAddress,
        to: mailOptions.to,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      console.error('[Webmail Dispatch Error]:', err);
      const errorObj = err as Error & { code?: string };
      let userAdvice = errorObj.message || 'Failed to dispatch email';

      if (
        errorObj.message &&
        (errorObj.message.includes('Invalid login') ||
          errorObj.message.includes('535') ||
          errorObj.message.includes('Username and Password not accepted'))
      ) {
        userAdvice =
          'Zoho Mail authentication failed. If Two-Factor Authentication (2FA) is enabled on your Zoho account, generate an App-Specific Password under Zoho Accounts > Security > App Passwords and enter it in Mail Server Settings.';
      } else if (errorObj.code === 'ETIMEDOUT' || errorObj.code === 'ECONNREFUSED') {
        userAdvice = `Could not connect to SMTP server (${req.body?.config?.smtpHost || 'smtppro.zoho.com'}). Ensure network and port permissions are open.`;
      } else if (errorObj.message && errorObj.message.includes('Relay access denied')) {
        userAdvice =
          'The mail server rejected the recipient (Relay access denied). Verify your sender domain matches your authenticated Zoho/cPanel user.';
      }

      res.status(500).json({
        success: false,
        code: errorObj.code || 'SEND_FAILED',
        error: userAdvice,
        rawError: errorObj.message,
      });
    }
  });

  // -------------------------------------------------------------
  // VITE & STATIC FILE SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Webmail Server Bridge] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
