// Copyright (c) 2021-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { useTranslation } from "react-i18next";
import {
    Navigate,
    Outlet,
    useRoutes,
} from "react-router-dom";
import { useAuthSession } from "../../../../frontend/hooks/useAuthSession";
import { useI18nWithLanguageService } from "../../../../frontend/hooks/useI18nWithLanguageService";
import { useDefaultLanguage } from "../../../../frontend/hooks/useDefaultLanguage";
import { useRouteServiceWithNavigate } from "../../../../frontend/hooks/useRouteServiceWithNavigate";
import {
    ADD_SERVER_ROUTE,
    INDEX_ROUTE,
    LOGIN_ROUTE,
    MAIN_ROUTE,
    SERVER_LIST_ROUTE,
    SERVER_ROUTE,
} from "../../../core/constants/route";

// NOTE! The order of these imports is essential -- it declares the order of SCSS files!
// So, put components before layouts, and layouts before views. Otherwise, layout SCSS rules will
// overwrite SCSS from views and make your life harder.

// Layouts (see note above!)
import { DashboardLayout } from "../layouts/dashboard/DashboardLayout";
import { RootLayout } from "../layouts/root/RootLayout";

// Views (see note above!)
import { MainView } from "../views/main/MainView";
import { LoginView } from "../views/login/LoginView";
import { NotFoundView } from "../views/notFound/NotFoundView";
import { AddServerView } from "../views/servers/add/AddServerView";
import { ServerView } from "../views/servers/server/ServerView";
import { ServerListView } from "../views/servers/ServerListView";

/**
 * The name for this component is complete legacy.
 *
 * It should be something like "FiSendanorApp" now :)
 *
 * It is the app of sendanor.fi.
 *
 */
export function GoVmApp () {

    const session = useAuthSession();

    const { t, i18n } = useTranslation();
    useRouteServiceWithNavigate();
    useDefaultLanguage(i18n?.language);
    useI18nWithLanguageService();

    const rootRoutes = {
        path: INDEX_ROUTE,
        element: (
            <RootLayout t={t}>
                <Outlet />
            </RootLayout>
        ),
        children: [
            {path: LOGIN_ROUTE, element: <LoginView t={t} />},
            {path: INDEX_ROUTE, element: <Navigate to={ session?.isLoggedIn ? MAIN_ROUTE : LOGIN_ROUTE } />},
            {path: '*', element: <NotFoundView t={t} />},
        ]
    };

    const mainRoutes = {
        path: MAIN_ROUTE,
        element: (
            <RootLayout t={t}>
                <DashboardLayout
                    // nav={(
                    //     <DashboardMenu t={t} />
                    // )}
                >
                    <Outlet />
                </DashboardLayout>
            </RootLayout>
        ),
        children: [
            {path: ADD_SERVER_ROUTE, element: <AddServerView t={t} />},
            {path: SERVER_ROUTE, element: <ServerView t={t} />},
            {path: SERVER_LIST_ROUTE, element: <ServerListView t={t} />},
            {path: MAIN_ROUTE, element: <MainView t={t} />},
            {path: '*', element: <NotFoundView t={t} />},
        ]
    };

    const routing = useRoutes(
        [
            rootRoutes,
            mainRoutes,
        ]
    );

    return <>{routing}</>;
}
