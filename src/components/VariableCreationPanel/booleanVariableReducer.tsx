export interface BooleanVariable{
    id: number,
    name: string,
    value: boolean
}

interface BooleanVariableAction{
    type: string,
    payload: BooleanVariable
}

//Actions definitions
export const addBooleanVariable = (newBooleanVariable: BooleanVariable) => ({
    type: "ADD_BOOLEAN_VARIABLE",
    payload: newBooleanVariable
});

export const updateBooleanVariable = (updatedBooleanVariable: BooleanVariable) => ({
    type: "UPDATE_BOOLEAN_VARIABLE",
    payload: updatedBooleanVariable
});

//State definition
export interface BooleanVariableState{
    booleanVariables: BooleanVariable[],
    nextBooleanVariableId: number
}

const initialState = {
    booleanVariables: new Array<BooleanVariable>,
    nextBooleanVariableId: 0
}

//Reducer definition
export function booleanVariableReducer(state = initialState, action: BooleanVariableAction){
    switch(action.type){
        case "ADD_BOOLEAN_VARIABLE":{
            return { 
                ...state, 
                booleanVariables: [...state.booleanVariables, action.payload],
                nextBooleanVariableId: state.nextBooleanVariableId + 1
            }
        }
        case "UPDATE_BOOLEAN_VARIABLE":{
            return { 
                ...state, 
                booleanVariables: state.booleanVariables.map((booleanVariable) => (
                    booleanVariable.id === action.payload.id ? action.payload : booleanVariable
                )) 
            }
        }
        default:{
            return state;
        }
    }
}