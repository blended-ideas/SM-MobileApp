export class ExpiryReportInterface {
  id: string;
  created: string;
  user: number;
  file: string;
}


export class SalesReportInterface {
  id: string;
  user: number;
  file: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  start_dt: string;
  end_dt: string;
}
