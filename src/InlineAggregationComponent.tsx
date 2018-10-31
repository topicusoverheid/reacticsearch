import AggregationComponent, {AggregationComponentProps} from "./AggregationComponent";

interface InlineAggregationComponentProps extends AggregationComponentProps {
    renderAggregation: (aggregation: object) => React.ReactNode,
    getAggregation: () => object,
}

abstract class InlineAggregationComponent extends AggregationComponent<InlineAggregationComponentProps> {

    constructor(props) {
        super(props);

        this.renderAggregation = this.props.renderAggregation;
        this.getAggregation = this.props.getAggregation;
    }

}

export default InlineAggregationComponent;
