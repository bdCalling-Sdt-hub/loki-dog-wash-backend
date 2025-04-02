import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FaqService } from './faq.service';
import { OtherType } from './faq.interface';
import { StatusCodes } from 'http-status-codes';

const createOrUpdateOthers = catchAsync(async (req: Request, res: Response) => {
   const result = await FaqService.createOrUpdateOthers(req.body);
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Others created successfully',
      data: result
   });
});

const getOthers = catchAsync(async (req: Request, res: Response) => {
   const result = await FaqService.getOthers(req.params.type as OtherType);
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Others fetched successfully',
      data: result
   });
});

const addQuestionAndAnswer = catchAsync(async (req: Request, res: Response) => {
   const result = await FaqService.addQuestionAndAnswer(req.body);
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Question and answer added successfully',
      data: result
   });
});


const removeQuestionAndAnswer = catchAsync(async (req: Request, res: Response) => {
   const result = await FaqService.removeQuestionAndAnswer(req.params.id);
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Question and answer removed successfully',
      data: result
   });
});

const updateQuestionAndAnswer = catchAsync(async (req: Request, res: Response) => {
   const result = await FaqService.updateQuestionAndAnswer(req.params.id, req.body);
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Question and answer updated successfully',
      data: result
   });
});

const getFaq = catchAsync(async (req: Request, res: Response) => {
   const result = await FaqService.getFaq();
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Faq fetched successfully',
      data: result
   });
});


export const FaqController = {
   createOrUpdateOthers,
   getOthers,
   addQuestionAndAnswer,
   removeQuestionAndAnswer,
   updateQuestionAndAnswer,
   getFaq
};  