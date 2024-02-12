import React, { useState, useEffect } from 'react';
import { Axios } from '@/utils/Axios';
import { useLocation } from 'react-router-dom';

import CreateRequestForm from '@/components/deprecated/Change/CreateRequestForm';
import EditRequestForm from '@/components/deprecated/Change/EditRequestForm';
import ViewRequestForm from '@/components/deprecated/Change/ViewRequestForm';

export default function ChangeRouter() {
  const token = sessionStorage.getItem('access');
  const query = new URLSearchParams(useLocation().search);
  const requestId = query.get('requestId');

  const [formData, setFormData] = useState({});
  const [content, setContent] = useState();

  const [loading, setLoading] = useState(true);

  const handleLocation = () => {
    let requestNumber = String(formData.requestNumber).slice(0, 8);
    switch (window.location.pathname) {
      case '/change/new':
        setContent(<CreateRequestForm token={token} />);
        break;
      case '/change/edit':
        setContent(
          <EditRequestForm
            token={token}
            requestId={requestId}
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />
        );
        break;
      case '/change/view':
        setContent(
          <ViewRequestForm
            token={token}
            requestId={requestId}
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />
        );
        break;
      default:
        console.log('Invalid path');
        break;
    }
  };

  const fetchData = async () => {
    if (window.location.pathname === '/change/edit') {
      try {
        const response = await Axios({
          method: 'GET',
          url: `/api/singleRequest/?requestId=${requestId}`,
          data: formData,
        });
        const data = response.data;
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...data,
        }));
        setLoading(false);
      } catch (error) {
        if (error.response) {
          console.log(error.response);
        }
      }
    } else if (window.location.pathname === '/change/view') {
      try {
        const response = await Axios({
          method: 'GET',
          url: `/api/singleRequest/?requestId=${requestId}`,
          data: formData,
        });
        const data = response.data;
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...data,
        }));
        setLoading(false);
      } catch (error) {
        if (error.response) {
          console.log(error.response);
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleLocation();
  }, [formData, window.location.pathname]);

  document.title = 'Change Request - PiXELL-River';

  return <>{content}</>;
}
