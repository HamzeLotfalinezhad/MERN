import React from 'react';
import { Modal } from 'react-bootstrap';

const ConfirmModal = ({ show, onHide, heading, body, confirmFcn }) => {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" >
      <Modal.Header>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center'>{body}</Modal.Body>
      <Modal.Footer>
        <button className="btn btn-sm btn-danger" style={{ marginLeft: '10px' }} onClick={() => { onHide(); }}>
          کنسل
        </button>
        <button className="btn btn-sm btn-primary" onClick={() => { confirmFcn(); onHide(); }}>
          تایید
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
