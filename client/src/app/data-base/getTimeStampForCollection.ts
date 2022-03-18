import {Timestamp} from '@angular/fire/firestore';

export const getTimeStampForCollection = (isCreate = true, isDeleted = false) => {
  const timeStamp = Timestamp.now().seconds * 1000;
  if (isCreate) {
    return {
      createdOn: timeStamp,
      updatedOn: timeStamp,
      isDeleted
    };
  } else {
    return {
      updatedOn: timeStamp,
      isDeleted
    };
  }
};

export const getServerTime = (): { month: number, date: number, year: number } => {
  const timeStamp = Timestamp.now().seconds * 1000;
  const date = new Date(timeStamp);
  return {
    month: date.getMonth(),
    year: date.getFullYear(),
    date: date.getDate(),
  };
};
