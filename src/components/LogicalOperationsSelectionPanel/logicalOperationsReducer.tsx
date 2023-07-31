import { BooleanVariable } from "../VariableCreationPanel/booleanVariableReducer";

export type LogicalOperator = "or" | "and" | "variable";

export interface LogicalOperation{
    id: number,
    firstOperand: BooleanVariable | LogicalOperation | null,
    secondOperand: BooleanVariable | LogicalOperation | null,
    operator: LogicalOperator | null
}

interface LogicalOperationsAction{
    type: string,
    payload: 
        number | 
        LogicalOperation | 
        LogicalOperator | 
        {
            logicalOperationId: number, 
            logicalOperator: LogicalOperator
        } |
        {
            logicalOperation: LogicalOperation,
            logicalOperationId: number
        } |
        { 
            logicalOperationId: number, 
            booleanVariable: BooleanVariable,
            operandPosition: "firstOperand" | "secondOperand"
        } |
        boolean |
        { 
            logicalOperationId: number, 
            operandPosition: "firstOperand" | "secondOperand"
        } |
        { 
            variableId: number, 
            variableValue: boolean
        }
}

//Actions definitions
export const setSelectedBooleanVariableId = (selectedBooleanVariableId: number) => ({
    type: "SET_SELECTED_BOOLEAN_VARIABLE_ID",
    payload: selectedBooleanVariableId
});

export const addLogicalOperation = (logicalOperation: LogicalOperation, logicalOperationId: number) => ({
    type: "ADD_LOGICAL_OPERATION",
    payload: { logicalOperation, logicalOperationId }
});

export const setLogicalOperator = (logicalOperationId: number, logicalOperator: LogicalOperator) => ({
    type: "SET_LOGICAL_OPERATOR",
    payload: { logicalOperationId, logicalOperator }
});

export const addVariableToLogicalOperation = (logicalOperationId: number, booleanVariable: BooleanVariable, operandPosition: "firstOperand" | "secondOperand") => ({
    type: "ADD_VARIABLE_TO_LOGICAL_OPERATION",
    payload: { logicalOperationId, booleanVariable, operandPosition }
});

export const setLogicalOperationsResult = (logicalOperationsResult: boolean) => ({
    type: "SET_LOGICAL_OPERATIONS_RESULT",
    payload: logicalOperationsResult
});

export const removeLogicalOperationOperand = (
    logicalOperationId: number,
    operandPosition?: "firstOperand" | "secondOperand"
) => ({
    type: "REMOVE_LOGICAL_OPERATION_OPERAND",
    payload: { logicalOperationId, operandPosition }
});

export const updateBooleanVariableValue = (variableId: number, variableValue: boolean) => ({
    type: "UPDATE_BOOLEAN_VARIABLE_VALUE",
    payload: { variableId, variableValue },
});
  

//State definition
export interface LogicalOperationsState{
    selectedBooleanVariableId: number | null,
    logicalOperations: LogicalOperation,
    nextLogicalOperationId: number,
    logicalOperationsResult: boolean | undefined
}

const initialState: LogicalOperationsState = {
    selectedBooleanVariableId: null,
    logicalOperations: {
        id: 0,
        firstOperand: null,
        secondOperand: null,
        operator: null
    },
    nextLogicalOperationId: 1,
    logicalOperationsResult: undefined
}

export function isLogicalOperation(obj: any): obj is LogicalOperation {
    return "id" in obj && "firstOperand" in obj && "secondOperand" in obj && "operator" in obj;
}

export function isBooleanVariable(obj: any): obj is BooleanVariable{
    return "id" in obj && "name" in obj && "value" in obj;
}

