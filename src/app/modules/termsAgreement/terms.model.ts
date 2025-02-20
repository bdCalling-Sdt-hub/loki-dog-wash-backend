import mongoose, { model } from 'mongoose';
import { IOperation, IRead, IWork, OperationModel, ReadModel, WorksModel } from './terms.interface';

const readSchema = new mongoose.Schema<IRead, ReadModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const workSchema = new mongoose.Schema<IWork, WorksModel>(
  {
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    section: {
      type: {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const operationSchema = new mongoose.Schema<IOperation, OperationModel>(
    {
      title: {
        type: String,
        required: true,
      },
      overview: {
        type: String,
        required: true,
      },
      section: {
        type: {
          name: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        },
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export const Read = model<IRead>('Read', readSchema);
export const Work = model<IWork>('Work', workSchema);
export const Operation = model<IOperation>('Operation', operationSchema);