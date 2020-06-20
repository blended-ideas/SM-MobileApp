import {environment} from '../../environments/environment';

export const USER_APIS = {
    login: environment.base_url + 'token/',
    refreshToken: environment.base_url + 'token/refresh/',
    userProfile: environment.base_url + 'users/user/me/',

    user: environment.base_url + 'users/user/',
    change_password: 'change_password/',
    update_user_password: 'update_user_password/',
    roles: environment.base_url + 'users/roles/',
};

export const PRODUCT_APIS = {
    product: environment.base_url + 'products/product/',
    product_stock_change: environment.base_url + 'products/product_stock_change/',
    product_expiry: environment.base_url + 'products/product_expiry/',
    add_stock: 'add_stock/',
    reduce_stock: 'reduce_stock/'
};

export const SHIFT_APIS = {
    detail: environment.base_url + 'shifts/detail/',
    entry: environment.base_url + 'shifts/entry/',
    approve: 'approve'
};
export const REPORT_APIS = {
    daily: environment.base_url + 'reports/daily_margin/',
    dashboard_sales: environment.base_url + 'reports/dashboard/sales/',
    product_expiry_report: environment.base_url + 'reports/product_expiry_report/',
    sales_report: environment.base_url + 'reports/sales_report/',
    margin_report: environment.base_url + 'reports/margin_report/',
};
