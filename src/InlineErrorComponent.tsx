import ErrorComponent from "./ErrorComponent";
import {ReacticComponentProps} from "./ReacticComponent";

export interface InlineErrorComponentProps extends ReacticComponentProps {
    renderError: (error: any) => React.ReactNode;
}

abstract class InlineErrorComponent extends ErrorComponent<InlineErrorComponentProps> {

    constructor(props) {
        super(props);

        this.renderError = props.renderError;
    }

}

export default InlineErrorComponent;
