import { useState, useEffect } from 'react';
import ViewProblem from '@/components/deprecated/Problem/ViewProblem';
import { useLocation } from 'react-router-dom';
import { Axios } from '@/utils/Axios';

export default function ViewProblemPage() {
  const query = new URLSearchParams(useLocation().search);
  const problemId = query.get('problemId');

  const [ticketNum, setTicketNum] = useState([]);
  const token = sessionStorage.getItem('access');
  const ticketNumber = 'PRB' + ticketNum.toString().padStart(6, '0');

  const getProblemData = async () => {
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/singleProblem/?problemId=${problemId}`,
      });

      const data = await response.data;
      setTicketNum(data.ticketNumber);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  useEffect(() => {
    getProblemData();
  }, []);

  return <ViewProblem />;
}
