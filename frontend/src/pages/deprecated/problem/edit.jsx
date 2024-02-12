import React, { useState, useEffect } from 'react';
import EditProblem from '@/components/deprecated/Problem/EditProblem';
import { useLocation } from 'react-router-dom';
import { Axios } from '@/utils/Axios';

export default function EditProblemPage() {
  const query = new URLSearchParams(useLocation().search);
  const problemId = query.get('problemId');

  const [ticketNum, setTicketNum] = useState([]);
  const token = sessionStorage.getItem('access');
  const ticketNumber = 'PRB' + ticketNum.toString().padStart(6, '0');

  const getProblemData = async () => {
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/problemData/${problemId}/`,
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

  return <EditProblem />;
}
