// Copyright (c) 2021-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { NavLink } from "react-router-dom";
import { Theme } from "../../../../../core/types/Theme";
import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import { useAuthSession } from "../../../../../frontend/hooks/useAuthSession";
import { SetThemeCallback } from "../../../../../frontend/hooks/useTheme";
import {
    ACTIVATED_CLASS_NAME,
    APP_HEADER_CLASS_NAME,
    NAV_LINK_CLASS_NAME,
} from "../../../../core/constants/className";
import { INDEX_ROUTE } from "../../../../core/constants/route";
import { SendanorLogo } from "../../../assets/logos";
import { useMenuItems } from "../../../hooks/useMenuItems";
import { NavMenu } from "../navMenu/NavMenu";
import "./AppHeader.scss";

export interface AppHeaderProps {
    readonly t: TranslationFunction;
    readonly className?: string;
    readonly theme?: Theme;
    readonly changeTheme: SetThemeCallback;
    readonly isFixed?: boolean;
}

export function AppHeader (props: AppHeaderProps) {
    const t = props.t;
    const className = props.className;
    const session = useAuthSession();
    const isLoggedIn = !!session?.isLoggedIn;
    const MENU_ITEMS = useMenuItems();
    const isFixed = props?.isFixed ?? false;
    return (
        <div
            className={
                APP_HEADER_CLASS_NAME
                + " " + (className ? " " + className : "")
                + " " + (isFixed ? "enable-fixed" : "disable-fixed")
            }
        >
            <header className={ APP_HEADER_CLASS_NAME + "-nav" }>
                <nav className={ `${ APP_HEADER_CLASS_NAME }-menu-normal` }>

                    <NavLink
                        to={INDEX_ROUTE}
                        className={({isActive}) =>
                            NAV_LINK_CLASS_NAME + " " +
                            `${APP_HEADER_CLASS_NAME}-logo` +
                            (isActive ? " " + ACTIVATED_CLASS_NAME : "")
                        }
                    ><SendanorLogo /></NavLink>

                    {isLoggedIn ?
                        <NavMenu
                            t={t}
                            className={APP_HEADER_CLASS_NAME + "-nav-menu"}
                            items={MENU_ITEMS}
                        />
                        : null}

                </nav>
            </header>
        </div>
);

}
