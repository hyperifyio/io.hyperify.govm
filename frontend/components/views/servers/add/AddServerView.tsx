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
    ADD_SERVER_VIEW_CLASS_NAME,
} from "../../../../../core/constants/className";
import "./AddServerView.scss";
import {
    LOGIN_ROUTE,
    SERVER_LIST_ROUTE,
} from "../../../../../core/constants/route";
import {
    T_ADD_SERVER_VIEW_ADD_FAILED_MESSAGE,
    T_ADD_SERVER_VIEW_SERVER_NAME_LABEL,
    T_ADD_SERVER_VIEW_SERVER_NAME_PLACEHOLDER,
    T_ADD_SERVER_VIEW_SERVER_SUBMIT_BUTTON_LABEL,
    T_ADD_SERVER_VIEW_TITLE,
} from "../../../../../core/constants/translation";
import { ServerListDTO } from "../../../../../core/types/ServerListDTO";
import { GoVmClientService } from "../../../../../services/GoVmClientService";
import { useServerNameValidator } from "../../../../hooks/useServerNameValidator";

const LOG = LogService.createLogger( 'AddServerView' );

export interface AddServerViewProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function AddServerView ( props: AddServerViewProps) {
    const t = props?.t;
    const navigate = useNavigate();
    const session = useAuthSession();
    const [addFailed, setAddFailed] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const saveCallback = useCallback(() => {
        setAddFailed(false);
        const token : EmailTokenDTO | SmsTokenDTO | undefined = AuthSessionService.getToken();
        if ( !token ) {
            LOG.warn('useServerList: You must have a valid session');
            RouteService.setRoute( LOGIN_ROUTE );
        } else {
            GoVmClientService.addServer( name, token ).then( ( _dto : ServerListDTO ) => {
                RouteService.setRoute( SERVER_LIST_ROUTE );
            } ).catch( ( err ) => {
                setAddFailed( true );
                LOG.error( `Failed to add a server: `, err );
            } );
        }
    },
        [
        name,
        setAddFailed,
    ]);
    const [ isNameValid ] = useServerNameValidator( name, true );
    const saveEnabled = isNameValid;

    if (!session?.isLoggedIn) {
        navigate(LOGIN_ROUTE);
        return <Loader />;
    }
    return (
        <div className={ ADD_SERVER_VIEW_CLASS_NAME }>
            <h3 className={ `${ ADD_SERVER_VIEW_CLASS_NAME }-title` }>{ t( T_ADD_SERVER_VIEW_TITLE ) }</h3>
            <div className={ `${ ADD_SERVER_VIEW_CLASS_NAME }-details` }>
                <Form submit={saveCallback}
                      className={ADD_SERVER_VIEW_CLASS_NAME+'-form'}>
                    <TextField
                        className={ADD_SERVER_VIEW_CLASS_NAME + '-form-name'}
                        label={t(T_ADD_SERVER_VIEW_SERVER_NAME_LABEL)}
                        placeholder={t(T_ADD_SERVER_VIEW_SERVER_NAME_PLACEHOLDER)}
                        value={name}
                        change={ (value) => setName(value ?? '') }
                    />
                    <SubmitButton
                        className={ADD_SERVER_VIEW_CLASS_NAME+'-form-submit-button'}
                        enabled={saveEnabled}
                    >{t(T_ADD_SERVER_VIEW_SERVER_SUBMIT_BUTTON_LABEL)}</SubmitButton>
                </Form>
                {addFailed ? <>
                    <p>{t(T_ADD_SERVER_VIEW_ADD_FAILED_MESSAGE)}</p>
                </> : null}
            </div>
        </div>
    );
}
