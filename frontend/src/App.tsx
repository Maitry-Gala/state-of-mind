import { Dashboard } from "./pages/Dashboard"
import { AuthPage } from "./pages/AuthPage"
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { SharedBrain } from "./pages/ShareBrain";

function ProtectedRoute({children}: {children: React.ReactNode}) {
  const token = localStorage.getItem("token");
  if(!token) return <Navigate to="/" replace />;
  return<>{children}</>
}

function App() {
  return (
    <>
    <Toaster position="top-right" richColors/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/brain/:shareLink" element={<SharedBrain />} />
        
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
 