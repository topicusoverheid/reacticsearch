import * as React from 'react';
import Filter, {FilterProps} from "./Filter";

class TextFilter extends Filter<FilterProps, string> {

    getDefaultValue() {
        return '';
    }

    renderInput(value) {
        return (
            <input type="search" value={value} onChange={event => this.setValue(event.target.value)}/>
        );
    }

    provideQuery(value: string) {
        if (!this.isDefaultValue()) {
            return {
                match: {
                    [this.props.field]: value
                }
            }
        }
        return null;
    }

}

export default TextFilter;
