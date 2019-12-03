import * as React from "react";

import ElasticsearchComponent, {
    ElasticsearchComponentProps,
    ElasticsearchComponentState
} from "./ElasticsearchComponent";

export interface DocumentComponentProps extends ElasticsearchComponentProps {
    index: string,
    documentId: string,
}

abstract class DocumentComponent<P extends DocumentComponentProps, S extends ElasticsearchComponentState> extends ElasticsearchComponent<P, S> {

    componentWillReceiveProps(nextProps) {
        if (nextProps.documentId !== this.props.documentId) {
            this.update(nextProps);
        }
    }

    request(client, props): Promise<any> {
        return client.get({index: props.index, type: props.type, id: props.documentId});
    }

    renderElasticsearchComponent() {
        var result = this.state.result;

        if (result) {
            if (result.found) {
                return this.renderDocument(result._source);
            } else {
                return this.renderNotFound();
            }
        }

        return null;
    }

    abstract renderDocument(document: object): React.ReactNode;

    abstract renderNotFound(): React.ReactNode;

}

export default DocumentComponent;
