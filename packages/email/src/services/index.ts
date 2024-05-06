import nodemailer from "nodemailer";

import { COMPANY_EMAIL, COMPANY_EMAIL_PASSWORD } from "../config";

export const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: COMPANY_EMAIL,
    pass: COMPANY_EMAIL_PASSWORD,
  },
});
