// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import { Loader } from "../../../../../frontend/components/loader/Loader";
import { useLogoutGoVmSession } from "../../../hooks/useLogoutGoVmSession";
import "./LogoutView.scss";

export interface LogoutViewProps {
    readonly className ?: string;
    readonly t : TranslationFunction;
}

export function LogoutView ( _props: LogoutViewProps) {
    useLogoutGoVmSession();
    return <Loader />;
}
