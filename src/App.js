import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import LayoutWrapper from "./components/LayoutWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductTable from "./components/admin/ProductTable";
import AdminDashboard from "./components/admin/AdminDashboard";
import CourierTable from "./components/admin/CourierTable";
import CitiesTable from "./components/admin/CitiesTable";
import RegionsTable from "./components/admin/RegionsTable";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="main" element={<LayoutWrapper />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductTable />} />
          <Route path="couriers" element={<CourierTable />} />
          <Route path="cities" element={<CitiesTable />} />
          <Route path="regions" element={<RegionsTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
