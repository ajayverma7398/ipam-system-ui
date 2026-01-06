# IPAM System - IP Address Management Platform

A comprehensive IP Address Management (IPAM) system UI built with Next.js 16, designed to help network administrators efficiently manage their network infrastructure, track IP allocations, and streamline workflows with role-based dashboards.

**Version:** 0.1.0  
**Status:** Frontend UI Complete (Mock Data) - Next.js 16 UI Implementation

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Key Features](#key-features)
- [Current Status](#current-status)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

The IPAM System provides a centralized platform for managing IP address allocations across enterprise networks. It addresses common challenges such as:

- Manual tracking of IP address assignments
- Lack of visibility into IP utilization
- Difficulty preventing IP conflicts
- Inefficient capacity planning
- Limited audit trails for compliance

### Target Users

| Role      | Description        | Key Permissions                                     |
|-----------|--------------------|-----------------------------------------------------|
| **Admin** | Full system access | All permissions including user management, settings |
| **User**  | Read-only access   | View pools, IPs, reports (no modifications)         |

---

## ✨ Features

### Core Functionality

- **IP Pool Management**: Create, view, edit, and delete IP pools with CIDR notation support
- **IP Allocation**: Allocate and release IP addresses with detailed tracking
- **Advanced IP Search**: Find IPs by various criteria (status, pool, device, etc.)
- **CIDR Calculator**: Calculate subnet masks, network ranges, and available IPs
- **Bulk Operations**: Perform bulk allocations, releases, and updates
- **Network Scanning**: Scan networks to discover active devices

### Reporting & Analytics

- **Utilization Reports**: Track IP pool utilization over time
- **Allocation Reports**: Monitor IP allocation trends and patterns
- **Capacity Planning**: Forecast future IP requirements
- **Audit Reports**: Complete audit trail for compliance
- **Custom Reports**: Build custom reports with flexible filters
- **Scheduled Reports**: Automate report generation and delivery

### User Management

- **Role-Based Access Control**: Four user roles with granular permissions
- **User Management**: Create, edit, and manage user accounts
- **Activity Tracking**: Monitor user activities and system events
- **Profile Management**: User profile settings and preferences

### System Settings

- **General Settings**: System-wide configuration options
- **Network Settings**: Network-related configurations
- **Integration Settings**: Third-party integrations (CMDB, Cloud, Monitoring)
- **API Settings**: API key management and rate limiting
- **Audit Settings**: Audit log configuration and retention policies

---

## 🛠 Tech Stack

### Frontend

| Technology       | Version | Purpose                         |
|------------------|---------|---------------------------------|
| **Next.js**      | 16.1.0  | React framework with App Router |
| **React**        | 19.2.3  | UI component library            |
| **TypeScript**   | 5.x     | Type-safe JavaScript            |
| **Tailwind CSS** | 4.x     | Utility-first CSS framework     |
| **Recharts**     | 3.6.0   | Data visualization library      |

### Development Tools

- **ESLint**: Code linting
- **TypeScript**: Type checking
- **npm**: Package management
- **Git**: Version control

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ipam-system-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### First Steps

1. Visit the landing page at `http://localhost:3000`
2. Sign up for a new account or login (currently using mock data)
3. Explore the dashboard and various features

---

## 📁 Project Structure

```
ipam-system-ui/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── pools/              # IP Pool management
│   │   ├── ip-management/      # IP allocation management
│   │   ├── reports/            # Reports & analytics
│   │   └── settings/           # System settings
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── common/             # Reusable common components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── ip-management/      # IP management components
│   │   ├── pools/              # Pool management components
│   │   ├── reports/            # Report components
│   │   └── settings/           # Settings components
│   └── lib/                    # Utilities and data
│       └── data/               # Mock data (JSON files)
├── Doc/                        # Project documentation
│   ├── PROJECT_OVERVIEW.md     # Complete project documentation
│   └── UI_DOCUMENTATION.md     # UI-specific documentation
├── public/                     # Static assets
└── package.json                # Dependencies and scripts
```

---

## 📜 Available Scripts

| Script                  | Description                                             |
|-------------------------|---------------------------------------------------------|
| `npm run dev`           | Start the development server on `http://localhost:3000` |
| `npm run build`         | Build the production-ready application                  |
| `npm run build:webpack` | Build using webpack (skip Turbo)                        |
| `npm run build:windows` | Build for Windows environment                           |
| `npm start`             | Start the production server                             |
| `npm run lint`          | Run ESLint to check code quality                        |

---

## 🎨 Key Features

### Dashboard

- **Statistics Cards**: Overview of pools, allocations, and utilization
- **Utilization Charts**: Visual representation of IP usage
- **Recent Activity**: Latest system activities and events
- **Quick Actions**: Fast access to common operations
- **System Health**: Network and system status indicators
- **Alerts Panel**: Important notifications and warnings

### IP Pool Management

- **Pool List**: View all IP pools with filtering and sorting
- **Pool Details**: Detailed view with allocation charts and statistics
- **Create Pool**: Wizard-based pool creation with validation
- **Bulk Operations**: Import/export pools, bulk updates
- **Pool Merger**: Merge multiple pools into one

### IP Management

- **IP Finder**: Advanced search with multiple filters
- **Allocation Wizard**: Step-by-step IP allocation process
- **CIDR Calculator**: Calculate subnet information
- **Bulk Allocation**: Allocate multiple IPs at once
- **Allocation History**: Track all IP allocation changes
- **Device Management**: Associate IPs with devices

### Reports

- **Utilization Reports**: Track pool utilization trends
- **Allocation Reports**: Monitor allocation patterns
- **Capacity Planning**: Forecast future requirements
- **Audit Reports**: Complete compliance audit trails
- **Custom Reports**: Build reports with flexible filters
- **Scheduled Reports**: Automated report generation

---

## 📊 Current Status

### ✅ Completed

- **Frontend UI**: Complete with 35+ pages and 120+ components
- **Navigation System**: Full routing and navigation
- **Role-Based Dashboards**: Admin, Network Engineer, Operator, Viewer
- **Mock Data Integration**: 18 pools, 100+ allocations, 11 users, 50+ activities
- **Component Library**: Comprehensive reusable components
- **Responsive Design**: Desktop-first design with mobile considerations

### 📝 Notes

- This is a **UI-only** implementation built with Next.js 16
- Currently using **mock data** stored in JSON files
- Data resets on page refresh (no persistence)
- Authentication is UI-only (no backend validation)
- All operations are simulated (no actual IP allocation)
- Ready to be connected to a backend API when available

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deployment Options

- **Vercel**: Recommended for Next.js applications
  - Connect your repository to Vercel
  - Automatic deployments on push
  - See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

- **Other Platforms**: Any platform that supports Next.js
  - Build the application using `npm run build`
  - Deploy the built application
  - No additional environment variables required for UI-only deployment

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly


---

## 📄 License

This project is private and proprietary.

**Built with ❤️ using Next.js, React, and TypeScript by Ashish Singh**
