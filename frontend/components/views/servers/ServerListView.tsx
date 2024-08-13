// Copyright (c) 2022-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonStyle } from "../../../../../core/frontend/button/ButtonStyle";
import { LogService } from "../../../../../core/LogService";
import { TranslationFunction } from "../../../../../core/types/TranslationFunction";
import { Button } from "../../../../../frontend/components/button/Button";
import { Card } from "../../../../../frontend/components/card/Card";
import { Loader } from "../../../../../frontend/components/loader/Loader";
import { TextColumn } from "../../../../../frontend/components/table/columns/text/TextColumn";
import { TableHeader } from "../../../../../frontend/components/table/TableHeader";
import { TableHeaderColumn } from "../../../../../frontend/components/table/TableHeaderColumn";
import { useAuthSession } from "../../../../../frontend/hooks/useAuthSession";
import { RouteService } from "../../../../../frontend/services/RouteService";
import {
    SERVER_LIST_VIEW_CLASS_NAME,
} from "../../../../core/constants/className";
import "./ServerListView.scss";
import {
    ADD_SERVER_ROUTE,
    GET_SERVER_ROUTE,
    LOGIN_ROUTE,
} from "../../../../core/constants/route";
import { Table } from "../../../../../frontend/components/table/Table";
import { TableBody } from "../../../../../frontend/components/table/TableBody";
import { TableRow } from "../../../../../frontend/components/table/TableRow";
import { TableColumn } from "../../../../../frontend/components/table/TableColumn";
import {
    T_COMMON_OPEN,
    T_SERVER_LIST_VIEW_ADD_BUTTON_LABEL,
    T_SERVER_LIST_VIEW_NO_RESULTS_FOUND,
    T_SERVER_LIST_VIEW_TABLE_ACTIONS_LABEL,
    T_SERVER_LIST_VIEW_TABLE_NAME_LABEL,
    T_SERVER_LIST_VIEW_TABLE_STATUS_LABEL,
    T_SERVER_LIST_VIEW_TITLE,
} from "../../../../core/constants/translation";
import { map } from "../../../../../core/functions/map";
import { ServerDTO } from "../../../../core/types/ServerDTO";
import { useServerList } from "../../../hooks/useServerList";

const LOG = LogService.createLogger( 'ServerListView' );

export interface ServerListViewProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function ServerListView ( props: ServerListViewProps) {
    const t = props?.t;
    const navigate = useNavigate();
    const session = useAuthSession();
    const [ list/*, refreshList*/ ] = useServerList();
    const isLoading = list?.length === undefined;
    const listCount = list?.length ?? 0;
    const onItemClick = useCallback(
        ( itemId : string ) => {
            const route = GET_SERVER_ROUTE( itemId );
            LOG.debug( `Going to server route: `, route );
            RouteService.setRoute( route );
        },
        [
        ],
    );
    const onDeployClick = useCallback(
        () => {
            RouteService.setRoute( ADD_SERVER_ROUTE );
        },
        [
        ],
    );
    if (!session?.isLoggedIn) {
        navigate(LOGIN_ROUTE);
        return <Loader />;
    }
    return (
        <div className={ SERVER_LIST_VIEW_CLASS_NAME }>
            <h3 className={ `${ SERVER_LIST_VIEW_CLASS_NAME }-title` }>{ t( T_SERVER_LIST_VIEW_TITLE ) }</h3>
            <div className={ `${ SERVER_LIST_VIEW_CLASS_NAME }-details` }>
                <Card>
                    { isLoading ? <Loader /> : (
                        <>
                            { listCount === 0 ? (
                                <p>{ t( T_SERVER_LIST_VIEW_NO_RESULTS_FOUND ) }</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableHeaderColumn>{ t( T_SERVER_LIST_VIEW_TABLE_NAME_LABEL ) }</TableHeaderColumn>
                                        <TableHeaderColumn>{ t( T_SERVER_LIST_VIEW_TABLE_STATUS_LABEL ) }</TableHeaderColumn>
                                        <TableHeaderColumn>{ t( T_SERVER_LIST_VIEW_TABLE_ACTIONS_LABEL ) }</TableHeaderColumn>
                                    </TableHeader>
                                    <TableBody>{ map(
                                        list,
                                        ( item : ServerDTO ) => {
                                            const name = item?.name;
                                            const itemClick = () => onItemClick( name );
                                            return (
                                                <TableRow
                                                    key={ `inventory-${ name }` }
                                                    click={ itemClick }
                                                >
                                                    <TextColumn value={ name } />
                                                    <TextColumn value={ item?.status } />
                                                    <TableColumn>
                                                        <Button
                                                            click={ itemClick }
                                                            style={ ButtonStyle.SECONDARY }
                                                        >{ t( T_COMMON_OPEN ) }</Button>
                                                    </TableColumn>
                                                </TableRow>
                                            );
                                        },
                                    ) }
                                    </TableBody>
                                </Table>
                            ) }
                        </>
                    ) }</Card>
            </div>

            <Button
                click={ onDeployClick }
                style={ ButtonStyle.PRIMARY }
            >{ t( T_SERVER_LIST_VIEW_ADD_BUTTON_LABEL ) }</Button>

        </div>
    );
}
