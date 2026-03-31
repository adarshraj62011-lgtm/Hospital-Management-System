# Hospital Management System

A full-stack web application designed to manage hospital operations efficiently. The system is built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js) and includes a public-facing website for patients and an admin dashboard for hospital staff/administrators.

## 🚀 Features
- **User Authentication**: Secure login and registration with JWT and bcrypt.
- **Role-Based Access**: Specialized interfaces for patients and administrators.
- **File Uploads**: Integration with Cloudinary for handling media and document uploads efficiently.
- **API Integration**: RESTful API built with Express and connected to MongoDB.
- **Responsive UI**: Built with React and optimized by Vite for super-fast development and performance.
- **Admin Dashboard**: Dedicated dashboard to monitor interactions and manage hospital data.

## 🛠️ Technology Stack
- **Frontend**: React.js, Vite, React Router DOM, Axios, React Toastify, React Multi Carousel.
- **Dashboard**: React.js, Vite, React Router DOM, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT (JSON Web Tokens), Bcrypt, Cloudinary, Express FileUpload.

## 📂 Project Structure
- `/frontend`: Contains the patient-facing web application.
- `/dashboard`: Contains the administrator dashboard.
- `/Backend`: Contains the RESTful API server and database models.

## 💻 Running Locally

### Prerequisites
- Node.js installed on your machine.
- MongoDB connection string.
- Cloudinary account credentials.

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adarshraj62011-lgtm/Hospital-Management-System.git
   cd Hospital-Management-System
   ```

2. **Backend Setup:**
   Navigate to the Backend folder, install dependencies, and configure environment variables.
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `/Backend` directory and add your credentials:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET_KEY=your_jwt_secret
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal, navigate to the frontend folder, and start the app.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Dashboard Setup:**
   Open a new terminal, navigate to the dashboard folder, and start the admin panel.
   ```bash
   cd dashboard
   npm install
   npm run dev
   ```

### 🎯 Alternative Global Startup
Alternatively, you can start the entire project via the included PowerShell script (if you are on Windows):
```powershell
./run-project.ps1
```

## 📜 License
This project is open-source and free to use.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
