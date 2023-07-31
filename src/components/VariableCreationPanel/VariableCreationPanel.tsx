import { useSelector, useDispatch } from "react-redux";
import { useMemo, useRef, useEffect } from "react";

import { RootReducerState } from "../../redux/reducerStore";
import { 
    BooleanVariableState, 
    addBooleanVariable,
    updateBooleanVariable
} from "./booleanVariableReducer";
import { updateBooleanVariableValue } from "../LogicalOperationsSelectionPanel/logicalOperationsReducer";

import "./VariableCreationPanel.scss";

const VariableCreationPanel: React.FC = () => {
    const{
        booleanVariables,
        nextBooleanVariableId
    } = useSelector<RootReducerState, BooleanVariableState>((state) => state.booleanVariableReducer);
    const dispatch = useDispatch();
    const overflowBoxRef = useRef<HTMLDivElement | null>(null);

    const handleUpdateVariableInLogicalOperations = (variableId: number, variableValue: boolean) => {

        dispatch(updateBooleanVariableValue(variableId, variableValue));

    }

    const booleanVariableRows = useMemo(() => (
        booleanVariables.map((booleanVariable, index) => {
            return(
                <div 
                    key={index}
                    className="PanelRow">
                    <input
                        className="VariableNameInput" 
                        type="text"
                        value={booleanVariable.name}
                        onChange={(event) => handleBooleanVariableNameChange(event, booleanVariable.id)}/>
                    <select
                        className="VariableValueSelect"
                        value={booleanVariable.value.toString()}
                        onChange={(event) => {
                            handleBooleanVariableValueChange(event, booleanVariable.id);
                            handleUpdateVariableInLogicalOperations(
                                booleanVariable.id, 
                                event.target.value === "true"
                            );
                        }}>
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                </div>
            );
        })
    ), [booleanVariables]);

    function handleAddBooleanVariable(){

        dispatch(addBooleanVariable({
            id: nextBooleanVariableId,
            name: "myArg" + nextBooleanVariableId,
            value: false
        }));

    };

    function handleBooleanVariableNameChange(
        event: React.ChangeEvent<HTMLInputElement>, 
        booleanVariableId: number
    ){

        dispatch(updateBooleanVariable({
            ...booleanVariables[booleanVariableId],
            name: event.currentTarget.value
        }));

    }

    function handleBooleanVariableValueChange(
        event: React.ChangeEvent<HTMLSelectElement>, 
        booleanVariableId: number
    ){

        dispatch(updateBooleanVariable({
            ...booleanVariables[booleanVariableId],
            value: event.currentTarget.value === "true"
        }));

    }

    useEffect(() => {

        if (overflowBoxRef.current !== null) {
            overflowBoxRef.current.scrollTop = overflowBoxRef.current.scrollHeight;
        }

    }, [overflowBoxRef.current?.scrollHeight]);

    return(
        <div className="VariableCreationPanel">
            <div 
                className="OverflowBox"  
                ref={overflowBoxRef}>
                {booleanVariableRows}
            </div>
            <div className="PanelRow">
                <button
                    className="AddVariableButton"
                    onClick={handleAddBooleanVariable}>
                    Add variable
                </button>
            </div>
        </div>
    );
}

export default VariableCreationPanel;