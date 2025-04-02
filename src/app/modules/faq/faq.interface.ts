import { Model, Types } from 'mongoose';

export enum OtherType {
    RULE = 'rule',
    TERMS = 'terms',
    PRIVACY = 'privacy',
}

export type IOthers = {
    _id:    Types.ObjectId;
    content: string;
    type: OtherType;
    createdAt: Date;
    updatedAt: Date;
};


export type IFaq = {
    _id:    Types.ObjectId;
    question: string;
    answer: string;
    createdAt: Date;
    updatedAt: Date;
};

export type OtherModel = Model<IOthers>;
export type FaqModel = Model<IFaq>;