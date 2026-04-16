import { useContext } from 'react';
import './Column.css';
import { FaRegEdit, FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { TaskContext } from '../../context/TaskContext';

function Column({ columnId }) {
    const { state, dispatch } = useContext(TaskContext);
    const column = state.columns[columnId];

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();

        const dragged = state.draggedItem;
        if (!dragged) return;

        dispatch({
            type: "MOVE_TASK",
            payload: {
                from: dragged.columnId,
                to: columnId,
                item: dragged.item
            }
        });

        dispatch({ type: "CLEAR_DRAGGED" });
    }

    function handleOnDrag(item) {
        dispatch({
            type: "SET_DRAGGED",
            payload: { columnId, item }
        });
    }

    return (
        <div
            className='column'
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="column-header">
                <p>{column.name}</p>
                <span className="badge">
                    {column.items.length}
                </span>
            </div>

            <div className="tasks">
                {column.items.length === 0 ? (
                    <p className="message">Add or drop tasks here</p>
                ) : (
                    column.items.map((item) => {
                        const isEditing = state.editing?.taskId === item.id;

                        return (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={() => handleOnDrag(item)}
                                onDoubleClick={() =>
                                    dispatch({
                                        type: "START_EDIT",
                                        payload: {
                                            columnId,
                                            taskId: item.id,
                                            text: item.content
                                        }
                                    })
                                }
                                className="task-card"
                                tabIndex={0}
                            >
                                {isEditing ? (
                                    <div className='edit-card'>
                                        <input
                                            value={state.editing.text}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "SET_EDIT_TEXT",
                                                    payload: e.target.value
                                                })
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    dispatch({ type: "SAVE_EDIT" });
                                                }
                                                if (e.key === "Escape") {
                                                    dispatch({ type: "CANCEL_EDIT" });
                                                }
                                            }}
                                            autoFocus
                                            id=""
                                            name=""
                                            className="edit-input"
                                        />
                                        <button
                                            onClick={() =>
                                                dispatch({
                                                    type: "SAVE_EDIT",
                                                    payload: { columnId, taskId: item.id }
                                                })
                                            }
                                            className="save btn-icon"
                                            aria-label="Save task"
                                        >
                                            <FaCheck />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="task-text">{item.content}</span>
                                )}

                                {!isEditing && (
                                    <div className="task-icons">
                                        <button
                                            onClick={() =>
                                                dispatch({
                                                    type: "START_EDIT",
                                                    payload: {
                                                        columnId,
                                                        taskId: item.id,
                                                        text: item.content
                                                    }
                                                })
                                            }
                                            className="edit btn-icon"
                                            aria-label="Edit task"
                                        >
                                            <FaRegEdit />
                                        </button>
                                        <button
                                            onClick={() =>
                                                dispatch({
                                                    type: "DELETE_TASK",
                                                    payload: { columnId, taskId: item.id }
                                                })
                                            }
                                            className="delete btn-icon"
                                            aria-label="Delete task"
                                        >
                                            <FaXmark />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}

export default Column;