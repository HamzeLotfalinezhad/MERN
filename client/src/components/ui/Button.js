import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ButtonSubmit = ({ onClick, loading, children, className, width }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`btn ${className} mt-2`}
      style={{ width:width }}
      >
      {loading ? <LoadingAnimation /> : children}
    </button>
  );
};

const LoadingAnimation = () => {
  return (
    <span>
      <FontAwesomeIcon icon={faSpinner} className='fa-spin'/>
    </span>
  );
};

export { ButtonSubmit };