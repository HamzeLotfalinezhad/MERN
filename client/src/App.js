import Register from "./pages/user/Register"
import Login from "./pages/user/Login"
import Home from "./pages/user/Home"
import About from "./pages/About"
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectiveRoutes from "./api/ProtectiveRoutes"
import AddFailure from "./pages/user/AddFailure"
import EditFailure from "./pages/user/EditFailure"
import './assets/css/main.css'
import Footer from "./components/Footer"

import AdminHome from "./pages/admin/Home"
import AdminLogin from "./pages/admin/Login"
import AdminRegister from "./pages/admin/Register"
import MainNavbar from "./components/MainNavbar"
import Page404 from "./pages/Page404"
import AdminEditUser from "./pages/admin/EditUser"
import AdminCharts from "./pages/admin/Charts"

function App() {

  // useEffect(() => {
  // Alert for 403 Error
  // axiosResponseInterceptor(setTokenExpiringAlert);
  // }, []);

  return (
    <BrowserRouter>
      <>
        <MainNavbar />

        <div className="container">
          {/* {isTokenExpiring && <TokenExpirationAlert />} */}
          <Routes >

            {/* User Routes */}
            <Route path="/" element={<Navigate to="/user/login" />} />
            <Route path="/user/profile" element={<ProtectiveRoutes><Home /></ProtectiveRoutes>} />
            <Route path="/user/register" element={<ProtectiveRoutes><Register /></ProtectiveRoutes>} />
            <Route path="/user/login" element={<ProtectiveRoutes><Login /></ProtectiveRoutes>} />
            <Route path="/user/addFailure" element={<ProtectiveRoutes><AddFailure /></ProtectiveRoutes>} />
            <Route path="/user/edit" element={<ProtectiveRoutes><EditFailure /></ProtectiveRoutes>} />
            <Route path="/about" element={<About />} />

            {/* Admin Routes */}
            <Route path="/" element={<Navigate to="/admin/login" />} />
            <Route path="/admin/profile" element={<ProtectiveRoutes><AdminHome /></ProtectiveRoutes>} />
            <Route path="/admin/register" element={<ProtectiveRoutes><AdminRegister /></ProtectiveRoutes>} />
            <Route path="/admin/login" element={<ProtectiveRoutes><AdminLogin /></ProtectiveRoutes>} />
            {/* <Route path="/admin/edit" element={<ProtectiveRoutes><AdminEditFailure /></ProtectiveRoutes>} /> */}
            <Route path="/admin/users" element={<ProtectiveRoutes><AdminEditUser /></ProtectiveRoutes>} />
            <Route path="/admin/charts" element={<ProtectiveRoutes><AdminCharts /></ProtectiveRoutes>} />

            {/* Add a catch-all route for unknown paths */}
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
            <Route path="*" element={<Page404 />} />
            <Route path="/404" element={<Page404 />} />

          </Routes >
        </div>
        <Footer />
      </>
    </BrowserRouter>
  );
}

export default App;


