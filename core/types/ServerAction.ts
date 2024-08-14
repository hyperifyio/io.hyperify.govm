// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    explainEnum,
    isEnum,
    parseEnum,
    stringifyEnum,
} from "../../../core/types/Enum";
import {
    explainNot,
    explainOk,
    explainOr,
} from "../../../core/types/explain";
import { isUndefined } from "../../../core/types/undefined";

export enum ServerAction {
    UNDEFINED = "undefined",
    DEPLOY = "deploy",
    START = "start",
    STOP = "stop",
    RESTART = "restart",
    DELETE = "delete",
}

export function isServerAction (value: unknown) : value is ServerAction {
    return isEnum(ServerAction, value);
}

export function explainServerAction (value : unknown) : string {
    return explainEnum("ServerAction", ServerAction, isServerAction, value);
}

export function stringifyServerAction (value : ServerAction) : string {
    return stringifyEnum(ServerAction, value);
}

export function parseServerAction (value: any) : ServerAction | undefined {
    return parseEnum(ServerAction, value) as ServerAction | undefined;
}

export function isServerActionOrUndefined (value: unknown): value is ServerAction | undefined {
    return isUndefined(value) || isServerAction(value);
}

export function explainServerActionOrUndefined (value: unknown): string {
    return isServerActionOrUndefined(value) ? explainOk() : explainNot(explainOr(['ServerAction', 'undefined']));
}
