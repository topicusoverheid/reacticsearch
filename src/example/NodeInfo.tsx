import * as React from "react";

import ElasticsearchComponent, {
    ElasticsearchComponentProps,
    ElasticsearchComponentState
} from "../ElasticsearchComponent";

class NodeInfo extends ElasticsearchComponent<ElasticsearchComponentProps, ElasticsearchComponentState> {

    request(): Promise<any> {
        return this.client.info();
    }

    render() {
        if (!this.state.result) {
            return null;
        }

        return JSON.stringify(this.state.result);
    }

}

export default NodeInfo;
