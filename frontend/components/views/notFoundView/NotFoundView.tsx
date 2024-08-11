// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import {
    NOT_FOUND_VIEW_CLASS_NAME,
} from "../../../../core/constants/className";
import "./NotFoundView.scss";
import {
    T_NOT_FOUND_VIEW_DESCRIPTION,
    T_NOT_FOUND_VIEW_TITLE,
} from "../../../../core/constants/translation";

export interface NotFoundViewProps {
    readonly t : TranslationFunction;
}

export function NotFoundView (
    props: NotFoundViewProps,
) {
    const t : TranslationFunction = props.t;
    return (
        <div className={NOT_FOUND_VIEW_CLASS_NAME}>
            <article>
                <h2>{t(T_NOT_FOUND_VIEW_TITLE)}</h2>
                <p>{t(T_NOT_FOUND_VIEW_DESCRIPTION)}</p>
            </article>
        </div>
    );
}
