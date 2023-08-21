import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router';
import { styled } from '@mui/system';

const HeaderWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  background: 'tomato',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
  color: 'white',
  justifyContent: 'space-between',
  width: '100%',
}));

const Title = styled('div')(({ theme }) => ({
  fontSize: '2em',
  margin: 'auto',
  display: 'flex',
  height: '70px',
  lineHeight: '70px',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  fontFamily: "'Montserrat', sans-serif",
}));

export default function Header({ title = 'Page Title', buttonFunc }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (typeof buttonFunc === 'function') {
      buttonFunc();
    } else if (buttonFunc === 'logout') {
      localStorage.removeItem('a4-token');
      localStorage.removeItem('a4-type');
      localStorage.removeItem('a4-name');
      navigate('/Login');
    } else {
      navigate('/CustomerHome');
    }
  };

  const ButtonIcon =
    buttonFunc === 'logout'
      ? LogoutIcon
      : buttonFunc === 'back'
      ? ArrowBackIosIcon
      : CloseIcon;

  const buttonStyle = {
    cursor: 'pointer',
    marginRight: '10px',
  };

  return (
    <HeaderWrapper>
      <span style={buttonStyle} />
      <Title>{title}</Title>
      <span style={buttonStyle} onClick={handleButtonClick}>
        <ButtonIcon className="button-icons" />
      </span>
    </HeaderWrapper>
  );
}
