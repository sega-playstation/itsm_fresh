import React, { useState, useEffect } from 'react';
import { Axios } from '@/utils/Axios';

import ChangeRequestForm from './ChangeRequestForm';
import Loading from '@/components/deprecated/UI/Loading';

export default function CreateRequestForm({ token }) {
  const formType = 'New';
  const title = 'Create New Request';
  let buttonLabel = 'Submit';

  let userId = sessionStorage.getItem('userId');
  let currentUserSection = sessionStorage.getItem('section');
  const currentUserRole = sessionStorage.getItem('roleId');
  const ticketOwnerRole = Number.parseInt(currentUserRole);
  if (currentUserSection === 'None') {
    currentUserSection = null;
  }

  const currentDate = new Date();
  const initialDateTime = new Date(currentDate.toISOString());

  const [formData, setFormData] = useState({
    // requestNumber: "",
    status: 1,
    requestType: '',
    requestDateTime: initialDateTime,
    requestName: '',
    projectName: '',
    assignedTechId: '',
    ticketOwnerId: userId,
    requestOwnerSection: currentUserSection,
    department: '',
    requestedById: '',
    requestContact: '',
    impact: 4,
    urgency: 4,
    priority: 4,
    description: '',
    isActive: false,
    assets: '',
    risk_assesment: '',
    approvals: '',
    install_plan_description: '',
    backout_plan_description: '',
    start_date: initialDateTime,
    end_date: initialDateTime,
    purpose: '',
    need: '',
    duration: '',
    // Risk Assessment
    doc_config: '',
    environment: '',
    redundancy: '',
    environment_maturity: '',
    time_to_implement: '',
    change_history: '',
    deployment_window: '',
    num_of_staff: '',
    testing: '',
    backout_plan_risk: '',
    scheduling: '',
  });

  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    try {
      await Axios({
        method: 'POST',
        url: `/api/requestData/`,
        data: formData,
      });
      window.location.pathname = '/change/all';
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [formData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ChangeRequestForm
      token={token}
      title={title}
      ticketOwnerRole={ticketOwnerRole}
      formType={formType}
      buttonLabel={buttonLabel}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
    />
  );
}
