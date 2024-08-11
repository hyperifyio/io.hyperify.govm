// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import { APP_FOOTER_CLASS_NAME } from "../../../../core/constants/className";
import { COPYRIGHT_YEAR } from "../../../../core/constants/frontend";
import { T_APP_COPYRIGHT } from "../../../../core/constants/translation";
import "./AppFooter.scss";

export interface AppFooterProps {
    readonly t         : TranslationFunction;
    readonly className?: string;
}

export function AppFooter (props: AppFooterProps) {
    const t = props?.t;
    const className = props?.className;
    const translationParams = {
        COPYRIGHT_YEAR: COPYRIGHT_YEAR,
    };
    return (
        <footer
            className={
                APP_FOOTER_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >
            <div className={APP_FOOTER_CLASS_NAME+'-content'}>
                {t(T_APP_COPYRIGHT, translationParams)}
            </div>
        </footer>
    );
}
