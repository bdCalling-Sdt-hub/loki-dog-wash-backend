import { IContact } from '../app/modules/contact-us/contact.interface';
import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #0b375e; font-size: 24px; margin-bottom: 20px;">Hey! ${values.name}, Your Loki Dog Wash Account Credentials</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #0b375e; min-width: 180px; display: inline-block; padding: 15px 20px; text-align: center; border-radius: 8px; color: #fff; font-size: 24px; letter-spacing: 5px; margin: 20px auto; font-weight: bold; font-family: monospace;">${values.otp}</div>
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
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <h2 style="color: #0b375e; text-align: center;">Reset Your Password</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #0b375e; min-width: 180px; display: inline-block; padding: 15px 20px; text-align: center; border-radius: 8px; color: #fff; font-size: 24px; letter-spacing: 5px; margin: 20px auto; font-weight: bold; font-family: monospace;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                <p style="color: #777; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align:left">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const bookingConfirmation = (values: {
  email: string;
  name: string;
  date: string;
  time: string;
  service: string;
  petName?: string;
  location: string;
  price: number;
}) => {
  const data = {
    to: values.email,
    subject: 'Booking Confirmation - Loki Dog Wash',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <h2 style="color: #0b375e; text-align: center;">Booking Confirmation</h2>
        
        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0b375e;">
          <h3 style="color: #333; margin-bottom: 15px;">Appointment Details:</h3>
          <p style="margin: 5px 0;"><strong>Pet Owner:</strong> ${values.name}</p>
          <p style="margin: 5px 0;"><strong>Service:</strong> ${values.service}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${values.date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${values.time}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${values.location}</p>
          <p style="margin: 5px 0;"><strong>Price:</strong> $${values.price}</p>
        </div>

        <p style="color: #555; line-height: 1.5;">Thank you for choosing Loki Dog Wash! We look forward to taking care of your dog.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="color: #666; margin: 0; font-size: 14px;">
            <strong>Important Notes:</strong>
            <ul style="margin: 10px 0;">
              <li>Please arrive 5 minutes before your appointment time</li>
              <li>Cancellations must be made at least 24 hours in advance</li>
              <li>Make sure your pet is on a leash upon arrival</li>
            </ul>
          </p>
        </div>

        <p style="color: #777; font-size: 14px; text-align: center; margin-top: 20px;">
          If you need to modify or cancel your appointment, please contact us at support@lokidogwash.com
        </p>
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
              <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="width: 120px; margin-bottom: 10px;" />
              <h2 style="color: #0b375e; font-size: 22px; margin: 0;">New Contact Message</h2>
              <p style="color: #666; font-size: 14px; margin-top: 5px;">You have received a new message from your website contact form.</p>
          </div>

          <!-- Message Details -->
          <div style="padding: 20px;">
              <p style="font-size: 16px; color: #444;"><strong>Name:</strong> ${
                values.name
              }</p>
              <p style="font-size: 16px; color: #444;"><strong>Email:</strong> <a href="mailto:${
                values.email
              }" style="color: #0b375e; text-decoration: none;">${
      values.email
    }</a></p>
              <p style="font-size: 16px; color: #444;"><strong>Message:</strong></p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; font-size: 15px; color: #333; line-height: 1.6;">
                  ${values.message}
              </div>
          </div>

          <!-- CTA -->
          <div style="text-align: center; padding: 20px 0;">
              <a href="mailto:${
                values.email
              }" style="background-color: #0b375e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Reply to ${
      values.name
    }</a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 15px; background-color: #f8f9fa; border-top: 1px solid #e2e8f0; font-size: 12px; color: #666;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Loki Dog Wash. All rights reserved.</p>
          </div>

      </div>
    </body>`,
  };
  return data;
};

const subscriptionPurchased = (values: {
  email: string;
  planName: string;
  amount: number;
  billingPeriod: string;
  nextBillingDate?: string;
}) => {
  const data = {
    to: values.email,
    subject: 'Subscription Purchase Confirmation',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <h2 style="color: #0b375e; text-align: center;">Thank You for Your Subscription!</h2>
        
        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0b375e;">
          <h3 style="color: #333; margin-bottom: 15px;">Subscription Details:</h3>
          <p style="margin: 5px 0;"><strong>Plan:</strong> ${
            values.planName
          }</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${
            values.amount
          }</p>
          <p style="margin: 5px 0;"><strong>Billing Period:</strong> ${
            values.billingPeriod
          }</p>
          ${
            values.nextBillingDate
              ? `<p style="margin: 5px 0;"><strong>Next Billing Date:</strong> ${values.nextBillingDate}</p>`
              : ''
          }
        </div>

        <p style="color: #555; line-height: 1.5;">Your subscription is now active and you can start enjoying all the benefits!</p>
      </div>
    </body>`,
  };
  return data;
};

