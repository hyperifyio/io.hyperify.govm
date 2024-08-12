// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { NavLink } from "react-router-dom";
import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import { Button } from "../../../../../frontend/components/button/Button";
import { useLogoutCallback } from "../../../../../frontend/hooks/useLogoutCallback";
import { DASHBOARD_MENU_CLASS_NAME } from "../../../../core/constants/className";
import {
    MAIN_ROUTE,
    SERVER_LIST_ROUTE,
} from "../../../../core/constants/route";
import {
    T_DASHBOARD_MENU_NAV_MAIN_LABEL,
    T_DASHBOARD_MENU_NAV_SERVERS_LABEL,
    T_LOGOUT_LABEL,
} from "../../../../core/constants/translation";
import "./DashboardMenu.scss";

export interface DashboardMenuProps {
    readonly className ?: string;
    readonly t          : TranslationFunction;
}

export function DashboardMenu ( props: DashboardMenuProps) {
    const t = props?.t;
    const className = props?.className;
    const logoutCallback = useLogoutCallback('DashboardMenu');
    const translationParams = {};
    return (
        <div className={
            DASHBOARD_MENU_CLASS_NAME
            + (className? ` ${className}` : '')
        }>
            <section className={DASHBOARD_MENU_CLASS_NAME+'-section'}>
                <NavLink end className={DASHBOARD_MENU_CLASS_NAME+"-link"} to={MAIN_ROUTE}>{t(T_DASHBOARD_MENU_NAV_MAIN_LABEL)}</NavLink>
                <NavLink end className={DASHBOARD_MENU_CLASS_NAME+"-link"} to={SERVER_LIST_ROUTE}>{t(T_DASHBOARD_MENU_NAV_SERVERS_LABEL)}</NavLink>
                <Button
                    className={"button"}
                    click={logoutCallback}
                >{t(T_LOGOUT_LABEL, translationParams)}</Button>
            </section>
        </div>
    );
}
