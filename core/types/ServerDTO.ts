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
import {
    explainString,
    isString,
} from "../../../core/types/String";
import { isUndefined } from "../../../core/types/undefined";
import {
    explainServerAction,
    isServerAction,
    ServerAction,
} from "./ServerAction";
import {
    explainServerStatus,
    isServerStatus,
    ServerStatus,
} from "./ServerStatus";

export interface ServerDTO {
    readonly name: string;
    readonly status: ServerStatus;
    readonly actions: readonly ServerAction[];
}

export function createServerDTO (
    name : string,
    status : ServerStatus,
    actions : readonly ServerAction[],
) : ServerDTO {
    return {
        name,
        status,
        actions,
    };
}

export function isServerDTO (value: unknown) : value is ServerDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'name',
            'status',
            'actions',
        ])
        && isString(value?.name)
        && isServerStatus(value?.status)
        && isArrayOf<ServerAction>(value?.actions, isServerAction)
    );
}

export function explainServerDTO (value: any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeysInDevelopment(value, [
                'name',
                'status',
                'actions',
            ])
            , explainProperty("name", explainString(value?.name))
            , explainProperty("status", explainServerStatus(value?.status))
            , explainProperty("actions", explainArrayOf<ServerAction>("ServerAction", explainServerAction, value?.actions, isServerAction))
        ]
    );
}

export function stringifyServerDTO (value : ServerDTO) : string {
    return `ServerDTO(${value})`;
}

export function parseServerDTO (value: unknown) : ServerDTO | undefined {
    if (isServerDTO(value)) return value;
    return undefined;
}

export function isServerDTOOrUndefined (value: unknown): value is ServerDTO | undefined {
    return isUndefined(value) || isServerDTO(value);
}

export function explainServerDTOOrUndefined (value: unknown): string {
    return isServerDTOOrUndefined(value) ? explainOk() : explainNot(explainOr(['ServerDTO', 'undefined']));
}
