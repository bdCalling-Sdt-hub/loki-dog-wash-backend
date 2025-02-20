import { Model } from 'mongoose';

//For Please before read section
export type IRead = {
  title: string;
  description: string;
};

//For how it works section
export type IWork = {
    title: string;
    overview: string;
    section: {
        name: string;
        description: string;
    };
};
export type IOperation = {
    title: string;
    overview: string;
    section: {
        name: string;
        description: string;
    };
};
export type ReadModel = Model<IRead>;
export type WorksModel = Model<IWork>;
export type OperationModel = Model<IOperation>;
