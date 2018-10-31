import * as React from 'react';

import LoadingComponent, {LoadingComponentProps} from "../LoadingComponent";
import './loading.css';

interface LoadingProps extends LoadingComponentProps {
    size: number,
}

class Loading extends LoadingComponent<LoadingProps> {

    public static defaultProps: Partial<LoadingProps> = {
        size: 100
    };

    renderLoading() {
        return (
            <div className="loader" style={{width: this.props.size, height: this.props.size}}/>
        )
    }

}

export default Loading;
