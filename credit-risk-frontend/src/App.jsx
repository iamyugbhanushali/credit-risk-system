import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";


function App() {

  return (

      <BrowserRouter>

          <Routes>

              {/* Public Routes */}

              <Route
                  path="/login"
                  element={<Login />}
              />

              <Route
                  path="/register"
                  element={<Register />}
              />


              {/* Protected Dashboard */}

              <Route
                  path="/dashboard"
                  element={
                      <ProtectedRoute>

                          <Dashboard />

                      </ProtectedRoute>
                  }
              />


              {/* Default Route */}

              <Route
                  path="*"
                  element={<Login />}
              />

          </Routes>

      </BrowserRouter>
  );
}


export default App;