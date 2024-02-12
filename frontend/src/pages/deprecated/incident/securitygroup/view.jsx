import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Axios } from '@/utils/Axios';
import ViewSecurityGroupUsers from '@/components/deprecated/Incident/SecurityGroups/ViewSecurityGroupUsers';

/**
 * Opens a page that allows the user to view a Security Group within the Sidebar
 * @returns The layout for a user to view a Security Group
 */
export default function ViewSecurityGroupPage() {
  const query = new URLSearchParams(useLocation().search);
  const groupId = query.get('securityGroupId');
  const token = sessionStorage.getItem('access');
  const [name, setName] = useState([]);

  useEffect(() => {
    getGroupData();
  }, []);

  /**
   * Gets the data for the selected Security Group
   */
  const getGroupData = async () => {
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/securitygroups/${groupId}/`,
      });

      const data = await response.data;
      setName(data.name);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  return <ViewSecurityGroupUsers />;
}
