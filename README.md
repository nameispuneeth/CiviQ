# CiviQ — Civic Issue Reporting & Management System

CiviQ is a full-stack web application that enables citizens to report civic issues, track their status, and receive updates from authorities.  
It provides dedicated dashboards for **Users**, **Admins**, and **Employees** to ensure transparent civic management.

---

## Project Documents

| Document | Link |
|---------|------|
| **Software Requirements Specification (SRS)** | [View SRS](./documents/SRS.pdf) |
| **Use Case Diagram** | [View Diagram](./documents/usecase-diagram.png) |
| **Activity / Workflow Diagram** | [View Workflow](./documents/workflow-diagram.png) |
| **Class Diagram / ER Diagram** | [View Diagram](./documents/er-diagram.png) |
| **URD / Module Documentation** | [View URD](./documents/URD.pdf) |
| **Project Screenshots** | [Screenshots](./screenshots/) |
| **Demo Video** | [Watch Demo](https://your-demo-link.com) |


---

## Features

### User
- Report civic issues with description, image, and geolocation.
- Track issue status (**Pending → In-Progress → Resolved**).
- Rate resolved issues.
- View history of submitted reports.

### Admin
- View all issues.
- Assign issues to employees.
- Update issue status.
- Manage employees.
- View issue location on a map.
- Access analytics.

### Employee
- View issues assigned by admin.
- Mark issue as completed.
- Personal dashboard.

---

## Tech Stack

**Frontend:** React, Tailwind CSS, React Router  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Other Libraries:** JWT, bcrypt, Cloudinary, Geo API

---

## 🛠️ Installation

### Clone Repo
```bash
git clone https://github.com/yourusername/CiviQ.git
cd CiviQ
```
### Install Backend
```
cd server
npm install
npm start
```

### Install Frontend
```
cd client
npm install
npm run dev
```

## 🧪 Future Enhancements

- Push notifications
- Chat system
- AI-based issue classification
- Multi-language support

  ### 🤝 Contributors
- Puneeth.
- Zaweed.

  
---
