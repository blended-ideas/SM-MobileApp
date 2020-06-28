export interface ShiftSelectionInterface {
  display: string;
  display2: string;
  time_start_hour: number;
  number_of_hours: number;
}

export const SHIFT_TIMINGS: ShiftSelectionInterface[] = [
  {display: '1st Shift', display2: '12am - 6am', time_start_hour: 0, number_of_hours: 6},
  {display: '2nd Shift', display2: '6am - 2pm', time_start_hour: 6, number_of_hours: 8},
  {display: '3rd Shift', display2: '2pm - 10pm', time_start_hour: 14, number_of_hours: 8},
  {display: '4th Shift', display2: '10pm - 12pm', time_start_hour: 22, number_of_hours: 2},
];
