
import { Axios } from '@/utils/Axios';


/**
 *  Retrieves incidents, filtering based on a user's role
 *  @returns The filtered incidents
 */
function getIncidents() {

    let currentUserId = sessionStorage.getItem("userId");
    let currentUserRole = sessionStorage.getItem("roleId");
    let currentUserSection = sessionStorage.getItem("section");

    const token = sessionStorage.getItem("access");

    if(currentUserRole === 1 || currentUserRole === 2){
        Axios({
            method: "GET",
            url: "http://127.0.0.1:8000/api/incidentdatagrid/",

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
    } else if(currentUserRole === 3){
        Axios({
            method: "GET",

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
    } else if(currentUserRole === 4){
        Axios({
            method: "GET",
            url: `http://127.0.0.1:8000/api/incidentdatagrid/?ticketOwnerId=${currentUserId}/`,

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

}

export default getIncidents;