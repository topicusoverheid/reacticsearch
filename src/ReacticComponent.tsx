import * as React from "react";
import ReacticContext from './ReacticContext';
import ReacticSearch from "./ReacticSearch";

export interface ReacticComponentProps {
    id: string,
    style?: React.CSSProperties,
    children?: React.ReactNode
}

export interface ReacticComponentState {

}

abstract class ReacticComponent<P extends ReacticComponentProps, S extends ReacticComponentState> extends React.Component<P, S> {

    reacticsearch: ReacticSearch<any, any>;

    render() {
        return (
            <div style={this.props.style}>
                <ReacticContext.Consumer>
                    {
                        (context) => {
                            if (!context || !context.reacticsearch) {
                                return (
                                    <div>
                                        ReacticComponents need to be inside of a ReacticSearch component
                                        ID: {this.props.id}
                                    </div>
                                );
                            }
                            var reacticsearch = context.reacticsearch;

                            if (reacticsearch.components.indexOf(this) === -1) {
                                this.reacticsearch = reacticsearch;
                                reacticsearch.components.push(this);
                            }

                            return this.renderReacticComponent(reacticsearch);
                        }
                    }
                </ReacticContext.Consumer>
            </div>
        );
    }

    protected abstract renderReacticComponent(reacticsearch: ReacticSearch<any, any>);

}

export default ReacticComponent;
