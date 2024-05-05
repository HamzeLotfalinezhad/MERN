import React from 'react';
import * as ExcelJS from 'exceljs';


const ExcelGenerator = ({ columns, data, name }) => {
  const generateExcel = () => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add data to the worksheet
    worksheet.columns = columns;
    data.forEach(item => {
      worksheet.addRow(item);

    });

    // Generate the Excel file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name + '.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <button className='btn btn-sm btn-primary' onClick={() => { generateExcel() }}>دانلود اکسل</button>
    </div>
  );
}

export default ExcelGenerator;
