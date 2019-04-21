import nodemailer from 'nodemailer';
import mailerConfig from '../config/mailerConfig';
import getMailBody from './getMailBody';

class Mailer {
  static async send(payload) {
    try {
      const from = 'notifications.bankr.com';
      const html = getMailBody(payload);
      const subject = 'Bankr Notification System';
      const { to } = payload;
      const mailOptions = {
        from, to, subject, html,
      };
      const transport = await nodemailer.createTransport(mailerConfig);
      const info = await transport.sendMail(mailOptions);
      return info;
    } catch (error) {
      return error;
    }
  }
}

export default Mailer;
