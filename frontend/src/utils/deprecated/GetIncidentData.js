import { Axios } from '@/utils/Axios';

/**
 * Retrieves an incident based on the given ID and returns its data.
 * @param {string} incidentId - The ID of the incident to be retrieved.
 * @returns {Promise<object>} A promise that resolves with the data of the specified incident or rejects with an error.
 */
function getIncidentData(incidentId) {
  return new Promise((resolve, reject) => {
    const token = sessionStorage.getItem("access");

    Axios({
      method: "GET",
      url: `http://127.0.0.1:8000/api/viewincidents/${incidentId}/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const data = response.data;
        resolve(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log("Error response:", error.response);
          console.log("Status code:", error.response.status);
          console.log("Response headers:", error.response.headers);
        }
        reject(error);
      });
  });
}

export default getIncidentData;