const subscriptionCanceled = (values: {
  email: string;
  planName: string;
  endDate: string;
}) => {
  const data = {
    to: values.email,
    subject: 'Subscription Cancellation Confirmation',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <h2 style="color: #0b375e; text-align: center;">Subscription Cancelled</h2>
        
        <p style="color: #555; line-height: 1.5;">We're sorry to see you go! Your subscription has been cancelled and will remain active until ${values.endDate}.</p>
        
        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0b375e;">
          <h3 style="color: #333; margin-bottom: 15px;">Cancellation Details:</h3>
          <p style="margin: 5px 0;"><strong>Plan:</strong> ${values.planName}</p>
          <p style="margin: 5px 0;"><strong>Active Until:</strong> ${values.endDate}</p>
        </div>

        <p style="color: #555; line-height: 1.5;">We hope to see you again!</p>
        
      </div>
    </body>`,
  };
  return data;
};

const onboardUser = (values: { email: string; name: string }) => {
  const data = {
    to: values.email,
    subject: 'Welcome to Loki Dog Wash! 🐾',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <h2 style="color: #0b375e; text-align: center;">Welcome to Loki Dog Wash!</h2>
        
        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0b375e;">
          <h3 style="color: #333; margin-bottom: 15px;">🎉 Special Welcome Offer</h3>
          <p style="color: #0b375e; font-weight: bold; font-size: 18px;">Enjoy a FREE Dog Wash within 24 hours!</p>
          <p style="margin: 10px 0;">As a new member, you get one complimentary dog wash that you can redeem within the next 24 hours.</p>
        </div>

        <div style="padding: 20px; margin: 20px 0;">
          <h3 style="color: #333; margin-bottom: 15px;">How It Works:</h3>
          <ol style="color: #555; line-height: 1.6;">
            <li>Browse available time slots in your area</li>
            <li>Select your preferred service package</li>
            <li>Book your appointment</li>
            <li>Receive confirmation and reminder notifications</li>
            <li>Enjoy professional dog washing services!</li>
          </ol>
        </div>

        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-bottom: 15px;">Important Information:</h3>
          <ul style="color: #555; line-height: 1.6;">
            <li>Appointments can be rescheduled up to 24 hours before the scheduled time</li>
            <li>Please arrive 5 minutes before your appointment</li>
            <li>Ensure your dog is on a leash when arriving</li>
            <li>Our groomers are certified and experienced professionals</li>
          </ul>
        </div>

        <div style="padding: 20px; margin: 20px 0; border-top: 1px solid #eee;">
          <h3 style="color: #333; margin-bottom: 15px;">Terms of Service:</h3>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            By using our services, you agree to our terms and conditions. This includes our cancellation policy, 
            service guidelines, and payment terms. For full details, please visit our website.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #555; line-height: 1.5;">Need help? Contact our support team at:</p>
          <p style="color: #0b375e; font-weight: bold;">support@lokidogwash.com</p>
        </div>
      </div>
    </body>`,
  };
  return data;
};

