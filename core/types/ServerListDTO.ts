// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    explainArrayOf,
    isArrayOf,
} from "../../../core/types/Array";
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
import { isUndefined } from "../../../core/types/undefined";
import {
    explainServerDTO,
    isServerDTO,
    ServerDTO,
} from "./ServerDTO";

export interface ServerListDTO {
    readonly payload: readonly ServerDTO[];
}

export function createServerListDTO (
    payload : readonly ServerDTO[],
) : ServerListDTO {
    return {
        payload,
    };
}

export function isServerListDTO (value: unknown) : value is ServerListDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'payload',
        ])
        && isArrayOf<ServerDTO>(value?.payload, isServerDTO)
    );
}

export function explainServerListDTO (value: any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeysInDevelopment(value, [
                'payload',
            ])
            , explainProperty("payload", explainArrayOf<ServerDTO>("ServerDTO", explainServerDTO, value?.payload, isServerDTO))
        ]
    );
}

export function stringifyServerListDTO (value : ServerListDTO) : string {
    return `ServerListDTO(${value})`;
}

export function parseServerListDTO (value: unknown) : ServerListDTO | undefined {
    if (isServerListDTO(value)) return value;
    return undefined;
}

export function isServerListDTOOrUndefined (value: unknown): value is ServerListDTO | undefined {
    return isUndefined(value) || isServerListDTO(value);
}

export function explainServerListDTOOrUndefined (value: unknown): string {
    return isServerListDTOOrUndefined(value) ? explainOk() : explainNot(explainOr(['ServerListDTO', 'undefined']));
}
