// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { NavLink } from "react-router-dom";
import { map } from "../../../../../core/functions/map";
import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import { MenuItem } from "../../../../core/types/MenuItem";
import {
    ACTIVATED_CLASS_NAME,
    NAV_LINK_CLASS_NAME,
    NAV_MENU_CLASS_NAME,
} from "../../../../core/constants/className";
import "./NavMenu.scss";

export interface NavMenuProps {
    readonly className ?: string;
    readonly t: TranslationFunction;
    readonly items : readonly MenuItem[];
}

export function NavMenu (props: NavMenuProps) {
    const t = props?.t;
    const items = props?.items;
    const className = props?.className;
    return (
        <nav className={
            NAV_MENU_CLASS_NAME
            + (className ? " " + className : "")
        }>{map(
            items,
            (item: MenuItem) => {
                return (
                    <NavLink
                        key={`nav-item-${item.route}`}
                        to={item.route}
                        className={({isActive}) =>
                            NAV_LINK_CLASS_NAME + (isActive ? " " + ACTIVATED_CLASS_NAME : "")
                        }
                    >{t(item.title)}</NavLink>
                );
            }
        )}</nav>
    );
}
