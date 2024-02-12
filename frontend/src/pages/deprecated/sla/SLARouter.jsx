import React, { useState, useEffect } from 'react';
import { Axios } from '@/utils/Axios';
import { useLocation } from 'react-router-dom';
import CreateSLAForm from '@/components/deprecated/SLAs/CreateSLAForm';
import EditSLAForm from '@/components/deprecated/SLAs/EditSLAForm';
import ViewSLAForm from '@/components/deprecated/SLAs/ViewSLAForm';

export default function SLARouter() {
  const token = sessionStorage.getItem('access');
  const query = new URLSearchParams(useLocation().search);
  const slaId = query.get('slaId');

  const [formData, setFormData] = useState({});
  const [content, setContent] = useState();

  const [loading, setLoading] = useState(true);

  const handleLocation = () => {
    let slaNumber = String(formData.number).slice(0, 8);
    switch (window.location.pathname) {
      case '/sla/new':
        setContent(<CreateSLAForm token={token} />);
        break;
      case '/sla/edit':
        setContent(
          <EditSLAForm
            token={token}
            slaId={slaId}
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />
        );
        break;
      case '/sla/view':
        setContent(
          <ViewSLAForm
            token={token}
            slaId={slaId}
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

  const getSLAData = async () => {
    if (
      window.location.pathname === '/sla/view' ||
      window.location.pathname === '/sla/edit'
    ) {
      try {
        const response = await Axios({
          method: 'GET',
          url: `/api/singleSLA/?slaId=${slaId}`,
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
    getSLAData();
  }, []);

  useEffect(() => {
    handleLocation();
  }, [formData, window.location.pathname]);

  document.title = 'SLA Ticket - PiXELL-River';

  return <>{content}</>;
}
