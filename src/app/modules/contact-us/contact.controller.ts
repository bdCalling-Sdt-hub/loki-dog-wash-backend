import { Request, Response } from 'express';
import { contactService } from './contact.service';
import { IContact } from './contact.interface';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

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
  const result = await contactService.createContact(contactData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact form submitted successfully',
    data: result,
  });
});

export const contactController = {
  createContact,
};