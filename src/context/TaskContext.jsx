import { createContext, useReducer } from "react";
import { initialState, reducer } from "./reducer";

export const TaskContext = createContext();

export function TaskProvider({ children }){
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <TaskContext.Provider value={{state, dispatch}}>
            {children}
        </TaskContext.Provider>
    )
}