# 🩸 BloodLink - Hospital Blood Donation Management System

[![BloodLink](https://img.shields.io/badge/BloodLink-Hospital%20Blood%20Donation-red)](https://github.com/nardos-tsige/BloodLink)

BloodLink is a full-stack hospital blood donation management system designed to connect blood donors with hospitals in Ethiopia. It streamlines the blood donation process, manages donor records, blood inventory, and emergency blood requests.

## 📋 Features

### 👤 Donor Dashboard
- Register and manage profile
- Update blood donation availability
- View donation history
- Receive blood request notifications
- Track donation impact (lives saved)

### 👨‍⚕️ Staff Dashboard
- Create blood requests for patients
- Track request status
- View blood inventory
- Search compatible donors

### 🔧 Admin Dashboard
- Verify new donor registrations
- Manage hospital staff accounts
- Monitor blood inventory levels
- Approve/Reject blood requests
- Generate system reports

## 🛠️ Tech Stack

**Frontend:**
- React.js
- CSS3 (Custom styling)
- Axios for API calls

**Backend:**
- Node.js
- Express.js
- SQLite3 database
- JWT Authentication
- Bcrypt for password hashing

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/your-username/BloodLink.git
cd BloodLink

**Backend Setup**

cd backend
npm install
node index.js

Server runs on http://localhost:5001

** Frontend Setup**
cd frontend
npm install
npm run dev

App runs on http://localhost:5173

Default Admin Login
Email: admin@bloodlink.com

Password: admin123

📁 Project Structure
text
BloodLink/
├── backend/
│   ├── index.js          # Express server
│   ├── database.js       # SQLite setup
│   ├── bloodlink.db      # Database file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Styles
│   │   └── main.jsx
│   └── package.json
└── README.md

🔄 Workflow
Donor registers → Admin verifies → Donor can donate

Staff creates blood request → Admin approves → Request processed

Staff searches compatible donors when blood is needed

Admin manages inventory and monitors all activities

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📄 License
This project is licensed under the MIT License.

👥 Team
Project Lead: Nardos

Department of Software Engineering, Addis Ababa University (CTBE)

📧 Contact
For any inquiries, please contact: tsigeferejanardos@gmail.com

🌟 Acknowledgments
Addis Ababa University - CTBE

Inst. Samuel Getachew (Project Advisor)

All blood donors who save lives

Made with ❤️ for Ethiopia
