import * as  React from 'react';
import ReacticComponent, {ReacticComponentProps, ReacticComponentState} from "./ReacticComponent";

export type QueryType = object | null | undefined;

export interface QueryComponentProps extends ReacticComponentProps {
}

export interface QueryComponentState extends ReacticComponentState {
}

abstract class QueryComponent<P extends QueryComponentProps, S extends QueryComponentState> extends ReacticComponent<P, S> {

    abstract getQuery(): QueryType

}

export default QueryComponent;
