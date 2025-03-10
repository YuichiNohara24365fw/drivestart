import React from 'react';
import { useParams } from 'react-router-dom';
import StaffDetail from '../components/StaffDetail';

const StaffDetailPage = () => {
  const { staffId } = useParams();
  return <StaffDetail staffId={staffId} />;
};

export default StaffDetailPage;