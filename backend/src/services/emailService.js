const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const baseEmailTemplate = (title, text, buttonText, buttonLink) => `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr><td align="center">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 4px; overflow: hidden;">
        <tr><td align="center" style="padding: 40px 0; background-color: #09090b;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;">Careful Baza</h1>
            <p style="color: #a1a1aa; margin: 5px 0 0 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Labs</p>
        </td></tr>
        <tr><td style="padding: 50px 40px;">
            <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: normal; color: #09090b;">${title}</h2>
            <p style="margin: 0 0 35px 0; font-size: 15px; line-height: 1.6; color: #52525b;">${text}</p>
            <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
                  <a href="${buttonLink}" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 16px 36px; text-decoration: none; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; border-radius: 2px;">
                    ${buttonText}
                  </a>
            </td></tr></table>
            <p style="margin: 40px 0 0 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">Or paste this link into your browser:<br><a href="${buttonLink}" style="color: #09090b; word-break: break-all;">${buttonLink}</a></p>
        </td></tr>
        <tr><td align="center" style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
            <p style="margin: 0; font-size: 11px; color: #a1a1aa; line-height: 1.6;">
              © ${new Date().getFullYear()} Careful Baza Labs. All rights reserved.<br>
            </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const sendMail = async (to, subject, title, text, buttonText, buttonLink) => {
  const html = baseEmailTemplate(title, text, buttonText, buttonLink);
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  });
};

module.exports = { sendMail };