// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    useCallback,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { EmailTokenDTO } from "../../../../../../core/auth/email/types/EmailTokenDTO";
import { SmsTokenDTO } from "../../../../../../core/auth/sms/types/SmsTokenDTO";
import { LogService } from "../../../../../../core/LogService";
import { TranslationFunction } from "../../../../../../core/types/TranslationFunction";
import { TextField } from "../../../../../../frontend/components/fields/text/TextField";
import { Form } from "../../../../../../frontend/components/form/Form";
import { Loader } from "../../../../../../frontend/components/loader/Loader";
import { SubmitButton } from "../../../../../../frontend/components/submitButton/SubmitButton";
import { useAuthSession } from "../../../../../../frontend/hooks/useAuthSession";
import { AuthSessionService } from "../../../../../../frontend/services/AuthSessionService";
import { RouteService } from "../../../../../../frontend/services/RouteService";
import {
    DEPLOY_SERVER_VIEW_CLASS_NAME,
} from "../../../../../core/constants/className";
import "./DeployServerView.scss";
import {
    LOGIN_ROUTE,
    SERVER_LIST_ROUTE,
} from "../../../../../core/constants/route";
import {
    T_DEPLOY_SERVER_VIEW_DEPLOY_FAILED_MESSAGE,
    T_DEPLOY_SERVER_VIEW_SERVER_NAME_LABEL,
    T_DEPLOY_SERVER_VIEW_SERVER_NAME_PLACEHOLDER,
    T_DEPLOY_SERVER_VIEW_SERVER_SUBMIT_BUTTON_LABEL,
    T_DEPLOY_SERVER_VIEW_TITLE,
} from "../../../../../core/constants/translation";
import { ServerListDTO } from "../../../../../core/types/ServerListDTO";
import { GoVmClientService } from "../../../../../services/GoVmClientService";
import { useServerNameValidator } from "../../../../hooks/useServerNameValidator";

const LOG = LogService.createLogger( 'DeployServerView' );

export interface DeployServerViewProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function DeployServerView ( props: DeployServerViewProps) {
    const t = props?.t;
    const navigate = useNavigate();
    const session = useAuthSession();
    const [deployFailed, setDeployFailed] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const saveCallback = useCallback(() => {
        setDeployFailed(false);
        const token : EmailTokenDTO | SmsTokenDTO | undefined = AuthSessionService.getToken();
        if ( !token ) {
            LOG.warn('useServerList: You must have a valid session');
            RouteService.setRoute( LOGIN_ROUTE );
        } else {
            GoVmClientService.deployServer( name, token ).then( ( _dto : ServerListDTO ) => {
                RouteService.setRoute( SERVER_LIST_ROUTE );
            } ).catch( ( err ) => {
                setDeployFailed( true );
                LOG.error( `Failed to deploy server: `, err );
            } );
        }
    },
        [
        name,
        setDeployFailed,
    ]);
    const [ isNameValid ] = useServerNameValidator( name, true );
    const saveEnabled = isNameValid;

    if (!session?.isLoggedIn) {
        navigate(LOGIN_ROUTE);
        return <Loader />;
    }
    return (
        <div className={ DEPLOY_SERVER_VIEW_CLASS_NAME }>
            <h3 className={ `${ DEPLOY_SERVER_VIEW_CLASS_NAME }-title` }>{ t( T_DEPLOY_SERVER_VIEW_TITLE ) }</h3>
            <div className={ `${ DEPLOY_SERVER_VIEW_CLASS_NAME }-details` }>
                <Form submit={saveCallback}
                      className={DEPLOY_SERVER_VIEW_CLASS_NAME+'-form'}>
                    <TextField
                        className={DEPLOY_SERVER_VIEW_CLASS_NAME + '-form-name'}
                        label={t(T_DEPLOY_SERVER_VIEW_SERVER_NAME_LABEL)}
                        placeholder={t(T_DEPLOY_SERVER_VIEW_SERVER_NAME_PLACEHOLDER)}
                        value={name}
                        change={ (value) => setName(value ?? '') }
                    />
                    <SubmitButton
                        className={DEPLOY_SERVER_VIEW_CLASS_NAME+'-form-submit-button'}
                        enabled={saveEnabled}
                    >{t(T_DEPLOY_SERVER_VIEW_SERVER_SUBMIT_BUTTON_LABEL)}</SubmitButton>
                </Form>

                {deployFailed ? <>
                    <p>{t(T_DEPLOY_SERVER_VIEW_DEPLOY_FAILED_MESSAGE)}</p>
                </> : null}
            </div>
        </div>
    );
}
