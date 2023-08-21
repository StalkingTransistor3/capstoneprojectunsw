import React, { useEffect, useState } from 'react';
import NewTableForm from './NewTableForm';
import TableCard from './TableCard';

const ManagerTable = () => {
  const [tableList, setTableList] = useState([]);
  const [liveTableInfo, setliveTableInfo] = useState({});
  const [triggerRender, setTriggerRender] = useState(false);

  const seatedTables = async () => {
    const response = await fetch(`/api/orders/table/seated/all`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
        let tableInfo = Object();
        for (const i in respo) {
          tableInfo[respo[i].TableNo] = respo[i];
        }
        console.log(tableInfo);
        setliveTableInfo(tableInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const allTables = async () => {
    const response = await fetch(`/api/tables`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((respo) => {
        setTableList(respo);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    allTables();
    seatedTables();
    const intervalId = setInterval(() => {
      seatedTables();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [triggerRender]);

  const handleRender = () => {
    setTriggerRender(!triggerRender);
  };

  return (
    <>
      <NewTableForm setRender={handleRender} />
      <div>
        <div
          className="card-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexGrow: '2',
            alignContent: 'space-around',
            gap: '32px',
            paddingTop: '16px',
          }}
        >
          {tableList.map((table) => (
            <TableCard
              key={table._id}
              id={table._id}
              tableNo={table.tableNo}
              seats={table.seats}
              seatInfo={liveTableInfo[table.tableNo]}
              setRender={handleRender}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ManagerTable;
