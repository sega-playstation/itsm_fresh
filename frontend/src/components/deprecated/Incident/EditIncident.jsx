import { useLocation } from 'react-router-dom';
import { Axios } from '@/utils/Axios';

import IncidentForm from './IncidentForm';

import Loading from '@/components/deprecated/UI/Loading';

export default function EditIncident({ formData, setFormData, loading }) {
  const title = 'Edit Incident';
  const formType = 'Edit';
  const buttonLabel = 'Update';
  const query = new URLSearchParams(useLocation().search);
  const incidentId = query.get('incidentId');
  const token = sessionStorage.getItem('access');

  const currentUserRole = sessionStorage.getItem('roleId');
  const ticketOwnerRole = Number.parseInt(currentUserRole);

  /**
   * PUT the ticket data to the incident table on the database. Updating the fields that are edited
   */

  const handleSubmit = async () => {
    try {
      await Axios({
        method: 'PUT',
        url: `/api/editIncident/?incidentId=${incidentId}`,
        data: formData,
      });
      window.location.href = '../incident/all';
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
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
  );
}
