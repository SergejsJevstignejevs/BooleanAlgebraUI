import { createStore, combineReducers } from "redux";

import { BooleanVariableState } from "../components/VariableCreationPanel/booleanVariableReducer";
import { LogicalOperationsState } from "../components/LogicalOperationsSelectionPanel/logicalOperationsReducer";

import { booleanVariableReducer } from "../components/VariableCreationPanel/booleanVariableReducer";
import { logicalOperationsReducer } from "../components/LogicalOperationsSelectionPanel/logicalOperationsReducer";

export interface RootReducerState{
    booleanVariableReducer: BooleanVariableState,
    logicalOperationsReducer: LogicalOperationsState
}

const rootReducer = combineReducers({
    booleanVariableReducer,
    logicalOperationsReducer
});

export const reducerStore = createStore(rootReducer);