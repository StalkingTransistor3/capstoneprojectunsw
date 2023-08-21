import React, { useEffect, useState } from 'react';
import {
  Table,
  TextField,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Rating from '@mui/material/Rating';

const FeedbackDashboard = () => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const response = fetch('/api/orders/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('a4-token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log('this is feedback!:');
        console.log(respo);
        setFeedbackData(respo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredFeedback = selectedDate
    ? feedbackData.filter((feedback) => {
        const feedbackDate = new Date(feedback.createdAt);
        return feedbackDate.toDateString() === selectedDate.toDateString();
      })
    : feedbackData;

  const sortedFeedback = filteredFeedback.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  return (
    <div>
      <h2>Feedback Table</h2>
      <span>
        <b>Date Picker </b>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          isClearable
        />
      </span>
      <table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Time</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Feedback</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedFeedback.map((feedback) => {
            if (feedback.Feedback === '') {
              return null; // Skip rendering empty feedback
            }
            return (
              <TableRow key={feedback.createdAt}>
                <TableCell>
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(feedback.createdAt).toLocaleTimeString()}
                </TableCell>
                <TableCell>{feedback.Feedback}</TableCell>
                <TableCell>
                  <Rating
                    name="half-rating-read"
                    defaultValue={feedback.Rating}
                    precision={0.5}
                    readOnly
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </table>
    </div>
  );
};

export default FeedbackDashboard;
