// import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./pages/Layout.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css"
function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </AuthProvider>

    );
}

export default App
