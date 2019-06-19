import {Client, ConfigOptions} from "elasticsearch-browser";
import {OutgoingHttpHeaders} from "http";

export default class ElasticsearchClient extends Client {

    constructor(configOptions: ConfigOptions, onRequest?: (params: object, options: object) => void, requestHeaders?: OutgoingHttpHeaders) {
        super(configOptions);

        // @ts-ignore
        const requestFunction = this.transport.request;
        // @ts-ignore
        this.transport.request = (params, options, cb) => {
            if (requestHeaders) {
                params.headers = requestHeaders;
            }
            onRequest && onRequest(params, options);
            // @ts-ignore
            return requestFunction.bind(this.transport)(params, options, cb);
        };
    }

}