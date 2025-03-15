import { Request, Response } from 'express';
import { contactService } from './contact.service';
import { IContact } from './contact.interface';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

/*const createContact = async (req: Request, res: Response) => {
  try {
    const contactData: IContact = req.body;
    const result = await contactService.createContact(contactData);
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error,
    });
  }
};*/

const createContact = catchAsync(async (req: Request, res: Response) => {
  const contactData: IContact = req.body;
  contactData.senderId = req.user.id;
  console.log(req.user)
  const result = await contactService.createContact(contactData, req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact form submitted successfully',
    data: result,
  });
});

const getContacts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const contacts = await contactService.getContacts(user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contacts fetched successfully',
    data: contacts,
  });
});

const getSingleContact = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const contacts = await contactService.getSingleContact(user, new Types.ObjectId(req.params.id));
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Sender contacts fetched successfully',
    data: contacts,
  });
});

const removeContact = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const contactId = new Types.ObjectId(req.params.id);
  const result = await contactService.removeContact(user, contactId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Contact removed successfully',
    data: result,
  });
});

export const contactController = {
  createContact,
  getContacts,
  getSingleContact,
  removeContact,
};