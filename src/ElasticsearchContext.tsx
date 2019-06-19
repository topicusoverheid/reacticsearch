import * as React from "react";
import {OutgoingHttpHeaders} from "http";

export interface ElasticsearchConfig {
    host: string,
    requestHeaders: OutgoingHttpHeaders,
}

const ElasticsearchContext = React.createContext<ElasticsearchConfig>({host: 'http://localhost:9200', requestHeaders: {}});

export default ElasticsearchContext;