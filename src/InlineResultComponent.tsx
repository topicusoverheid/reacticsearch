import ResultComponent, {ResultComponentProps} from "./ResultComponent";
import {ReacticComponentState} from "./ReacticComponent";

interface InlineResultComponentProps extends ResultComponentProps {
    renderResult: (result: any) => React.ReactNode,
}

abstract class InlineResultComponent extends ResultComponent<InlineResultComponentProps, ReacticComponentState> {

    constructor(props) {
        super(props);

        this.renderResult = props.renderResult;
    }

}

export default InlineResultComponent;
