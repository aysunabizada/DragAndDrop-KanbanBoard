import { useContext } from 'react'
import Column from './component/Column/Column'
import InputBar from './component/InputBar/InputBar'
import { TaskContext } from './context/TaskContext'

function MainApp() {
    const { state } = useContext(TaskContext);

    return (
        <main className="main">
            <div className="container">
                <h1 className="title">Drag and Drop Kanban Board</h1>
                <InputBar />
                <div className="board">
                    {Object.keys(state.columns).map((columnId) => (
                        <Column key={columnId} columnId={columnId} />
                    ))}
                </div>
            </div>
        </main>
    )
}

export default MainApp