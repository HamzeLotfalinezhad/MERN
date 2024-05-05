import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { axiosInstance } from '../../api/axiosInstance';
import { ButtonSubmit } from '../ui/Button';

const ConfirmPassModal = ({ show, onHide, onConfirm }) => {

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    pass: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const confirmPass = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.post('/admin/confirmPass', form);
      setLoading(false)
      if (response.status === 200) onConfirm()
    } catch (error) {
      setLoading(true)
    }
  }

  return (
    <Modal show={show} onHide={onHide} style={{ background:'rgba(0,0,0,0.5)' }}>
      <Modal.Header>
        <Modal.Title>رمز را وارد کنید</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center'>
        <form>
          <div>
            <input
              className='form-control text-center'
              placeholder='رمز را وارد کنید...'
              type="password"
              id="paas"
              name="pass"
              value={form.pass}
              onChange={handleChange}
            />
          </div>
          {/* <ButtonSubmit className="btn btn-sm btn-primary" onClick={() => { confirmPass() }}>تایید</ButtonSubmit> */}
        </form>
      </Modal.Body>
      <Modal.Footer>
        {/* <button className="btn btn-sm btn-danger" style={{ marginLeft: '10px' }} onClick={() => { onHide(); }}>
          کنسل
        </button> */}
        <ButtonSubmit loading={loading} className="btn-sm btn-primary" width="100%" onClick={() => { confirmPass() }}>
          تایید
        </ButtonSubmit>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmPassModal;
