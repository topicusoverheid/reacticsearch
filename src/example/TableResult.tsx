import * as React from 'react';

import * as PropTypes from 'prop-types';
import ResultComponent, {ResultComponentProps} from "../ResultComponent";
import {ReacticComponentState} from "../ReacticComponent";
import {ReactNode} from "react";

const ASC = 'asc';
const DESC = 'desc';

interface TableResultProps extends ResultComponentProps {
    fields: object,
    onClickRow: (row: any) => void
}

class TableResult<P extends TableResultProps> extends ResultComponent<P, ReacticComponentState> {

    renderResult(result) {
        var hits = result.hits.hits;

        if (hits.length === 0) {
            return <div>No results for query: {JSON.stringify(this.reacticsearch.getBody().query, null, 4)}</div>
        }

        var fields = this.props.fields;

        return (
            <div>
                <table style={{border: 1}}>
                    <tbody>
                    <tr>
                        {
                            Object.keys(fields).map(key => {
                                var field = fields[key];
                                var sortKey = key;

                                if (!field.type || field.type === 'object') {
                                    return <th key={key}>{key}</th>
                                }

                                if (field.type === 'text') {
                                    sortKey = key + '.keyword';
                                }

                                var sort = this.reacticsearch.state.sort;
                                var order = DESC;

                                if (sort) {
                                    order = sort[sortKey] === ASC ? DESC : ASC;
                                }

                                var arrow = order === ASC ? '↑' : '↓';

                                return (
                                    <th onClick={event => {
                                        this.reacticsearch.setSort({[sortKey]: order});
                                    }} key={key}>{key} : {fields[key].type} {arrow}</th>
                                );
                            })
                        }
                    </tr>
                    {
                        hits.map((hit, index) =>
                            <tr key={index} onClick={event => this.props.onClickRow(hit)}>
                                {
                                    Object.keys(fields).map(key => <td
                                        key={key}>{this.renderValue(hit._source[key])}</td>)
                                }
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        );
    }

    private renderValue(value): React.ReactNode {
        if (typeof value === 'boolean') {
            return <input type="checkbox" disabled checked={value}/>
        }
        return JSON.stringify(value);
    }
}

export default TableResult;
