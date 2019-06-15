import * as React from 'react';
import ReacticSearch from '../ReacticSearch';
import TextFilter from "./TextFilter";
import TableResult from "./TableResult";
import Pagination from "./Pagination";
import Sort, {SortItem} from "./Sort";
import ResultInfo from "./ResultInfo";
import TermsAggregation from "./TermsAggregation";
import BooleanFilter from "./BooleanFilter";
import SelectedFilters from "./SelectedFilters";
import Loading from "./Loading";
import Error from "./Error";
import Indices from "./Indices";
import NodeInfo from "./NodeInfo";
import InlineQueryComponent from "../InlineQueryComponent";
import InlineDocumentComponent from "../InlineDocumentComponent";
import ElasticsearchComponent from "../ElasticsearchComponent";

const SORTS = [
    new SortItem('Relevance', undefined),
    new SortItem('Newest', {
        timestamp: 'desc'
    }),
    new SortItem('Oldest', {
        timestamp: 'asc'
    }),
];

interface ExampleState {
    host: string
    index?: string,
    type?: string,
    fields: object,
    aggregationField: string,
    documentId?: string
}

const FILTERS = {
    text: field => {
        var label = field.substr(0, 1).toUpperCase() + field.substr(1, field.length - 1).toLowerCase();
        return (
            <TextFilter key={field} field={field} id={field} label={label}/>
        );
    },
    boolean: field => {
        var label = field.substr(0, 1).toUpperCase() + field.substr(1, field.length - 1).toLowerCase();
        return (
            <BooleanFilter key={field} field={field} id={field} label={label}/>
        );
    },
    object: field => {
        return <div>{field}: no supported filters</div>
    }
};

const MATCH_ALL_QUERY = {match_all: {}};

class Example extends React.Component<object, ExampleState> {

    reacticsearch: any;

    constructor(props) {
        super(props);

        this.state = {
            host: window.location.host,
            index: undefined,
            type: undefined,
            fields: {},
            aggregationField: '',
            documentId: undefined,
        };

        // Log Elasticsearch requests
        ElasticsearchComponent.defaultProps.onRequest = (params, options) => {
            console.log('Elasticsearch request:', params, options);
        };

        // Set Elasticsearch request headers
        ElasticsearchComponent.defaultProps.requestHeaders = {Authorization: 'password'};
    }

    getFields() {
        var fields = {};

        Object.keys(this.state.fields).filter(key => this.state.fields[key].enabled)
            .forEach(key => fields[key] = this.state.fields[key]);

        return fields;
    }

    render() {
        var fields = this.getFields();
        return (
            <div>
                <h1>Host</h1>
                <input value={this.state.host} onChange={event => {
                    this.setState({host: event.currentTarget.value});
                }}/>
                <br/>
                <NodeInfo host={this.state.host}/>
                <div>
                    Index/Type
                    <br/>
                    <Indices host={this.state.host} onSelect={(index, type, fields) => {
                        var textAggregationField;

                        var keys = Object.keys(fields);
                        textAggregationField = keys.filter(field => {
                            return fields[field].type === 'text'
                        })[0];

                        for (let i = 0; i < Math.min(keys.length, 5); i++) {
                            fields[keys[i]].enabled = true;
                        }

                        this.setState({
                            index,
                            type,
                            fields,
                            aggregationField: textAggregationField
                        }, () => {
                            this.reacticsearch.update();
                        });
                    }}/>
                </div>
                <br/>
                {
                    this.state.index && this.state.type &&
                    <ReacticSearch
                        ref={reacticsearch => this.reacticsearch = reacticsearch}
                        index={this.state.index}
                        type={this.state.type}
                        debug
                        beforeSearch={body => {
                            // one can modify the body here when needed
                        }}
                    >
                        reacticsearch-example
                        <Loading size={100} style={{
                            position: 'fixed',
                            top: 0,
                            left: 0
                        }}/>
                        <Loading size={100} style={{
                            position: 'fixed',
                            top: 0,
                            right: 0
                        }}/>
                        <Error id="error"/>

                        <>
                            <h1>
                                Filters
                            </h1>
                            Selected filters
                            <SelectedFilters id="selectedFilters"/>
                            <TextFilter id="quickSearch" label="Quick search (searches in all fields)" field=""
                                        customQuery={function (value) {
                                            if (value.length === 0) {
                                                return null;
                                            }
                                            return {
                                                simple_query_string: {
                                                    query: value + (value.endsWith('*') ? '' : '*')
                                                }
                                            };
                                        }}/>
                            {
                                Object.keys(this.state.fields).map(fieldKey => {
                                    return (
                                        <React.Fragment key={fieldKey}>
                                            <input
                                                type="checkbox"
                                                checked={this.state.fields[fieldKey].enabled}
                                                onChange={event => {
                                                    this.state.fields[fieldKey].enabled = !this.state.fields[fieldKey].enabled;
                                                    this.setState({fields: this.state.fields});
                                                }}
                                            />
                                            {fieldKey}
                                        </React.Fragment>
                                    );
                                })
                            }
                            {
                                Object.keys(fields).map(key => {
                                    var field = fields[key];

                                    var filterFunction = FILTERS[field.type];

                                    if (filterFunction) {
                                        return filterFunction(key);
                                    }

                                    return FILTERS.text(key);
                                })
                            }
                        </>

                        <div style={{float: 'right'}}>
                            <h1>
                                Sort
                            </h1>
                            <Sort id="sort" values={SORTS}/>
                        </div>

                        <>
                            <h1>
                                Result Info
                            </h1>
                            <ResultInfo id="resultInfo"/>
                        </>

                        <>
                            <h1>
                                Inline Query Example
                            </h1>
                            {JSON.stringify(MATCH_ALL_QUERY)}
                            <InlineQueryComponent
                                id="inlineQueryExample"
                                getQuery={() => {
                                    return MATCH_ALL_QUERY
                                }}
                            />
                        </>

                        <>
                            <h1>
                                Aggregation
                            </h1>
                            <select defaultValue={this.state.aggregationField} onChange={event => {
                                var field = event.target.value;

                                this.setState({aggregationField: field}, function () {
                                    this.reacticsearch.update()
                                })
                            }}>
                                {
                                    Object.keys(this.state.fields).map(field => {
                                        return <option value={field}>{field}</option>
                                    })
                                }
                            </select>
                            <TermsAggregation id={'aggregation' + this.state.aggregationField}
                                              name={this.state.aggregationField}/>
                        </>

                        <>
                            <h1>
                                Results
                            </h1>
                            <hr/>
                            <Pagination id="topPagination" style={{textAlign: 'center'}}/>

                            <TableResult
                                id="result"
                                fields={fields}
                                onClickRow={row => {
                                    this.setState({documentId: row._id});
                                }}
                            />

                            <h1>
                                Document view: {this.state.documentId!}
                            </h1>
                            <InlineDocumentComponent
                                index={this.state.index}
                                type={this.state.type}
                                documentId={this.state.documentId!}
                                renderDocument={document => JSON.stringify(document)}
                                renderNotFound={() => this.state.documentId! + ' not FOUND!'}
                            />

                            <Pagination id="bottomPagination" style={{textAlign: 'center'}}/>
                            <hr/>
                        </>

                    </ReacticSearch>
                }
            </div>
        );
    }
}

export default Example;
