import { useState } from "react"
import { FaRegEdit } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

function App() {
    const [columns, setColumns] = useState({
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
                { id: 8, content: "Die peacefully" },
            ]
        }
    })

    const [newTask, setNewTask] = useState('')
    const [activeColumns, setActiveColumns] = useState('todo')
    const [draggedItem, setDraggedItem] = useState(null)
    const [editingId, setEditingId] = useState(null);
    const [text, setText] = useState("");

    function addNewTask() {
        if (newTask.trim() === "") return;
        const task = {
            id: crypto.randomUUID(),
            content: newTask
        }

        setColumns(prev => ({
            ...prev,
            [activeColumns]: {  
                ...prev[activeColumns],
                items: [...prev[activeColumns].items, task]
            }
        }))

        setNewTask("");
    }

    function removeTask(columnId, taskId) {
        const updatedColumns = { ...columns };
        updatedColumns[columnId].items = updatedColumns[columnId].items.filter(item => item.id !== taskId);
        setColumns(updatedColumns);
    }

    function handleEdit(task) {
        setEditingId(task.id);
        setText(task.content);
    }

    function saveEdit(columnId, taskId) {
        setColumns(prev => ({
            ...prev,
            [columnId]: {
                ...prev[columnId],
                items: prev[columnId].items.map(item =>
                    item.id === taskId
                        ? { ...item, content: text }
                        : item
                )
            }
        }));

        setEditingId(null);
    }

    function handleOnDrag(columnId, item) {
        setDraggedItem({ columnId, item })
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e, columnId) {
        e.preventDefault();
        if (!draggedItem) return;

        const { columnId: sourceColumnId, item } = draggedItem;
        if (sourceColumnId === columnId) return;
        const updatedColumns = { ...columns };

        updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter((i) => i.id != item.id)
        updatedColumns[columnId].items.push(item);

        setColumns(updatedColumns);
        setDraggedItem(null);
    }

    return (
        <main className="main">
            <div className="container">
                <h1 className="title">Drag and Drop Kanban Board</h1>
                <div className="input-bar shadow">
                    <input placeholder="Add smth..."
                        type="text"
                        id=""
                        name=""
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addNewTask()}
                    />

                    <select
                        value={activeColumns}
                        name=""
                        id=""
                        onChange={(e) => setActiveColumns(e.target.value)}
                    >
                        {Object.keys(columns).map((columnId) => (
                            <option
                                value={columnId}
                                key={columnId}>
                                {columns[columnId].name}
                            </option>
                        ))}
                    </select>

                    <button onClick={addNewTask} >Add</button>
                </div>
                <div className="board">
                    {Object.keys(columns).map((columnId) => (
                        <div
                            key={columnId}
                            className='column'
                            onDragOver={(e) => handleDragOver(e, columnId)}
                            onDrop={(e) => handleDrop(e, columnId)}
                        >
                            <div className="column-header">
                                <p>{columns[columnId].name}</p>
                                <span className="badge">
                                    {columns[columnId].items.length}
                                </span>
                            </div>
                            <div className="tasks">
                                {
                                    columns[columnId].items.length === 0 ? (
                                        <p className="message">Add or drop tasks here</p>
                                    ) :
                                        (columns[columnId].items.map((item) => {
                                            const isEditing = editingId === item.id;
                                            return (
                                                <div
                                                    key={item.id}
                                                    draggable={!isEditing}
                                                    onDoubleClick={() => handleEdit(item)}
                                                    onDragStart={() => handleOnDrag(columnId, item)}
                                                    className="task-card"
                                                >
                                                    {isEditing ? (
                                                        <input
                                                            value={text}
                                                            onChange={(e) => setText(e.target.value)}
                                                            onBlur={() => saveEdit(columnId, item.id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") saveEdit(columnId, item.id);
                                                            }}
                                                            autoFocus
                                                            id=""
                                                            name=""
                                                            className="edit-input"
                                                        />
                                                    ) : (
                                                        <span className="task-text">{item.content}</span>
                                                    )}
                                                    {!isEditing && (
                                                        <div className="task-icons">
                                                            <FaRegEdit
                                                                onClick={() => handleEdit(item)}
                                                                className="edit icon"
                                                            />
                                                            <FaXmark
                                                                onClick={() => removeTask(columnId, item.id)}
                                                                className="delete icon"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default App
