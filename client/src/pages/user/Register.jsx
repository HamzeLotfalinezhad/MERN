import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axiosInstance";
import { ButtonSubmit } from "../../components/ui/Button";
import logoImg from '../../assets/images/osstem logo.png'; // Import the logo image

export default function Register() {

  const users = {
    name: "",
    phone: "",
    password: "",
    repeatPassword: ""
  }

  // in VueJs you have params which can update easily anywhere,
  // in react for each param (object, list or boolean) you must create useState
  // ex: [currentValue, functionToUpdateValue] = useState(initialValue);
  const [user, setUser] = useState(users);
  // const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value }); // update user object state
  }

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post('/user/register', user);

      if (response.status === 202) {
        const errors = response.data.errors.map((item, i) => (
          // <li key={i}>{item.msg}</li>
          <span key={i}>{item.msg}</span>
        ));
        // return setValidationErrors(errors);
        const error1 = errors[0];
        return toast.error(error1, { position: "top-center" })
      }
      // toast.success(response.data.msg, { position: "top-center", style: { background: '#fff' } })
      navigate("/user/login")

    } catch (error) {
      setLoading(false)
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
            <h3>ثبت نام
              <span className="float-left">
                <img src={logoImg} style={{ width: '100px' }} />
              </span>
            </h3>
            <hr></hr>
            <div className="col-12 mt-3 mb-3">
              <div className="form-floating">
                <input dir='rtl' type="text" onChange={inputHandler}
                  className="text-center" required name="name" />
                <label>نام و نام خانوادگی</label>
              </div>
            </div>

            <div className="col-12 mt-3 mb-3">
              <div className="form-floating">
                <input dir='ltr' type="text" onChange={inputHandler} placeholder="0912...."
                  className="text-center" required name="phone" />
                <label>شماره همراه</label>
              </div>
            </div>

            <div className="col-12 mt-3 mb-3">
              <div className="form-floating">
                <input type="password" onChange={inputHandler}
                  className="text-center" required name="password" />
                <label>رمز عبور</label>
              </div>
            </div>

            <div className="col-12 mt-3 mb-3">
              <div className="form-floating">
                <input type="password" onChange={inputHandler}
                  className="text-center" required name="repeatPassword" />
                <label>تکرار رمز عبور</label>
              </div>
            </div>

            <ButtonSubmit onClick={submitForm} loading={loading} className="btn-primary" width='100%'>ثبت نام</ButtonSubmit>
          </form>
          <hr></hr>
          <span id="emailHelp" className="form-text text-muted mt-2">
            <span>ثبت نام کرده اید؟ </span>
            <Link to="/user/login">وارد شوید</Link>
          </span>
        </div>
      </div>
    </>
  )
}
