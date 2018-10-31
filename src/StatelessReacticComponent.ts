import {ReacticComponentProps, ReacticComponentState} from "./ReacticComponent";
import ReacticComponent from "./ReacticComponent";

abstract class StatelessReacticComponent<P extends ReacticComponentProps> extends ReacticComponent<P, ReacticComponentState> {
}

export default StatelessReacticComponent;
