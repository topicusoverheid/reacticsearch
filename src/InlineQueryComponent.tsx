import QueryComponent, {QueryComponentProps, QueryComponentState, QueryType} from "./QueryComponent";
import ReacticSearch from "./ReacticSearch";

interface InlineQueryComponentProps extends QueryComponentProps {
    getQuery: () => QueryType
}

abstract class InlineQueryComponent extends QueryComponent<InlineQueryComponentProps, QueryComponentState> {

    constructor(props) {
        super(props);

        this.getQuery = props.getQuery;
    }

    renderReacticComponent(reacticsearch: ReacticSearch<any, any>) {
        return null;
    }

}

export default InlineQueryComponent;
