import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootReducerState } from "../../redux/reducerStore";
import { BooleanVariableState } from "../VariableCreationPanel/booleanVariableReducer";
import {
    LogicalOperationsState, 
    evaluateLogicalOperations, 
    setLogicalOperationsResult, 
    setSelectedBooleanVariableId 
} from "./logicalOperationsReducer";

import LogicalOperationComponent from "./LogicalOperationComponent/LogicalOperationComponent";

import "./LogicalOperationsSelectionPanel.scss";

const LogicalOperationsSelectionPanel: React.FC = () => {
    const{
        booleanVariables
    } = useSelector<RootReducerState, BooleanVariableState>((state) => state.booleanVariableReducer);
    const{
        selectedBooleanVariableId
    } = useSelector<RootReducerState, LogicalOperationsState>((state) => state.logicalOperationsReducer);
    const{
        logicalOperations,
        logicalOperationsResult
    } = useSelector<RootReducerState, LogicalOperationsState>((state) => state.logicalOperationsReducer);
    const dispatch = useDispatch();

    const selectOptions = booleanVariables.map((booleanVariable) => {

        return (
            <option 
                key={booleanVariable.id}
                var-name={booleanVariable.name}
                value={booleanVariable.id}>
                {booleanVariable.name}
            </option>
        );

    });

    useEffect(() => {

        dispatch(setLogicalOperationsResult(evaluateLogicalOperations(logicalOperations)));

    }, [logicalOperations]);

    return (
        <div className="LogicalOperationsSelectionPanel">
            {/* <select
                className="Select"
                onChange={(event) => {
                    dispatch(setSelectedBooleanVariableId(Number(event.target.value)));
                }}>
                <option value="default" hidden>Select operation</option>
                {selectOptions}
            </select> */}
            <LogicalOperationComponent logicalOperation={logicalOperations}/>
            <p 
                className="Result">
                <span>
                    {/* Result: {
                        selectedBooleanVariableId !== null ? 
                        booleanVariables[selectedBooleanVariableId].value.toString() :
                        "undefined"
                    } */}
                    Result: {
                        logicalOperationsResult !== undefined ? 
                            logicalOperationsResult.toString() : 
                            "undefined"
                    }
                </span>
            </p>
        </div>
    );
}

export default LogicalOperationsSelectionPanel;