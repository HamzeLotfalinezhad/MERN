import { useEffect, useState } from "react"
import { axiosInstance } from "../../api/axiosInstance"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faUser, faUserAlt, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import SearchInput from "../../components/ui/SearchInput.js";
import EditableTableCell from "../../components/ui/EditableTableCell.js";
import Loading from "../../components/ui/Loading.js";
import ExcelGenerator from "../../components/ExcelGenerator.js";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { dateFilter } from "../../assets/js/utils";
import transition from "react-element-popper/animations/transition"
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/UserSlice.js";

export default function EditUser() {
  const user = useSelector(selectUser);
  const role = user.user.role || ''

  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminOrUser, setIsAdminOrUser] = useState('user');
  const [searchUrl, setSearchUrl] = useState('record/searchUser');

  // const [searchResults, setSearchResults] = useState([]);
  const [searchSelectedUser, setSearchSelectedUser] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [searchSelectedUser]); // Trigger fetch when searchSelectedUser changes

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const obj = {
        _id: searchSelectedUser._id,
      }

      var response = null
      if (isAdminOrUser === 'user') response = await axiosInstance.post("record/getUser", obj);
      if (isAdminOrUser === 'admin') response = await axiosInstance.post("record/getAdmin", obj);

      if (response && response.data) {
        response.data.password = '' // password is empty so initialize it
        setUserData([response.data])
      }
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error);
    }
  };


  // Function to handle search results list below search input
  // const handleSearchResults = (results) => {
  //   if (results) setSearchResults(results);
  // };

  // When clicked on searchd user list items, get records of selected user
  const onClickSearchResult = async (item, url) => {
    setSearchSelectedUser(item)
    // setSearchResults([])
  }

  // Tbale on cell click edit
  const [userData, setUserData] = useState([]);
  const handleCellSave = async (newValue, rowIndex, colIndex) => {
    const updatedUserData = [...userData];
    const recordId = updatedUserData[rowIndex]._id;

    const oldValue = updatedUserData[rowIndex][colIndex];
    // Update the specific record in the state
    updatedUserData[rowIndex][colIndex] = newValue;
    setUserData(updatedUserData);

    try {
      setIsLoading(true)
      const obj = {
        _id: recordId,
        key: colIndex,
        value: newValue
      }
      var response = null
      if (isAdminOrUser === 'user') response = await axiosInstance.post('/record/editUserKeyValue', obj);
      if (isAdminOrUser === 'admin') response = await axiosInstance.post('/record/editAdminKeyValue', obj);

      if (response.data !== '') {
        updatedUserData[rowIndex][colIndex] = oldValue;
      }

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error updating record:', error);
    }
  };

  const switchAdminUser = () => {
    if (isAdminOrUser === 'admin') {
      setIsAdminOrUser('user')
      setSearchUrl('record/searchUser')
    }
    if (isAdminOrUser === 'user') {
      setIsAdminOrUser('admin')
      setSearchUrl('record/searchAdmin')
    }
  }


  // Dates
  let [date1, setDate1] = useState(new Date())
  let [date2, setDate2] = useState(new Date())
  let [date1Selected, setDate1Selected] = useState(false)
  let [date2Selected, setDate2Selected] = useState(false)

  function handleChangeDate1(value) {
    const pdate = value.year + '/' + value.month.number + '/' + value.day;
    const edate = dateFilter(pdate);
    setDate1(edate)
    setDate1Selected(true)
  }

  function handleChangeDate2(value) {
    const pdate = value.year + '/' + value.month.number + '/' + value.day;
    const edate = dateFilter(pdate);
    setDate2(edate)
    setDate2Selected(true)
  }



  let [excelData, setExcelData] = useState([])
  const excelColumns = [
    { header: 'Implant', key: 'implant', width: 15 },
    { header: 'Diameter-Lengrh', key: 'DL', width: 20 },
    { header: 'Bone Type', key: 'boneType', width: 15 },
    { header: 'Insertion Date', key: 'insertDate', width: 15 },
    { header: 'Removal Date', key: 'removalDate', width: 15 },
    { header: 'Doctor Name', key: 'DrName', width: 20 },
    { header: 'Patient Name', key: 'PatientName', width: 20 },
    { header: 'Smoker', key: 'smoker', width: 10 },
    { header: 'Diabitic', key: 'diabitic', width: 10 },
    { header: 'Overweight', key: 'overweight', width: 10 },
    { header: 'Reason of Failure', key: 'failureReason', width: 30 },
  ]

  const getDataForExcel = async () => {
    try {
      if (!date1Selected || !date2Selected) return toast.error('تاریخ را انتخاب کنید', { position: 'top-center' })

      setIsLoading(true)
      setExcelData([])
      const result = await axiosInstance.get('record/records', {
        params: {
          date1: date1,
          date2: date2
        }
      })

      setIsLoading(false)

      if (result.status === 200) {
        var data = []
        const data0 = result.data;
        data0.forEach(item => {
          data.push(
            {
              implant: 'TSIII ' + item.implant.bodytype,
              DL: item.implant.diameter + 'xH' + item.implant.size,
              boneType: item.boneType,
              insertDate: item.insertDate,
              removalDate: item.removeDate,
              DrName: item.user.nameEn,
              PatientName: item.patientName.en ? item.patientName.en : 'NA',
              smoker: item.patient.smoker ? 'Yes' : 'No',
              diabitic: item.patient.diabetic ? 'Yes' : 'No',
              overweight: item.patient.overweight ? 'Yes' : 'No',
              failureReason: item.extraInfo,
            }
          )
        });
        setExcelData(data)

      } else {
        toast.error('خطا در ایجاد خروجی اکسل', { position: 'top-center' })
      }

    } catch (error) {
      setIsLoading(false)
      toast.error('خطا در ایجاد اکسل', { position: 'top-center' })
    }
  }

  const getIncompleteUses = async () => {
    try {
      setIsLoading(true)
      const result = await axiosInstance.get('admin/incompleteUsers')

      setIsLoading(false)
      if (result.status === 200) {
        result.data.forEach(item => {
          item.password = ''
        });
        setUserData(result.data)
      }
    } catch (error) {
      toast.error('خطا', { position: 'top-center' })
    }
  }


  return (
    <>
      <div className="container mt-5">
        <h4>
          <FontAwesomeIcon icon={faUsers} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
          <span style={{ cursor: 'pointer' }}>
            {isAdminOrUser === 'user' ? 'کاربران' : 'ادمین ها'}
          </span>
          <span>
            <button onClick={() => { getIncompleteUses() }} className="btn btn-sm btn-warning mr-2">دریافت کاربران ناقص</button>
          </span>
          <span><Loading isLoading={isLoading} /></span>

          <span style={{ marginRight: '5px', float: 'left' }}>
            <div>
              <div className="input-group">
                {role === 'admin' &&
                  <button onClick={() => switchAdminUser()} className="btn btn-sm btn-end mr-2">{isAdminOrUser}</button>
                }
                <SearchInput
                  url={searchUrl}
                  // onSearchResults={handleSearchResults}
                  onClickSearchResult={onClickSearchResult}
                  width='300px'
                  placeholder="جستجو ..." />
              </div>
            </div>
          </span>
        </h4>

        {userData && userData.length > 0 ?
          <div className="card mt-4" style={{ boxShadow: "1px 1px 2px 1px #aaa", borderRadius: '8px' }}>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">نام فارسی</th>
                  <th scope="col">نام انگلیسی</th>
                  <th scope="col">شماره همراه</th>
                  <th scope="col">رمز عبور</th>
                  <th scope="col">سطح دسترسی</th>
                </tr>
              </thead>
              <tbody>
                {userData ? userData.map((user, rowIndex) => (
                  <tr key={rowIndex}>
                    <EditableTableCell
                      value={user.name}
                      dir='rtl'
                      onSave={(newValue) => handleCellSave(newValue, rowIndex, 'name')}
                    />
                    <EditableTableCell
                      value={user.nameEn}
                      dir='ltr'
                      onSave={(newValue) => handleCellSave(newValue, rowIndex, 'nameEn')}
                    />
                    <EditableTableCell
                      value={user.phone}
                      dir='ltr'
                      onSave={(newValue) => handleCellSave(newValue, rowIndex, 'phone')}
                    />
                    <EditableTableCell
                      value={user.password}
                      dir='ltr'
                      onSave={(newValue) => handleCellSave(newValue, rowIndex, 'password')}
                    />
                    <EditableTableCell
                      value={user.role}
                      dir='ltr'
                      onSave={(newValue) => handleCellSave(newValue, rowIndex, 'role')}
                    />
                  </tr>
                )) : null}
              </tbody>
            </table>
          </div>
          : ''}
      </div >
      <hr></hr>

      {/* Excel export */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4>
              <FontAwesomeIcon icon={faFileExcel} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
              <span style={{ cursor: 'pointer' }}>
                خروجی اکسل
              </span>
            </h4>

            <div className="form-row mt-4">

              <div dir='ltr' className="col-auto">
                <div className="input-group input-group-sm mb-2">
                  <DatePicker
                    inputClass="form-control form-control-sm text-center"
                    animations={[transition()]}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    onChange={handleChangeDate1}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">از تاریخ</div>
                  </div>
                </div>
              </div>
              <div dir='ltr' className="col-auto">
                <div className="input-group input-group-sm mb-2">
                  <DatePicker
                    inputClass="form-control form-control-sm text-center"
                    animations={[transition()]}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    onChange={handleChangeDate2}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">تا تاریخ</div>
                  </div>
                </div>
              </div>
              <div dir='ltr' className="col-auto">
                <button className="btn btn-sm btn-success" onClick={() => { getDataForExcel() }}>
                  دریافت دیتا
                </button>
              </div>
              {(excelData && excelData.length > 0) &&
                <div dir='ltr' className="col-auto">
                  <ExcelGenerator name="Osstem Failure Report" data={excelData} columns={excelColumns} />
                </div>
              }
            </div>



          </div>
        </div>
      </div>

    </>
  )
}
