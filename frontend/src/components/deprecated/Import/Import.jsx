import{  Axios } from '@/utils/Axios';
import ImportForm from './ImportForm';
import React, { useState } from 'react';

function Import() {
  document.title = 'Import CSV ' + '- PiXELL-River';
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // data = Axios.get('api/upload/', {
  //     headers: {
  //         "Content-Type": ""
  //     }
  // })

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <span>Loading. . .</span>
          <div className="half-spinner"></div>
        </div>
      ) : (
        <ImportForm />
      )}
    </div>
  );
}

export default Import;
