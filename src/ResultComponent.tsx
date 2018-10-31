import * as React from 'react';

import ReacticComponent, {ReacticComponentProps, ReacticComponentState} from "./ReacticComponent";

export interface ResultComponentProps extends ReacticComponentProps {

}

abstract class ResultComponent<P extends ResultComponentProps, S extends ReacticComponentState> extends ReacticComponent<P, ReacticComponentState> {

    renderReacticComponent(reacticsearch) {
        return reacticsearch.state.result && this.renderResult(reacticsearch.state.result);
    }

    abstract renderResult(result): React.ReactNode

}

export default ResultComponent;
