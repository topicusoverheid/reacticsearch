import * as React from "react";

import ElasticsearchComponent, {
    ElasticsearchComponentProps,
    ElasticsearchComponentState
} from "./ElasticsearchComponent";
import DocumentComponent, {DocumentComponentProps} from "./DocumentComponent";
import {ReacticComponentState} from "./ReacticComponent";

export interface InlineDocumentComponentProps extends DocumentComponentProps {
    renderDocument: (document: object) => React.ReactNode,
    renderNotFound: () => React.ReactNode
}

abstract class InlineDocumentComponent extends DocumentComponent<InlineDocumentComponentProps, ElasticsearchComponentState> {

    constructor(props) {
        super(props);

        this.renderDocument = props.renderDocument;
        this.renderNotFound = props.renderNotFound;
    }

}

export default InlineDocumentComponent;
