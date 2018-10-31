import {ReacticComponentProps} from "./ReacticComponent";
import StatelessReacticComponent from "./StatelessReacticComponent";

export interface LoadingComponentProps extends ReacticComponentProps {

}

abstract class LoadingComponent<P extends LoadingComponentProps> extends StatelessReacticComponent<P> {

    renderReacticComponent(reacticsearch) {
        if (reacticsearch.state.loading) {
            return this.renderLoading();
        }
        return null;
    }

    abstract renderLoading(): React.ReactNode ;

}

export default LoadingComponent;
