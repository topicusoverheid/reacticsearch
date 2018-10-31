import * as React from 'react';
import FilterComponent, {FilterComponentProps, FilterValue} from '../FilterComponent';

export interface FilterProps extends FilterComponentProps {
    label: string
}

abstract class Filter<P extends FilterProps, FV extends FilterValue> extends FilterComponent<P, FV> {

    renderFilter(value: FV): React.ReactNode {
        return (
            <div>
                {this.props.label}
                <br/>
                {
                    this.renderInput(value)
                }
            </div>
        );
    }

    abstract renderInput(value: FV): React.ReactNode

}

export default Filter;
