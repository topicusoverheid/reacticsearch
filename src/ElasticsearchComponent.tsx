import * as React from "react";

import {ConfigOptions} from "elasticsearch-browser";
import {OutgoingHttpHeaders} from "http";
import ElasticsearchClient from "./ElasticsearchClient";
import ElasticsearchContext, {ElasticsearchConfig} from "./ElasticsearchContext";
import {ReactNode} from "react";

export interface ElasticsearchComponentProps {
    // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/configuration.html#config-options
    clientProps?: ConfigOptions,
    requestHeaders?: OutgoingHttpHeaders,
    onRequest?: (params: object, options: object) => void,
    onResult?: (result: any) => void,
    onError?: (error: any) => void,
    onLoadingChange?: (loading: boolean) => void,
    style?: React.CSSProperties,
    children?: React.ReactNode
}

export interface ElasticsearchComponentState {
    loading: boolean,
    error?: any,
    result?: any
}

abstract class ElasticsearchComponent<P extends ElasticsearchComponentProps, S extends ElasticsearchComponentState> extends React.PureComponent<P, S> {

    public static defaultProps: Partial<ElasticsearchComponentProps> = {};

    static contextType = ElasticsearchContext;
    context!: React.ContextType<typeof ElasticsearchContext>;

    private client: ElasticsearchClient;

    constructor(props) {
        super(props);

        // @ts-ignore
        this.state = {
            loading: false,
            error: undefined,
            result: undefined,
        };
    }

    private createClient(props: P = this.props, config: ElasticsearchConfig = this.context): ElasticsearchClient {
        return new ElasticsearchClient({
                ...props.clientProps,
                host: config.host,
            },
            props.onRequest,
            {...props.requestHeaders, ...config.requestHeaders}
        );
    }

    componentDidMount() {
        this.client = this.createClient(this.props, this.context);
        this.update();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextConfig: ElasticsearchConfig): void {
        if (this.context.host !== nextConfig.host || this.context.requestHeaders !== nextConfig.requestHeaders) {
            this.client = this.createClient(nextProps, nextConfig);
            this.update();
        }
    }

    abstract request(client: ElasticsearchClient, props: P): Promise<any>;

    update(props: P = this.props) {
        var self = this;

        self.setState({
            loading: true,
            error: undefined,
        });

        props.onLoadingChange && props.onLoadingChange(true);

        this.request(this.client, props).then(res => {
            self.setState({result: res, loading: false});

            props.onResult && props.onResult(res);
            props.onLoadingChange && props.onLoadingChange(false);
        }).catch(error => {
            self.setState({result: undefined, error: error, loading: false});

            props.onError && props.onError(error);
            props.onLoadingChange && props.onLoadingChange(false);
        });
    }

    render(): ReactNode {
        return (
            <div style={this.props.style}>
                <ElasticsearchContext.Consumer>
                    {
                        (config: ElasticsearchConfig) => {
                            // this.config = config;
                            return this.renderElasticsearchComponent();
                        }
                    }
                </ElasticsearchContext.Consumer>
            </div>
        );
    }

    abstract renderElasticsearchComponent(): ReactNode

}

ElasticsearchComponent.contextType = ElasticsearchContext;

export default ElasticsearchComponent;
