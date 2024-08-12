// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ServerAction } from "../types/ServerAction";

export const T_APP_COPYRIGHT = 'app.copyright';
export const T_NOT_FOUND_VIEW_TITLE = 'notFoundView.title';
export const T_NOT_FOUND_VIEW_DESCRIPTION = 'notFoundView.description';
export const T_DASHBOARD_MENU_NAV_MAIN_LABEL = 'dashboardMenu.nav.main';
export const T_DASHBOARD_MENU_NAV_SERVERS_LABEL = 'dashboardMenu.nav.servers';
export const T_LOGOUT_LABEL = 'common.logout';
export const T_LOGIN_VIEW_TITLE = 'loginView.title';
export const T_LOGIN_VIEW_EMAIL_LABEL = 'loginView.email.label';
export const T_LOGIN_VIEW_PASSWORD_LABEL = 'loginView.password.label';
export const T_LOGIN_VIEW_EMAIL_PLACEHOLDER = 'loginView.email.placeholder';
export const T_LOGIN_VIEW_PASSWORD_PLACEHOLDER = 'loginView.password.placeholder';
export const T_LOGIN_VIEW_SUBMIT_BUTTON_LABEL = 'loginView.submitButton.label';
export const T_LOGIN_VIEW_ERROR_MESSAGE = 'loginView.errorMessage';
export const T_NAV_SERVERS = 'nav.servers';
export const T_SERVER_VIEW_TITLE = 'serverView.title';
export const T_SERVER_VIEW_NAME_LABEL = 'serverView.name.label';
export const T_SERVER_VIEW_STATUS_LABEL = 'serverView.status.label';
export const T_SERVER_VIEW_NO_RESULTS_FOUND = 'serverView.noResultsFound';
export const T_SERVER_VIEW_ACTION_FAILED_MESSAGE = 'serverView.actionFailedMessage';
export const T_SERVER_LIST_VIEW_TITLE = 'serverListView.title';
export const T_SERVER_LIST_VIEW_NO_RESULTS_FOUND = 'serverListView.noResultsFound';
export const T_SERVER_LIST_VIEW_TABLE_NAME_LABEL = 'serverListView.table.fields.name.label';
export const T_SERVER_LIST_VIEW_TABLE_STATUS_LABEL = 'serverListView.table.fields.status.label';
export const T_SERVER_LIST_VIEW_TABLE_ACTIONS_LABEL = 'serverListView.table.fields.actions.label';
export const T_SERVER_VIEW_ACTION_BUTTON_LABEL = (action: ServerAction) => `serverView.actionButton.${action}.label`;
export const T_COMMON_OPEN = 'common.open';
export const T_SERVER_LIST_VIEW_DEPLOY_BUTTON_LABEL = 'serverListView.deployButton.label';
export const T_DEPLOY_SERVER_VIEW_TITLE = 'deployServerView.title';
export const T_DEPLOY_SERVER_VIEW_SERVER_NAME_LABEL = 'deployServerView.fields.name.label';
export const T_DEPLOY_SERVER_VIEW_SERVER_NAME_PLACEHOLDER = 'deployServerView.fields.name.placeholder';
export const T_DEPLOY_SERVER_VIEW_SERVER_SUBMIT_BUTTON_LABEL = 'deployServerView.submitButton.label';
export const T_DEPLOY_SERVER_VIEW_DEPLOY_FAILED_MESSAGE = 'deployServerView.deployFailedMessage';
export const T_SERVER_STATUS = ( status: string) : string => `serverStatus.${status}`;
