import ErrorComponent, {ErrorComponentProps} from "../ErrorComponent";

class Error extends ErrorComponent<ErrorComponentProps> {

    renderError(error) {
        return 'Error: ' + error;
    }

}

export default Error;
