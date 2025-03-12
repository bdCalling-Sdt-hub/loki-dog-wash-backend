import { Model } from 'mongoose'

export type IConnect = {
  image: string;
  title: string;
  link: string;
}

export type ConnectModel = Model<IConnect, Record<string, unknown>>
