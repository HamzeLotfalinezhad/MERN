import { useEffect, useState } from "react";
import { ButtonSubmit } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axiosInstance";
import decodeAccessToken from "../../utils/decodeAccessToken"
import { useDispatch } from "react-redux";
import { login } from "../../store/UserSlice";
import logoImg from '../../assets/images/osstem logo.png'; // Import the logo image

export default function Login() {
  const users = {
    phone: "",
    password: ""
  }
  const [user, setUser] = useState(users);
  // const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value }); // update user object state
  }

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axiosInstance.post('/user/login', user);

      if (response.status === 201) {
        return toast.error(response.data.msg, { position: "top-center" })
      }
      if (response.status === 202) {
        const errors = response.data.errors.map((item, i) => (
          // <li key={i}>{item.msg}</li>
          <span key={i}>{item.msg}</span>
        ));
        // return setValidationErrors(errors);
        const error1 = errors[0];
        return toast.error(error1, { position: "top-center" })
      }

      if (response && response.status === 200) {
        const { accessToken } = response.data;
        const userInfo = decodeAccessToken(accessToken);
        // add user state to store
        dispatch(login({
          user: userInfo,
          isAdmin: false
        }))

        navigate("/user/profile")
      }

    } catch (error) {
      toast.error(error.message, { position: "top-center" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="col-md-4 col-12 mx-auto mt-5">
        {/* <div>
          {validationErrors.length > 0 && (
            <div style={{ background: "#f05" }}>
              <ul dir="rtl">{validationErrors}</ul>
            </div>
          )}
        </div> */}
        <div className="card" style={{ boxShadow: "1px 1px 2px 1px #aaa", borderRadius: '8px', padding: '15px 25px 15px 25px' }}>
          <form>
            <h3>ورود
              <span className="float-left">
                <img src={logoImg} style={{ width: '100px' }} />
              </span>
            </h3>
            <hr></hr>

            <div className="col-12 mt-3 mb-3">
              <div className="form-floating">
                <input dir='ltr' type="text"
                  className="text-center" required onChange={inputHandler} name="phone" />
                <label>شماره همراه</label>
              </div>
            </div>

            <div className="col-12 mt-3 mb-3">
              <div className="form-floating">
                <input dir='ltr' type="password"
                  className="text-center" required onChange={inputHandler} name="password" />
                <label>رمز عبور</label>
              </div>
            </div>

            <div dir='ltr' className="col-auto">
              <ButtonSubmit onClick={submitForm} loading={loading}
                className="btn-primary"
                width='100%'
              >ورود
              </ButtonSubmit>
            </div>

          </form>
          <hr></hr>
          <span id="emailHelp" className="form-text text-muted mt-2">
            <span>ثبت نام نکرده اید؟ </span>
            <Link to="/user/register">ثبت نام کنید</Link>
          </span>
        </div>
      </div>
    </>
  )
}
