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
        };

        setColumns(prev => ({
            ...prev,
            todo: {
                ...prev.todo,
                items: [...prev.todo.items, task]
            }
        }));
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

    console.log(columns);

    return (
        <main className="min-h-screen w-full flex items-center justify-center flex-col gap-10">
            <h1 className="text-4xl font-extrabold text-[#303650] text-center mt-8">Drag and Drop Kanban Board</h1>
            <div className="rounded-lg bg-amber-50 max-w-lg xl:w-full flex overflow-hidden shadow mx-3">
                <input className="focus:outline-none w-full py-3 text-gray-800 inp placeholder:text-gray-500 pl-5" placeholder="Add something..."
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNewTask()}
                />

                <select value={activeColumns} name="" id=""
                    className="px-2 text-black mr-2 outline-none border-l cursor-pointer"
                    onChange={(e) => setActiveColumns(e.target.value)}
                >
                    {Object.keys(columns).map((columnId) => (
                        <option value={columnId} key={columnId}>
                            {columns[columnId].name}
                        </option>
                    ))}
                </select>

                <button onClick={addNewTask} className="text-white cursor-pointer bg-amber-500 px-8 font-bold">Add</button>
            </div>
            <div className="flex items-center justify-center gap-8 flex-wrap overflow-x-auto w-full mb-8 text-white">
                {Object.keys(columns).map((columnId) => (
                    <div
                        key={columnId}
                        className='w-80 h-96 bg-[#30364F] rounded-xl p-5 overflow-auto [&::-webkit-scrollbar]:w-px'
                        onDragOver={(e) => handleDragOver(e, columnId)}
                        onDrop={(e) => handleDrop(e, columnId)}
                    >
                        <div className="bg-amber-50 rounded-xl flex items-center justify-between text-black px-4 py-2 mb-3">
                            <p className="font-medium">{columns[columnId].name}</p>
                            <span className="bg-amber-500 text-white w-6 h-6 flex justify-center items-center rounded-full">
                                {columns[columnId].items.length}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {columns[columnId].items.map((item) => {
                                const isEditing = editingId === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        draggable={!isEditing}
                                        onDoubleClick={() => handleEdit(item)}
                                        onDragStart={() => handleOnDrag(columnId, item)}
                                        className="rounded-xl cursor-pointer flex items-center border border-[#222636] hover:border-[#fe9900] justify-between bg-[#222636] px-4 py-2.5"
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
                                                className="bg-transparent outline-none text-white w-full"
                                            />
                                        ) : (
                                            <span className="truncate">{item.content}</span>
                                        )}
                                        {!isEditing && (
                                            <div className="flex gap-2 items-center">
                                                <FaRegEdit
                                                    onClick={() => handleEdit(item)}
                                                    className="cursor-pointer hover:text-blue-600"
                                                />
                                                <FaXmark
                                                    onClick={() => removeTask(columnId, item.id)}
                                                    className="cursor-pointer hover:text-red-600"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default App
