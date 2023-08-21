# COMP3900 NinjaTurtles
## Spyce Wait Management System
Spyce is a wait management system for restaurant to manage customer orders and restaurant staff works.

The system is separated into two major parts:
1. Staff work management system: Accessible with \<address\>:3001/login
2. Customer food ordering system: Accessible with \<address>:3001

### How to run with Docker Desktop
1. Install the latest version of Docker Desktop (Tested on Docker Desktop 4.21.1). Make sure that the Docker engine is running in the background.
2. Open the project directory in the terminal. Enter the commands below to run the database, backend and frontend server:
```bash
docker compose up
```
3. If you want the program to run even when the terminal is closed, run this command instead:
```bash
docker compose up -d
```

### Accessing the mongoDB DataBase
- You can directly access the database while running the software on docker using mongoDB Compass. Below is the URI to access the database.
```
mongodb//localhost:27017
```
- When we start the program using docker, sample food items and table data will be loaded into the database.