// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import { EmailTokenDTO } from "../../../../../../core/auth/email/types/EmailTokenDTO";
import { SmsTokenDTO } from "../../../../../../core/auth/sms/types/SmsTokenDTO";
import { ButtonStyle } from "../../../../../../core/frontend/button/ButtonStyle";
import { map } from "../../../../../../core/functions/map";
import { LogService } from "../../../../../../core/LogService";
import { TranslationFunction } from "../../../../../../core/types/TranslationFunction";
import { Button } from "../../../../../../frontend/components/button/Button";
import { TextCard } from "../../../../../../frontend/components/card/text/TextCard";
import { CardGrid } from "../../../../../../frontend/components/cardGrid/CardGrid";
import { Loader } from "../../../../../../frontend/components/loader/Loader";
import { useAuthSession } from "../../../../../../frontend/hooks/useAuthSession";
import { AuthSessionService } from "../../../../../../frontend/services/AuthSessionService";
import { RouteService } from "../../../../../../frontend/services/RouteService";
import { SERVER_VIEW_CLASS_NAME } from "../../../../../core/constants/className";
import { SERVER_VIEW_FETCH_RETRY_TIMEOUT_ON_PASSIVE_STATES } from "../../../../../core/constants/frontend";
import {
    LOGIN_ROUTE,
    SERVER_LIST_ROUTE,
} from "../../../../../core/constants/route";
import {
    T_ADD_SERVER_VIEW_ADD_FAILED_MESSAGE,
    T_SERVER_STATUS,
    T_SERVER_VIEW_ACTION_BUTTON_LABEL,
    T_SERVER_VIEW_NAME_LABEL,
    T_SERVER_VIEW_NO_RESULTS_FOUND,
    T_SERVER_VIEW_STATUS_LABEL,
    T_SERVER_VIEW_TITLE,
} from "../../../../../core/constants/translation";
import "./ServerView.scss";
import { ServerAction } from "../../../../../core/types/ServerAction";
import { ServerDTO } from "../../../../../core/types/ServerDTO";
import {
    isPassiveServerStatus,
    parseServerStatus,
    ServerStatus,
} from "../../../../../core/types/ServerStatus";
import { GoVmClientService } from "../../../../../services/GoVmClientService";
import { useServer } from "../../../../hooks/useServer";

const LOG = LogService.createLogger( 'ServerView' );

export interface ServerViewProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function ServerView ( props: ServerViewProps) {
    const t = props?.t;
    const params = useParams();
    const name = params?.name;
    const navigate = useNavigate();
    const session = useAuthSession();
    const [lastAction, setLastAction] = useState<ServerAction|undefined>(undefined);
    const [hasError, setHasError] = useState<boolean>(false);
    const [item, refreshItemCallback] = useServer(name);
    const itemStatus = parseServerStatus(item?.status) ?? ServerStatus.UNINITIALIZED;
    const notFound = item === null;
    const isLoading = item === undefined;
    const isPassiveStatus = isPassiveServerStatus(itemStatus)
    const [deletingEnabled, setDeletingEnabled] = useState<boolean>(false);

    const translationParams = {
        NAME: name,
        ACTION : lastAction ?? 'n/a',
    };

    const onActionClick = useCallback( (action: ServerAction) => {

        if (!name) {
            LOG.error(`Error for action "${action}": No server name`);
            return;
        }

        setLastAction(action);
        setHasError(false);

        const token : EmailTokenDTO | SmsTokenDTO | undefined = AuthSessionService.getToken();
        if ( !token ) {
            LOG.warn('useServerList: You must have a valid session');
            RouteService.setRoute( LOGIN_ROUTE );
        } else {
            GoVmClientService.executeServerAction( name, action, token ).then( (dto: ServerDTO) => {
                LOG.info( `Success for server "${ name }" and action "${ action }": `, dto );
                if (action === ServerAction.DELETE) {
                    setDeletingEnabled(true);
                }
                refreshItemCallback();
            } ).catch( ( err ) => {
                LOG.error( `Error for server "${ name }" and action "${ action }": `, err );
                setHasError( true );
                refreshItemCallback();
            } )
        }
    }, [
        name,
        setHasError,
        refreshItemCallback,
    ]);

    // Refresh non-passive statuses
    useEffect(() => {

        if (deletingEnabled && notFound) {
            navigate(SERVER_LIST_ROUTE)
        }

        let timer : any = setInterval(() => {
            if (!isPassiveStatus) {
                refreshItemCallback();
            } else {
                clearInterval(timer);
                timer = undefined;
            }
        }, SERVER_VIEW_FETCH_RETRY_TIMEOUT_ON_PASSIVE_STATES);
        return () => {
            if (timer !== undefined) {
                clearInterval(timer);
                timer = undefined;
            }
        }
    }, [
        navigate,
        notFound,
        deletingEnabled,
        isPassiveStatus,
        refreshItemCallback,
    ]);

    if (!session?.isLoggedIn) {
        navigate(LOGIN_ROUTE);
        return <Loader />;
    }
    return (
        <div className={ SERVER_VIEW_CLASS_NAME }>
            <h3>{ t( T_SERVER_VIEW_TITLE, translationParams ) }</h3>
            <div className={`${SERVER_VIEW_CLASS_NAME}-details`}>
                {isLoading? <Loader /> : null}
                {notFound ? (
                    <p className={`${SERVER_VIEW_CLASS_NAME}-details-error-message`}>{t(T_SERVER_VIEW_NO_RESULTS_FOUND, translationParams)}</p>
                ) : null}
                {!notFound && !isLoading ?
                    <>
                        <CardGrid>
                            <TextCard label={t(T_SERVER_VIEW_NAME_LABEL)} value={item?.name} />
                            <TextCard label={t(T_SERVER_VIEW_STATUS_LABEL)} value={t(T_SERVER_STATUS(itemStatus))} />
                        </CardGrid>

                        <div className={SERVER_VIEW_CLASS_NAME+'-actions'}>{
                            map(item?.actions, (action: ServerAction, index: number) => {
                                return (
                                    <Button
                                        className={SERVER_VIEW_CLASS_NAME+'-action-button'}
                                        key={`action:${action}`}
                                        click={ () => onActionClick(action) }
                                        style={ index === 0 ? ButtonStyle.PRIMARY : ButtonStyle.SECONDARY }
                                    >{ t( T_SERVER_VIEW_ACTION_BUTTON_LABEL(action) ) }</Button>
                                )
                            })
                        }</div>

                    </>
                : null}
                {hasError ? <>
                    <p>{t(T_ADD_SERVER_VIEW_ADD_FAILED_MESSAGE, translationParams)}</p>
                </> : null}
                {isPassiveStatus ? null : (
                    <Loader />
                )}
            </div>
        </div>
    );
}
