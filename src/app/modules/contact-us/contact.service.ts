import { JwtPayload } from 'jsonwebtoken';
import { emailHelper } from '../../../helpers/emailHelper';
import { sendNotification } from '../../../helpers/sendNotificationHelper';
import { contactEmailTemplate } from './contact.emailTemplate';
import { IContact, IContactResponse } from './contact.interface';
import { Contact } from './contact.model';
import { User } from '../user/user.model';

import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { emailTemplate } from '../../../shared/emailTemplate';
import { Types } from 'mongoose';

const createContact = async (payload: IContact, user: JwtPayload): Promise<IContactResponse> => {
  try {
    // Fetch user and admin in parallel
    const [isUserExist, admin] = await Promise.all([
      User.findById(user.id),
      User.findOne({ role: { $in: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] } }),
    ]);

    // Validate user and admin existence
    if (!isUserExist || !admin) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User or admin not found!');
    }

    // Create the contact message
    await Contact.create(payload);

    // Prepare notification data for admin and user
    const adminNotification = {
      title: `${isUserExist.firstName} ${isUserExist.lastName} has sent a new contact message`,
      message: payload.message,
      senderId: isUserExist._id,
      receiverId: admin._id,
      type: "CONTACT" as const,
    };

    const userNotification = {
      title: `Thank you for your message, ${isUserExist.firstName} ${isUserExist.lastName}. We will get back to you soon.`,
      message: `Our team will get back to you soon. Regards, ${admin.firstName} ${admin.lastName}`,
      senderId: admin._id,
      receiverId: isUserExist._id,
      type: "CONTACT" as const,
    };

    // Send notifications in parallel
    await Promise.all([
      sendNotification('notification', admin._id, adminNotification),
      sendNotification('notification', isUserExist._id, userNotification),
    ]);

    // Send email to admin
     emailHelper.sendEmail(
      emailTemplate.contactMessage({
        name: isUserExist.firstName + ' ' + isUserExist.lastName,
        email: isUserExist.email,
        message: payload.message,
      }),
    );

    return {
      success: true,
      message: 'Contact message sent successfully',
    };
  } catch (error) {
    throw error; // Re-throw the error for global error handling
  }
};

const getContacts = async (user: JwtPayload) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).populate('senderId', 'firstName lastName image email');
    return contacts;
  } catch (error) {
    throw error; // Re-throw the error for global error handling
  }
};

const getSingleContact = async (user: JwtPayload, contactId: Types.ObjectId) => {
  try {
    const contact = await Contact.findById(contactId).populate('senderId', 'firstName lastName image email');
    return contact;
  } catch (error) {
    throw error; // Re-throw the error for global error handling
  }
};


const removeContact = async (user: JwtPayload, contactId: Types.ObjectId) => {
  try {
    console.log(contactId);
    const contact = await Contact.findByIdAndDelete(contactId);
    return contact;
  } catch (error) {
    throw error; // Re-throw the error for global error handling
  }
};

export const contactService = {
  createContact,
  getContacts,
  getSingleContact,
  removeContact,
};