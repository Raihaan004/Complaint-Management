# 🎯 Complaint Management System

A modern, responsive web application built with Next.js for managing customer complaints efficiently. The system features real-time status updates, email notifications, and a user-friendly admin interface.

## ✨ Features

### For Users
- 🚀 Easy complaint submission with priority levels
- 📧 Real-time email notifications for status updates
- 📱 Fully responsive design for all devices
- 🔍 Track complaints with unique reference IDs
- 🔒 Secure user authentication system

### For Administrators
- 📊 Comprehensive admin dashboard with filtering options
- 🔄 Real-time status management system
- 📝 Comment system for detailed updates
- 📨 Automated bidirectional email notifications
- 🎯 Priority-based complaint handling
- 🗂️ Category-based organization
- 📊 User email tracking and management

## 🛠️ Tech Stack

- **Frontend:**
  - Next.js 13+ (App Router)
  - TypeScript
  - Tailwind CSS
  - React (Server & Client Components)

- **Backend:**
  - Next.js API Routes
  - MongoDB with Mongoose
  - JWT Authentication
  - Nodemailer for automated emails

## 🚀 Getting Started

### Prerequisites

- Node.js 16.8 or later
- MongoDB instance
- Email service credentials (SMTP)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin@example.com
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Raihaan004/Complaint-Management.git
   cd complaint-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
complaint-management/
├── app/                   # Next.js app router
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── complaints/   # Complaint management
│   ├── login/           # User login page
│   └── register/        # User registration
├── components/           # React components
│   ├── ComplaintForm.tsx    # Submission form
│   ├── ComplaintTable.tsx   # Admin table
│   └── ...                  # Other components
├── lib/                  # Utility functions
│   ├── dbConnect.ts      # MongoDB connection
│   ├── jwt.ts           # JWT handling
│   └── nodemailer.ts    # Email service
└── models/              # MongoDB models
    ├── Complaint.ts     # Complaint schema
    └── User.ts         # User schema
```

## 🔄 Core Features

### Email Notifications
- Automatic notifications for complaint submission
- Status update notifications for users
- Admin notifications for new complaints
- Customizable email templates

### Admin Dashboard
- Real-time complaint management
- Status filtering (Pending, In Progress, Resolved)
- Priority-based sorting
- User email tracking
- Detailed complaint view
- Comment system for updates

### Security
- JWT-based authentication
- Secure password handling
- Protected API routes
- Role-based access control

## 📝 API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Complaints
- `GET /api/complaints` - List all complaints (admin)
- `POST /api/complaints` - Submit new complaint
- `PATCH /api/complaints/[id]` - Update complaint status
- `DELETE /api/complaints/[id]` - Delete complaint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

[@Raihaan004](https://github.com/Raihaan004)

Project Link: [https://github.com/Raihaan004/Complaint-Management](https://github.com/Raihaan004/Complaint-Management)
