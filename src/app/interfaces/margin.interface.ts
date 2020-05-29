export interface MarginDataInterface {
  price_total: number;
  distributor_margin_total: number;
  retailer_margin_total: number;
}

export interface MarginInterface {
  daily_margin: MarginDataInterface;
  weekly_margin: MarginDataInterface;
  monthly_margin: MarginDataInterface;
  quarterly_margin: MarginDataInterface;
}
