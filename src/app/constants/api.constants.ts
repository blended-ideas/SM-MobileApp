import {environment} from '../../environments/environment';

export const USER_APIS = {
    login: environment.base_url + 'token/',
    refreshToken: environment.base_url + 'token/refresh/',
    userProfile: environment.base_url + 'users/user/me/',

    user: environment.base_url + 'users/user/',
    change_password: 'change_password/',
};

export const PRODUCT_APIS = {
    product: environment.base_url + 'products/product/',
    product_stock_change: environment.base_url + 'products/product_stock_change/',
    add_stock: 'add_stock/',
    reduce_stock: 'reduce_stock/'
};

export const SHIFT_APIS = {
    detail: environment.base_url + 'shifts/detail/',
    entry: environment.base_url + 'shifts/entry/'
};
