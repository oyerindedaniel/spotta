import { COMPANY_EMAIL, EMAIL_GLOBAL_TITLE } from "./config";
import { transporter } from "./services";

interface SendMailReturn {
  status: boolean;
  message: any;
}

interface SendMailParameters {
  email: string | string[];
  subject: string;
  html: any;
  text?: string;
  attachments?: any[];
}

type SendMail = (
  data: SendMailParameters,
) => Promise<{ status: true; message: string } | SendMailReturn>;

export const sendMail: SendMail = async ({
  email,
  subject,
  html,
  text,
  attachments,
}) => {
  if (process.env.NODE_ENV === "test") {
    return {
      status: true,
      message: "mail sent successfully",
    };
  }
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: {
        name: EMAIL_GLOBAL_TITLE,
        address: COMPANY_EMAIL,
      },
      to: email,
      subject,
      html,
      text: text || "TEXT EMAILS - COMING SOON :(",
      attachments: attachments || [],
    });
    return {
      status: true,
      message: "mail sent successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: err,
    };
  }
};
