import { Navigate, Route, Routes } from "react-router-dom";
import { ServiceListPage } from "./features/services/pages/ServiceListPage";
import { AppNav } from "./components/AppNav";


export default function App() {
  return (
    <>
      <AppNav />
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route path="/services" element={<ServiceListPage />} />
      </Routes>
    </>
  );
}
