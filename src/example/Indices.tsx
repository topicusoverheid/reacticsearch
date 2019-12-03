import * as React from "react";

import ElasticsearchComponent, {
    ElasticsearchComponentProps,
    ElasticsearchComponentState
} from "../ElasticsearchComponent";

interface IndicesProps extends ElasticsearchComponentProps {
    onSelect: (index: string, type: string, mappings: []) => void;
}

export type Item = { index: string, mapping: object };

class Indices extends ElasticsearchComponent<IndicesProps, ElasticsearchComponentState> {

    request(client, props): Promise<any> {
        return client.indices.getMapping();
    }

    renderElasticsearchComponent() {
        if (!this.state.result) {
            return null;
        }

        const items: Item[] = Object.keys(this.state.result).map(index => {
            return {
                index: index,
                mapping: this.state.result[index].mappings.properties
            };
        });

        return (
            <select onChange={event => {
                var item = items[event.target.value];

                if (item) {
                    this.props.onSelect(item.index, item.type, item.mapping);
                } else {
                    this.props.onSelect(undefined, undefined, undefined);
                }
            }}>
                <option selected/>
                {
                    items.map((item, index) => {
                        return (
                            <option key={index} value={index}>
                                {item.index}
                            </option>
                        );
                    })
                }
            </select>
        )
    }

}

export default Indices;
