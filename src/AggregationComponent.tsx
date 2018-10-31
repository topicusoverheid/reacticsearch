import ResultComponent, {ResultComponentProps} from "./ResultComponent";
import * as PropTypes from "prop-types";
import {ReacticComponentState} from "./ReacticComponent";

export interface AggregationComponentProps extends ResultComponentProps {
    name: string
}

abstract class AggregationComponent<P extends AggregationComponentProps> extends ResultComponent<P, ReacticComponentState> {

    renderResult(result) {
        var aggregation = result.aggregations[this.props.name];

        if (!aggregation) {
            return 'Aggration error: ' + this.props.name;
        }

        return this.renderAggregation(aggregation)
    }

    abstract renderAggregation(aggregation): React.ReactNode

    abstract getAggregation(): object

}

export default AggregationComponent;
