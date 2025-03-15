import {Model, Types} from 'mongoose';
export type IContact = {
    message: string;
    senderId: Types.ObjectId;
  }
  
  export type IContactResponse = {
    success: boolean;
    message: string;
  }

  export type ContactModel = Model<IContact, Record<string, unknown>>;

