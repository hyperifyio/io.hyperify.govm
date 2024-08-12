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

export interface CreateServerDTO {
    readonly name: string;
}

export function createCreateServerDTO (
    name : string,
) : CreateServerDTO {
    return {
        name,
    };
}

export function isCreateServerDTO (value: unknown) : value is CreateServerDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'name',
        ])
        && isString(value?.name)
    );
}

export function explainCreateServerDTO (value: any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeysInDevelopment(value, [
                'name',
            ])
            , explainProperty("name", explainString(value?.name))
        ]
    );
}

export function stringifyCreateServerDTO (value : CreateServerDTO) : string {
    return `CreateServerDTO(${value})`;
}

export function parseCreateServerDTO (value: unknown) : CreateServerDTO | undefined {
    if (isCreateServerDTO(value)) return value;
    return undefined;
}

export function isCreateServerDTOOrUndefined (value: unknown): value is CreateServerDTO | undefined {
    return isUndefined(value) || isCreateServerDTO(value);
}

export function explainCreateServerDTOOrUndefined (value: unknown): string {
    return isCreateServerDTOOrUndefined(value) ? explainOk() : explainNot(explainOr(['CreateServerDTO', 'undefined']));
}
