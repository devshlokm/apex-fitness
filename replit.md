# Fitness Tracking Application

## Overview

This is a full-stack fitness tracking application built with React, Express, and PostgreSQL. The app provides a comprehensive platform for users to track their nutrition, workouts, body metrics, and overall fitness progress. It features a mobile-first design with a clean, modern interface optimized for daily fitness tracking.

The application allows users to log meals from a pre-defined diet chart or add custom entries, track workout sessions with exercises and sets, monitor body composition metrics, and view their fitness journey through progress analytics. The system is designed to encourage consistent fitness habits through streak tracking and goal setting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based architecture using functional components and hooks
- **Vite**: Fast build tool and development server with hot module replacement
- **Wouter**: Lightweight client-side routing for navigation between dashboard, nutrition, workouts, and progress pages
- **TanStack Query**: Server state management for efficient data fetching, caching, and synchronization
- **Shadcn/ui**: Design system built on Radix UI primitives with Tailwind CSS for consistent, accessible components
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

### Backend Architecture
- **Express.js**: RESTful API server with TypeScript support
- **Modular Route System**: Clean separation of API endpoints in dedicated route handlers
- **Storage Abstraction**: Interface-based storage layer for easy database switching and testing
- **Request Logging**: Comprehensive logging middleware for API calls with response times and JSON capture
- **Error Handling**: Centralized error handling with proper HTTP status codes and error messages

### Database Schema Design
- **PostgreSQL with Drizzle ORM**: Type-safe database operations with schema-first approach
- **User Management**: Core user profiles with streak tracking and authentication support
- **Body Metrics**: Comprehensive tracking of weight, BMI, body fat, muscle mass, and other composition metrics
- **Nutrition System**: Pre-defined meal options categorized by meal types (breakfast, lunch, dinner, snacks, post-workout) with logged meal tracking
- **Workout Management**: Exercise library, workout sessions, sets tracking, and personal records
- **Goals and Progress**: Daily goal setting and achievement tracking

### State Management Strategy
- **Server State**: TanStack Query manages all server-side data with automatic caching, background updates, and optimistic updates
- **Client State**: React hooks (useState, useContext) for component-level state and UI interactions
- **Form State**: React Hook Form with Zod validation for type-safe form handling
- **Toast Notifications**: Centralized notification system for user feedback

### UI/UX Design Patterns
- **Component Composition**: Reusable UI components with consistent styling and behavior
- **Modal System**: Sheet-based modals for mobile-optimized interactions
- **Progress Visualization**: Circular progress indicators and charts for tracking metrics
- **Success Animations**: Engaging feedback for completed actions to encourage user retention
- **Accessibility First**: Radix UI primitives ensure keyboard navigation and screen reader support

## External Dependencies

### Database Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **Drizzle Kit**: Database migration and schema management tools
- **Connection Pooling**: Efficient database connection management for production workloads

### UI Framework and Styling
- **Radix UI**: Headless component library providing accessible primitives for complex UI patterns
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens and responsive design
- **Lucide Icons**: Consistent icon set with React components
- **Custom Fonts**: Google Fonts integration (Roboto, Open Sans) for typography hierarchy

### Development and Build Tools
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Integration**: Development environment optimization with runtime error overlays and cartographer

### Data Validation and Types
- **Zod**: Runtime type validation for API requests and form data
- **Drizzle-Zod**: Automatic schema validation generation from database schema
- **Shared Types**: Common TypeScript definitions between client and server

### Production Considerations
- **Session Management**: PostgreSQL-backed session storage for user authentication
- **Environment Configuration**: Secure environment variable handling for database URLs and API keys
- **Build Optimization**: Separate client and server builds with proper asset handling
- **Error Monitoring**: Comprehensive error tracking and logging for production debugging