import * as React from "react";

import ElasticsearchComponent, {
    ElasticsearchComponentProps,
    ElasticsearchComponentState
} from "./ElasticsearchComponent";

export interface DocumentComponentProps extends ElasticsearchComponentProps {
    index: string,
    type: string,
    documentId: string,
}

abstract class DocumentComponent<P extends DocumentComponentProps, S extends ElasticsearchComponentState> extends ElasticsearchComponent<P, S> {

    componentWillReceiveProps(nextProps) {
        if (nextProps.documentId !== this.props.documentId) {
            this.update(nextProps);
        }
    }

    request(props): Promise<any> {
        return this.client.get({index: props.index, type: props.type, id: props.documentId});
    }

    render() {
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
