import * as React from "react";

import ElasticsearchComponent, {
    ElasticsearchComponentProps,
    ElasticsearchComponentState
} from "../ElasticsearchComponent";

interface IndicesProps extends ElasticsearchComponentProps {
    onSelect: (index: string, type: string, mappings: []) => void;
}

type Item = { index: string, type: string, mapping: object };

class Indices extends ElasticsearchComponent<IndicesProps, ElasticsearchComponentState> {

    request(): Promise<any> {
        return this.client.indices.get({index: '_all'});
    }

    render() {
        if (!this.state.result) {
            return null;
        }

        var items: Item[] = [];

        Object.keys(this.state.result).forEach(index => {

            Object.keys(this.state.result[index].mappings).forEach(mappingKey => {
                items.push({
                    index: index,
                    type: mappingKey,
                    mapping: this.state.result[index].mappings[mappingKey].properties
                })
            });
        });

        return (
            <select onChange={event => {
                var item = items[event.target.value];

                if (item) {
                    this.props.onSelect(item.index, item.type, item.mapping);
                }
            }}>
                <option selected/>
                {
                    items.map((item, index) => {
                        return (
                            <option key={index} value={index}>
                                {item.index + '/' + item.type}
                            </option>
                        );
                    })
                }
            </select>
        )
    }

}

export default Indices;
