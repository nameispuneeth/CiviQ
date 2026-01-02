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


<h1>Project Screenshots : </h1>
<h2>Home Page : </h2>
<img width="1890" height="857" alt="Screenshot 2026-01-02 133614" src="https://github.com/user-attachments/assets/a8ce6ab6-d8b4-42c7-b611-5b704a4b307a" />

<h1>Citizen Profile : </h1>
<h4>URL For Citizen Page : </h4> <a href="https://civiqconnectbypj.vercel.app/" target="_blank">https://civiqconnectbypj.vercel.app</a>
<h2>Authentication : </h2>
<img width="684" height="740" alt="Screenshot 2026-01-02 133649" src="https://github.com/user-attachments/assets/87a5497e-c7c8-4f74-8794-583df7fe524f" />
<img width="597" height="787" alt="Screenshot 2026-01-02 133641" src="https://github.com/user-attachments/assets/ae531676-95f8-45c2-8c9d-2dc6967d1c72" />
<h2>User Home Page : </h2>
<img width="1909" height="843" alt="Screenshot 2026-01-02 134330" src="https://github.com/user-attachments/assets/936a012c-5c46-4b02-abea-d95d17251c27" />
<h2>Report Issue Page : </h2>
<img width="464" height="806" alt="Screenshot 2026-01-02 134400" src="https://github.com/user-attachments/assets/2ce6e608-9ee1-474f-ad45-376dc9a2bbff" />
<h2>Track Issues Page : </h2>
<img width="1169" height="855" alt="Screenshot 2026-01-02 134505" src="https://github.com/user-attachments/assets/05362b7d-491f-4811-ac40-d7f0e7c2bbab" />

<h1>Admin and Employee Profile : </h1>
<h4>URL For Admin and Employee Pages : </h4> <a href="https://civiq-admin.vercel.app/" target="_blank">https://civiq-admin.vercel.app/</a>

<h2>Admin and Employee Authentication : </h2>
<img width="583" height="777" alt="Screenshot 2026-01-02 134732" src="https://github.com/user-attachments/assets/abe8b2ec-d3e7-4268-935b-56b94a01a3a9" />
<h2>Admin Dashboard : </h2>
<img width="1910" height="851" alt="Screenshot 2026-01-02 134758" src="https://github.com/user-attachments/assets/d37b6400-23e8-44e4-8c80-7198667c393e" />
<h2>Admin Updating Issues : </h2>
<img width="1821" height="831" alt="Screenshot 2026-01-02 134817" src="https://github.com/user-attachments/assets/fc1cbd12-b950-4b6c-89e2-fc74c04cf98c" />
<h2>Map in Admin Page : </h2>
<img width="1900" height="831" alt="Screenshot 2026-01-02 135019" src="https://github.com/user-attachments/assets/c5181358-1636-40bc-a6dc-26b545a50f26" />
<h2>Employees Details in Admin Page (Addition & Removal) : </h2>
<img width="1828" height="854" alt="Screenshot 2026-01-02 135030" src="https://github.com/user-attachments/assets/11610bd7-128c-4015-8da8-91f2ec035807" />

<h2>Employee Page : </h2>
<img width="1894" height="803" alt="Screenshot 2026-01-02 135213" src="https://github.com/user-attachments/assets/2e45dd43-e858-4ead-9774-ec01ee958b1c" />
---



## Installation

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

<h2>Future Enhancements</h2>

- Push notifications
- Chat system
- AI-based issue classification
- Multi-language support

<h2> Contributors: </h2>

- Puneeth.
- Zaweed.

