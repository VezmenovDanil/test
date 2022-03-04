import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { defer, elementAt } from 'rxjs';
export interface Room {
  number: number;
  capacity: number;
  price: number;
  bookingDate: DateRange[];
}
export interface DateRange {
  startDate: number;
  endDate: number;
}

@Injectable({
  providedIn: 'root',
})
export class MockService {
  constructor() {}

  render = (sort: string, order: SortDirection, filterState: DateRange) => {
    let tempMockHandler = mockData;
    if (filterState.endDate > 0 && filterState.startDate > 0) {
      tempMockHandler = tempMockHandler.filter((element) =>
        element.bookingDate.some(
          (rangeElem) =>
            (rangeElem.endDate <= filterState.startDate &&
              !(rangeElem.startDate >= filterState.endDate)) ||
            (!(rangeElem.startDate = filterState.startDate) &&
              !(rangeElem.endDate = filterState.endDate)) // kostil' need refactoring but i dont have time :^( may used interval method from js-joda lib
        )
      );
    }
    console.log(tempMockHandler);

    const resdata = tempMockHandler.sort((a, b: Room) => {
      const isAsc = order === 'asc';
      switch (sort) {
        case 'price':
          return this.compare(a.price, b.price, isAsc);
        default:
          return 0;
      }
    });
    return defer(() => Promise.resolve(resdata));
  };

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
const mockData: Room[] = [
  {
    number: 1,
    capacity: 3,
    price: 2500,
    bookingDate: [{ startDate: 16463, endDate: 16463 }],
  },
  {
    number: 2,
    capacity: 2,
    price: 2200,
    bookingDate: [
      { startDate: 16464, endDate: 16464 },
      { startDate: 16465, endDate: 16466 },
    ],
  },
  {
    number: 3,
    capacity: 1,
    price: 1200,
    bookingDate: [{ startDate: 16465, endDate: 16465 }],
  },
  {
    number: 4,
    capacity: 1,
    price: 1200,
    bookingDate: [{ startDate: 16466, endDate: 16466 }],
  },
  {
    number: 5,
    capacity: 1,
    price: 1200,
    bookingDate: [{ startDate: 16467, endDate: 16468 }],
  },
  {
    number: 6,
    capacity: 1,
    price: 1200,
    bookingDate: [{ startDate: 16466, endDate: 16469 }],
  },
  {
    number: 7,
    capacity: 4,
    price: 3500,
    bookingDate: [{ startDate: 16469, endDate: 16469 }],
  },
  {
    number: 8,
    capacity: 4,
    price: 5200,
    bookingDate: [{ startDate: 16470, endDate: 16470 }],
  },
  {
    number: 9,
    capacity: 1,
    price: 3500,
    bookingDate: [{ startDate: 16468, endDate: 16468 }],
  },
  {
    number: 10,
    capacity: 2,
    price: 3900,
    bookingDate: [{ startDate: 16469, endDate: 16469 }],
  },
];
