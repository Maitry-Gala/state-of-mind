import { Dashboard } from "./pages/Dashboard"
import { AuthPage } from "./pages/AuthPage"
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <>
    <Toaster position="top-right" richColors/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
 