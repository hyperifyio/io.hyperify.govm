// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { CallbackWithLanguage } from "../../../core/auth/email/email-auth-constants";
import { AuthEmailQueryParam } from "../../../core/auth/email/types/AuthEmailQueryParam";
import { Language } from "../../../core/types/Language";
import { MenuItem } from "../types/MenuItem";

export const INDEX_ROUTE = '/';
export const MAIN_ROUTE = '/main';
export const LOGIN_ROUTE = '/login';

export const MENU_ITEMS : MenuItem[] = [
    // { route : SHELLS_ROUTE,           title : T_NAV_SHELLS             },
];

export const GOVM_AUTHENTICATE_EMAIL_URL : CallbackWithLanguage = (lang: Language) => `/api/v1/auth?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;
export const GOVM_VERIFY_EMAIL_CODE_URL : CallbackWithLanguage = (lang: Language) => `/api/v1/auth/code?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;
export const GOVM_VERIFY_EMAIL_TOKEN_URL : CallbackWithLanguage = (lang: Language) => `/api/v1/auth/verify?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;

function q (value: string) : string {
    return encodeURIComponent(value);
}