const updateLogicalOperationOperator = ( // Adds operator to defined logicalOperation through logicalOperationId
    logicalOperation: LogicalOperation,
    logicalOperationId: number,
    operator: LogicalOperator
): LogicalOperation => {
    
    if (logicalOperation.id === logicalOperationId) {
        if (operator === "variable") {
            // If operator is "variable", reset first and second operands to null
            return {
                ...logicalOperation,
                operator,
                firstOperand: null,
                secondOperand: null,
            };
        } else {
            // If operator is not "variable", update the operator only
            return {
                ...logicalOperation,
                operator,
            };
        }
    }

    return {
        ...logicalOperation,
        firstOperand: 
            logicalOperation.firstOperand !== null ?
                (isLogicalOperation(logicalOperation.firstOperand) ? 
                    updateLogicalOperationOperator(logicalOperation.firstOperand, logicalOperationId, operator) :
                    logicalOperation.firstOperand
                ):
                logicalOperation.firstOperand,
        secondOperand:
            logicalOperation.secondOperand !== null ?
                (isLogicalOperation(logicalOperation.secondOperand) ? 
                    updateLogicalOperationOperator(logicalOperation.secondOperand, logicalOperationId, operator) :
                    logicalOperation.secondOperand
                ):
                logicalOperation.secondOperand
    };
};

export function updateLogicalOperationOperand(
    logicalOperations: LogicalOperation,
    logicalOperationId: number,
    logicalOperationOperand: LogicalOperation | BooleanVariable | null,
    operandPosition?: "firstOperand" | "secondOperand"
): LogicalOperation {

    if (logicalOperations.id === logicalOperationId) {
        if (operandPosition) {
            // Found the LogicalOperation to update, return the updated one
            return {
                ...logicalOperations,
                [operandPosition]: logicalOperationOperand,
            };
        } else {
            if (!logicalOperations.firstOperand) {

                return { ...logicalOperations, firstOperand: logicalOperationOperand };
    
            } else if (!logicalOperations.secondOperand) {
    
                return { ...logicalOperations, secondOperand: logicalOperationOperand };
    
            }
        }
    }

    const updatedFirstOperand =
        logicalOperations.firstOperand !== null && isLogicalOperation(logicalOperations.firstOperand)
            ? updateLogicalOperationOperand(logicalOperations.firstOperand, logicalOperationId, logicalOperationOperand, operandPosition)
            : logicalOperations.firstOperand;

    const updatedSecondOperand =
        logicalOperations.secondOperand !== null && isLogicalOperation(logicalOperations.secondOperand)
            ? updateLogicalOperationOperand(logicalOperations.secondOperand, logicalOperationId, logicalOperationOperand, operandPosition)
            : logicalOperations.secondOperand;

    return {
        ...logicalOperations,
        firstOperand: updatedFirstOperand,
        secondOperand: updatedSecondOperand
    };
}

export function evaluateLogicalOperations(logicalOperation: LogicalOperation): boolean {
    if (logicalOperation.operator === "variable") {
        // If the operator is "variable", check the corresponding BooleanVariable's value
        const variable = logicalOperation.firstOperand as BooleanVariable | null;
        return variable ? variable.value : false; // Return the variable's value or false if not found
    }

    if (logicalOperation.operator === "and") {
        // If the operator is "and", evaluate both operands recursively and apply the "and" operation
        const firstOperandValue = 
            logicalOperation.firstOperand && isLogicalOperation(logicalOperation.firstOperand) ? 
                evaluateLogicalOperations(logicalOperation.firstOperand)
                : (logicalOperation.firstOperand as BooleanVariable)?.value || false;
        const secondOperandValue =
            logicalOperation.secondOperand && isLogicalOperation(logicalOperation.secondOperand) ? 
                evaluateLogicalOperations(logicalOperation.secondOperand)
                : (logicalOperation.secondOperand as BooleanVariable)?.value || false;
        return firstOperandValue && secondOperandValue;
    }
    
    if (logicalOperation.operator === "or") {
        // If the operator is "or", evaluate both operands recursively and apply the "or" operation
        const firstOperandValue = 
            logicalOperation.firstOperand && isLogicalOperation(logicalOperation.firstOperand) ? 
                evaluateLogicalOperations(logicalOperation.firstOperand)
                : (logicalOperation.firstOperand as BooleanVariable)?.value || false;
        const secondOperandValue =
            logicalOperation.secondOperand && isLogicalOperation(logicalOperation.secondOperand) ? 
                evaluateLogicalOperations(logicalOperation.secondOperand)
                : (logicalOperation.secondOperand as BooleanVariable)?.value || false;
        return firstOperandValue || secondOperandValue;
    }

    // If the operator is null, return false
    return false;
}

