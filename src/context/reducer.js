export const initialState = {
    columns: {
        todo: {
            name: "To Do",
            items: [
                { id: 1, content: "Get up early" },
                { id: 2, content: "Write Code" },
                { id: 3, content: "Eat a banana" },
            ]
        },
        inProgress: {
            name: "In Progress",
            items: [
                { id: 5, content: "Learn how to live" },
                { id: 6, content: "Earn money" },
            ]
        },
        done: {
            name: "Done",
            items: [
                { id: 7, content: "Die peacefully" },
            ]
        }
    },
    draggedItem: null,
    editing: {
        columnId: null,
        taskId: null,
        text: ""
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case "ADD_TASK": {
            const { columnId, task } = action.payload;

            return {
                ...state,
                columns: {
                    ...state.columns,
                    [columnId]: {
                        ...state.columns[columnId],
                        items: [...state.columns[columnId].items, task]
                    }
                }
            }
        }

        case "DELETE_TASK": {
            const { columnId, taskId } = action.payload;

            return {
                ...state,
                columns: {
                    ...state.columns,
                    [columnId]: {
                        ...state.columns[columnId],
                        items: state.columns[columnId].items.filter(
                            item => item.id !== taskId
                        )
                    }
                }
            }
        }

        case "START_EDIT": {
            return {
                ...state,
                editing: {
                    columnId: action.payload.columnId,
                    taskId: action.payload.taskId,
                    text: action.payload.text
                }
            };
        }

        case "SET_EDIT_TEXT": {
            return {
                ...state,
                editing: {
                    ...state.editing,
                    text: action.payload
                }
            };
        }

        case "SAVE_EDIT": {
            const { columnId, taskId, text } = state.editing;

            return {
                ...state,
                columns: {
                    ...state.columns,
                    [columnId]: {
                        ...state.columns[columnId],
                        items: state.columns[columnId].items.map(item =>
                            item.id === taskId
                                ? { ...item, content: text }
                                : item
                        )
                    }
                },
                editing: { columnId: null, taskId: null, text: "" }
            };
        }

        case "CANCEL_EDIT": {
            return {
                ...state,
                editing: { columnId: null, taskId: null, text: "" }
            };
        }

        case "MOVE_TASK": {
            const { from, to, item } = action.payload;

            if (from === to) return state;

            return {
                ...state,
                columns: {
                    ...state.columns,
                    [from]: {
                        ...state.columns[from],
                        items: state.columns[from].items.filter(i => i.id !== item.id)
                    },
                    [to]: {
                        ...state.columns[to],
                        items: [
                            ...state.columns[to].items,
                            item
                        ]
                    }
                }
            }
        }

        case "SET_DRAGGED": return { ...state, draggedItem: action.payload }
        case "CLEAR_DRAGGED": return { ...state, draggedItem: null };
        default: return state;
    }
}