import React from 'react';
import BackHandIcon from '@mui/icons-material/BackHand';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Header({
  title = 'Page Title',
  buttonFunc = 'cross',
  setAssistanceStatus,
}) {
  const navigate = useNavigate();

  const handleAssistanceClick = () => {
    if (setAssistanceStatus) {
      setAssistanceStatus(true);
    }
  };

  return (
    <>
      <div className="header-wrapper">
        <div className="header-title-container">
          <div className="header-title">{title}</div>
        </div>
      </div>
    </>
  );
}
