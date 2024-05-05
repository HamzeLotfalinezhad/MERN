import React, { useState } from 'react';

const EditableTableCell = ({ value, onSave, dir }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
    onSave(editValue);
  };

  return (
    <td onDoubleClick={handleDoubleClick} style={{ width: '10%' }}>
      {editing ? (
        <input
          className="form-control form-control-sm text-center"
          style={{
            width: '100%', // Take up full width of the cell
            textAlign: 'center', // Center text horizontally
            margin:'auto'
          }}
          type="text"
          dir={dir}
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus // Autofocus on the input field when editing
        />
      ) : (
        value
      )}
    </td>
  );
};

export default EditableTableCell;
