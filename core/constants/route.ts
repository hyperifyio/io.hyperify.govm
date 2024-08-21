// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { MenuItem } from "../types/MenuItem";
import {
    T_NAV_LOGOUT,
    T_NAV_SERVERS,
} from "./translation";

export const INDEX_ROUTE = '/';
export const LOGIN_ROUTE = '/login';

export const MAIN_ROUTE = '/main';
export const LOGOUT_ROUTE = '/main/logout';
export const SERVER_LIST_ROUTE = '/main/servers';
export const ADD_SERVER_ROUTE = '/main/servers/new';
export const SERVER_ROUTE = '/main/servers/:name';

export const MENU_ITEMS : MenuItem[] = [
    { route : SERVER_LIST_ROUTE,           title : T_NAV_SERVERS            },
    { route : LOGOUT_ROUTE,                title : T_NAV_LOGOUT             },
];

export const GET_SERVER_ROUTE = (name: string) => `/main/servers/${q(name)}`;


function q (value: string) : string {
    return encodeURIComponent(value);
}
