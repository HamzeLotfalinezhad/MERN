import { useEffect, useState } from "react";
import { ButtonSubmit } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axiosInstance";
import { Checkbox } from "../../components/form/Checkbox";
import { useSelector } from "react-redux";
// import { selectUser } from "../../store/UserSlice";
import { selectRecords } from "../../store/RecordSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse, faClipboardCheck, faClipboardUser } from '@fortawesome/free-solid-svg-icons';


export default function EditFailure(props) {
  // const user = useSelector(selectUser);
  const navigate = useNavigate();

  // const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);


  // Accessing record object from Redux store
  const record = useSelector(selectRecords);

  // Initialize form state
  const [form, setForm] = useState({
    user: record.user._id,
    patient: {
      age: null,
      smoker: false,
      diabetic: false,
      overweight: false
    },
    implant: {
      bodytype: null,
      diameter: null,
      size: null
    },
    boneType: '',
    tooth: {
      jaw: null,
      number: null
    }
  });

  // Update form state with record data when it changes
  useEffect(() => {
    if (record) {
      // Ensure record is not null or undefined
      setForm(prevForm => ({
        ...prevForm,
        ...record
      }));
    }
  }, [record]);

  const inputHandler = (e) => {
    try {
      const { name, value } = e.target;
      const propertyPath = name.split('.');

      // Creating a new copy of the form object
      // const updatedForm = { ...form };

      // Deep copy of form
      const updatedForm = JSON.parse(JSON.stringify(form));

      if (propertyPath.length === 1) {
        updatedForm[propertyPath[0]] = value
      }
      if (propertyPath.length === 2) {
        updatedForm[propertyPath[0]][propertyPath[1]] = value
      }

      setForm(updatedForm);
    } catch (error) {
      console.log(error);
    }

  }

  const handleCheckboxChange = (propertyName) => (isChecked) => {
    setForm((prevState) => ({
      ...prevState,
      patient: {
        ...prevState.patient,
        [propertyName]: isChecked, // Update the property value based on checkbox state
      },
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      form.user = record.user._id;
      const response = await axiosInstance.post('/record/update', form);

      if (response.data && response.data.errors && response.data.errors.length > 0) {
        const errors = response.data.errors.map((item, i) => (
          // <li key={i}>{item.msg}</li>
          <span key={i}>{item.msg}</span>
        ));
        // return setValidationErrors(errors);
        const error1 = errors[0];
        return toast.error(error1, { position: "top-center" })
      }

      if (response && response.status === 204) {
        navigate("/admin/profile")
      }
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
      <div className="row" style={{ padding: '0px 5px 15px 5px' }}>
        {/* <div>
          {validationErrors.length > 0 && (
            <div style={{ background: "#f05" }}>
              <ul dir="rtl">{validationErrors}</ul>
            </div>
          )}
        </div> */}

        <div className="col-md-4 col-sm-12 mx-auto mt-5">
          <form>
            <h2>
              <FontAwesomeIcon icon={faClipboardUser} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
              مشخصات بیمار</h2>
            <hr />

            <div className="form-row">
              <div className="form-group col-md-6 col-sm-12">
                <div className="form-check form-check-inline">
                  <label className="form-check-label" htmlFor="inlineCheckbox1">
                    سن بیمار:
                    <span style={{ color: '#0a5', paddingRight: '5px' }}>
                      {form && form.patient && form.patient.age ? form.patient.age : ''}
                    </span>
                  </label>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12" style={{ textAlign: 'left' }}>
                <input dir='rtl' onChange={inputHandler}
                  value={form.patient.age || ''}
                  type="number" name="patient.age" className="form-control form-control-sm" placeholder="سن تقریبی بیمار" />
              </div>
            </div>

            <div className="form-row">

              <div className="form-group col-md-12 mb-1">
                <Checkbox defaultChecked={record.patient.smoker}
                  handleCheckboxChange={handleCheckboxChange("smoker")} text="بیمار سیگاری است" />
              </div>
              <div className="form-group col-md-12 mb-1">
                <Checkbox defaultChecked={record.patient.diabetic}
                  handleCheckboxChange={handleCheckboxChange("diabetic")} text="بیمار دیابتی است" />
              </div>
              <div className="form-group col-md-12">
                <Checkbox defaultChecked={record.patient.overweight}
                  handleCheckboxChange={handleCheckboxChange("overweight")} text="بیمار دارای اضافه وزن است" />
              </div>
            </div>
            <hr></hr>
            <h5 style={{ margin: '0px' }}>
              <FontAwesomeIcon icon={faUserNurse} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
              {record.user.name}</h5>
          </form>
        </div>

        <div className="col-md-6 col-sm-12 mx-auto mt-5">
          <form>
            <h2>
              <FontAwesomeIcon icon={faClipboardCheck} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
              جزییات جراحی</h2>
            <hr />

            <div dir="rtl" className="form-row">
              <div className="form-group col-md-6 col-sm-12">
                <div className="form-check form-check-inline">
                  <label className="form-check-label" htmlFor="inlineCheckbox1">
                    نوع ایمپلنت:
                    <span style={{ color: '#0a5', paddingRight: '5px' }}>{form.implant.bodytype}</span>
                  </label>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12" style={{ textAlign: 'left' }}>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.bodytype === "SA"} onChange={inputHandler} type="radio" value="SA" id="SA" name="implant.bodytype" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="SA">SA</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.bodytype === "CA"} onChange={inputHandler} type="radio" id="CA" value="CA" name="implant.bodytype" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="CA">CA</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.bodytype === "BA"} onChange={inputHandler} type="radio" id="BA" value="BA" name="implant.bodytype" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="BA">BA</label>
                </div>
              </div>
            </div>
            <hr style={{ marginTop: '5px' }}></hr>

            <div dir="rtl" className="form-row" >
              <div className="form-group col-md-4">
                <div className="form-check form-check-inline">
                  <label className="form-check-label" htmlFor="inlineCheckbox1">
                    قطر ایمپلنت:
                    <span style={{ color: '#0a5', paddingRight: '5px' }}>{form.implant.diameter}</span>
                  </label>
                </div>
              </div>
              <div dir='ltr' className="form-group col-md-8" style={{ textAlign: 'left' }}>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.diameter === "3.5"} onChange={inputHandler} type="radio" id="d3.5" value="3.5" name="implant.diameter" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="d3.5">3.5</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.diameter === "4"} onChange={inputHandler} type="radio" id="d4" value="4" name="implant.diameter" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="d4">4</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.diameter === "4.5"} onChange={inputHandler} type="radio" id="d4.5" value="4.5" name="implant.diameter" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="d4.5">4.5</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.diameter === "5"} onChange={inputHandler} type="radio" id="d5" value="5" name="implant.diameter" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="d5">5</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.diameter === "6"} onChange={inputHandler} type="radio" id="d6" value="6" name="implant.diameter" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="d6">6</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.diameter === "7"} onChange={inputHandler} type="radio" id="d7" value="7" name="implant.diameter" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="d7">7</label>
                </div>
              </div>
            </div>

            <div dir="rtl" className="form-row" >
              <div dir='rtl' className="form-group col-md-4">
                <div className="form-check form-check-inline">
                  <label className="form-check-label" htmlFor="inlineCheckbox1">
                    سایز ایمپلنت:
                    <span style={{ color: '#0a5', paddingRight: '5px' }}>{form.implant.size}</span>
                  </label>
                </div>
              </div>
              <div dir='ltr' className="form-group col-md-8" style={{ textAlign: 'left' }}>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.size === "6"} onChange={inputHandler} type="radio" id="s6" value="6" name="implant.size" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="s6">6</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.size === "7"} onChange={inputHandler} type="radio" id="s7" value="7" name="implant.size" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="s7">7</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.size === "8.5"} onChange={inputHandler} type="radio" id="s8.5" value="8.5" name="implant.size" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="s8.5">8.5</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.size === "10"} onChange={inputHandler} type="radio" id="s10" value="10" name="implant.size" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="s10">10</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.size === "11.5"} onChange={inputHandler} type="radio" id="s11.5" value="11.5" name="implant.size" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="s11.5">11.5</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.implant && form.implant.size === "13"} onChange={inputHandler} type="radio" id="s13" value="13" name="implant.size" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="s13">13</label>
                </div>
              </div>
            </div>
            <hr style={{ marginTop: '5px' }}></hr>

            <div dir="rtl" className="form-row" >
              <div dir='rtl' className="form-group col-md-4">
                <div className="form-check form-check-inline">
                  <label className="form-check-label" htmlFor="inlineCheckbox1">
                    نوع سختی استخوان:
                    <span style={{ color: '#0a5', paddingRight: '5px' }}>{form.boneType}</span>
                  </label>
                </div>
              </div>
              <div dir='ltr' className="form-group col-md-8" style={{ textAlign: 'left' }}>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.boneType === "D1"} onChange={inputHandler} type="radio" id="bt1" value="D1" name="boneType" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="bt1">D1</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.boneType === "D2"} onChange={inputHandler} type="radio" id="bt2" value="D2" name="boneType" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="bt2">D2</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.boneType === "D3"} onChange={inputHandler} type="radio" id="bt3" value="D3" name="boneType" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="bt3">D3</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input checked={form && form.boneType === "D4"} onChange={inputHandler} type="radio" id="bt4" value="D4" name="boneType" className="custom-control-input" />
                  <label className="custom-control-label" htmlFor="bt4">D4</label>
                </div>
              </div>
            </div>


          </form>
          <hr style={{ marginTop: '5px' }}></hr>
          <ButtonSubmit onClick={submitForm} loading={loading} className="btn-warning" style={{ width: '100%' }}>ویرایش رکورد</ButtonSubmit>

        </div>
      </div>
    </>
  )
}