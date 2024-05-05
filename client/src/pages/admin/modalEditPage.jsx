import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { selectRecords } from '../../store/RecordSlice';
import { ButtonSubmit } from '../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faClipboardUser, faTimes, faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from '../../components/form/Checkbox';
import ConfirmPassModal from '../../components/modal/confirmPassModal';
// import { selectUser } from '../../store/UserSlice';
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { dateFilter, pr_num } from "../../assets/js/utils";
import transition from "react-element-popper/animations/transition"
import { Input } from '../../components/form/Input';

const ModalEditPage = ({ show, onHide }) => {

  // const user = useSelector(selectUser);

  // const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Accessing record object from Redux store
  const record = useSelector(selectRecords);

  // Initialize form state
  const [form, setForm] = useState({
    user: record ? record.user._id : '',
    insertDate: '',
    insertDatePr: '',
    removeDate: '',
    removeDatePr: '',
    dateDiff: '',
    patientName: {
      fa: null,
      en: null
    },
    patient: {
      age: null,
      smoker: false,
      diabetic: false,
      overweight: false
    },
    implant: {
      bodytype: null,
      diameter: null,
      size: null,
      code: null
    },
    boneType: '',
    tooth: {
      jaw: null,
      number: null
    },
    extraInfo: ''
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

      const date11 = new Date(form.insertDate);
      const date22 = new Date(form.removeDate);
      if (date22 <= date11) {
        return toast.error('تاریخ جایگذاری باید کمتر از تاریخ خارج شدن باشد', { position: "top-center" })
      }

      if (!form.patientName.en || form.patientName.en === '') return toast.error('نام انگلیسی بیمار وارد کنید', { position: 'top-center' })

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
        onHide()
        // navigate("/admin/profile")
      }
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // Modal pass confirm before delete
  const [showPassModal, setShowPassModal] = useState(false)
  const deleteRecord = () => setShowPassModal(true)
  const onHidePassModal = () => setShowPassModal(false)

  const onConfirmPassModal = async () => {
    const obj = { data: { _id: record._id, user: record.user._id } }
    const response = await axiosInstance.delete('/admin/deleteRecord', obj);
    if (response.status === 204) {
      onHide()
      onHidePassModal()
    }
  }


  // Dates
  let [date1, setDate1] = useState(new Date())
  let [date2, setDate2] = useState(new Date())

  function handleChangeDate1(value) {
    const pdate = value.year + '/' + value.month.number + '/' + value.day;
    const edate = dateFilter(pdate);
    setDate1(edate)

    // Update form object
    const updatedForm = JSON.parse(JSON.stringify(form));
    updatedForm['insertDate'] = edate
    updatedForm['insertDatePr'] = pdate
    setForm(updatedForm);
  }

  function handleChangeDate2(value) {
    const pdate = value.year + '/' + value.month.number + '/' + value.day;
    const edate = dateFilter(pdate);
    setDate2(edate)

    // Date difference
    const date11 = new Date(date1);
    const date22 = new Date(date2);
    const differenceMs = Math.abs(date22 - date11);
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    // Update form object
    var updatedForm = JSON.parse(JSON.stringify(form));
    updatedForm['removeDate'] = edate
    updatedForm['removeDatePr'] = pdate
    updatedForm['dateDiff'] = differenceDays
    setForm(updatedForm);
  }

  return (
    <>
      <ConfirmPassModal show={showPassModal} onHide={onHidePassModal} onConfirm={onConfirmPassModal} />

      <Modal show={show} onHide={onHide} dialogClassName="fullscreen-modal">
        <Modal.Header>
          <Modal.Title>
            {record && record.isVerified ?
              <><span style={{ color: '#e05', fontSize: '20px' }}> امکان ویرایش وجود ندارد </span></>
              :
              <span>ویرایش</span>
            }

            <span style={{ margin: '0px 20px', textAlign: 'right', fontSize: '18px', color: 'rgb(57 92 250)' }}>
              (
              <FontAwesomeIcon icon={faUserNurse} style={{ paddingLeft: '10px' }} />
              {record && record.user.name}
              )
            </span>
          </Modal.Title>
          <span style={{ float: 'left', fontSize: '25px', cursor: 'pointer' }} onClick={() => { onHide() }}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </Modal.Header>
        <Modal.Body className='text-center'>

          <div className="row mb-5" style={{ padding: '0px 5px 15px 5px' }}>
            {/* <div>
          {validationErrors.length > 0 && (
            <div style={{ background: "#f05" }}>
              <ul dir="rtl">{validationErrors}</ul>
            </div>
          )}
        </div> */}

            <div className="col-md-4 col-sm-12 mx-auto mt-1 text-right">
              <form>
                <h4>
                  <FontAwesomeIcon icon={faClipboardUser} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
                  مشخصات بیمار</h4>
                <hr />

                <div className="form-row text-right">
                  <div className="form-group col-md-7 col-sm-12">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        تاریخ جایگذاری ایمپلنت:
                        <span style={{ color: '#0a5', paddingRight: '5px' }}>
                          {/* {form && form.insertDate ? form.insertDate : ''} */}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div dir='rtl' className="col-md-5 col-sm-12 input-group input-group-sm mb-3">
                    <DatePicker
                      value={form.insertDatePr}
                      inputClass="form-control form-control-sm text-center"
                      animations={[transition()]}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      onChange={handleChangeDate1}
                    />
                  </div>
                </div>

                <div className="form-row mt-0 text-right">
                  <div className="form-group col-md-7 col-sm-12">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        تاریخ خارج کردن ایمپلنت:
                        <span style={{ color: '#0a5', paddingRight: '5px' }}>
                          {/* {form && form.removeDate ? form.removeDate : ''} */}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div dir='rtl' className="col-md-5 col-sm-12 input-group input-group-sm mb-3">
                    <DatePicker
                      value={form.removeDatePr}
                      inputClass="form-control form-control-sm text-center"
                      animations={[transition()]}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      onChange={handleChangeDate2}
                    />
                  </div>
                </div>

                <div className="form-row text-right">
                  <div className="form-group col-md-8 col-sm-12">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        فاصله زمانی:
                        <span style={{ color: '#0a5', paddingRight: '5px' }}>
                          {form && form.dateDiff ? pr_num(form.dateDiff) + ' ' : ''}
                          روز
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <hr></hr>

                <div className="form-row">
                  <div className="form-group col-md-6 col-sm-12">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        نام بیمار:
                        {/* <span style={{ color: '#0a5', paddingRight: '5px' }}>
                      {form && form.patient && form.patient.age ? form.patient.age : ''}
                    </span> */}
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-6 col-sm-12 text-right">
                    <Input inputHandler={inputHandler}
                      value={form.patientName.fa}
                      name="patientName.fa" className="form-control-sm"
                      letter='fa' placeholder="نام بیمار" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6 col-sm-12">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        نام انگلیسی بیمار:
                        {/* <span style={{ color: '#0a5', paddingRight: '5px' }}>
                      {form && form.patient && form.patient.age ? form.patient.age : ''}
                    </span> */}
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-6 col-sm-12">
                    <Input dir="ltr" inputHandler={inputHandler}
                      value={form.patientName.en}
                      name="patientName.en" className="form-control-sm text-left"
                      letter='en' placeholder="نام انگلیسی" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6 col-sm-12 text-right">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        سن بیمار:
                        <span style={{ color: '#0a5', paddingRight: '5px' }}>
                          {form && form.patient && form.patient.age ? form.patient.age : ''}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-6 col-sm-12 text-left">
                    <Input inputHandler={inputHandler}
                      value={form.patient.age}
                      name="patient.age" className="form-control-sm text-right"
                      letter='num' placeholder="سن بیمار" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-12 mb-1">
                    <Checkbox defaultChecked={record && record.patient.smoker}
                      handleCheckboxChange={handleCheckboxChange("smoker")} text="بیمار سیگاری است" />
                  </div>
                  <div className="form-group col-md-12 mb-1">
                    <Checkbox defaultChecked={record && record.patient.diabetic}
                      handleCheckboxChange={handleCheckboxChange("diabetic")} text="بیمار دیابتی است" />
                  </div>
                  <div className="form-group col-md-12">
                    <Checkbox defaultChecked={record && record.patient.overweight}
                      handleCheckboxChange={handleCheckboxChange("overweight")} text="بیمار دارای اضافه وزن است" />
                  </div>
                </div>
                <hr></hr>
                {/* <h5 style={{ margin: '0px', textAlign: 'right' }}>
                  <FontAwesomeIcon icon={faUserNurse} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
                  {record && record.user.name}</h5> */}
              </form>
            </div>

            <div className="col-md-6 col-sm-12 mx-auto mt-1 text-right">
              <form>
                <h4>
                  <FontAwesomeIcon icon={faClipboardCheck} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
                  جزییات جراحی</h4>
                <hr />

                <div dir="rtl" className="form-row">
                  <div className="form-group col-md-6 col-sm-12 text-right">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        نوع ایمپلنت:
                        <span style={{ color: '#0a5', paddingRight: '5px' }}>{form.implant.bodytype}</span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-6 col-sm-12 text-left">
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

                <div dir="rtl" className="form-row" >
                  <div className="form-group col-md-4 text-right">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        قطر ایمپلنت:
                        <span style={{ color: '#0a5', paddingRight: '5px' }}>{form.implant.diameter}</span>
                      </label>
                    </div>
                  </div>
                  <div dir='ltr' className="form-group col-md-8 text-left">
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

                <div dir="rtl" className="form-row">
                  <div dir='rtl' className="form-group col-md-4 text-right">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        سایز ایمپلنت:
                        <span style={{ color: '#0a5', paddingRight: '5px' }}>{form.implant.size}</span>
                      </label>
                    </div>
                  </div>
                  <div dir='ltr' className="form-group col-md-8 text-left">
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

                <div dir="rtl" className="form-row" >
                  <div dir='rtl' className="form-group col-md-4 text-right">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        سختی استخوان:
                        <span style={{ color: '#0a5', paddingRight: '5px' }}>{form.boneType}</span>
                      </label>
                    </div>
                  </div>
                  <div dir='ltr' className="form-group col-md-8 text-left">
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
                <hr style={{ marginTop: '5px' }}></hr>

                <div className="form-row">
                  <div className="form-group col-md-6 col-sm-12">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="inlineCheckbox1">
                        شماره سریال ایمپلنت:
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-6 col-sm-12 text-left">
                    <Input inputHandler={inputHandler} value={form.implant.code}
                      name="implant.code" className="form-control-sm text-center"
                      dir='ltr' letter='en-num' placeholder="شماره سریال ایمپلنت" />
                  </div>
                </div>

                <div className="form-group">
                  <label>توضیح دلایل fail شدن</label>
                  <textarea onChange={inputHandler} name="extraInfo"
                    className="form-control" rows="3" value={form.extraInfo}></textarea>
                </div>

              </form>
              <hr style={{ marginTop: '5px' }}></hr>
              {record && !record.isVerified &&
                <div className="text-right">
                  <ButtonSubmit onClick={submitForm} loading={loading} className="btn-sm btn-warning" width="50%" style={{ width: '100%' }}>ویرایش رکورد</ButtonSubmit>
                  <ButtonSubmit onClick={deleteRecord} loading={loading} className="btn-sm btn-danger mr-2" style={{ width: '100%' }}>حذف</ButtonSubmit>
                </div>
              }
            </div>
          </div>

        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalEditPage;
