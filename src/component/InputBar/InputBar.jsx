import { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import './InputBar.css';

function InputBar() {
    const { state, dispatch } = useContext(TaskContext);
    const [text, setText] = useState("");
    const [column, setColumn] = useState("todo");

    function addTask() {
        if (text.trim() === "") return;

        dispatch({
            type: "ADD_TASK",
            payload: {
                columnId: column,
                task: {
                    id: crypto.randomUUID(),
                    content: text
                }
            }
        });

        setText("");
    }

    return (
        <div className="input-bar shadow">
            <input
                placeholder="Add smth..."
                id=""
                name=""
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
            />

            <select
                value={column}
                name=""
                id=""
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