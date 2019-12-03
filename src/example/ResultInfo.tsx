import * as React from 'react';

import ResultComponent, {ResultComponentProps} from "../ResultComponent";
import {ReacticComponentState} from "../ReacticComponent";

class ResultInfo extends ResultComponent<ResultComponentProps, ReacticComponentState> {

    renderResult(result) {
        return 'Found ' + result.hits.total.value + ', took ' + result.took + ' ms.';
    }

}

export default ResultInfo;