const findParentIdAndOperandPosition = (
    logicalOperation: LogicalOperation | null,
    targetId: number
): { parentLogicalOperationId: number | null, targetOperandPosition: "firstOperand" | "secondOperand" | null } => {
    if (!logicalOperation) {
        return { parentLogicalOperationId: null, targetOperandPosition: null };
    }

    if (
        logicalOperation.firstOperand && 
        isLogicalOperation(logicalOperation.firstOperand) && 
        logicalOperation.firstOperand.id === targetId) {
        return { parentLogicalOperationId: logicalOperation.id, targetOperandPosition: "firstOperand" };
    }

    if (
        logicalOperation.secondOperand && 
        isLogicalOperation(logicalOperation.secondOperand) && 
        logicalOperation.secondOperand.id === targetId) {
        return { parentLogicalOperationId: logicalOperation.id, targetOperandPosition: "secondOperand" };
    }

    if (logicalOperation.firstOperand && isLogicalOperation(logicalOperation.firstOperand)) {
        const { parentLogicalOperationId, targetOperandPosition } = findParentIdAndOperandPosition(logicalOperation.firstOperand, targetId);
        if (parentLogicalOperationId !== null) {
            return { parentLogicalOperationId, targetOperandPosition };
        }
    }

    if (logicalOperation.secondOperand && isLogicalOperation(logicalOperation.secondOperand)) {
        const { parentLogicalOperationId, targetOperandPosition } = findParentIdAndOperandPosition(logicalOperation.secondOperand, targetId);
        if (parentLogicalOperationId !== null) {
            return { parentLogicalOperationId, targetOperandPosition };
        }
    }

    return { parentLogicalOperationId: null, targetOperandPosition: null };
};

const removeOperandRecursive = (
    logicalOperation: LogicalOperation,
    logicalOperationId: number | null,
    operandPosition: "firstOperand" | "secondOperand" | null
): LogicalOperation => {

    if(logicalOperationId === null){
        return {
            ...logicalOperation,
            firstOperand: null,
            secondOperand: null,
            operator: null
        };
    }

    if (logicalOperation.id === logicalOperationId) {
        // If the current logical operation matches the target id and operandPosition is provided, remove the operand
        if (operandPosition) {

            if(logicalOperation.operator === "variable"){
                return {
                    ...logicalOperation,
                    firstOperand: null,
                    secondOperand: null,
                    operator: null
                };
            }

            return {
                ...logicalOperation,
                [operandPosition]: null
            };

        } else {
            // If operandPosition is not provided, return a new LogicalOperation with both operands set to null
            return {
                ...logicalOperation,
                firstOperand: null,
                secondOperand: null,
                operator: null
            };
        }
    } else {
        // If not, recursively traverse through the operands to find and remove the target operand
        const updatedFirstOperand =
            logicalOperation.firstOperand &&
            isLogicalOperation(logicalOperation.firstOperand)
            ? removeOperandRecursive(
                logicalOperation.firstOperand, 
                logicalOperationId, 
                operandPosition)
            : logicalOperation.firstOperand;

        const updatedSecondOperand =
            logicalOperation.secondOperand &&
            isLogicalOperation(logicalOperation.secondOperand)
            ? removeOperandRecursive(
                logicalOperation.secondOperand, 
                logicalOperationId, 
                operandPosition)
            : logicalOperation.secondOperand;

        return {
            ...logicalOperation,
            firstOperand: updatedFirstOperand,
            secondOperand: updatedSecondOperand
        };
    }
};

