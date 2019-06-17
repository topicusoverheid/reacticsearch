import * as React from "react";

import {Client, ConfigOptions} from "elasticsearch-browser";
import {OutgoingHttpHeaders} from "http";

export interface ElasticsearchComponentProps {
    host: string,
    // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/configuration.html#config-options
    clientProps?: ConfigOptions,
    requestHeaders?: OutgoingHttpHeaders,
    onRequest?: (params: object, options: object) => void,
    onResult?: (result: any) => void,
    onError?: (error: any) => void,
    onLoadingChange?: (loading: boolean) => void,
}

export interface ElasticsearchComponentState {
    loading: boolean,
    error?: any,
    result?: any
}

abstract class ElasticsearchComponent<P extends ElasticsearchComponentProps, S extends ElasticsearchComponentState> extends React.PureComponent<P, S> {

    public static defaultProps: Partial<ElasticsearchComponentProps> = {
        host: 'localhost:9200',
    };

    protected client: Client;

    constructor(props) {
        super(props);

        // @ts-ignore
        this.state = {
            loading: false,
            error: undefined,
            result: undefined,
        };

        this.client = this.createClient();
    }

    protected createClient(props : P = this.props): Client {
        const client = new Client(
            {
                // @ts-ignore
                ...props.clientProps,
                host: props.host,
            }
        );

        const requestFunction = client.transport.request;
        client.transport.request = (params, options, cb) => {
            if (props.requestHeaders) {
                params.headers = props.requestHeaders;
            }
            props.onRequest && props.onRequest(params, options);
            return requestFunction.bind(client.transport)(params, options, cb);
        };

        return client;
    }

    componentDidMount() {
        this.update();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.props.host !== nextProps.host || this.props.clientProps !== nextProps.clientProps) {
            this.client.close();
            this.client = this.createClient(nextProps);
            this.update(nextProps);
        }
    }

    abstract request(props: P): Promise<any>;

    update(props = this.props) {
        var self = this;

        self.setState({
            loading: true,
            error: undefined,
        });

        props.onLoadingChange && props.onLoadingChange(true);

        this.request(props).then(res => {
            self.setState({result: res, loading: false});

            props.onResult && props.onResult(res);
            props.onLoadingChange && props.onLoadingChange(false);
        }).catch(error => {
            self.setState({result: undefined, error: error, loading: false});

            props.onError && props.onError(error);
            props.onLoadingChange && props.onLoadingChange(false);
        });
    }

}

export default ElasticsearchComponent;
