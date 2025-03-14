import { parse } from "date-fns";

export const parseDateInUTC = (dateString: string, format: string): Date => {
    // Parse the date in the local timezone
    const localDate = parse(dateString, format, new Date());
    
    // Convert the local date to UTC
    const utcDate = new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes(),
        localDate.getSeconds()
      )
    );
  
    return utcDate;
  };