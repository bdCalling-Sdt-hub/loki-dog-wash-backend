import { Types } from 'mongoose';
import { Notification } from '../app/modules/notification/notification.model';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

import { INotification } from '../app/modules/notification/notification.interface';
// import { sendPushNotification } from './pushNotificationHelper';



export const sendNotification = async (
  namespace: string,
  recipient: Types.ObjectId | string,
  data: Partial<INotification>,
  pushNotificationData?: {
    deviceId: string;
    destination: string;
    role: string;
    id?: string;
    icon?: string;
    title?: string;
    message?: string;
  },
) => {

  data.type = data.type || "QUESTION_REPLY"; 
  const result = await Notification.create(data);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create notification',
    );
  }

  const populatedResult = await result.populate({
    path: 'senderId',
    select: '_id firstName image',
  });


//   if (pushNotificationData) {
//     const { title, message, role, destination, id, icon, deviceId } = pushNotificationData;
//     try {
//       await sendPushNotification(
//         deviceId,
//         title ? title : data.title,
//         message !== undefined ? message : data.message,
//         {
//           role: role,
//           destination: destination,
//           id: new Types.ObjectId(id).toString(),
//         },
//         icon
//       );
//     } catch (error) {
//       console.error('Error sending push notification:', error);
//     }
//   }
  //@ts-expect-error socket
  global.io.emit(`${namespace}::${recipient}`, populatedResult);

}


  export const sendDataWithSocket = async (
  namespace: string,
  recipient: string | Types.ObjectId,
  data: Record<string, unknown>
) => {
    //@ts-expect-error socket
    global.io.emit(`${namespace}::${recipient}`, data);
};
