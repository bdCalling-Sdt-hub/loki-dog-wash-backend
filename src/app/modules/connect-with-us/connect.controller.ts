import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ConnectWithUsService } from './connect.service';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createConnectWithUs = catchAsync(async (req: Request, res: Response) => {
    
    const image = getSingleFilePath(req.files, 'image');
    const data = {
        image,
        ...req.body
    }
    const result = await ConnectWithUsService.createConnectWithUsToDB(data);
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

const updateConnectWithUs = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const image = getSingleFilePath(req.files, 'image');
    const data = {
        image,
        ...req.body
    }
    const result = await ConnectWithUsService.updateConnectWithUsToDB(id, data);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Connect with us updated successfully',
        data: result,
    });
});



const deleteConnectWithUs = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ConnectWithUsService.deleteConnectWithUsToDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Connect with us deleted successfully',
        data: result,
    });
});

export const ConnectWithUsController = {
    createConnectWithUs,
    getConnectWithUs,
    updateConnectWithUs,
    deleteConnectWithUs
};