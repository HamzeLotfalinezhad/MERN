import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Loading = ({ isLoading }) => {
  return (
    <>
      {isLoading ?
        <span
          style={{ fontSize: '28px', marginRight: '10px', color: '#f55' }
          } >
          <FontAwesomeIcon icon={faSpinner}
            className="fa-spin" />
        </span >
        : ''}
    </>
  );
};


export default Loading;