import { IContact } from '../app/modules/contact-us/contact.interface';
import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hey! ${values.name}, Your Toothlens Account Credentials</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align:left">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const contactMessage = (values: any) => {
  const data = {
    to: values.email,
    subject: `${values.name} has sent a new contact message`,
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 30px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #0b375e;">
              <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="width: 120px; margin-bottom: 10px;" />
              <h2 style="color: #0b375e; font-size: 22px; margin: 0;">New Contact Message</h2>
              <p style="color: #666; font-size: 14px; margin-top: 5px;">You have received a new message from your website contact form.</p>
          </div>

          <!-- Message Details -->
          <div style="padding: 20px;">
              <p style="font-size: 16px; color: #444;"><strong>Name:</strong> ${values.name}</p>
              <p style="font-size: 16px; color: #444;"><strong>Email:</strong> <a href="mailto:${values.email}" style="color: #0b375e; text-decoration: none;">${values.email}</a></p>
              <p style="font-size: 16px; color: #444;"><strong>Message:</strong></p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; font-size: 15px; color: #333; line-height: 1.6;">
                  ${values.message}
              </div>
          </div>

          <!-- CTA -->
          <div style="text-align: center; padding: 20px 0;">
              <a href="mailto:${values.email}" style="background-color: #0b375e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Reply to ${values.name}</a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 15px; background-color: #f8f9fa; border-top: 1px solid #e2e8f0; font-size: 12px; color: #666;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>

      </div>
    </body>`,
  };
  return data;
};


export const emailTemplate = {
  createAccount,
  resetPassword,
  contactMessage,
};
