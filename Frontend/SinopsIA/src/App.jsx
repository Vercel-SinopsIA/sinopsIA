import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import './App.css'

function App() {
  return (
    <div className="bg-[#F5EFEB] min-h-screen flex flex-col">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;