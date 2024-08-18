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
import {
    explainServerPermissionsDTO,
    isServerPermissionsDTO,
    ServerPermissionsDTO,
} from "./ServerPermissionsDTO";

export interface ServerListDTO {
    readonly payload: readonly ServerDTO[];
    readonly permissions: ServerPermissionsDTO;
}

export function createServerListDTO (
    payload : readonly ServerDTO[],
    permissions: ServerPermissionsDTO,
) : ServerListDTO {
    return {
        payload,
        permissions,
    };
}

export function isServerListDTO (value: unknown) : value is ServerListDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'payload',
            'permissions',
        ])
        && isArrayOf<ServerDTO>(value?.payload, isServerDTO)
        && isServerPermissionsDTO(value?.permissions)
    );
}

export function explainServerListDTO (value: any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeysInDevelopment(value, [
                'payload',
                'permissions',
            ])
            , explainProperty("payload", explainArrayOf<ServerDTO>("ServerDTO", explainServerDTO, value?.payload, isServerDTO))
            , explainProperty("permissions", explainServerPermissionsDTO(value?.permissions))
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
