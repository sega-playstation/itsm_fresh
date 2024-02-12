
import { Axios } from '@/utils/Axios';

/**
 *  Retrieves all users with the technician role and returns them in a const
 *  @returns The data of all the technician users
 */
function getTechnicians() {

    const token = sessionStorage.getItem("access");

    Axios({
        method: "GET",
        url: "http://127.0.0.1:8000/api/assignedusers/?role=2",

      })
        .then((response) => {
          const data = response.data;

          return data;
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
}

export default getTechnicians;