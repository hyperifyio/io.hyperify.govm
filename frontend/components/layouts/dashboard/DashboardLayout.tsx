// Copyright (c) 2021-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { ReactNode } from "react";
import { DASHBOARD_LAYOUT_CLASS_NAME } from "../../../../core/constants/className";
import "./DashboardLayout.scss";

export interface DashboardLayoutProps {
    readonly className ?: string;
    readonly nav       ?: ReactNode;
    readonly children   : ReactNode;
}

export function DashboardLayout (props: DashboardLayoutProps) {
    const className = props?.className;
    const nav = props?.nav;
    const children = props?.children;
    return (
        <div className={DASHBOARD_LAYOUT_CLASS_NAME + (className? ' ' + className : '')}>
            { nav ? <nav className={`${DASHBOARD_LAYOUT_CLASS_NAME}-nav`}>{nav}</nav> : null }
            <section className={`${DASHBOARD_LAYOUT_CLASS_NAME}-content`}>{children}</section>
        </div>
    );
}
