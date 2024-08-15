// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    explain,
    explainNot,
    explainOk,
    explainOr,
    explainProperty,
} from "../../../core/types/explain";
import {
    explainNoOtherKeysInDevelopment,
    hasNoOtherKeysInDevelopment,
} from "../../../core/types/OtherKeys";
import {
    explainRegularObject,
    isRegularObject,
} from "../../../core/types/RegularObject";
import {
    explainString,
    isString,
} from "../../../core/types/String";
import { isUndefined } from "../../../core/types/undefined";

export interface VncDTO {
    readonly url: string;
    readonly ws: string;
    readonly password: string;
    readonly token: string;
}

export function createVncDTO (
    url : string,
    ws : string,
    password : string,
    token : string,
) : VncDTO {
    return {
        url,
        ws,
        password,
        token,
    };
}

export function isVncDTO (value: unknown) : value is VncDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'url',
            'ws',
            'password',
            'token',
        ])
        && isString(value?.url)
        && isString(value?.ws)
        && isString(value?.password)
        && isString(value?.token)
    );
}

export function explainVncDTO (value: any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeysInDevelopment(value, [
                'url',
                'ws',
                'password',
                'token',
            ])
            , explainProperty("url", explainString(value?.url))
            , explainProperty("ws", explainString(value?.ws))
            , explainProperty("password", explainString(value?.password))
            , explainProperty("token", explainString(value?.token))
        ]
    );
}

export function stringifyVncDTO (value : VncDTO) : string {
    return `VncDTO(${value})`;
}

export function parseVncDTO (value: unknown) : VncDTO | undefined {
    if (isVncDTO(value)) return value;
    return undefined;
}

export function isVncDTOOrUndefined (value: unknown): value is VncDTO | undefined {
    return isUndefined(value) || isVncDTO(value);
}

export function explainVncDTOOrUndefined (value: unknown): string {
    return isVncDTOOrUndefined(value) ? explainOk() : explainNot(explainOr(['VncDTO', 'undefined']));
}
