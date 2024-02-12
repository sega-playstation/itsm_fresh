import React, { useState, useEffect } from 'react';
import { Axios } from '@/utils/Axios';
import { useLocation } from 'react-router-dom';

import CreateIncident from '@/components/deprecated/Incident/CreateIncident';
import EditIncident from '@/components/deprecated/Incident/EditIncident';
import ViewIncident from '@/components/deprecated/Incident/ViewIncident';

export default function IncidentRouter() {
  const token = sessionStorage.getItem('access');
  const query = new URLSearchParams(useLocation().search);
  const incidentId = query.get('incidentId');

  const [formData, setFormData] = useState({});
  const [content, setContent] = useState();

  const [loading, setLoading] = useState(true);

  const handleLocation = () => {
    switch (window.location.pathname) {
      case '/incident/new':
        setContent(<CreateIncident token={token} />);
        break;
      case '/incident/edit':
        setContent(
          <EditIncident
            token={token}
            incidentId={incidentId}
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />
        );
        break;
      case '/incident/view':
        setContent(
          <ViewIncident
            token={token}
            incidentId={incidentId}
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
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/singleIncident/?incidentId=${incidentId}`,
      });

      const data = await response.data;
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...data,
      }));
      setLoading(false);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleLocation();
  }, [formData, window.location.pathname]);

  document.title = 'New Incident Ticket - PiXELL-River';

  if (!content) {
    return <></>;
  }

  return content;
}
