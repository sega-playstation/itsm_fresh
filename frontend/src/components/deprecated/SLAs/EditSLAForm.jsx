import { Axios } from '@/utils/Axios';

import SLAForm from './SLAForm';
import Loading from '@/components/deprecated/UI/Loading';

/**
 * Creates a new SLA based off of a ticket in any module and gives a timeline for the ticket to be resolved
 */
export default function EditSLAForm({
  token,
  slaId,
  formData,
  setFormData,
  loading,
}) {
  let formType = 'Edit';
  let buttonLabel = 'Edit';
  // const cookies

  /**
   * Edit POST the ticket data to the SLA table on the database
   */
  const handleSubmit = async () => {
    try {
      await Axios({
        method: 'PUT',
        url: `/api/editSLA/${slaId}/`,
        data: formData,
      });

      window.location.href = '../sla/all';
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
    <SLAForm
      onSubmit={handleSubmit}
      buttonLabel={buttonLabel}
      formType={formType}
      formData={formData}
      setFormData={setFormData}
    />
  );
}
