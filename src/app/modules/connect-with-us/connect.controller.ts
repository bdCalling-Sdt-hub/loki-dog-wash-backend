import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ConnectWithUsService } from './connect.service';

const createConnectWithUs = catchAsync(async (req: Request, res: Response) => {
    const result = await ConnectWithUsService.createConnectWithUsToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Connect with us created successfully',
        data: result,
    });
});

const getConnectWithUs = catchAsync(async (req: Request, res: Response) => {
    const result = await ConnectWithUsService.getConnectWithUsFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Connect with us retrieved successfully',
        data: result,
    });
});

export const ConnectWithUsController = {
    createConnectWithUs,
    getConnectWithUs
};