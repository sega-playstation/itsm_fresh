import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Axios } from '@/utils/Axios';
import Loading from '@/components/deprecated/UI/Loading';

import IncidentForm from './IncidentForm';

export default function CreateIncident() {
  const title = 'New Incident';
  const formType = 'Create';
  const buttonLabel = 'Create';
  const location = useLocation();
  const token = sessionStorage.getItem('access');
  const currentUserRole = sessionStorage.getItem('roleId');
  const ticketOwnerRole = Number.parseInt(currentUserRole);
  const initialDateTime = new Date().toISOString();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    userId: '',
    status: 1,
    reportDateTime: initialDateTime,
    assignedTechId: '',
    ticketOwnerId: '',
    ticketOwnerSection: '',
    ticketOwnerRole: ticketOwnerRole,
    ticketType: '',
    security_group: '',
    isAssigned: false,
    subject: '',
    details: '',
    multipleAffectedUser: false,
    affectedUserSize: 0,
    impact: 4,
    urgency: 4,
    priority: 4,
    slaId: '',
    sla_status: 1,
  });

  /**
   * POST the ticket data to the incident table on the database
   */
  const handleSubmit = async () => {
    if (location.pathname === '/incident/new') {
      // console.log(formData);
      try {
        await Axios({
          method: 'POST',
          url: '/api/incident/',
          data: formData,
        });
        window.location.href = '../incident/all';
      } catch (error) {
        if (error.response) {
          console.log(error.response);
        }
      }
    }
  };

  // For Testing Form Data Inputs
  useEffect(() => {
    // console.log("TEST:", formData);
    setLoading(false);
  }, [formData]);

  // Waits for data to be loaded
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <IncidentForm
        token={token}
        title={title}
        ticketOwnerRole={ticketOwnerRole}
        formType={formType}
        buttonLabel={buttonLabel}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </>
  );
}
