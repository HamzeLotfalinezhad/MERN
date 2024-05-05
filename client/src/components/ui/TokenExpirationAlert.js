import React, { useState } from 'react';

const TokenExpirationAlert = () => {
  const [visible, setVisible] = useState(true);

  const handleRefresh = () => {
    setVisible(false); // Hide the alert
  };

  return (
    visible && (
      <>
        <div className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 999,
            display: "block"
          }}
        ></div>

        <div dir="rtl" className="alert alert-danger alert-dismissible fade show text-right" role="alert"
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "1000",
            textAlign: "right",
            fontWeight: 700,
            direction: "rtl",
            padding: "15px"
          }}
        >
          {' توکن منقضی شده است. '}
          <span style={{ color: "#00f", cursor: "pointer" }} onClick={handleRefresh}>اینجا</span>
          {' کلیک کنید '}
          {/* <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setVisible(false)}>
          <span aria-hidden="true">&times;</span>
        </button> */}
        </div>
      </>
    )
  );
};

export default TokenExpirationAlert;
