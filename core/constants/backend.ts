// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { CallbackWithLanguage } from "../../../core/auth/email/email-auth-constants";
import { AuthEmailQueryParam } from "../../../core/auth/email/types/AuthEmailQueryParam";
import { Language } from "../../../core/types/Language";
import { ServerAction } from "../types/ServerAction";

export const API_URL = '/api/v1';
export const SERVER_API_URL = (id: string): string => `/servers/${q(id)}`;
export const EXECUTE_ACTION_SERVER_API_URL = (id: string, action: ServerAction): string => `/servers/${q(id)}/${action}`;
export const SERVER_LIST_API_URL = '/servers';
export const DEPLOY_SERVER_API_URL = '/servers';

export const GOVM_AUTHENTICATE_EMAIL_URL : CallbackWithLanguage = (lang: Language) => `${API_URL}/auth?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;
export const GOVM_VERIFY_EMAIL_CODE_URL : CallbackWithLanguage = (lang: Language) => `${API_URL}/auth/code?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;
export const GOVM_VERIFY_EMAIL_TOKEN_URL : CallbackWithLanguage = (lang: Language) => `${API_URL}/auth/verify?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;

function q (value: string) : string {
    return encodeURIComponent(value);
}
