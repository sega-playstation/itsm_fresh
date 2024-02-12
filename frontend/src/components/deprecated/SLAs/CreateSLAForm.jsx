import React, { useState, useEffect } from 'react';
import { Axios } from '@/utils/Axios';

import SLAForm from './SLAForm';
import Loading from '@/components/deprecated/UI/Loading';

/**
 * Creates a new SLA based off of a ticket in any module and gives a timeline for the ticket to be resolved
 */
export default function CreateSLAForm({ token }) {
  let formType = 'New';
  let buttonLabel = 'Create';
  let isCreatedByStudent = false;
  const currentOwner = sessionStorage.getItem('userId');
  const currentUserRole = sessionStorage.getItem('roleId');
  if (currentUserRole === '4') {
    isCreatedByStudent = true;
  }
  let currentUserSection = sessionStorage.getItem('section');
  if (currentUserSection === 'None') {
    currentUserSection = null;
  }

  const [formData, setFormData] = useState({
    owner: currentOwner,
    ownersection: currentUserSection,
    priority: '',
    sla_name: '',
    criteria: '',
    isCreatedByStudent: isCreatedByStudent,
  });

  const [loading, setLoading] = useState(true);
  /**
   * POST the ticket data to the SLA table on the database
   */
  const handleSubmit = async () => {
    try {
      await Axios({
        method: 'POST',
        url: '/api/postSLA/',
        data: formData,
      });

      window.location.href = '../sla/all';
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading formType={formType} />;
  }

  return (
    <SLAForm
      onSubmit={handleSubmit}
      buttonLabel={buttonLabel}
      formType={formType}
      formData={formData}
      setFormData={setFormData}
    />
  );
}
