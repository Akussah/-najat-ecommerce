import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const formatFrom = (emailFrom) => {
  if (!emailFrom) return '';
  if (emailFrom.includes('<') && emailFrom.includes('>')) return emailFrom;
  return `ALHAMD ASHINO <${emailFrom}>`;
};

export const createEmailService = (config) => {
  const smtpConfig = config.smtp || {};
  const emailFrom = config.emailFrom || smtpConfig.from || smtpConfig.user || '';
  const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    auth: smtpConfig.user && smtpConfig.pass ? { user: smtpConfig.user, pass: smtpConfig.pass } : undefined
  });

  return {
    async sendEmail(to, subject, html) {
      if (resend) {
        if (!emailFrom) {
          console.log('Email not sent: EMAIL_FROM missing for Resend.');
          return;
        }
        try {
          const { error } = await resend.emails.send({
            from: formatFrom(emailFrom),
            to: Array.isArray(to) ? to : [to],
            replyTo: emailFrom,
            subject,
            html
          });
          if (error) {
            console.error('Error sending email via Resend:', error);
            return;
          }
          console.log(`Email sent to ${Array.isArray(to) ? to.join(', ') : to}`);
        } catch (error) {
          console.error('Error sending email via Resend:', error);
        }
        return;
      }

      if (!smtpConfig.host || !smtpConfig.user) {
        console.log('Email not sent: SMTP config missing.');
        return;
      }
      try {
        await transporter.sendMail({
          from: formatFrom(emailFrom || smtpConfig.from),
          to,
          subject,
          html,
          replyTo: emailFrom || smtpConfig.from
        });
        console.log(`Email sent to ${to}`);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  };
};
