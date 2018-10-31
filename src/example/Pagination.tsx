import *as React from 'react';

import {ReacticComponentProps} from "../ReacticComponent";
import ReacticSearch from "../ReacticSearch";
import StatelessReacticComponent from "../StatelessReacticComponent";

const PAGE_SIZES = [1, 5, 10, 15, 20, 50];

export interface PaginationProps extends ReacticComponentProps {

}

class Pagination extends StatelessReacticComponent<PaginationProps> {

    renderReacticComponent(reacticsearch: ReacticSearch<any, any>) {
        var total = 0;
        var maxPages = 0;

        if (reacticsearch.state.result) {
            total = reacticsearch.state.result.hits.total;

            maxPages = parseInt('' + (total / reacticsearch.state.pageSize));
        }

        return (
            <div>
                <button disabled={reacticsearch.state.page === 0} type="button" onClick={event => {
                    reacticsearch.setPage(0)
                }}>
                    {
                        '<<'
                    }
                </button>
                <button disabled={reacticsearch.state.page === 0} type="button" onClick={event => {
                    reacticsearch.setPage(reacticsearch.state.page - 1)
                }}>
                    {
                        '<'
                    }
                </button>
                <input value={reacticsearch.state.page} type="number" onChange={event => {
                    var page = parseInt(event.target.value);

                    if (!isNaN(page)) {
                        reacticsearch.setPage(page);
                    }
                }}/>
                <select value={reacticsearch.state.pageSize} onChange={event => {
                    reacticsearch.setPage(0);
                    reacticsearch.setPageSize(event.target.value);
                }}>
                    {PAGE_SIZES.map(pageSize => {
                        return (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        );
                    })}
                </select>
                <button disabled={reacticsearch.state.page === maxPages} type="button" onClick={event => {
                    reacticsearch.setPage(reacticsearch.state.page + 1)
                }}>
                    {
                        '>'
                    }
                </button>
                <button disabled={reacticsearch.state.page === maxPages} type="button" onClick={event => {
                    reacticsearch.setPage(maxPages)
                }}>
                    {
                        '>>'
                    }
                </button>
            </div>
        );
    }

}

export default Pagination;
