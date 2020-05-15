export interface ProductInterface {
    id: string;
    created_by: number;

    name: string;
    category: string;

    stock: number;
    price: number;
    landing_price: number;
    distributor_margin: number;
    retailer_margin: number;
    barcode_entry: string;

    image: string;
    is_active: boolean;
    checked: boolean;
}

export interface ProductStockChangeInterface {
    id: number;
    user: string;
    product: string;
    value: number;
    changeType: 'INITIAL_STOCK' | 'SHIFT' | 'ADDITION' | 'DEDUCTION';

    shift_total?: number; // Calculated
}
