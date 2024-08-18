// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    explainArrayOf,
    isArrayOf,
} from "../../../core/types/Array";
import {
    explainBoolean,
    isBoolean,
} from "../../../core/types/Boolean";
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
    explainServerAction,
    isServerAction,
    ServerAction,
} from "./ServerAction";

export interface ServerPermissionsDTO {
    readonly enabledActions: readonly ServerAction[];
    readonly createEnabled: boolean;
    readonly deployEnabled: boolean;
    readonly startEnabled: boolean;
    readonly stopEnabled: boolean;
    readonly restartEnabled: boolean;
    readonly deleteEnabled: boolean;
    readonly consoleEnabled: boolean;
}

export function createServerPermissionsDTO (
    enabledActions : readonly ServerAction[],
    createEnabled : boolean,
    deployEnabled : boolean,
    startEnabled : boolean,
    stopEnabled : boolean,
    restartEnabled : boolean,
    deleteEnabled : boolean,
    consoleEnabled : boolean,
) : ServerPermissionsDTO {
    return {
        enabledActions,
        createEnabled,
        deployEnabled,
        startEnabled,
        stopEnabled,
        restartEnabled,
        deleteEnabled,
        consoleEnabled,
    };
}

export function isServerPermissionsDTO (value: unknown) : value is ServerPermissionsDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'enabledActions',
            'createEnabled',
            'deployEnabled',
            'startEnabled',
            'stopEnabled',
            'restartEnabled',
            'deleteEnabled',
            'consoleEnabled',
        ])
        && isArrayOf<ServerAction>(value?.enabledActions, isServerAction)
        && isBoolean(value?.createEnabled)
        && isBoolean(value?.deployEnabled)
        && isBoolean(value?.startEnabled)
        && isBoolean(value?.stopEnabled)
        && isBoolean(value?.restartEnabled)
        && isBoolean(value?.deleteEnabled)
        && isBoolean(value?.consoleEnabled)
    );
}

export function explainServerPermissionsDTO (value: any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeysInDevelopment(value, [
                'enabledActions',
                'createEnabled',
                'deployEnabled',
                'startEnabled',
                'stopEnabled',
                'restartEnabled',
                'deleteEnabled',
                'consoleEnabled',
            ])
            , explainProperty("enabledActions", explainArrayOf<ServerAction>("ServerAction", explainServerAction, value?.enabledActions, isServerAction))
            , explainProperty("createEnabled", explainBoolean(value?.createEnabled))
            , explainProperty("deployEnabled", explainBoolean(value?.deployEnabled))
            , explainProperty("startEnabled", explainBoolean(value?.startEnabled))
            , explainProperty("stopEnabled", explainBoolean(value?.stopEnabled))
            , explainProperty("restartEnabled", explainBoolean(value?.restartEnabled))
            , explainProperty("deleteEnabled", explainBoolean(value?.deleteEnabled))
            , explainProperty("consoleEnabled", explainBoolean(value?.consoleEnabled))
        ]
    );
}

export function stringifyServerPermissionsDTO (value : ServerPermissionsDTO) : string {
    return `ServerPermissionsDTO(${value})`;
}

export function parseServerPermissionsDTO (value: unknown) : ServerPermissionsDTO | undefined {
    if (isServerPermissionsDTO(value)) return value;
    return undefined;
}

export function isServerPermissionsDTOOrUndefined (value: unknown): value is ServerPermissionsDTO | undefined {
    return isUndefined(value) || isServerPermissionsDTO(value);
}

export function explainServerPermissionsDTOOrUndefined (value: unknown): string {
    return isServerPermissionsDTOOrUndefined(value) ? explainOk() : explainNot(explainOr(['ServerPermissionsDTO', 'undefined']));
}
