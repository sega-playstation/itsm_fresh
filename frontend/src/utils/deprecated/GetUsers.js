import{  Axios } from '@/utils/Axios';

export function getUsers(token, loginUser) {
  return Axios({
    method: "GET",
    url: "/api/userFast/",

  })
    .then((response) => {
      const data = response.data;
      const sortedData = data.sort((a, b) =>
        a.first_name.localeCompare(b.first_name)
      );
      const owner = sortedData.find(
        (element) => element.username === loginUser
      );
      return { sortedData, owner };
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}
