// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { EmailTokenDTO } from "../../core/auth/email/types/EmailTokenDTO";
import { SmsTokenDTO } from "../../core/auth/sms/types/SmsTokenDTO";
import { AuthorizationUtils } from "../../core/AuthorizationUtils";
import { HttpService } from "../../core/HttpService";
import { ReadonlyJsonAny } from "../../core/Json";
import { LogService } from "../../core/LogService";
import { LogLevel } from "../../core/types/LogLevel";
import {
    API_URL,
    ADD_SERVER_API_URL,
    EXECUTE_ACTION_SERVER_API_URL,
    SERVER_API_URL,
    SERVER_LIST_API_URL,
} from "../core/constants/backend";
import { ServerAction } from "../core/types/ServerAction";
import {
    isServerDTO,
    ServerDTO,
} from "../core/types/ServerDTO";
import {
    isServerListDTO,
    ServerListDTO,
} from "../core/types/ServerListDTO";

const AUTHORIZATION_HEADER = 'Authorization';

const LOG = LogService.createLogger('GoVmClientService');

/**
 * This is the client part of the API for sendanor.fi.
 *
 * See {@link EmailAuthHttpService} for login and authentication.
 */
export class GoVmClientService {

    private static _apiUrl : string = API_URL;

    public static setApiUrl (url: string) : void {
        this._apiUrl = url;
    }

    public static setLogLevel (level: LogLevel) {
        LOG.setLogLevel(level);
    }

    /**
     * Returns server list
     */
    public static async getServerList (
        token    : EmailTokenDTO | SmsTokenDTO
    ) : Promise<readonly ServerDTO[]> {
        const sessionToken = GoVmClientService._getSessionToken(token);
        const response : ReadonlyJsonAny | undefined = await HttpService.getJson(
            this._apiUrl + SERVER_LIST_API_URL,
            GoVmClientService._createHeaders(sessionToken)
        );
        if (!isServerListDTO(response)) {
            LOG.debug(`getServerList: response: `, response);
            throw new TypeError(`Response was not ServerListDTO: ${response}`);
        }
        return response.payload;
    }

    /**
     * Returns the server record
     */
    public static async getServerById (
        serverId : string,
        token     : EmailTokenDTO | SmsTokenDTO
    ) : Promise<ServerDTO | undefined> {
        const sessionToken = GoVmClientService._getSessionToken(token);
        const response : ReadonlyJsonAny | undefined = await HttpService.getJson(
            this._apiUrl + SERVER_API_URL(serverId),
            GoVmClientService._createHeaders(sessionToken)
        );
        if (!isServerDTO(response)) {
            LOG.debug(`getServerById: response: `, response);
            throw new TypeError(`Response was not ServerDTO: ${response}`);
        }
        return response;
    }

    /**
     * Add a new server
     */
    public static async addServer (
        serverName : string,
        token      : EmailTokenDTO | SmsTokenDTO
    ) : Promise<ServerListDTO> {
        const sessionToken = GoVmClientService._getSessionToken(token);
        const response : ReadonlyJsonAny | undefined = await HttpService.postJson(
            this._apiUrl + ADD_SERVER_API_URL,
            {
                name: serverName,
            },
            GoVmClientService._createHeaders(sessionToken),
        );
        if (!isServerListDTO(response)) {
            LOG.debug(`addServer: response: `, response);
            throw new TypeError(`Response was not ServerListDTO: ${response}`);
        }
        return response;
    }

    /**
     * Execute action on a server
     */
    public static async executeServerAction (
        serverName : string,
        action     : ServerAction,
        token      : EmailTokenDTO | SmsTokenDTO
    ) : Promise<ServerDTO> {
        const sessionToken = GoVmClientService._getSessionToken(token);
        const response : ReadonlyJsonAny | undefined = await HttpService.postJson(
            this._apiUrl + EXECUTE_ACTION_SERVER_API_URL(serverName, action),
            {
            },
            GoVmClientService._createHeaders(sessionToken),
        );
        if (!isServerDTO(response)) {
            LOG.debug(`executeServerAction: response: `, response);
            throw new TypeError(`Response was not ServerDTO: ${response}`);
        }
        return response;
    }


    private static _getSessionToken (
        token: EmailTokenDTO | SmsTokenDTO
    ) : string {
        const sessionToken = token?.token;
        if (!sessionToken) throw new TypeError(`Token is required`);
        if (!token?.verified) throw new TypeError(`Token must be verified`);
        return sessionToken;
    }

    private static _createHeaders (
        sessionToken: string
    ) : {[key: string]: string} {
        return {
            [AUTHORIZATION_HEADER]: AuthorizationUtils.createBearerHeader(sessionToken)
        };
    }

}
