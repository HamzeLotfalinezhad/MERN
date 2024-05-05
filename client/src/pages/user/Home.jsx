import { useEffect, useState } from "react"
import { axiosInstance } from "../../api/axiosInstance.js"
import { Link, useNavigate } from "react-router-dom";
import { pr_date, pr_num, timeAgoPr } from "../../assets/js/utils.js";
import { useDispatch } from "react-redux";
import { addRecord } from "../../store/RecordSlice.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faClockRotateLeft, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from "../../components/ui/Loading.js";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const [records, setRecords] = useState([])
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [responseLength, setResponseLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Adjust page size as needed

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Trigger fetch when currentPage changes

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("record/getAll", {
        params: {
          page: currentPage,
          pageSize: pageSize
        }
      });

      if (response && response.data) {
        setRecords(response.data);
        setResponseLength(response.data.length);
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error);
    }
  };

  const routeChange = () => {
    navigate('/user/addFailure');
  }

  const handleEdit = (item) => {
    dispatch(addRecord(item));
  };

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

  return (
    <>
      <div className="container mt-5">
        <h2>
          <FontAwesomeIcon icon={faClockRotateLeft} style={{ paddingLeft: '10px', color: 'rgb(57 92 250)' }} />
          تاریخچه
          <Loading isLoading={isLoading} />
          <span style={{ marginRight: '5px', float: 'left' }}>
            <button onClick={routeChange} className="btn btn-primary btn-sm">افزودن مورد جدید</button>
          </span>
        </h2>
        <hr></hr>
        {records.length > 0 ?
          <div className="card" style={{ boxShadow: "1px 1px 2px 1px #aaa", borderRadius: '8px' }}>
            <table className="table">
              <thead>
                <tr>
                <th scope="col">کد</th>
                <th scope="col">نام بیمار</th>
                  <th scope="col">تاریخ</th>
                  {/* <th scope="col">نوع ایمپلنت</th> */}
                  <th scope="col">قطر و اندازه</th>
                  <th scope="col">ویرایش</th>
                  <th scope="col">تایید</th>
                </tr>
              </thead>
              <tbody>
                {
                  records.map((item, i) => {
                    return (
                      <tr key={i}>
                        <th scope="row"><span style={{ color: "#555", fontSize: '30px' }}>{item.recordId}</span></th>
                        <th scope="row"><span>{item.patientName.fa || ''}</span></th>
                        {/* <td>{pr_date(item.createdAt)}</td> */}
                        <td>{timeAgoPr(item.createdAt)}
                          <br></br>
                          <span style={{ 'fontSize': '12px', color: '#aaa' }}>{pr_date(item.createdAt)}</span>
                        </td>
                        {/* <td>{item.implant.bodytype}</td> */}
                        <td>
                          D: {item.implant.diameter}
                          <br></br>
                          S: {item.implant.size}
                        </td>
                        <td>
                          <Link to={{
                            // pathname: `/edit/${item._id}`,
                            pathname: `/user/edit`,
                          }}
                            onClick={() => handleEdit(item)}
                            className="btn btn-sm btn-warning">
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                        </td>
                        <td>
                          {item.isVerified
                            ?
                            <FontAwesomeIcon color="#0b5" icon={faCheck} />

                            :
                            <FontAwesomeIcon color="#f05" icon={faTimes} />
                          }
                        </td>

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
