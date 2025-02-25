import {Model} from 'mongoose';
export type IContact = {
    name: string;
    email: string;
    message: string;
  }
  
  export type IContactResponse = {
    success: boolean;
    message: string;
  }

  export type ContactModel = Model<IContact, Record<string, unknown>>;

