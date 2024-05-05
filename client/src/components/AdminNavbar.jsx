import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom"
import { axiosInstance, baseURL } from "../api/axiosInstance";
import { useSelector } from "react-redux";
import { logout, selectUser } from "../store/UserSlice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../assets/images/logo.png'; // Import the logo image

export default function AdminNavbar() {

  const navigate = useNavigate();
  const user = useSelector(selectUser);
  var role = null
  if (user && user.user.role) role = user.user.role
  const dispatch = useDispatch();

  // useEffect(() => {
  // }, []);

  const Logout = async (e) => {
    try {
      const response = await axiosInstance.get(baseURL + "admin/logout")
      if (response.status === 200) {
        localStorage.setItem('accessToken', null)
        dispatch(logout());
        navigate("/admin/login")
      }
    } catch (error) { }
  }

  return (

    <nav dir='ltr' className="navbar navbar-expand-lg"
      style={{ boxShadow: "1px 1px 5px 1px #aaa", background: '#309' }}>
      <div className="container">
        <a className="navbar-brand" style={{ color: "#fff" }}>
          <img src={logoImg} alt="Logo" width="130px" />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span style={{ fontSize: '40px', color: '#fff' }}>=</span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul dir='rtl' className="navbar-nav ml-auto">
            {user ? (
              <>
                <button onClick={Logout} className="btn btn-sm btn-yellow ml-3">
                  <FontAwesomeIcon icon={faRightToBracket}/>
                </button>
                <CustomLink className="nav-link" to="/admin/profile">{user && user.user ? user.user.name : ''}</CustomLink>
                {(role === 'admin' || role === 'manager') &&
                  <>
                    <CustomLink className="nav-link" to="/admin/charts">نمودارها</CustomLink>
                    <CustomLink className="nav-link" to="/admin/users">تنظیمات</CustomLink>
                  </>
                }
              </>
            ) : (
              <CustomLink className="nav-link" to="/admin/login">ورود</CustomLink>
            )}
            {/* <CustomLink className="nav-link" to="/about">درباره ما</CustomLink> */}
          </ul>
        </div>
      </div>
    </nav>

  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  const liStyle = isActive ? { color: "#ff0", fontWeight: 700 } : { color: '#eee', fontWeight: 500 };
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props} style={liStyle}>
        {children}
      </Link>
    </li>
  )
}
