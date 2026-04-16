import { TaskProvider } from "./context/TaskContext";
import MainApp from "./MainApp";
import "./App.css";

function App() {
    return (
        <TaskProvider>
            <MainApp />
        </TaskProvider>
    )
}

export default App