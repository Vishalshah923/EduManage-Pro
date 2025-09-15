# Student Management System

## Overview

This is a comprehensive Educational Management System (EduManage Pro) built as a full-stack web application. The system provides functionality for managing student admissions, fee collection, hostel allocations, library operations, and exam records. It features a modern React-based frontend with a Node.js/Express backend and PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a component-based architecture:
- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management and local React state for UI state
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Context-based authentication system with localStorage persistence
- **Form Management**: React Hook Form with Zod validation schemas

### Backend Architecture
The backend follows a REST API architecture with Express.js:
- **Framework**: Express.js with TypeScript for the web server
- **API Design**: RESTful endpoints organized by resource (students, fees, hostels, library, exams)
- **Authentication**: Session-based authentication with username/password
- **Data Layer**: Abstract storage interface allowing for different implementations
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with Vite integration for seamless development

### Database Architecture
The system uses PostgreSQL with Drizzle ORM:
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Design**: Relational model with proper foreign key relationships
- **Tables**: Users, Students, Fees, Hostels, Library Books, and Exams
- **Migrations**: Database schema versioning with Drizzle Kit
- **Validation**: Zod schemas for runtime type validation

### Core Data Models
- **Users**: Authentication and role management (admin, staff, student)
- **Students**: Student profiles with admission details and status tracking
- **Fees**: Payment records with transaction tracking and receipt management
- **Hostels**: Room allocation and occupancy management
- **Library**: Book issue/return tracking with due date management
- **Exams**: Academic performance tracking with subject-wise results

### Authentication & Authorization
- Simple username/password authentication
- Role-based access control (admin, staff, student)
- Client-side route protection with authentication context
- Session persistence using localStorage

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database for persistent data storage
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)

### UI Component Libraries
- **Radix UI**: Headless UI primitives for accessible components
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and development server with HMR
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast bundling for production builds

### Data Management
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database operations
- **Zod**: Runtime schema validation

### Charts & Visualization
- **Chart.js**: Data visualization for dashboard analytics

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx & class-variance-authority**: Conditional CSS class management
- **wouter**: Lightweight React router