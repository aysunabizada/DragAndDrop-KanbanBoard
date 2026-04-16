import React, { useCallback, useContext } from "react";
import { TaskContext } from "../../context/TaskContext";
import { FaRegEdit, FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import './Task.css';

function Task({ item, columnId, isEditing }) {
    const { state, dispatch } = useContext(TaskContext);

    const handleDragStart = useCallback(() => {
        dispatch({
            type: "SET_DRAGGED",
            payload: { columnId, item }
        });
    }, [dispatch, columnId, item])

    const handleDoubleClick = useCallback(() => {
        dispatch({
            type: "START_EDIT",
            payload: {
                columnId,
                taskId: item.id,
                text: item.content
            }
        })
    }, [dispatch, columnId, item]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            dispatch({
                type: "SAVE_EDIT",
                payload: { columnId, taskId: item.id }
            })
        }

        if (e.key === "Escape") {
            dispatch({ type: "CANCEL_EDIT" });
        }
    }, [dispatch, columnId, item.id])

    return (
        <div
            role="button"
            tabIndex={0}
            className="task-card"
            draggable={!isEditing}
            onDragStart={handleDragStart}
            onDoubleClick={handleDoubleClick}
        >
            {isEditing ? (
                <div className='edit-card'>
                    <input
                        value={state.editing?.text || ''}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_EDIT_TEXT",
                                payload: e.target.value
                            })
                        }
                        onKeyDown={handleKeyDown}
                        autoFocus
                        id={`inp-${item.id}`}
                        className="edit-input"
                    />
                    <button
                        title="Done?"
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
                        title="Would u like to edit?"
                        className="delete btn-icon"
                        aria-label="Edit task"
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
                    >
                        <FaRegEdit />
                    </button>
                    <button
                        title="Are u gonna delete it?"
                        className="edit btn-icon"
                        aria-label="Delete task"
                        onClick={() =>
                            dispatch({
                                type: "DELETE_TASK",
                                payload: { columnId, taskId: item.id }
                            })
                        }
                    >
                        <FaXmark />
                    </button>
                </div>
            )}
        </div>
    );
}

export default React.memo(Task);