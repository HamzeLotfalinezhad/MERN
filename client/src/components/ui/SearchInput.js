import _ from 'lodash';
import { useState } from 'react';
import { axiosInstance } from '../../api/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const SearchInput = ({ onSearchResults, placeholder, url, onClickSearchResult, width }) => { // Accept onSearchResults callback prop
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const inputHandler = _.debounce(async (value) => {
    if (value.trim() === '') return
    try {
      const response = await axiosInstance.get(url, {
        params: {
          search: searchText,
        }
      });
      const results = response.data;
      setSearchResults(results);

      // Pass the results back to the parent component using the callback function
      onSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }, 500); // Adjust the debounce delay as needed

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchText(value);
    inputHandler(value);
  };

  return (
    <div>
      <div>
        <input
          className="form-control form-control-sm text-center"
          style={{ width: width }}
          dir='rtl'
          type="text"
          name="search"
          value={searchText}
          onChange={handleChange}
          placeholder={placeholder}
        />

        {searchResults.length > 0 && (
          <div className="card">
            <span
              style={{
                fontSize: '14px',
                background: '#eee',
                textAlign: 'right',
                width: '100%',
                position: 'absolute',
                zIndex: '1000',
                padding: '10px 10px 10px 10px',
                border: '1px solid #aaa',
                borderRadius: '8px',

              }}>
              <div className="col p-2">
                {searchResults.map((item, i) => (
                  <>
                    <h5
                      style={{ cursor: 'pointer', 'fontSize': '14px', color: '#05a' }}
                      onClick={() => {
                        onClickSearchResult(item) // when clicked on search items
                        setSearchResults([]) // hide search result list
                      }}
                      key={i}>
                      <FontAwesomeIcon icon={faCheckCircle} style={{ marginLeft: '10px' }}/>
                      {item.name}
                    </h5>
                    <hr style={{ margin: '10px' }}></hr>
                  </>
                ))}
              </div>
            </span>
          </div>
        )}

        {/* <div className="card">
          <span
            style={{
              fontSize: '14px',
              background: '#fff',
              textAlign: 'right',
              width:'100%',
              position: 'absolute',
              zIndex: '1000',
              padding:'5px 10px 5px 10px',
              border:'1px solid #aaa',
              borderRadius:'8px',
            }}>
            <div class="ds-dataset-1">
              {searchResults.map((item, ii) => (
                <p key={ii}>{item.name}</p>
              ))}

            </div>
          </span>
        </div> */}

      </div>
    </div>

  );
};

export default SearchInput;