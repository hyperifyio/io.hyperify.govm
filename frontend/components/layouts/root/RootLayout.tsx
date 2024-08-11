// Copyright (c) 2021-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { ReactNode, useRef, useState } from "react";
import { Theme } from "../../../../../core/types/Theme";
import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import { useScrollingElement } from "../../../../../frontend/hooks/useScrollingElement";
import { useScrollTop } from "../../../../../frontend/hooks/useScrollTop";
import { ROOT_LAYOUT_CLASS_NAME } from "../../../../core/constants/className";
import { AppHeader } from "../../common/appHeader/AppHeader";
import { AppFooter } from "../../common/appFooter/AppFooter";
import "./RootLayout.scss";

export interface RootLayoutProps {
    readonly t: TranslationFunction;
    readonly children: ReactNode;
    readonly className?: string;
    readonly theme?: Theme;
    readonly setThemeDark?: boolean;
}

export function RootLayout ( props: RootLayoutProps) {
    const t = props?.t;
    const [ theme, setTheme ] = useState<Theme>(props?.theme ?? Theme.LIGHT);
    const isThemeDark = theme === Theme.DARK;
    const myRef = useRef<HTMLDivElement>(null);
    const scrollingElement = useScrollingElement();
    const scrollTop = useScrollTop(scrollingElement);
    const isOnTop : boolean = scrollTop === 0;
    return (
        <div
            ref={myRef}
            className={ROOT_LAYOUT_CLASS_NAME}
            data-theme={isThemeDark ? "dark" : "light"}
        >
            <AppHeader
                className={`${ROOT_LAYOUT_CLASS_NAME}-header`}
                theme={theme}
                changeTheme={setTheme}
                t={t}
                isFixed={!isOnTop}
            />
            <section className={`${ROOT_LAYOUT_CLASS_NAME}-content`}>{props.children}</section>
            <AppFooter
                className={`${ROOT_LAYOUT_CLASS_NAME}-footer`}
                t={t}
            />
        </div>
    );
}
