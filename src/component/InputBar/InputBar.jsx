import { useCallback, useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import './InputBar.css';
import toast from 'react-hot-toast';

function InputBar() {
    const { state, dispatch } = useContext(TaskContext);
    const [text, setText] = useState("");
    const [column, setColumn] = useState("todo");

    const addTask = useCallback(() => {
        const value = text.trim();
        if (!value) return;

        if (value.length < 2) {
            toast.error("Task must be at least 2 characters long!")
            return
        }
        if (value.length > 200) {
            toast.error('Task must be less than 200 characters long!');
            return
        }

        const isDuplicate = Object.values(state.columns).some(col =>
            col.items.some(item =>
                item.content.toLowerCase() === value.toLowerCase()
            )
        )

        if (isDuplicate) return toast.error('Item already exists!');

        dispatch({
            type: "ADD_TASK",
            payload: {
                columnId: column,
                task: {
                    id: crypto.randomUUID(),
                    content: value
                }
            }
        })
        setText("");
        toast.success('Task added!');

    }, [dispatch, column, text]);

    return (
        <div className="input-bar shadow">
            <input
                placeholder="Add smth..."
                id="addInp"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
            />

            <select
                value={column}
                id="select"
                onChange={(e) => setColumn(e.target.value)}
            >
                {Object.keys(state.columns).map((columnId) => (
                    <option key={columnId} value={columnId}>
                        {state.columns[columnId].name}
                    </option>
                ))}
            </select>

            <button onClick={addTask}>Add</button>
        </div>
    );
}

export default InputBar;