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

export enum ServerStatus {
    UNINITIALIZED = "uninitialized",
    DEPLOYING = "deploying",
    STOPPED = "stopped",
    STARTING = "starting",
    STOPPING = "stopping",
    STARTED = "started",
    BLOCKED = "blocked",
    PAUSED = "paused",
    CRASHED = "crashed",
    SUSPENDED = "suspended",
    UNKNOWN = "unknown",
    DELETING = "deleting",
    DELETED = "deleted",
}

export function isPassiveServerStatus (value: ServerStatus) : boolean {
    switch (value) {
        case ServerStatus.UNINITIALIZED: return true;
        case ServerStatus.STOPPED: return true;
        case ServerStatus.STARTED: return true;
        case ServerStatus.CRASHED: return true;
        case ServerStatus.SUSPENDED: return true;
        case ServerStatus.DELETED: return true;
        default: return false;
    }
}

export function isServerStatus (value: unknown) : value is ServerStatus {
    return isEnum(ServerStatus, value);
}

export function explainServerStatus (value : unknown) : string {
    return explainEnum("ServerStatus", ServerStatus, isServerStatus, value);
}

export function stringifyServerStatus (value : ServerStatus) : string {
    return stringifyEnum(ServerStatus, value);
}

export function parseServerStatus (value: any) : ServerStatus | undefined {
    return parseEnum(ServerStatus, value) as ServerStatus | undefined;
}

export function isServerStatusOrUndefined (value: unknown): value is ServerStatus | undefined {
    return isUndefined(value) || isServerStatus(value);
}

export function explainServerStatusOrUndefined (value: unknown): string {
    return isServerStatusOrUndefined(value) ? explainOk() : explainNot(explainOr(['ServerStatus', 'undefined']));
}
