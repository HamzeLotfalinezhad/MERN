import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axiosInstance";
import { ButtonSubmit } from "../../components/ui/Button";

export default function Register() {

  const users = {
    name: "",
    phone: "",
    password: "",
    repeatPassword: ""
  }

  const [user, setUser] = useState(users);
  const [validationErrors, setValidationErrors] = useState([]);
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
      const response = await axiosInstance.post('/admin/register', user);

      if (response.status === 202) {
        const errors = response.data.errors.map((item, i) => (
          <span key={i}>{item.msg}</span>
        ));
        // return setValidationErrors(errors);
        const error1 = errors[0];
        return toast.error(error1, { position: "top-center" })
      }

      navigate("/admin/login")

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
            <h4>ثبت نام ادمین</h4>
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

            <div dir='ltr' className="col-auto mt-3 mb-4">
              <ButtonSubmit onClick={submitForm} loading={loading} width='100%' className="btn-primary" >ثبت نام</ButtonSubmit>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
