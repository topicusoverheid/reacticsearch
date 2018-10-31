import * as React from 'react';
import Filter, {FilterProps} from "./Filter";

type BooleanFilterValue = boolean | any ;

class BooleanFilter extends Filter<FilterProps, BooleanFilterValue> {

    getDefaultValue(): BooleanFilterValue {
        return null;
    }

    renderInput(value) {
        return (
            <input type="checkbox"
                   ref={checkbox => checkbox && (checkbox.indeterminate = value === null)}
                   checked={this.state.value === true}
                   onChange={event => {
                       switch (value) {
                           case true:
                               value = false;
                               break;
                           case false:
                               value = null;
                               break;
                           case null:
                               value = true;
                               break;
                       }

                       event.target.indeterminate = value === null;
                       this.setValue(value, true);
                   }}
            />
        );
    }

    provideQuery(value: BooleanFilterValue) {
        if (value === null) {
            return null;
        }
        return {
            term: {
                [this.props.field]: value
            }
        }
    }

}

export default BooleanFilter;