const subscriptionPaymentFailed = (values: {
  email: string;
  failureReason: string;
  retryDeadline: string;
  planName: string;
  endDate: string;
}) => {
  const data = {
    to: values.email,
    subject: 'Action Required: Subscription Payment Failed',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <h2 style="color: #d32f2f; text-align: center;">Payment Failed</h2>
        
        <div style="padding: 20px; background-color: #fef8f8; border-radius: 8px; margin: 20px 0; border: 1px solid #ffebee;">
          <p style="color: #555; line-height: 1.5;">We were unable to process your subscription payment for the following reason:</p>
          <p style="color: #d32f2f; font-weight: bold;">${values.failureReason}</p>
        </div>

        <p style="color: #555; line-height: 1.5;">To avoid any interruption in your service, please update your payment information by ${values.retryDeadline}.</p>
        <p style="color: #777; font-size: 14px;">If you need assistance, please don't hesitate to contact our support team.</p>
      </div>
    </body>`,
  };
  return data;
};

const subscriptionUpdated = (values: {
  email: string;
  newPlanName: string;
  endDate: string;
  newAmount: number;
  effectiveDate: string;
}) => {
  const data = {
    to: values.email,
    subject: 'Subscription Update Confirmation',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <h2 style="color: #0b375e; text-align: center;">Subscription Updated</h2>
        
        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0b375e;">
          <h3 style="color: #333; margin-bottom: 15px;">Updated Subscription Details:</h3>
          <p style="margin: 5px 0;"><strong>New Plan:</strong> ${values.newPlanName}</p>
          <p style="margin: 5px 0;"><strong>New Amount:</strong> $${values.newAmount}</p>
          <p style="margin: 5px 0;"><strong>Changes Effective From:</strong> ${values.effectiveDate}</p>
        </div>

        <p style="color: #555; line-height: 1.5;">Your subscription has been successfully updated. The new changes will take effect from your next billing cycle.</p>
      </div>
    </body>`,
  };
  return data;
};

const accountVerificationOrReset = (values: {
  email: string;
  name: string;
  otp: string;
  type: 'verification' | 'reset';
}) => {
  const isReset = values.type === 'reset';
  const title = isReset ? 'Reset Your Password' : 'Verify Your Account';
  const message = isReset
    ? 'To reset your password, please use the verification code below:'
    : 'To verify your account, please use the verification code below:';

  const data = {
    to: values.email,
    subject: title,
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://lokislavishdogwash.com/wp-content/uploads/2025/02/B6581623-1573-4D8B-9E29-520500C3D5A7.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <h2 style="color: #0b375e; text-align: center;">${title}</h2>
        
        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0b375e;">
          <h3 style="color: #333; margin-bottom: 15px;">Hello ${values.name}!</h3>
          <p style="margin: 10px 0; text-align: center;">${message}</p>
          
          <div style="background-color: #0b375e; min-width: 120px; padding: 15px; text-align: center; border-radius: 6px; color: #fff; font-size: 28px; letter-spacing: 3px; margin: 25px auto; font-weight: bold;">${values.otp}</div>
          
          <p style="margin: 10px 0; text-align: center; color: #666;">This code is valid for 3 minutes.</p>
        </div>

        <div style="padding: 15px; margin: 20px 0; border-top: 1px solid #e2e8f0;">
          <p style="color: #777; font-size: 14px; line-height: 1.6; text-align: center;">
            If you didn't request this code, you can safely ignore this email.<br>
            Someone else might have typed your email address by mistake.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #555; line-height: 1.5;">Need help? Contact our support team at:</p>
          <p style="color: #0b375e; font-weight: bold;">support@lokidogwash.com</p>
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
  subscriptionPurchased,
  subscriptionCanceled,
  subscriptionPaymentFailed,
  subscriptionUpdated,
  bookingConfirmation,
  onboardUser,
  accountVerificationOrReset,
};
