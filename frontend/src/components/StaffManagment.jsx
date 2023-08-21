import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import StaffProfile from './StaffProfile';
import NewStaffForm from './NewStaffFrom';

const StaffManagement = () => {
  const [triggerRender, setTriggerRender] = useState(false);
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    const response = fetch(`/api/staffs/manage/all/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('a4-token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log('this is staff data!!:');
        console.log(respo);
        setStaffData(respo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [triggerRender]);

  const handleRender = () => {
    setTriggerRender(!triggerRender);
  };

  return (
    <>
      <NewStaffForm setRender={handleRender} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>First Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Last Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Contact</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>
                Employee Type
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffData.map((staff) => (
              <TableRow
                key={staff.email}
                sx={{ backgroundColor: staff.expireAt ? '#6c757d' : '#FFFFFF' }}
              >
                <TableCell>{staff.first_name}</TableCell>
                <TableCell>{staff.last_name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.contact}</TableCell>
                <TableCell>{staff.employee_type}</TableCell>
                <TableCell>
                  <StaffProfile {...staff} setRender={handleRender} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default StaffManagement;
