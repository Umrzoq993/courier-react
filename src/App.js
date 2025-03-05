import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import LayoutWrapper from "./components/LayoutWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="main" element={<LayoutWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
