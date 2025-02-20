import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TermsService } from './terms.service';

const createRead = catchAsync(async (req: Request, res: Response) => {
  const { ...readData } = req.body;
  const result = await TermsService.createReadToDB(readData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Read created successfully',
    data: result,
  });
})

const createWork = catchAsync(async (req: Request, res: Response) => {
  const { ...workData } = req.body;
  const result = await TermsService.createWorkToDB(workData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Work created successfully',
    data: result,
  });
})
const createOperation = catchAsync(async (req: Request, res: Response) => {
    const { ...operationData } = req.body;
    const result = await TermsService.createOperationToDB(operationData);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Opeartion created successfully',
      data: result,
    });
  })

const getAllRead = catchAsync(async (req: Request, res: Response) => {
  const result = await TermsService.getAllReadFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Read fetched successfully',
    data: result,
  });
})

const getAllWork = catchAsync(async (req: Request, res: Response) => {
  const result = await TermsService.getAllWorkFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Work fetched successfully',
    data: result,
  });
})

const getAllOperation = catchAsync(async (req: Request, res: Response) => {
    const result = await TermsService.getAllOperationFromDB();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Operation fetched successfully',
      data: result,
    });
  })

const ReadAgreement = catchAsync(async (req: Request, res: Response) => {
    const id = req.user.id;
  const { readTerms } = req.body;
  const result = await TermsService.postReadAgreementToDB(id,readTerms);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Read Agreemnet created successfully',
    data: result,
  });
})

const WorksAgreement = catchAsync(async (req: Request, res: Response) => {
    const id = req.user.id;
  const { workTerms } = req.body;
  const result = await TermsService.postWorkAgreementToDB(id,workTerms);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Work Agreemnet created successfully',
    data: result,
  });
})

const OperationAgreement = catchAsync(async (req: Request, res: Response) => {
    const id = req.user.id;
  const { operationTerms } = req.body;
  const result = await TermsService.postOperationAgreementToDB(id,operationTerms);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Operation Agreemnet created successfully',
    data: result,
  });
})

export const TermsController = {
  createRead,
  createWork,
  createOperation,
  getAllRead,
  getAllWork,
  getAllOperation,
  ReadAgreement,
  WorksAgreement,
  OperationAgreement
};