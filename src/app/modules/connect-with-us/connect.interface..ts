import { Model } from 'mongoose'

export type IConnect = {
  title: string;
  link: string;
}

export type ConnectModel = Model<IConnect, Record<string, unknown>>
