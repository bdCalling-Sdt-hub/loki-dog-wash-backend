import { ISlots } from './station.interface';

export const processSlots = (slots: string[]): ISlots[] => {
  const result = slots.map((slot: any) => {
    // Parse the time slot (e.g., "9.00 am" or "10.30 pm")
    const [time, period] = slot.toLowerCase().split(' ');
    const [hours, minutes] = time.split('.');

    // Convert to 24-hour format
    let hour = parseInt(hours);
    const minute = parseInt(minutes || '0');

    if (period === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period === 'am' && hour === 12) {
      hour = 0;
    }

    // Generate time code (HHMM format)
    const timeCode = generateTimeCode(slot);

    // Add timeCode to station data
    return {
      slot,
      timeCode: timeCode,
    };
  });
  return result as ISlots[];
};

export const generateTimeCode = (slot: string): Number => {
  const [time, period] = slot.toLowerCase().split(' ');
  const [hours, minutes] = time.split('.');

  // Convert to 24-hour format
  let hour = parseInt(hours);
  const minute = parseInt(minutes || '0');

  if (period === 'pm' && hour !== 12) {
    hour += 12;
  } else if (period === 'am' && hour === 12) {
    hour = 0;
  }

  // Generate time code (HHMM format)
  const timeCode =
    hour.toString().padStart(2, '0') + minute.toString().padStart(2, '0');

  return parseInt(timeCode);
};
