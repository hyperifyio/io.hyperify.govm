// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    useCallback,
    useEffect,
    useState,
} from "react";
import { EmailTokenDTO } from "../../../core/auth/email/types/EmailTokenDTO";
import { SmsTokenDTO } from "../../../core/auth/sms/types/SmsTokenDTO";
import { LogService } from "../../../core/LogService";
import { isRequestError } from "../../../core/request/types/RequestError";
import { AuthSessionService } from "../../../frontend/services/AuthSessionService";
import { SERVER_FETCH_RETRY_TIMEOUT_ON_ERROR } from "../../core/constants/frontend";
import { ServerDTO } from "../../core/types/ServerDTO";
import { GoVmClientService } from "../../services/GoVmClientService";

const LOG = LogService.createLogger('useServer');

export type RefreshCallback = () => void;

export function useServer (
    inventoryItemId ?: string,
    session ?: EmailTokenDTO
) : [ServerDTO | null | undefined, RefreshCallback] {
    const [ item, setItem ] = useState<ServerDTO | undefined | null>(undefined);
    const refreshCallback = useCallback(
        () => {
            const token : EmailTokenDTO | SmsTokenDTO | undefined = session ?? AuthSessionService.getToken();
            if ( !token || !inventoryItemId ) {
                LOG.warn('useServer: You must have a valid session and clientId and invoiceId');
            } else {
                GoVmClientService.getServerById(inventoryItemId, token).then( (foundItem : ServerDTO | undefined) => {
                    setItem( foundItem );
                }).catch((err) => {
                    if (isRequestError(err) && err.status === 404) {
                        LOG.error(`Server not found `, err);
                        setItem(null);
                    } else if (isRequestError(err) && err.status === 401) {
                        LOG.error(`Authentication failed, clearing session token: `, err);
                        AuthSessionService.forgetToken();
                    } else {
                        LOG.error(`Error while fetching clients: `, err);
                        setTimeout(
                            () => {
                                setItem(undefined);
                            },
                            SERVER_FETCH_RETRY_TIMEOUT_ON_ERROR
                        );
                    }
                });
            }
        },
        [
            inventoryItemId,
            session,
            setItem
        ]
    );
    useEffect(
        () => {
            if ( item === undefined ) {
                setItem(null);
                refreshCallback();
            }
        },
        [
            session,
            item,
            setItem,
            refreshCallback
        ]
    );
    return [item, refreshCallback];
}
