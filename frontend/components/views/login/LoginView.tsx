// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    useCallback,
    useState,
} from "react";
import { EmailTokenDTO } from "../../../../../core/auth/email/types/EmailTokenDTO";
import { LogService } from "../../../../../core/LogService";
import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import { EmailField } from "../../../../../frontend/components/fields/email/EmailField";
import { PasswordField } from "../../../../../frontend/components/fields/password/PasswordField";
import { Form } from "../../../../../frontend/components/form/Form";
import { Loader } from "../../../../../frontend/components/loader/Loader";
import { SubmitButton } from "../../../../../frontend/components/submitButton/SubmitButton";
import { useAuthSession } from "../../../../../frontend/hooks/useAuthSession";
import { useEmailValidator } from "../../../../../frontend/hooks/useEmailValidator";
import { useTextValidator } from "../../../../../frontend/hooks/useTextValidator";
import { EmailAuthSessionService } from "../../../../../frontend/services/EmailAuthSessionService";
import {
    LOGIN_VIEW_CLASS_NAME
} from "../../../../core/constants/className";
import { useNavigate } from "react-router-dom";
import {
    INDEX_ROUTE,
} from "../../../../core/constants/route";
import "./LoginView.scss";
import {
    T_LOGIN_VIEW_EMAIL_LABEL,
    T_LOGIN_VIEW_EMAIL_PLACEHOLDER,
    T_LOGIN_VIEW_ERROR_MESSAGE,
    T_LOGIN_VIEW_PASSWORD_LABEL,
    T_LOGIN_VIEW_PASSWORD_PLACEHOLDER,
    T_LOGIN_VIEW_SUBMIT_BUTTON_LABEL,
    T_LOGIN_VIEW_TITLE,
} from "../../../../core/constants/translation";

const LOG = LogService.createLogger( 'LoginView' );

export interface LoginViewProps {
    readonly className ?: string;
    readonly t : TranslationFunction;
}

export function LoginView ( props: LoginViewProps) {
    const t = props?.t;
    const className = props?.className;
    const navigate = useNavigate();
    const session = useAuthSession();
    const [hasError, setError] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const submitCallback = useCallback(() => {
        setError(false);
        EmailAuthSessionService.authenticateEmailAddressWithPassword(email, password).then( (_token: EmailTokenDTO) => {
            navigate(INDEX_ROUTE);
        }).catch((err) => {
            LOG.error(`Error: `, err);
            setError(true);
        });
    }, [
        email,
        password,
        setError,
        navigate,
    ]);

    const [isEmailValid] = useEmailValidator(email, true);
    const [isPasswordValid] = useTextValidator(password, true);
    const isSubmitEnabled : boolean = isEmailValid && isPasswordValid;

    if (session?.isLoggedIn) {
        navigate(INDEX_ROUTE);
        return <Loader />;
    }

    return (
        <div className={
            LOGIN_VIEW_CLASS_NAME
            + (className? ` ${className}` : '')
        }>
            <h2 className={`${LOGIN_VIEW_CLASS_NAME}-title`}>{t(T_LOGIN_VIEW_TITLE)}</h2>
            <Form submit={submitCallback}
                  className={`${LOGIN_VIEW_CLASS_NAME}-form`}
            >
                <EmailField
                    className={`${LOGIN_VIEW_CLASS_NAME}-email`}
                    label={t(T_LOGIN_VIEW_EMAIL_LABEL)}
                    placeholder={t(T_LOGIN_VIEW_EMAIL_PLACEHOLDER)}
                    value={email}
                    change={(value) => setEmail(value ?? '')} />
                <PasswordField
                    className={`${LOGIN_VIEW_CLASS_NAME}-password`}
                    label={t(T_LOGIN_VIEW_PASSWORD_LABEL)}
                    placeholder={t(T_LOGIN_VIEW_PASSWORD_PLACEHOLDER)}
                    value={password}
                    change={(value) => setPassword(value ?? '')} />
                <SubmitButton
                    className={`${LOGIN_VIEW_CLASS_NAME}-button`}
                    enabled={isSubmitEnabled}
                >{t(T_LOGIN_VIEW_SUBMIT_BUTTON_LABEL)}</SubmitButton>

                {hasError ? <p className={`${LOGIN_VIEW_CLASS_NAME}-error`}>{t(T_LOGIN_VIEW_ERROR_MESSAGE)}</p> : null}

            </Form>
        </div>
    );
}
