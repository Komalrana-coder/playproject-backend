import nodemailer from "nodemailer";

export const sendEmail = async (to: string, otp: number) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`
  };

  await transporter.sendMail(mailOptions);

};