import * as  React from 'react';
import {ReacticComponentState} from "./ReacticComponent";
import * as qs from 'qs';
import validator from 'validator';
import QueryComponent, {QueryComponentProps} from "./QueryComponent";

const deepEqual = require('deep-equal');

const DEBOUNCE = 500;

type QueryType = object | null;

export interface FilterComponentProps extends QueryComponentProps {
    field: string | string[] | any,
    defaultQuery?: () => QueryType,
    customQuery?: (value: any) => QueryType,
    URLParams?: boolean,
    debounce?: number
}

export type FilterValue = any;

export interface FilterComponentState extends ReacticComponentState {
    value: FilterValue
}

abstract class FilterComponent<P extends FilterComponentProps, FV extends FilterValue> extends QueryComponent<P, FilterComponentState> {

    public static defaultProps: Partial<FilterComponentProps> = {
        URLParams: true,
        debounce: DEBOUNCE,
    };

    private debounceTimeout: NodeJS.Timer;

    constructor(props) {
        super(props);

        var value = this.getDefaultValue();

        if (this.props.URLParams) {
            var search = qs.parse(window.location.search, {ignoreQueryPrefix: true});

            var paramValue = search[this.props.id];

            if (paramValue) {
                if (typeof paramValue === 'string' && validator.isJSON(paramValue)) {
                    value = JSON.parse(paramValue);
                } else if (typeof paramValue === 'string' && paramValue.startsWith('"') && paramValue.endsWith('"')) {
                    value = paramValue.substr(1, paramValue.length - 2);
                } else if (validator.isBoolean(paramValue)) {
                    value = paramValue === 'true';
                }
            }
        }

        this.state = {
            value: value
        };
    }

    protected renderReacticComponent(reacticsearch) {
        return this.renderFilter(this.state.value);
    }

    abstract getDefaultValue()

    abstract provideQuery(value: FV): QueryType

    getQuery() {
        var value = this.state.value;

        var query: QueryType;
        if (this.isDefaultValue() && this.props.defaultQuery) {
            query = this.props.defaultQuery();
        } else if (this.props.customQuery) {
            query = this.props.customQuery(value);
        } else {
            query = this.provideQuery(value)
        }

        return query;
    }

    setValue(value: FV, updateImmediately = false, callback?: () => void) {
        clearTimeout(this.debounceTimeout);
        this.setState({value: value}, function () {
            if (updateImmediately) {
                this.setValueImpl(value);
            } else {
                this.debounceTimeout = setTimeout(this.setValueImpl.bind(this, value), this.props.debounce);
            }
            if (callback) {
                callback();
            }
        });
    }

    getValue() {
        return this.state.value;
    }

    setValueImpl(value: FilterValue) {
        var params = {};

        this.reacticsearch.getComponents<FilterComponentProps, FilterComponentState, FilterComponent<FilterComponentProps, FilterComponentState>>(FilterComponent)
            .filter(filter => !filter.isDefaultValue())
            .forEach(filter => {
                params[filter.props.id] = JSON.stringify(filter.getValue());
            });

        if (Object.keys(params).length > 0) {
            var baseUrl = window.location.href.replace(window.location.search, '');
            var search = qs.stringify(params, {encode: false});

            var searchUrl = baseUrl + '?' + search;
            window.history.pushState(null, '', searchUrl);
        } else {
            window.history.pushState(null, '', window.location.href.split('?')[0]);
        }

        this.reacticsearch.update();
    }

    isDefaultValue(): boolean {
        var defaultValue = this.getDefaultValue();
        if (this.state.value === defaultValue) {
            return true;
        }
        return deepEqual(this.state.value, defaultValue);
    }

    reset() {
        this.setValue(this.getDefaultValue(), true);
    }

    abstract renderFilter(value: FilterValue): React.ReactNode ;

}

export default FilterComponent;
