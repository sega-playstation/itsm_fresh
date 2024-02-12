import Changelog from '@/components/deprecated/UI/Changelog';
import { Helmet } from 'react-helmet-async';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {/* Changelog is disabled for the time being. It needs to be redesigned with JoyUI and fitted with up-to-date info. */}
      {/* <Changelog /> */}
      <div>Dashboard content will go here.</div>
    </>
  );
}
