// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { EmailTokenDTO } from "../../../core/auth/email/types/EmailTokenDTO";
import { SmsTokenDTO } from "../../../core/auth/sms/types/SmsTokenDTO";
import { LogService } from "../../../core/LogService";
import { isRequestError } from "../../../core/request/types/RequestError";
import { AuthSessionService } from "../../../frontend/services/AuthSessionService";
import { SERVER_LIST_FETCH_RETRY_TIMEOUT_ON_ERROR } from "../../core/constants/frontend";
import { ServerDTO } from "../../core/types/ServerDTO";
import { GoVmClientService } from "../../services/GoVmClientService";

const LOG = LogService.createLogger('useServerList');

export type RefreshCallback = () => void;

export function useServerList (
    session ?: EmailTokenDTO,
) : [readonly ServerDTO[] | null | undefined, RefreshCallback] {
    const [ list, setList ] = useState<readonly ServerDTO[] | undefined | null>(undefined);
    const refreshCallback = useCallback(
        () => {
            const token : EmailTokenDTO | SmsTokenDTO | undefined = session ?? AuthSessionService.getToken();
            if ( !token ) {
                LOG.warn('useServerList: You must have a valid session');
            } else {
                GoVmClientService.getServerList(token).then( (list : readonly ServerDTO[]) => {
                    LOG.debug(`changing list = `, list);
                    setList(list);
                }).catch((err) => {
                    if (isRequestError(err) && err.status === 401) {
                        LOG.error(`Authentication failed, clearing session token: `, err);
                        AuthSessionService.forgetToken();
                    } else {
                        LOG.error(`Error while fetching servers: `, err);
                        setTimeout(
                            () => {
                                setList(undefined);
                            },
                            SERVER_LIST_FETCH_RETRY_TIMEOUT_ON_ERROR
                        );
                    }
                });
            }
        },
        [
            session,
            setList,
        ]
    );

    useEffect(
        () => {
            if ( list === undefined ) {
                setList(null);
                refreshCallback();
            }
        },
        [
            session,
            list,
            setList,
            refreshCallback,
        ]
    );

    return [list, refreshCallback];
}
