import React, { useState } from 'react';
import {
  ProForm,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { message, Upload, Modal } from 'antd';
import adminService from '../../Services/adminService';

function FileAddPage() {
  const [errors, setErrors] = useState([]);

  const handleBeforeUpload = (file: File) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel' ||
                    file.type === 'text/csv';
    if (!isExcel) {
      message.error('You can only upload Excel files!');
    }
    return isExcel || Upload.LIST_IGNORE;
  };

  const handleUpload = async (options:any) => {
    const { onSuccess, onError, file } = options;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await adminService.addUsersFile(formData);

      if (response.errors) {
        setErrors(response.errors);
        Modal.error({
          title: 'Upload Error',
          content: (
            <div>
              <p>There were errors in the following rows:</p>
              <ul>
                {response.errors.map((error:any, index:number) => (
                  <li key={index}>Row {error.row}: {error.error}</li>
                ))}
              </ul>
            </div>
          ),
        });
        onError(response.errors);
      } else {
        message.success('File uploaded successfully');
        onSuccess(response);
      }
    } catch (error:any) {
      message.error('Upload failed: ' + error.message);
      onError(error);
    }
  };

  return (
    <ProForm>
      <ProFormUploadButton
        title="Import your file here"
        name="upload"
        label="Upload"
        max={1}
        fieldProps={{
          name: 'file',
          accept: '.xlsx,.xls,.csv',
          beforeUpload: handleBeforeUpload,
          customRequest: handleUpload,
        }}
        extra="* Only Excel file extensions are accepted (.xlsx, .xls, .csv)"
      />
    </ProForm>
  );
}

export default FileAddPage;