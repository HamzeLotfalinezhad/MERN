import { useEffect, useState } from "react"
import { axiosInstance } from "../../api/axiosInstance"
import { Link } from "react-router-dom";
import { pr_date, pr_num, timeAgoPr } from "../../assets/js/utils.js";
import { useDispatch } from "react-redux";
import { addRecord } from "../../store/RecordSlice.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faClockRotateLeft, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from "../../components/ui/Button.js";
import ConfirmModal from "../../components/modal/confirmModal.js";
import SearchInput from "../../components/ui/SearchInput.js";
import ModalEditPage from "./modalEditPage";
import Loading from "../../components/ui/Loading.js";
import { selectUser } from "../../store/UserSlice.js";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector(selectUser);
  const role = user.user.role || null;

  const roles_manager = ['admin', 'manager']
  const roles_coordinator = ['admin', 'coordinator']

  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([])
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [responseLength, setResponseLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Adjust page size as needed


  // const [searchResults, setSearchResults] = useState([]);
  const [searchSelectedUser, setSearchSelectedUser] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchSelectedUser]); // Trigger fetch when currentPage changes

  const fetchData = async () => {
    try {
      setIsLoading(true)
      if (searchSelectedUser) { // show searched user records

        const obj = {
          _id: searchSelectedUser._id,
          page: currentPage,
          pageSize: pageSize
        }
        const response = await axiosInstance.post("record/getUserRecords", obj);
        if (response && response.data) {
          setRecords(response.data);
          setResponseLength(response.data.length);
        }

      } else { // show all recent records

        setSearchSelectedUser(false)
        const response = await axiosInstance.get("record/getALlRecent", {
          params: {
            page: currentPage,
            pageSize: pageSize
          }
        });
        if (response && response.data) {
          setRecords(response.data);
          setResponseLength(response.data.length);
        }

      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error);
    }
  };

  // When clicked on Edit icon, Go to edit Page
  const handleEdit = (item) => {
    dispatch(addRecord(item)); // store selected item in store redux
  };

  // pagination
  const nextPage = () => {
    // if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
    // }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function when modal submit btn clicked
  const confirmModalIsVerified = async () => {
    try {
      const response = await axiosInstance.post("record/verifyRecord",
        {
          _id: this_item._id,
          isVerified: this_isVerified
        })
      if (response) fetchData();
    } catch (error) {
    }
  }

  // Function to handle search results list below search input
  // const handleSearchResults = (results) => {
  //   if (results) setSearchResults(results);
  // };

  // When clicked on searchd user list items, get records of selected user
  const onClickSearchResult = async (item) => {
    setSearchSelectedUser(item)
    // setSearchResults([])
  }

  // Modal edit record
  const [showEditModal, setShowEditModal] = useState(false);
  const handleCloseModalEdit = () => {
    setShowEditModal(false);
    fetchData();
  };
  const handleShowModalEdit = (item) => {
    dispatch(addRecord(item)); // store item
    setShowEditModal(true);
  }

  // show modal confirm verify btn
  const [showModalVerified, setShowModalVerified] = useState(false);
  const handleCloseModalVerified = () => setShowModalVerified(false);
  const handleShowModalVerified = () => setShowModalVerified(true);

  const [this_item, setThisItem] = useState(null);
  const [this_isVerified, setThisisVerified] = useState(null);
  const handleVerifyRecord = async (item, isVerified) => {
    handleShowModalVerified();
    setThisItem(item);
    setThisisVerified(isVerified);
  };

  // show modal confirm received btn
  const [showModalReceived, setShowModalReceived] = useState(false);
  const handleCloseModalReceived = () => setShowModalReceived(false);
  const handleShowModalReceived = () => setShowModalReceived(true);

  const [this_isRecived, setThisisReceived] = useState(null);
  const handleReceivedRecord = async (item, this_isRecived) => {
    handleShowModalReceived();
    setThisItem(item);
    setThisisReceived(this_isRecived);
  };

  // Function when modal submit btn clicked
  const confirmModalIsReceived = async () => {
    try {
      const response = await axiosInstance.post("record/receivedRecord",
        {
          _id: this_item._id,
          isReceived: this_isRecived
        })
      if (response) fetchData();
    } catch (error) {
    }
  }

  return (
    <>
      <ConfirmModal
        show={showModalReceived}
        onHide={handleCloseModalReceived}
        heading='ایمپلنت تحویل شد'
        body='پس از تایید امکان ویرایش وجود ندارد'
        confirmFcn={confirmModalIsReceived} />

      <ConfirmModal
        show={showModalVerified}
        onHide={handleCloseModalVerified}
        heading='تایید نهایی'
        body='پس از تایید امکان ویرایش وجود ندارد'
        confirmFcn={confirmModalIsVerified} />

      <ModalEditPage
        show={showEditModal}
        onHide={handleCloseModalEdit} />

      <div className="container mt-5">

        <h4>
          <FontAwesomeIcon icon={faClockRotateLeft} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
          <span onClick={() => { setSearchSelectedUser(false); fetchData() }} style={{ cursor: 'pointer' }}>تاریخچه</span>
          <Loading isLoading={isLoading} />
          <span style={{ marginRight: '5px', float: 'left' }}>
            {roles_manager.includes(role) &&
              <div>
                <SearchInput
                  url="record/searchUser"
                  // onSearchResults={handleSearchResults} 
                  onClickSearchResult={onClickSearchResult}
                  width='300px'
                  placeholder="جستجو دندانپزشک ..." />
              </div>
            }
          </span>
        </h4>
        <hr></hr>

        {records.length > 0 ?
          <div className="card" style={{ boxShadow: "1px 1px 2px 1px #aaa", borderRadius: '8px' }}>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">کد</th>
                  <th scope="col">تاریخ</th>
                  <th scope="col">نام بیمار</th>
                  <th scope="col">دنداپزشک</th>
                  <th scope="col">نوع</th>
                  <th scope="col">قطر و اندازه</th>
                  {roles_manager.includes(role) && <th scope="col">ویرایش</th>}
                  {roles_coordinator.includes(role) && <th scope="col">تحویل شد</th>}
                  {roles_manager.includes(role) && <th scope="col">تایید نهایی</th>}
                </tr>
              </thead>
              <tbody>
                {
                  records.map((item, i) => {
                    return (
                      <tr key={i}>
                        <th scope="row"><span style={{ color: "#555", fontSize: '30px' }}>{item.recordId}</span></th>

                        <td>{timeAgoPr(item.createdAt)}
                          <hr></hr>
                          <span style={{ 'fontSize': '12px', color: '#aaa' }}>{pr_date(item.createdAt)}</span>
                        </td>
                        <th scope="row">
                          <span>{item.patientName.fa || ''}</span>
                          <hr></hr>
                          <span style={{ 'fontSize': '12px', color: '#aaa' }}>{item.patientName.en || '--'}</span>
                        </th>
                        <td>{item.user.name}
                          <hr></hr>
                          <span style={{ 'fontSize': '12px', color: '#aaa' }}>{item.user.phone}</span>
                        </td>
                        <td>{item.implant.bodytype}</td>
                        <td>
                          {item.implant.diameter}
                          <hr></hr>
                          {item.implant.size}
                        </td>

                        {roles_manager.includes(role) &&
                          <td>
                            <Link to={{
                              // pathname: `/admin/edit`,
                            }}
                              // onClick={() => handleEdit(item)}  // edit page
                              onClick={() => handleShowModalEdit(item)}  // edit in modal
                              className="btn btn-sm btn-warning">
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                          </td>
                        }

                        {roles_coordinator.includes(role) &&
                          <td>
                            {item.isReceived
                              ?
                              <ButtonSubmit className="btn-sm btn-success"
                                onClick={() => handleReceivedRecord(item, false)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </ButtonSubmit>
                              :
                              <ButtonSubmit className="btn-sm btn-danger"
                                onClick={() => handleReceivedRecord(item, true)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </ButtonSubmit>
                            }
                          </td>
                        }

                        {roles_manager.includes(role) &&
                          <td>
                            {item.isVerified
                              ?
                              <ButtonSubmit className="btn-sm btn-success"
                                onClick={() => handleVerifyRecord(item, false)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </ButtonSubmit>
                              :
                              <ButtonSubmit className="btn-sm btn-danger"
                                onClick={() => handleVerifyRecord(item, true)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </ButtonSubmit>
                            }
                          </td>
                        }

                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          : 'لیست خالی است'}

        {/* Pagination controls */}
        <div dir='ltr' className="mt-2">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <a style={responseLength < 1 ? { background: '#ccc' } : {}}
                  className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&laquo;</span>
                  {responseLength < 1 ? (
                    <span>بعد</span>
                  ) : (
                    <span onClick={nextPage}>بعد</span>
                  )}
                </a>
              </li>
              <li className="page-item"><a className="page-link" href="#">{pr_num(currentPage)}</a></li>
              <li className="page-item">
                <a style={currentPage === 1 ? { background: '#ccc' } : {}}
                  className="page-link" href="#" aria-label="Previous">
                  {currentPage === 1 ? (
                    <span>قبل</span>
                  ) : (
                    <span onClick={prevPage}>قبل</span>
                  )}
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>


    </>
  )
}
