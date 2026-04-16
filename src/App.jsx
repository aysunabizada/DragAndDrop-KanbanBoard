import { TaskProvider } from "./context/TaskContext";
import MainApp from "./MainApp";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            
            <TaskProvider>
                <MainApp />
            </TaskProvider>
        </>
    )
}

export default App