import LoadingComponent, {LoadingComponentProps} from "./LoadingComponent";

interface InlineLoadingComponentProps extends LoadingComponentProps {
    renderLoading: () => React.ReactNode,
}

abstract class InlineLoadingComponent extends LoadingComponent<InlineLoadingComponentProps> {

    constructor(props) {
        super(props);

        this.renderLoading = props.renderLoading;
    }

}

export default InlineLoadingComponent;
