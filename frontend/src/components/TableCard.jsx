import { React } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Badge,
} from '@mui/material';
import EditTable from './EditTable';
import DeleteIcon from '@mui/icons-material/Delete';
import QRIcon from '@mui/icons-material/QrCode';
import BackHandIcon from '@mui/icons-material/BackHand';
import { QRCodeCanvas } from 'qrcode.react';

const { REACT_APP_BASE_URL } = process.env;

const TableCard = ({ tableNo, seats, id, seatInfo, setRender }) => {
  const qrId = `qr-table-${tableNo}`;
  const qrLink = `${REACT_APP_BASE_URL}/?table_number=${tableNo}`;

  if (seatInfo == undefined) {
    seatInfo = {};
    seatInfo.Seated = false;
    seatInfo.NeedAssistance = false;
  }

  const handleDelete = async () => {
    const response = await fetch(`/api/tables/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(response);
    setRender();
  };

  const handleQR = (table_no) => {
    const canvas = document.getElementById(qrId);
    const image = canvas.toDataURL('img/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `table${table_no}.png`;
    link.click();
  };

  return (
    // <Badge color="secondary" badgeContent={<BackHandIcon/>} invisible={!seatInfo.NeedAssistance}
    //   sx={{ "& .MuiBadge-badge": { fontSize: 15, maxWidth: 15, maxHeight: 15} }}
    // >
    <Card
      style={{
        display: 'flex',
        flexFlow: 'column',
        alignContent: 'space-around',
        width: '320px',
        background: seatInfo.Seated ? '#AED6F1' : '#D3D3D3',
      }}
    >
      <CardHeader title={tableNo} />
      <CardContent>
        <QRCodeCanvas value={qrLink} id={qrId} hidden />
        <Typography variant="body1">Seats: {seats}</Typography>
      </CardContent>
      <div
        className="button-container"
        style={{
          display: 'flex',
          gap: '10px',
          paddingBottom: '10px',
          alignContent: 'center',
          marginTop: 'auto',
          paddingLeft: '10px',
        }}
      >
        <span>
          <EditTable
            key={id}
            id={id}
            tableNo={tableNo}
            seats={seats}
            setRender={setRender}
          />
        </span>
        <span>
          <Button
            variant="contained"
            className="qr-button"
            onClick={() => {
              handleQR(tableNo);
            }}
          >
            <QRIcon />
          </Button>
        </span>
        <span>
          <Button
            variant="contained"
            color="error"
            className="delete-button"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </span>
      </div>
    </Card>
    // </Badge>
  );
};

export default TableCard;
