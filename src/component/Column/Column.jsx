import { useCallback, useContext, useMemo } from 'react';
import './Column.css';
import { TaskContext } from '../../context/TaskContext';
import Task from '../Task/Task';

function Column({ columnId }) {
    const { state, dispatch } = useContext(TaskContext);
    const column = state.columns[columnId];

    if (!state?.columns) {
        return <p className="message">Loading board...</p>;
    }

    if (!column) {
        return <p className="message">Column does not exist</p>;
    }
    
    function handleDragOver(e) {
        e.preventDefault();
    }

    const draggedItem = state.draggedItem;

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        if (!draggedItem) return;

        dispatch({
            type: "MOVE_TASK",
            payload: {
                from: draggedItem.columnId,
                to: columnId,
                item: draggedItem.item
            }
        })

        dispatch({ type: "CLEAR_DRAGGED" });
    }, [columnId, dispatch, draggedItem]);

    const taskCount = useMemo(() => {
        return column.items.length;
    }, [column.items])

    return (
        <div
            className='column'
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="column-header">
                <p>{column.name}</p>
                <span className="badge">{taskCount}</span>
            </div>

            <div className="tasks">
                {column.items.length === 0 ? (
                    <p className="message">Add or drop tasks here</p>
                ) : (
                    column.items.map((item) => {
                        const isEditing = state.editing?.taskId === item.id;

                        return (
                            <Task
                                key={item.id}
                                item={item}
                                columnId={columnId}
                                isEditing={isEditing}
                            />
                        )
                    })
                )}
            </div>
        </div>
    );
}

export default Column;