import * as React from 'react';

import ReacticContext from './ReacticContext';
import FilterComponent, {FilterComponentProps, FilterValue} from "./FilterComponent";
import AggregationComponent, {AggregationComponentProps} from "./AggregationComponent";
import ReacticComponent, {ReacticComponentProps, ReacticComponentState} from "./ReacticComponent";
import ElasticsearchComponent, {
    ElasticsearchComponentProps,
    ElasticsearchComponentState
} from "./ElasticsearchComponent";
import QueryComponent, {QueryComponentProps, QueryComponentState} from "./QueryComponent";

// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html#query-dsl-bool-query
enum Occur {
    MUST = 'must',
    FILTER = 'filter',
    SHOULD = 'should',
    MUST_NOT = 'must_not'
}

export interface ReacticSearchProps extends ElasticsearchComponentProps {
    debug?: boolean,
    children?: React.ReactNode,

    // es options
    index: string,

    beforeSearch?: (body) => void

    // query options
    occur?: Occur,
    defaultQuery?: () => object,
    defaultSort?: object
}

export interface ReacticSearchState extends ElasticsearchComponentState {
    page: number,
    pageSize: number,
    sort: number
}

class ReacticSearch<P extends ReacticSearchProps, S extends ReacticSearchState> extends ElasticsearchComponent<P, S> {

    public static defaultProps: Partial<ReacticSearchProps> = {
        ...ElasticsearchComponent.defaultProps,
        occur: Occur.MUST,
    };

    components: ReacticComponent<any, any>[] = [];

    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state, {
            // body
            page: 0,
            pageSize: 10,
            sort: props.defaultSort
        });
    }

    // ES search request

    request(client, props) {
        var body = this.getBody();

        if (props.beforeSearch) {
            props.beforeSearch(body);
        }

        return client.search({
            index: props.index,
            body: body
        });
    }

    getBody(): any {
        return {
            query: this.getQuery(),
            aggs: this.getAggregations(),
            size: this.state.pageSize,
            from: this.state.page * this.state.pageSize,
            sort: this.state.sort
        };
    }

    getAggregations() {
        var aggregations = {};
        this.getComponents<AggregationComponentProps, ReacticComponentState, AggregationComponent<AggregationComponentProps>>(AggregationComponent)
            .forEach(component => {
                var name = component.props.name;
                var aggregation = component.getAggregation();

                aggregations[name] = aggregation;
            });

        return aggregations;
    }

    getQuery() {
        var queries = this.getComponents<QueryComponentProps, QueryComponentState, QueryComponent<QueryComponentProps, QueryComponentState>>(QueryComponent)
            .map(component => component.getQuery())
            .filter(query => query !== undefined && query !== null);

        if (queries.length === 0) {
            if (this.props.defaultQuery) {
                return this.props.defaultQuery();
            }
            return {
                match_all: {}
            };
        }

        // if there is just one query return it
        // otherwise it will becoma an unnceccary bool query with just one query...
        if (queries.length === 1) {
            return queries[0];
        }

        return {
            bool: {
                [this.props.occur!.toString()]: queries
            }
        }
    }

    // end ES search request

    getComponents<P extends ReacticComponentProps, S extends ReacticComponentState, T extends ReacticComponent<P, S>>(type): T[] {
        // @ts-ignore
        return this.components.filter(component => {
            return component instanceof type;
        });
    }

    renderElasticsearchComponent() {
        return (
            <ReacticContext.Provider value={{reacticsearch: this}}>
                {
                    this.props.debug &&
                    <div>
                        Body:
                        {
                            JSON.stringify(this.getBody())
                        }
                        <br/>
                        <br/>
                        State:
                        {
                            JSON.stringify(Object.assign({}, this.state, {result: undefined}))
                        }
                    </div>
                }
                {this.props.children}
            </ReacticContext.Provider>
        );
    }

    // controller methods

    setPage(page) {
        if (page < 0) {
            throw new Error('page cant be lower than 0')
        }
        this.setState({page: page}, this.update);
    }

    setPageSize(pageSize) {
        if (pageSize < 1) {
            throw new Error('pageSize cant be lower than 1')
        }
        this.setState({pageSize: pageSize}, this.update);
    }

    setSort(sort) {
        this.setState({sort: sort}, this.update);
    }

    // end methods

}

export default ReacticSearch;
