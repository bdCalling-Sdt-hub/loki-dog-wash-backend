import config from "../../../config";
import { ISendEmail } from "../../../types/email";
import { IContact } from "./contact.interface";

interface IUserConfirmation {
    name: string;
    email: string;
}

interface IAdminNotification extends IContact {}

const userConfirmation = (values: IUserConfirmation) => {
    const data = {
        to: values.email,
        subject: 'Welcome to Loki\'s Lavish Dog Wash - We\'ve Received Your Message',
        html: `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background-color: #0b375e; padding: 40px 40px 60px 40px; text-align: center;">
                        <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 600;">Loki\'s Lavish Dog Wash</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-top: 8px;">Stress Free Dog Wash</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px; margin-top: -20px; background: white; border-radius: 20px 20px 0 0;">
                        <div style="background: white; border-radius: 12px; padding: 30px;">
                            <h2 style="color: #2d3748; font-size: 24px; margin: 0 0 20px 0;">Hello ${values.name}! 👋</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                Thank you for reaching out to Loki\'s Lavish Dog Wash. We're excited about your interest in our stress free dog wash platform!
                            </p>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                Our team will review your message and get back to you shortly. We're committed to helping you find the best solution for your furry friend.
                            </p>
                            <div style="margin: 30px 0; padding: 20px; background-color: #fff8f6; border-left: 4px solid #0b375e; border-radius: 4px;">
                                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">
                                    "Don't let your dog's stress become your stress. Let us take care of your furry friend's needs while you relax."
                                </p>
                            </div>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Best regards,<br>
                                <span style="color: #0b375e; font-weight: 600;">The Loki\'s Lavish Dog Wash Team</span>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; font-size: 14px; margin: 0;">
                            © ${new Date().getFullYear()} MentorNex. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </body>`,
    };
    return data;
};

const adminNotification = (values: IAdminNotification): ISendEmail => {
    if (!config.email.user) {
        throw new Error('Admin email configuration is missing');
    }

    return {
        to: config.email.user,
        subject: 'New Loki\'s Lavish Dog Wash Contact Inquiry',
        html: `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background-color: #0b375e; padding: 40px 40px 60px 40px; text-align: center;">
                        <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 600;">Loki\'s Lavish Dog Wash</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-top: 8px;">New Contact Form Submission</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px; margin-top: -20px; background: white; border-radius: 20px 20px 0 0;">
                        <div style="background: white; border-radius: 12px;">
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #2d3748; font-size: 24px; margin: 0 0 20px 0;">Contact Details</h2>
                                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                                    <div style="margin-bottom: 15px;">
                                        <p style="color: #718096; font-size: 14px; margin: 0 0 4px 0;">Name</p>
                                        <p style="color: #2d3748; font-size: 16px; margin: 0;">${values.name}</p>
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                        <p style="color: #718096; font-size: 14px; margin: 0 0 4px 0;">Email</p>
                                        <p style="color: #2d3748; font-size: 16px; margin: 0;">${values.email}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="margin-top: 30px;">
                                <h3 style="color: #2d3748; font-size: 18px; margin: 0 0 15px 0;">Message</h3>
                                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">${values.message}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; font-size: 14px; margin: 0;">
                            © ${new Date().getFullYear()} Loki\'s Lavish Dog Wash. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </body>`,
    };
};

export const contactEmailTemplate = {
    userConfirmation,
    adminNotification,
};