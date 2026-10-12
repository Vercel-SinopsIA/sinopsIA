import { useState } from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-[#F5EFEB] min-h-screen flex flex-col">
      <ToastContainer />
                <RouterProvider router={router} />
    </div>
  );
}

export default App;