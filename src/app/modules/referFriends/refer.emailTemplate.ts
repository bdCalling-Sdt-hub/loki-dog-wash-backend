import config from "../../../config";
import { ISendEmail } from "../../../types/email";
import { IRefer } from "./refer.interface";

interface IUserConfirmation {
    email: string;
    referralCode: string;
    referredBy: string
}

// const userConfirmation = (values: IUserConfirmation): ISendEmail => {
//     const data = {
//         to: values.email,
//         subject: `You\'ve Been Invited to Loki\'s Lavish Dog Wash by ${values.referredBy}`,
//         html: `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0;">
//             <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
//                 <div style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
//                     <!-- Header -->
//                     <div style="background-color: #0b375e; padding: 40px 40px 60px 40px; text-align: center;">
//                         <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 600;">Loki\'s Lavish Dog Wash</h1>
//                         <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-top: 8px;">Stress Free Dog Wash</p>
//                     </div>
                    
//                     <!-- Content -->
//                     <div style="padding: 40px; margin-top: -20px; background: white; border-radius: 20px 20px 0 0;">
//                         <div style="background: white; border-radius: 12px; padding: 30px;">
//                             <h2 style="color: #2d3748; font-size: 24px; margin: 0 0 20px 0;">You've Been Invited! 👋</h2>
//                             <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
//                                 A friend thinks you and your furry friend would love Loki's Lavish Dog Wash!
//                             </p>
//                             <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
//                                 Use this referral code when you sign up: <strong>${values.referralCode}</strong>
//                             </p>
//                             <div style="margin: 30px 0; padding: 20px; background-color: #fff8f6; border-left: 4px solid #0b375e; border-radius: 4px;">
//                                 <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">
//                                     "Don't let your dog's stress become your stress. Let us take care of your furry friend's needs while you relax."
//                                 </p>
//                             </div>
//                             <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
//                                 Best regards,<br>
//                                 <span style="color: #0b375e; font-weight: 600;">The Loki\'s Lavish Dog Wash Team</span>
//                             </p>
//                             <div style="margin-top: 30px; text-align: center;">
//                                 <a href="${config.frontend_url}/signup?referral=${values.referralCode}" style="background-color: #0b375e; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 600;">Sign Up Now</a>
//                             </div>
//                         </div>
//                     </div>
                    
//                     <!-- Footer -->
//                     <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
//                         <p style="color: #718096; font-size: 14px; margin: 0;">
//                             © ${new Date().getFullYear()} Loki\'s Lavish Dog Wash. All rights reserved.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </body>`,
//     };
//     return data;
// };


const userConfirmation = (values: IUserConfirmation): ISendEmail => {
    const data = {
        to: values.email,
        subject: `You\'ve Been Invited to Loki\'s Lavish Dog Wash by ${values.referredBy}`,
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
                            <h2 style="color: #2d3748; font-size: 24px; margin: 0 0 20px 0;">You've Been Invited! 👋</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                A friend thinks you and your furry friend would love Loki's Lavish Dog Wash!
                            </p>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                Use this referral code when you sign up: <strong>${values.referralCode}</strong>
                            </p>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                Please make sure to create an account using this email address in order to verify your referral code.
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
                            <div style="margin-top: 30px; text-align: center;">
                                <a href="${config.frontend_url}/signup?referral=${values.referralCode}" style="background-color: #0b375e; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 600;">Sign Up Now</a>
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
    return data;
};



export const referEmailTemplate = {
    userConfirmation
};