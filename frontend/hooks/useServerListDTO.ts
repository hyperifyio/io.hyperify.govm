// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { EmailTokenDTO } from "../../../core/auth/email/types/EmailTokenDTO";
import { SmsTokenDTO } from "../../../core/auth/sms/types/SmsTokenDTO";
import { LogService } from "../../../core/LogService";
import { isRequestError } from "../../../core/request/types/RequestError";
import { AuthSessionService } from "../../../frontend/services/AuthSessionService";
import { SERVER_LIST_FETCH_RETRY_TIMEOUT_ON_ERROR } from "../../core/constants/frontend";
import { ServerListDTO } from "../../core/types/ServerListDTO";
import { GoVmClientService } from "../../services/GoVmClientService";

const LOG = LogService.createLogger('useServerListDTO');

export type RefreshCallback = () => void;

export function useServerListDTO (
    session ?: EmailTokenDTO,
) : [ServerListDTO | null | undefined, RefreshCallback] {
    const [ dto, setDto ] = useState<ServerListDTO | undefined | null>(undefined);
    const refreshCallback = useCallback(
        () => {
            const token : EmailTokenDTO | SmsTokenDTO | undefined = session ?? AuthSessionService.getToken();
            if ( !token ) {
                LOG.warn('useServerList: You must have a valid session');
            } else {
                GoVmClientService.getServerListDTO(token).then( (dto : ServerListDTO) => {
                    LOG.debug(`changing dto = `, dto);
                    setDto(dto);
                }).catch((err) => {
                    if (isRequestError(err) && err.status === 401) {
                        LOG.error(`Authentication failed, clearing session token: `, err);
                        AuthSessionService.forgetToken();
                    } else {
                        LOG.error(`Error while fetching servers: `, err);
                        setTimeout(
                            () => {
                                setDto(undefined);
                            },
                            SERVER_LIST_FETCH_RETRY_TIMEOUT_ON_ERROR
                        );
                    }
                });
            }
        },
        [
            session,
            setDto,
        ]
    );

    useEffect(
        () => {
            if ( dto === undefined ) {
                setDto(null);
                refreshCallback();
            }
        },
        [
            session,
            dto,
            setDto,
            refreshCallback,
        ]
    );

    return [dto, refreshCallback];
}
