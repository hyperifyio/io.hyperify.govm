// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { useNavigate } from "react-router-dom";
import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import { Loader } from "../../../../../frontend/components/loader/Loader";
import { useAuthSession } from "../../../../../frontend/hooks/useAuthSession";
import {
    MAIN_VIEW_CLASS_NAME
} from "../../../../core/constants/className";
import "./MainView.scss";
import {
    LOGIN_ROUTE,
} from "../../../../core/constants/route";

export interface MainIndexViewProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function MainView ( props: MainIndexViewProps) {
    const navigate = useNavigate();
    const session = useAuthSession();
    if (!session?.isLoggedIn) {
        navigate(LOGIN_ROUTE);
        return <Loader />;
    }
    return (
        <div className={MAIN_VIEW_CLASS_NAME}>
            Logged in as {session?.email}
        </div>
    );
}
