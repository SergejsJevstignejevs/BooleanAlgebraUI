import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootReducerState } from "../../../redux/reducerStore";
import { 
    BooleanVariable, 
    BooleanVariableState 
} from "../../VariableCreationPanel/booleanVariableReducer";
import { 
    LogicalOperation, 
    LogicalOperationsState,
    LogicalOperator,
    setLogicalOperator,
    isLogicalOperation,
    addLogicalOperation,
    addVariableToLogicalOperation,
    removeLogicalOperationOperand
} from "../logicalOperationsReducer";

import "./LogicalOperationComponent.scss";

export interface LogicalOperationProps{
    logicalOperation?: LogicalOperation,
    depth?: number,
    maxDepth?: number
}

const LogicalOperationComponent: React.FC<LogicalOperationProps> = (
    { logicalOperation, depth = 0, maxDepth = 5 }
) =>{
    const{
        booleanVariables
    } = useSelector<RootReducerState, BooleanVariableState>((state) => state.booleanVariableReducer);
    const{
        nextLogicalOperationId
    } = useSelector<RootReducerState, LogicalOperationsState>((state) => state.logicalOperationsReducer);
    const dispatch = useDispatch();

    const selectOptions = useMemo(() => (
        
        booleanVariables.map((booleanVariable: BooleanVariable) => {
            
            return (
                <option 
                    key={booleanVariable.id}
                    var-name={booleanVariable.name}
                    value={booleanVariable.id}>
                    {booleanVariable.name}
                </option>
            );
    
        })

    ), [booleanVariables]);

    function handleAddOperator(event: React.ChangeEvent<HTMLSelectElement>, logicalOperationId: number){
   
        dispatch(setLogicalOperator(logicalOperationId, event.target.value as LogicalOperator));

    }

    function handleAddOperation(
        logicalOperationId: number
    ){

        dispatch(addLogicalOperation({
            id: nextLogicalOperationId,
            firstOperand: null,
            secondOperand: null,
            operator: null
        }, logicalOperationId));

    }

    const handleAddVariable = (
        event: React.ChangeEvent<HTMLSelectElement>, 
        logicalOperationId: number, 
        operandPosition: "firstOperand" | "secondOperand") => {

        dispatch(addVariableToLogicalOperation(
            logicalOperationId, 
            booleanVariables[Number(event.target.value)],
            operandPosition
        ));

    };

    const handleCancelOperation = (
        logicalOperationId: number,
        operandPosition?: "firstOperand" | "secondOperand") => {

        dispatch(removeLogicalOperationOperand(logicalOperationId, operandPosition));

    };

    return (
        <div className="LogicalOperationComponent">
            {logicalOperation?.operator === null ? 
                (
                    <>
                        <div className="ChoiseContainer">
                            <select
                                style={{ marginLeft: `${depth * 10}px` }}
                                className="Select Operator"
                                onChange={(event) => handleAddOperator(event, logicalOperation.id)}
                                value={logicalOperation?.operator || "default"}
                            >
                                <option value="default" disabled>
                                    select operator
                                </option>
                                <option value="variable">variable</option>
                                <option value="and">and</option>
                                <option value="or">or</option>
                            </select>
                            <button 
                                className="CancelButton"
                                type="button"
                                onClick={() => handleCancelOperation(logicalOperation!.id)}>
                                <img src="\pictures\cancel.svg" alt="Cancel image" />
                            </button>
                        </div>
                    </>
                ) : 
                (
                    <>
                        {logicalOperation?.operator === "variable" ? 
                            (
                                <div className="ChoiseContainer">
                                    <select 
                                        style={{ marginLeft: `${(depth + 1) * 10}px` }} 
                                        className="Select Variable"
                                        onChange={(event) => handleAddVariable(event, logicalOperation!.id, "firstOperand")}
                                        value={logicalOperation?.firstOperand !== null ? logicalOperation?.firstOperand.id : "default"}
                                    >
                                        <option value="default" disabled>
                                            select variable
                                        </option>
                                        {selectOptions}
                                    </select>
                                    <button 
                                        className="CancelButton"
                                        type="button"
                                        onClick={() => handleCancelOperation(logicalOperation!.id, "firstOperand")}>
                                        <img src="\pictures\cancel.svg" alt="Cancel image" />
                                    </button>
                                </div>
                            ) : 
                            (
                                <>
                                    <div className="ChoiseContainer">
                                        <select
                                            style={{ marginLeft: `${depth * 10}px` }}
                                            className="Select Operator"
                                            onChange={(event) => handleAddOperator(event, logicalOperation!.id)}
                                            value={logicalOperation?.operator || "default"}
                                        >
                                            <option value="default" disabled>
                                                select operator
                                            </option>
                                            <option value="variable">variable</option>
                                            <option value="and">and</option>
                                            <option value="or">or</option>
                                        </select>
                                        <button 
                                            className="CancelButton"
                                            type="button"
                                            onClick={() => handleCancelOperation(logicalOperation!.id)}>
                                            <img src="\pictures\cancel.svg" alt="Cancel image" />
                                        </button>
                                    </div>
                                    {["and", "or"].includes(logicalOperation?.operator || "") ? (
                                        <>
                                            {
                                                logicalOperation?.firstOperand &&
                                                isLogicalOperation(logicalOperation?.firstOperand) ? 
                                                    (
                                                        <LogicalOperationComponent
                                                            logicalOperation={logicalOperation?.firstOperand}
                                                            depth={depth + 1}
                                                        />
                                                    ) : 
                                                    (
                                                        <div className="ChoiseContainer">
                                                            <select
                                                                style={{ marginLeft: `${(depth + 1) * 10}px` }} 
                                                                className="Select Variable"
                                                                onChange={(event) => handleAddVariable(event, logicalOperation!.id, "firstOperand")}
                                                                value={logicalOperation?.firstOperand !== null ? logicalOperation?.firstOperand.id : "default"}
                                                            >
                                                                <option value="default" disabled>
                                                                    select variable
                                                                </option>
                                                                {selectOptions}
                                                            </select>
                                                            <button 
                                                                className="CancelButton"
                                                                type="button"
                                                                onClick={() => handleCancelOperation(logicalOperation!.id, "firstOperand")}>
                                                                <img src="\pictures\cancel.svg" alt="Cancel image" />
                                                            </button>
                                                        </div>
                                                    )
                                            }
                                            {
                                                logicalOperation?.secondOperand &&
                                                isLogicalOperation(logicalOperation?.secondOperand) ? 
                                                    (
                                                        <LogicalOperationComponent
                                                            logicalOperation={logicalOperation?.secondOperand}
                                                            depth={depth + 1}
                                                        />
                                                    ) : 
                                                    (
                                                        <div className="ChoiseContainer">
                                                            <select
                                                                style={{ marginLeft: `${(depth + 1) * 10}px` }} 
                                                                className="Select Variable"
                                                                onChange={(event) => handleAddVariable(event, logicalOperation!.id, "secondOperand")}
                                                                value={logicalOperation?.secondOperand !== null ? logicalOperation?.secondOperand.id : "default"}
                                                            >
                                                                <option value="default" disabled>
                                                                    select variable
                                                                </option>
                                                                {selectOptions}
                                                            </select>
                                                            <button 
                                                                className="CancelButton"
                                                                type="button"
                                                                onClick={() => handleCancelOperation(logicalOperation!.id, "secondOperand")}>
                                                                <img src="\pictures\cancel.svg" alt="Cancel image" />
                                                            </button>
                                                        </div>
                                                    )
                                            }
                                        </>
                                    ) : (
                                        <div className="ChoiseContainer">
                                            <select 
                                                style={{ marginLeft: `${(depth + 1) * 10}px` }} 
                                                className="Select Variable"
                                                onChange={(event) => handleAddVariable(event, logicalOperation!.id, "firstOperand")}
                                                value={logicalOperation?.firstOperand !== null ? logicalOperation?.firstOperand.id : "default"}
                                            >
                                                <option value="default" disabled>
                                                    select variable
                                                </option>
                                                {selectOptions}
                                            </select>
                                            <button 
                                                className="CancelButton"
                                                type="button"
                                                onClick={() => handleCancelOperation(logicalOperation!.id, "firstOperand")}>
                                                <img src="\pictures\cancel.svg" alt="Cancel image" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )
                        }
                        {   
                            !["variable"].includes(logicalOperation?.operator || "") &&
                            !(logicalOperation?.id === 0 && logicalOperation?.operator === "variable") ?
                                (
                                    (logicalOperation?.firstOperand === null || logicalOperation?.secondOperand === null) ? 
                                        (
                                            <button
                                                style={{ marginLeft: `${(depth + 1) * 10}px` }}
                                                className="AddOperationButton"
                                                onClick={() => handleAddOperation(logicalOperation!.id)}
                                            >
                                                Add Operation
                                            </button>
                                        ) : 
                                        null
                                ) :
                                null
                        }
                    </>
                )
            }
        </div> 
    );

}

export default LogicalOperationComponent;