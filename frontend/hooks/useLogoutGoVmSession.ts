// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    useEffect,
} from "react";
import { EmailTokenDTO } from "../../../core/auth/email/types/EmailTokenDTO";
import { SmsTokenDTO } from "../../../core/auth/sms/types/SmsTokenDTO";
import { LogService } from "../../../core/LogService";
import { useAuthSession } from "../../../frontend/hooks/useAuthSession";
import { AuthSessionService } from "../../../frontend/services/AuthSessionService";
import { RouteService } from "../../../frontend/services/RouteService";
import { LOGIN_ROUTE } from "../../core/constants/route";
import { GoVmClientService } from "../../services/GoVmClientService";

const LOG = LogService.createLogger('useLogoutGoVmSession');

export function useLogoutGoVmSession () {
    const session = useAuthSession();
    const isLoggedIn = session?.isLoggedIn;
    useEffect(() => {
        const token : EmailTokenDTO | SmsTokenDTO | undefined = AuthSessionService.getToken();
        if ( !token ) {
            LOG.debug('Already logged out');
            RouteService.setRoute( LOGIN_ROUTE );
        } else {
            GoVmClientService.logoutSession( token ).then( () => {
                LOG.info(`Logout successful`);
                AuthSessionService.forgetToken();
                RouteService.setRoute( LOGIN_ROUTE );
            }).catch((err) => {
                LOG.error(`Logout failed: `, err);
                AuthSessionService.forgetToken();
                RouteService.setRoute( LOGIN_ROUTE );
            })
        }
    }, [
        isLoggedIn,
    ]);
}
