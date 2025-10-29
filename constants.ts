import type { Crosswalk } from './types';

// Specific reference time for Daegu High School based on user input.
// Red light turns on at 18:30:49, green light is 34s long.
// So, green light started at 18:30:15.
const getDaeguHighSchoolReferenceTime = (): number => {
    const refTime = new Date();
    refTime.setHours(18, 30, 15, 0); // Set to 18:30:15 today
    
    // If this time is in the future today, it means the last cycle start was yesterday
    if (refTime.getTime() > Date.now()) {
        refTime.setDate(refTime.getDate() - 1);
    }
    return refTime.getTime();
};

// Specific reference time for Frank Burger front.
// Red light turns on at 18:40:21, green light is 35s long.
// So, green light started at 18:39:46.
const getFrankBurgerRefTime = (): number => {
    const refTime = new Date();
    refTime.setHours(18, 39, 46, 0); // Set to 18:39:46 today

    if (refTime.getTime() > Date.now()) {
        refTime.setDate(refTime.getDate() - 1);
    }
    return refTime.getTime();
};

// Specific reference time for Kyodae Intersection CU front.
// Red light turns on at 19:22:56, green light is 43s long.
// So, green light started at 19:22:13.
const getKyodaeCURefTime = (): number => {
    const refTime = new Date();
    refTime.setHours(19, 22, 13, 0); // Set to 19:22:13 today

    if (refTime.getTime() > Date.now()) {
        refTime.setDate(refTime.getDate() - 1);
    }
    return refTime.getTime();
};

export const CROSSWALKS_DATA: Crosswalk[] = [
  {
    id: 1,
    name: '프랭크버거 대구교대점 앞',
    pedestrianGreenSeconds: 35,
    pedestrianRedSeconds: 164,
    referenceTime: getFrankBurgerRefTime(),
    lat: 35.8560,
    lng: 128.5885,
  },
  {
    id: 2,
    name: '교대 삼거리 CU대구교대점 앞',
    pedestrianGreenSeconds: 43,
    pedestrianRedSeconds: 157,
    referenceTime: getKyodaeCURefTime(),
    lat: 35.8555,
    lng: 128.5871,
  },
  {
    id: 3,
    name: '대구고등학교 정문 앞',
    pedestrianGreenSeconds: 34,
    pedestrianRedSeconds: 165,
    referenceTime: getDaeguHighSchoolReferenceTime(),
    lat: 35.8519,
    lng: 128.5843,
  }
];