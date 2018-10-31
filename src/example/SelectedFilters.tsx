import * as React from 'react';

import {ReacticComponentProps} from "../ReacticComponent";
import Filter, {FilterProps} from "./Filter";
import StatelessReacticComponent from "../StatelessReacticComponent";
import {FilterComponentState} from "../FilterComponent";

class SelectedFilters extends StatelessReacticComponent<ReacticComponentProps> {

    renderReacticComponent() {
        var filters = this.reacticsearch.getComponents<FilterProps, FilterComponentState, Filter<FilterProps, FilterComponentState>>(Filter)
            .filter(filter => !filter.isDefaultValue());

        return (
            <React.Fragment>
                {
                    filters.map((filter, index) => {
                        return (
                            <div key={index} style={{display: 'inline', backgroundColor: 'lightgrey'}}>
                                {filter.props.label + ': ' + JSON.stringify(filter.getValue()) + ' '}
                                <button onClick={event => filter.reset()}>X</button>
                            </div>
                        );
                    })
                }
            </React.Fragment>
        );
    }

}

export default SelectedFilters;
