import { model, Schema } from 'mongoose';
import { ConnectModel, IConnect } from './connect.interface.';

const connectSchema = new Schema<IConnect, ConnectModel>({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    require: true
  },
});

export const Connect = model<IConnect, ConnectModel>('Connect', connectSchema);