function updateVariableInLogicalOperations(
    logicalOperation: LogicalOperation,
    variableId: number,
    newVariableValue: boolean
): LogicalOperation{

    if (logicalOperation.operator === "variable" && logicalOperation.firstOperand?.id === variableId) {
        return { 
            ...logicalOperation, 
            firstOperand: { 
                ...logicalOperation.firstOperand, 
                value: newVariableValue 
            } 
        };
    }

    if(isBooleanVariable(logicalOperation.firstOperand) && logicalOperation.firstOperand.id === variableId){
        return { 
            ...logicalOperation, 
            firstOperand: { 
                ...logicalOperation.firstOperand, 
                value: newVariableValue 
            } 
        };
    }

    if(isBooleanVariable(logicalOperation.secondOperand) && logicalOperation.secondOperand.id === variableId){
        return { 
            ...logicalOperation, 
            secondOperand: { 
                ...logicalOperation.secondOperand, 
                value: newVariableValue 
            } 
        };
    }

    const updatedFirstOperand = 
        logicalOperation.firstOperand && isLogicalOperation(logicalOperation.firstOperand) ?
            updateVariableInLogicalOperations(logicalOperation.firstOperand, variableId, newVariableValue)
            : logicalOperation.firstOperand;
    const updatedSecondOperand = 
        logicalOperation.secondOperand && isLogicalOperation(logicalOperation.secondOperand) ?
            updateVariableInLogicalOperations(logicalOperation.secondOperand, variableId, newVariableValue)
            : logicalOperation.secondOperand;

    return {
        ...logicalOperation,
        firstOperand: updatedFirstOperand,
        secondOperand: updatedSecondOperand,
    };
}

//Reducer definition
export function logicalOperationsReducer(state = initialState, action: LogicalOperationsAction){
    switch(action.type){
        case "SET_SELECTED_BOOLEAN_VARIABLE_ID":{
            return { 
                ...state,
                selectedBooleanVariableId: action.payload
            }
        }
        case "ADD_LOGICAL_OPERATION":{
            const { logicalOperation, logicalOperationId } = action.payload as {
                logicalOperation: LogicalOperation,
                logicalOperationId: number
            };
            const updatedLogicalOperations = updateLogicalOperationOperand(
                state.logicalOperations,
                logicalOperationId,
                logicalOperation
            );
            return { 
                ...state,
                logicalOperations: updatedLogicalOperations,
                nextLogicalOperationId: state.nextLogicalOperationId + 1
            }
        }
        case "SET_LOGICAL_OPERATOR":{
            const { logicalOperationId, logicalOperator} = action.payload as { 
                logicalOperationId: number; 
                logicalOperator: LogicalOperator; 
            };
            const updatedLogicalOperations = updateLogicalOperationOperator(
                state.logicalOperations,
                logicalOperationId,
                logicalOperator
            );
            return {
                ...state,
                logicalOperations: updatedLogicalOperations
            }
        }
        case "ADD_VARIABLE_TO_LOGICAL_OPERATION": {
            const { 
                logicalOperationId, 
                booleanVariable,
                operandPosition 
            } = action.payload as { 
                logicalOperationId: number, 
                booleanVariable: BooleanVariable,
                operandPosition: "firstOperand" | "secondOperand"
            };
            const updatedLogicalOperations = updateLogicalOperationOperand(
                state.logicalOperations,
                logicalOperationId,
                booleanVariable,
                operandPosition
            );
            return {
                ...state,
                logicalOperations: updatedLogicalOperations
            };
        }
        case "SET_LOGICAL_OPERATIONS_RESULT": {
            return {
                ...state,
                logicalOperationsResult: action.payload
            }
        }
        case "REMOVE_LOGICAL_OPERATION_OPERAND": {
            const { logicalOperationId, operandPosition } = action.payload as { 
                logicalOperationId: number, 
                operandPosition: "firstOperand" | "secondOperand"
            }

            if(operandPosition === undefined){
                const {
                    parentLogicalOperationId,
                    targetOperandPosition
                } = findParentIdAndOperandPosition(state.logicalOperations, logicalOperationId);
                
                const updatedLogicalOperations = removeOperandRecursive(
                    state.logicalOperations,
                    parentLogicalOperationId,
                    targetOperandPosition
                );

                return {
                    ...state,
                    logicalOperations: updatedLogicalOperations
                }

            } 
            
            const updatedLogicalOperations = removeOperandRecursive(
                state.logicalOperations,
                logicalOperationId,
                operandPosition
            );
            return {
                ...state,
                logicalOperations: updatedLogicalOperations
            }
        }
        case "UPDATE_BOOLEAN_VARIABLE_VALUE":{
            const { variableId, variableValue } = action.payload as { 
                variableId: number; 
                variableValue: boolean 
            };

            const updatedLogicalOperations = updateVariableInLogicalOperations(
                state.logicalOperations, 
                variableId, 
                variableValue
            );

            return {
              ...state,
              logicalOperations: updatedLogicalOperations,
            };
        }
        default:{
            return state;
        }
    }
}