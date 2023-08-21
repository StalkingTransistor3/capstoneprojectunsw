# Spyce Wait Management System Backend
Written with Express.js on Node.js.

To run the backend server outside docker containers, you must have mongodb running before backend starts. Once mongodb is running on port 27017, you can run backend server by using the commands below after opening the backend directory in terminal:
```bash
npm install
```
```bash
npm run start
```
### Configuration
You must configure some settings by editing .env file if needed.

Staff email verification will run when new staffs are registered as long as EMAIL_VERIFY is not set to 0. 

DOMAIN is the domain for accessing frontend website. This environment variable is used to create email verification and password reset links.