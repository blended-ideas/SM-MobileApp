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
    quantity?: number;
    condition?: string;
}

export interface ProductStockChangeInterface {
    id: number;
    user: number;
    user_name: string;
    created: string;
    product: string;
    value: number;
    changeType: 'INITIAL_STOCK' | 'SHIFT' | 'ADDITION' | 'DEDUCTION';

    shift_total?: number; // Calculated
}

export interface ProductExpiryDateInterface {
    user: number;
    user_name: string;

    product: string;
    product_name: string;

    datetime: string;
}
