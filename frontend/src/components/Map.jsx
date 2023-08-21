import React, { useState, useRef, useEffect } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  List,
  ListItemText,
  ListItem,
  Checkbox,
  Dialog,
  DialogTitle,
  Popover,
  Button,
  IconButton,
  FormGroup,
  FormControlLabel,
  DialogActions,
  DialogContent,
  TextField,
  DialogContentText,
} from '@mui/material';

const Map = (props) => {
  const mapRef = useRef(null);
  const [tableList, setTableList] = useState([]);
  const [liveTableInfo, setliveTableInfo] = useState({});
  const [mapWidth, setMapWidth] = useState(300);
  const [mapHeight, setMapHeight] = useState(300);
  const [editAnchor, setEditAnchor] = useState(null);
  const [removeTableOpen, setRemoveTableOpen] = useState(false);
  const [removeTableTarget, setRemoveTableTarget] = useState({});
  const [addEditTableOpen, setAddEditTableOpen] = useState(false);
  const [addEditTableTarget, setAddEditTableTarget] = useState({});
  const [addMode, setAddMode] = useState(0);
  const [addX, setAddX] = useState(0);
  const [addY, setAddY] = useState(0);
  const [addW, setAddW] = useState(0);
  const [addH, setAddH] = useState(0);
  const [addR, setAddR] = useState(0);
  const [triggerRender, setTriggerRender] = useState(false);
  const openEdit = Boolean(editAnchor);

  const handleEditOpen = (event) => {
    setEditAnchor(event.currentTarget);
  };
  const handleEditClose = () => {
    setEditAnchor(null);
  };
  const handleRemoveTableOpen = (table) => {
    setRemoveTableOpen(true);
    setRemoveTableTarget(table);
  };

  const handleRemoveTableClose = () => {
    setRemoveTableOpen(false);
    setRemoveTableTarget({});
    setTriggerRender(!triggerRender);
  };

  const handleAddEditTableOpen = (table) => {
    setAddEditTableOpen(true);
    setAddEditTableTarget(table);
    if (table.inMap) {
      setAddX(table.x);
      setAddY(table.y);
      setAddW(table.width);
      setAddH(table.height);
      setAddR(table.radius);
    }
    if (table.radius) {
      setAddMode(1);
    } else {
      setAddMode(0);
    }
  };

  const handleAddEditTableClose = () => {
    setAddEditTableOpen(false);
    setAddEditTableTarget({});
    setAddX(0);
    setAddY(0);
    setAddW(0);
    setAddH(0);
    setAddR(0);
    setTriggerRender(!triggerRender);
  };

  const allTables = async () => {
    const response = await fetch(`/api/tables`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const tables = await response.json();
    setTableList(tables);
  };

  const seatedTables = async () => {
    const response = await fetch(`/api/orders/table/seated/all`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const tables = await response.json();
    let tableInfo = Object();
    for (const i in tables) {
      tableInfo[tables[i].TableNo] = tables[i];
    }
    setliveTableInfo(tableInfo);
  };

  const addEditTable = async (table) => {
    const body =
      addMode === 0
        ? {
            inMap: true,
            x: addX,
            y: addY,
            width: addW,
            height: addH,
            $unset: {
              radius: 1,
            },
          }
        : {
            inMap: true,
            x: addX,
            y: addY,
            radius: addR,
            $unset: {
              width: 1,
              height: 1,
            },
          };
    console.log(table);
    await fetch(`/api/tables/${addEditTableTarget._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });

    handleAddEditTableClose();
  };

  const removeTable = async (table) => {
    const body = {
      inMap: false,
      $unset: {
        x: 1,
        y: 1,
        radius: 1,
        width: 1,
        height: 1,
      },
    };
    console.log(table);
    await fetch(`/api/tables/${removeTableTarget._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });

    handleRemoveTableClose();
  };

  useEffect(() => {
    const map = mapRef.current;
    const ctx = map.getContext('2d');
    map.width = mapWidth;
    map.height = mapHeight;

    const drawTableInfoManager = (table) => {
      ctx.fillStyle = 'black';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (table.width && table.height) {
        const tableNoY = liveTableInfo[table.tableNo]
          ? table.y + table.height / 2 - 48
          : table.y + table.height / 2 - 12;
        ctx.fillText(
          `Table ${table.tableNo}`,
          table.x + table.width / 2,
          tableNoY,
        );
        ctx.font = '16px Arial';
        const seatsNoY = liveTableInfo[table.tableNo]
          ? table.y + table.height / 2 - 16
          : table.y + table.height / 2 + 24;
        ctx.fillText(
          `Seats: ${table.seats}`,
          table.x + table.width / 2,
          seatsNoY,
        );

        if (liveTableInfo[table.tableNo]) {
          ctx.fillText(
            `Assist: ${liveTableInfo[table.tableNo].NeedAssistance}`,
            table.x + table.width / 2,
            table.y + table.height / 2 + 16,
          );
          ctx.fillText(
            `${liveTableInfo[table.tableNo].Status}`,
            table.x + table.width / 2,
            table.y + table.height / 2 + 48,
          );
        }
      } else if (table.radius) {
        const tableNoY = liveTableInfo[table.tableNo]
          ? table.y - 48
          : table.y - 16;
        ctx.fillText(`Table ${table.tableNo}`, table.x, tableNoY);
        ctx.font = '16px Arial';
        const seatsNoY = liveTableInfo[table.tableNo]
          ? table.y - 16
          : table.y + 16;
        ctx.fillText(`Seats: ${table.seats}`, table.x, seatsNoY);

        if (liveTableInfo[table.tableNo]) {
          ctx.fillText(
            `Assist: ${liveTableInfo[table.tableNo].NeedAssistance}`,
            table.x,
            table.y + 16,
          );
          ctx.fillText(
            `${liveTableInfo[table.tableNo].Status}`,
            table.x,
            table.y + 48,
          );
        }
      }
    };

    const drawTableInfoCustomer = (table) => {
      ctx.fillStyle = 'black';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (table.width && table.height) {
        const tableNoY = table.y + table.height / 2 - 16;
        ctx.fillText(
          `Table ${table.tableNo}`,
          table.x + table.width / 2,
          tableNoY,
        );
        ctx.font = '16px Arial';

        if (!liveTableInfo[table.tableNo]) {
          const seatsNoY = table.y + table.height / 2 + 32;
          ctx.fillText(
            `Seats: ${table.seats}`,
            table.x + table.width / 2,
            seatsNoY,
          );
        }

        ctx.fillText(
          liveTableInfo[table.tableNo] ? 'OCCUPIED' : 'AVALIABLE',
          table.x + table.width / 2,
          table.y + table.height / 2 + 12,
        );
      } else if (table.radius) {
        const tableNoY = table.y - 16;
        ctx.fillText(`Table ${table.tableNo}`, table.x, tableNoY);
        ctx.font = '16px Arial';

        if (!liveTableInfo[table.tableNo]) {
          const seatsNoY = table.y + 32;
          ctx.fillText(`Seats: ${table.seats}`, table.x, seatsNoY);
        }

        ctx.fillText(
          liveTableInfo[table.tableNo] ? 'OCCUPIED' : 'AVALIABLE',
          table.x,
          table.y + 12,
        );
      }
    };

    const drawTables = () => {
      ctx.clearRect(0, 0, map.width, map.height);
      ctx.fillStyle = '#faedcd';
      ctx.fillRect(0, 0, map.width, map.height);

      if (tableList) {
        tableList.forEach((table) => {
          if (props.manage) {
            ctx.fillStyle = liveTableInfo[table.tableNo]
              ? '#AED6F1'
              : '#D3D3D3';
          } else {
            ctx.fillStyle = liveTableInfo[table.tableNo]
              ? '#D3D3D3'
              : '#AED6F1';
          }

          if (table.inMap) {
            if (table.width && table.height) {
              if (table.x + table.width >= map.width) {
                setMapWidth(table.x + table.width + 32);
              }
              if (table.y + table.height >= map.height) {
                setMapHeight(table.y + table.height + 32);
              }

              ctx.fillRect(table.x, table.y, table.width, table.height);
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 3;
              ctx.strokeRect(table.x, table.y, table.width, table.height);
            } else if (table.radius) {
              if (table.x + table.radius >= map.width) {
                setMapWidth(table.x + table.radius + 32);
              }
              if (table.y + table.radius >= map.height) {
                setMapHeight(table.y + table.radius + 32);
              }

              ctx.beginPath();
              ctx.arc(table.x, table.y, table.radius, 0, 2 * Math.PI);
              ctx.fill();
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 3;
              ctx.stroke();
            }

            if (props.manage) {
              drawTableInfoManager(table);
            } else {
              drawTableInfoCustomer(table);
            }
          }
        });
      }
    };

    drawTables();

    return () => {};
  }, [
    tableList,
    mapHeight,
    mapWidth,
    triggerRender,
    liveTableInfo,
    props.manage,
  ]);

  useEffect(() => {
    allTables();
    seatedTables();
    const intervalId = setInterval(() => {
      allTables();
      seatedTables();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {props.manage && (
        <div>
          <Button variant="contained" onClick={handleEditOpen}>
            Edit
          </Button>
          <Popover
            open={openEdit}
            anchorEl={editAnchor}
            onClose={handleEditClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <div
              className="tableMapList"
              style={{ maxHeight: '320px', overflowY: 'auto' }}
            >
              <List>
                {tableList.map((table) => (
                  <ListItem key={table.tableNo}>
                    <ListItemText primary={`Table ${table.tableNo}`} />
                    <span style={{ paddingLeft: '32px' }}>
                      {!table.inMap && (
                        <IconButton
                          edge="end"
                          color="success"
                          onClick={() => {
                            handleAddEditTableOpen(table);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      )}
                      {table.inMap && (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              handleAddEditTableOpen(table);
                            }}
                          >
                            <TuneIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => {
                              handleRemoveTableOpen(table);
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </>
                      )}
                    </span>
                  </ListItem>
                ))}
              </List>
            </div>
          </Popover>
          <Dialog
            maxWidth="xs"
            fullWidth="true"
            open={removeTableOpen}
            onClose={handleRemoveTableClose}
          >
            <DialogTitle align="center">
              Remove Table {removeTableTarget.tableNo}
            </DialogTitle>
            <DialogActions>
              <div align="center" style={{ padding: '8px' }}>
                <span style={{ padding: '8px' }}>
                  <Button variant="contained" onClick={handleRemoveTableClose}>
                    Cancel
                  </Button>
                </span>
                <span style={{ padding: '8px' }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={removeTable}
                  >
                    Remove
                  </Button>
                </span>
              </div>
            </DialogActions>
          </Dialog>
          <Dialog
            maxWidth="xs"
            fullWidth="true"
            open={addEditTableOpen}
            onClose={handleAddEditTableClose}
          >
            <DialogTitle align="center">
              {addEditTableTarget.inMap ? 'Edit' : 'Add'} Table{' '}
              {addEditTableTarget.tableNo}
            </DialogTitle>
            <FormGroup align="center" style={{ display: 'inline-block' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addMode === 0}
                    onClick={() => {
                      setAddMode(0);
                    }}
                  />
                }
                label="Rectangle"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addMode === 1}
                    onClick={() => {
                      setAddMode(1);
                    }}
                  />
                }
                label="Circle"
              />
            </FormGroup>
            <DialogContent>
              <TextField
                label="x"
                fullWidth
                margin="normal"
                onChange={(event) => setAddX(event.target.value)}
                defaultValue={addX ? addX : ''}
              />
              <TextField
                label="y"
                fullWidth
                margin="normal"
                onChange={(event) => setAddY(event.target.value)}
                defaultValue={addY ? addY : ''}
              />

              {addMode === 0 && (
                <div>
                  <TextField
                    label="width"
                    fullWidth
                    margin="normal"
                    onChange={(event) => setAddW(event.target.value)}
                    defaultValue={addW ? addW : ''}
                  />
                  <TextField
                    label="height"
                    fullWidth
                    margin="normal"
                    onChange={(event) => setAddH(event.target.value)}
                    defaultValue={addH ? addH : ''}
                  />
                  <DialogContentText>
                    {'Recommended width & height ≥ 160'}
                  </DialogContentText>
                </div>
              )}
              {addMode === 1 && (
                <div>
                  <TextField
                    label="radius"
                    fullWidth
                    margin="normal"
                    onChange={(event) => setAddR(event.target.value)}
                    defaultValue={addR ? addR : ''}
                  />
                  <DialogContentText>
                    {'Recommended radius ≥ 96'}
                  </DialogContentText>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <div align="center" style={{ padding: '8px' }}>
                <span style={{ padding: '8px' }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleAddEditTableClose}
                  >
                    Cancel
                  </Button>
                </span>
                <span style={{ padding: '8px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addEditTable}
                  >
                    Add
                  </Button>
                </span>
              </div>
            </DialogActions>
          </Dialog>
        </div>
      )}
      <div
        className="mapDiv"
        style={{
          overflow: 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
          paddingTop: '8px',
        }}
      >
        <canvas
          ref={mapRef}
          style={{
            borderRadius: '4px',
          }}
        />
      </div>
    </>
  );
};

export default Map;
