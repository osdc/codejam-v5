# Expense Tracker

**Expense Tracker** is a web application designed to help users manage and track their personal finances. The app allows users to record expenses, categorize them, and visualize their spending through charts and reports. It provides a clean and intuitive user interface for managing everyday expenses and financial data.

---

## Features

- **User Authentication**: Secure registration and login system using JWT (JSON Web Tokens).
- **Expense Management**: Add, edit, and delete expense records with customizable categories.
- **Categories**: Organize expenses by categories such as Food, Transportation, Utilities, etc.
- **Date Range Filters**: Filter expenses by a selected date range.
- **Real-Time Analytics**: View visual reports on spending trends using charts.
- **Export Data**: Export expenses as CSV for offline tracking and analysis.
- **Responsive Design**: Fully responsive UI optimized for both desktop and mobile devices.

---

## Technologies Used

### Frontend

- **React.js**: Library for building the user interface.
- **Axios**: Promise-based HTTP client to handle API requests.
- **HTML, CSS, Javascript, Tailwind, Bootstrap**

### Backend

- **Node.js**: JavaScript runtime for the server-side logic.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user data and expenses.
- **JWT**: Authentication token for secure API access.
- **Bcrypt**: For hashing user passwords securely.

---

## Installation

Follow the steps below to get the application up and running locally on your machine.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (>= 14.0.0)
- [MongoDB](https://www.mongodb.com/) (either running locally or using a cloud instance)
- code editor for instance Visual Studio Code

### Clone the Repository

- **Clone the repository to your local machine:**

git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

---

### Frontend Setup
- **Navigate to the client directory:**
cd client

- **Install the necessary dependencies:**
npm install

- **Start the frontend server:**
npm start

- The frontend should now be running at http://localhost:3000.

---

### Backend Setup
- **Navigate to the server directory:** 
cd ../server

- **Install the necessary dependencies:** 
npm install

- **Start the backend server:**
npm start

- The backend should now be running at http://localhost:3001.

### Full Stack
Now, your full stack application should be up and running locally. Open your browser and navigate to http://localhost:3000 to interact with the Expense Tracker.

---

### Usage
- **Sign up**: Create a new account by providing an email and password.
- **Login**: Use your credentials to sign in.
- **Add Expense**: Add new expenses by entering the amount, description, and category.
- **View Expenses**: See a list of your expenses and filter them by category or date range.
- **Generate Reports**: View your spending trends in graphical reports.
- **Export Data**: Export your expense history to a CSV file.

---

### Contributing
- We welcome contributions to improve the Expense Tracker project. If you want to contribute, please follow these steps:
- Fork the repository.
- Create a new branch (git checkout -b feature/your-feature).
- Make your changes and commit them (git commit -am 'Add your feature').
- Push to the branch (git push origin feature/your-feature).
- Create a pull request explaining your changes.

---

### Acknowledgments
- React for building the frontend.
- Node.js for the backend server.
- MongoDB for the database.
- JWT for secure authentication.

---
