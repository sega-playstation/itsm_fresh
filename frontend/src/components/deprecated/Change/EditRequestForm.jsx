import { Axios } from '@/utils/Axios';

import ChangeRequestForm from './ChangeRequestForm';
import Loading from '@/components/deprecated/UI/Loading';

export default function CreateRequestForm({
  token,
  requestId,
  formData,
  setFormData,
  loading,
}) {
  const formType = 'Edit';
  const title = 'Edit Request';
  let buttonLabel = 'Edit';

  const currentUserRole = sessionStorage.getItem('roleId');
  const ticketOwnerRole = Number.parseInt(currentUserRole);

  const handleSubmit = async () => {
    try {
      await Axios({
        method: 'PUT',
        url: `/api/editRequest/${requestId}/`,
        data: formData,
      });
      window.location.href = '../change/all';
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
