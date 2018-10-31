import ReacticComponent, {ReacticComponentProps, ReacticComponentState} from "./ReacticComponent";
import StatelessReacticComponent from "./StatelessReacticComponent";

export interface ErrorComponentProps extends ReacticComponentProps {

}

abstract class ErrorComponent<P extends ErrorComponentProps> extends StatelessReacticComponent<P> {

    renderReacticComponent(reacticsearch): React.ReactNode {
        if (reacticsearch.state.error) {
            return this.renderError(reacticsearch.state.error);
        }
        return null;
    }

    abstract renderError(error): React.ReactNode

}

export default ErrorComponent;
