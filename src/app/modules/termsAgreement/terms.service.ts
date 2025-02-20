import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IOperation, IRead, IWork } from './terms.interface';
import { Operation, Read, Work } from './terms.model';
import { User } from '../user/user.model';

const createReadToDB = async (payload: IRead): Promise<IRead | null> => {
  const result = await Read.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create read!');
  }
  return result;
};

const createWorkToDB = async (payload: IWork): Promise<IWork | null> => {
  const result = await Work.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create work!');
  }
  return result;
};

const createOperationToDB = async (
  payload: IOperation
): Promise<IOperation | null> => {
  const result = await Operation.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create operation!');
  }
  return result;
};

const getAllReadFromDB = async (): Promise<IRead[] | null> => {
  const result = await Read.find();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get read!');
  }
  return result;
};

const getAllWorkFromDB = async (): Promise<IWork[] | null> => {
  const result = await Work.find();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get work!');
  }
  return result;
};

const getAllOperationFromDB = async (): Promise<IOperation[] | null> => {
  const result = await Operation.find();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get operation!');
  }
  return result;
};

const postReadAgreementToDB = async (id: string, readTerms: boolean) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { readTerms: readTerms },
    { new: true }
  );

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to post read agreement!'
    );
  }

  return result;
};

const postWorkAgreementToDB = async (id: string, workTerms: boolean) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { workTerms: workTerms },
    { new: true }
  );

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to post read agreement!'
    );
  }

  return result;
};

const postOperationAgreementToDB = async (
  id: string,
  operationTerms: boolean
) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { operationTerms: operationTerms },
    { new: true }
  );

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to post operation agreement!'
    );
  }

  return result;
};

export const TermsService = {
  createReadToDB,
  createWorkToDB,
  createOperationToDB,
  getAllReadFromDB,
  getAllWorkFromDB,
  getAllOperationFromDB,
  postReadAgreementToDB,
  postWorkAgreementToDB,
  postOperationAgreementToDB,
};
