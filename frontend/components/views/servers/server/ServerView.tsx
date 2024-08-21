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
    T_SERVER_STATUS,
    T_SERVER_VIEW_ACTION_BUTTON_LABEL,
    T_SERVER_VIEW_ACTION_FAILED_MESSAGE,
    T_SERVER_VIEW_CLOSE_VNC_BUTTON_LABEL,
    T_SERVER_VIEW_NAME_LABEL,
    T_SERVER_VIEW_NO_RESULTS_FOUND,
    T_SERVER_VIEW_OPEN_VNC_BUTTON_LABEL,
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
import { VncDTO } from "../../../../../core/types/VncDTO";
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
    const [vncDTO, setVncDTO] = useState<VncDTO|undefined>(undefined);
    const [lastAction, setLastAction] = useState<ServerAction>(ServerAction.UNDEFINED);
    const [hasError, setHasError] = useState<boolean>(false);
    const [item, refreshItemCallback] = useServer(name);
    const itemStatus = parseServerStatus(item?.status) ?? ServerStatus.UNINITIALIZED;
    const notFound = item === null;
    const isLoading = item === undefined;
    const [deletingEnabled, setDeletingEnabled] = useState<boolean>(false);

    const hasConsole : boolean = !!item?.permissions?.consoleEnabled && [
        ServerStatus.STARTED,
        ServerStatus.PAUSED,
        ServerStatus.BLOCKED,
        ServerStatus.CRASHED,
        ServerStatus.DEPLOYING,
        ServerStatus.DELETING,
        ServerStatus.STOPPING,
        ServerStatus.STARTING,
        ServerStatus.SUSPENDED,
        ServerStatus.SUSPENDED,
    ].includes(itemStatus);

    const isPassiveStatus = isPassiveServerStatus(itemStatus)

    const translationParams = {
        NAME: name,
        ACTION : lastAction,
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

    const onOpenVncClick = useCallback( () => {

        if (!name) {
            LOG.error(`Error for vncOpenButton: No server name`);
            return;
        }

        setLastAction(ServerAction.CONSOLE);
        setHasError(false);
        const token : EmailTokenDTO | SmsTokenDTO | undefined = AuthSessionService.getToken();
        if ( !token ) {
            LOG.warn('onOpenVncClick: You must have a valid session');
            RouteService.setRoute( LOGIN_ROUTE );
        } else {
            GoVmClientService.openVnc( name, token ).then( (dto: VncDTO) => {
                LOG.info( `onOpenVncClick: Success for open vnc "${ name }" : `, dto );
                setVncDTO(dto)
            } ).catch( ( err ) => {
                LOG.error( `onOpenVncClick: Error for server "${ name }": `, err );
                setHasError( true );
                refreshItemCallback();
            } )
        }
    }, [
        name,
        setHasError,
        refreshItemCallback,
    ]);

    const onCloseVncClick = useCallback( () => {

        if (!vncDTO) {
            LOG.error(`Error for onCloseVncClick: No vnc URL defined`);
            return;
        }

        setLastAction(ServerAction.CONSOLE);
        setHasError(false);
        const token : EmailTokenDTO | SmsTokenDTO | undefined = AuthSessionService.getToken();
        if ( !token ) {
            LOG.warn('onCloseVncClick: You must have a valid session');
            RouteService.setRoute( LOGIN_ROUTE );
        } else {
            GoVmClientService.closeVnc( vncDTO.token, token ).then( (dto: VncDTO) => {
                LOG.info( `onCloseVncClick: Success for open vnc "${ name }" : `, dto );
                setVncDTO(undefined)
            } ).catch( ( err ) => {
                LOG.error( `onCloseVncClick: Error for server "${ name }": `, err );
                setHasError( true );
                setVncDTO(undefined)
                refreshItemCallback();
            } )
        }
    }, [
        name,
        vncDTO,
        setHasError,
        refreshItemCallback,
    ]);

    // Refresh non-passive statuses
    useEffect(() => {
        let timer : any;
        if (deletingEnabled && notFound) {
            navigate(SERVER_LIST_ROUTE)
        } else {
            timer = setInterval(() => {
                if (deletingEnabled && notFound) {
                    clearInterval(timer);
                    timer = undefined;
                } else {
                    refreshItemCallback();
                }
            }, SERVER_VIEW_FETCH_RETRY_TIMEOUT_ON_PASSIVE_STATES);
        }
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
        hasConsole,
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
                            <TextCard
                                label={ t( T_SERVER_VIEW_NAME_LABEL ) }
                                value={ item?.name }
                            />
                            <TextCard
                                label={ t( T_SERVER_VIEW_STATUS_LABEL ) }
                                value={ t( T_SERVER_STATUS( itemStatus ) ) }
                            />
                        </CardGrid>

                        <div className={ SERVER_VIEW_CLASS_NAME + '-actions' }>{
                            map( item?.actions, ( action : ServerAction, index : number ) => {
                                return (
                                    <Button
                                        className={ SERVER_VIEW_CLASS_NAME + '-action-button' }
                                        key={ `action:${ action }` }
                                        click={ () => onActionClick( action ) }
                                        style={ index === 0 ? ButtonStyle.PRIMARY : ButtonStyle.SECONDARY }
                                    >{ t( T_SERVER_VIEW_ACTION_BUTTON_LABEL( action ) ) }</Button>
                                );
                            } )
                        }</div>

                    </>
                    : null }
                { hasError ? <>
                    <p>{ t( T_SERVER_VIEW_ACTION_FAILED_MESSAGE(lastAction), translationParams)}</p>
                </> : null}
                {isPassiveStatus ? null : (
                    <Loader />
                )}
            </div>

            {hasConsole ? (
                vncDTO ? (
                        <div className={`${SERVER_VIEW_CLASS_NAME}-console`}>
                            <iframe
                                title="console"
                                id="vnc"
                                src={vncDTO.url}
                                width="100%"
                                height="635px"
                            ></iframe>
                            <Button
                                className={ SERVER_VIEW_CLASS_NAME + '-close-vnc-button' }
                                click={ () => onCloseVncClick() }
                                style={ ButtonStyle.SECONDARY }
                            >{ t( T_SERVER_VIEW_CLOSE_VNC_BUTTON_LABEL ) }</Button>
                        </div>
                    ) : (
                        <Button
                            className={ SERVER_VIEW_CLASS_NAME + '-open-vnc-button' }
                            click={ () => onOpenVncClick() }
                            style={ ButtonStyle.SECONDARY }
                        >{ t( T_SERVER_VIEW_OPEN_VNC_BUTTON_LABEL ) }</Button>
                    )
            ) : null}

        </div>
    );
}
