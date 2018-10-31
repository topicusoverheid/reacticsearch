import *as React from "react";
import ReacticComponent, {ReacticComponentProps} from "../ReacticComponent";
import ReacticSearch from "../ReacticSearch";
import StatelessReacticComponent from "../StatelessReacticComponent";

export class SortItem {

    label: string;
    sort?: object;

    constructor(label: string, sort?: object) {
        this.label = label;
        this.sort = sort;
    }
}

interface SortProps extends ReacticComponentProps {
    values: SortItem[]
}

class Sort extends StatelessReacticComponent<SortProps> {

    renderReacticComponent(reacticsearch: ReacticSearch<any, any>) {
        return (
            <select
                defaultValue={this.props.values[0].label}
                onChange={event => reacticsearch.setSort(this.props.values[event.target.value].sort)}
            >
                {
                    this.props.values.map((item, index) => {
                        return (
                            <option key={item.label} value={index}>
                                {item.label}
                            </option>
                        );
                    })
                }
            </select>
        );
    }

}

export default Sort;
