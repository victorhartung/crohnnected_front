
# Crohnnected Frontend

A foundational Angular 19 frontend application for the Crohnnected digital health management platform, specifically designed for Crohn's disease management.

## 🎯 Overview

This is a foundational Angular 19 frontend that provides the essential scaffolding and core functionality for a comprehensive Crohn's disease management system. It integrates with the Crohnnected backend API and includes authentication, user management, and basic health tracking capabilities.

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with automatic token handling
- **Role-based access control** (Patient, Healthcare Professional, Family Support Member)
- **Secure login/registration** with form validation
- **Route guards** for protected routes
- **HTTP interceptors** for automatic token injection

### 🎨 UI/UX Design
- **Angular Material Design** with healthcare-focused theme
- **Responsive design** for all device sizes
- **Healthcare color palette** (calming blues, healing greens)
- **Accessible components** with ARIA labels and keyboard navigation
- **Professional medical aesthetics** with clean, modern layouts

### 🏗️ Architecture
- **Modular structure** with core, shared, and feature modules
- **Standalone components** using Angular's latest patterns
- **Reactive forms** with custom validators
- **Observable-based state management**
- **Lazy-loaded routes** for optimal performance

### 🌐 Internationalization
- **Multi-language support** (English and Brazilian Portuguese)
- **Translation-ready** structure for easy expansion
- **Locale-specific formatting** and content

### 📱 Core Components
- **Login/Registration** forms with validation
- **Dashboard** with role-specific content and quick actions
- **Profile management** with comprehensive user settings
- **Navigation layout** with sidebar and responsive header
- **Health metrics** display for patients
- **Quick actions** based on user roles

## 🛠️ Technical Stack

- **Angular 19** - Latest version with standalone components
- **Angular Material** - UI component library
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **SCSS** - Enhanced CSS with variables and mixins
- **Angular CDK** - Component development kit for responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Angular CLI

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd crohnnected-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Access the application**
- Frontend: http://localhost:4200
- Login page: http://localhost:4200/auth/login
- Registration: http://localhost:4200/auth/register

### Backend Integration

The frontend is configured to connect to the Crohnnected backend API:
- Default API URL: `http://localhost:8080/api`
- Update in `src/environments/environment.ts` for different environments

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, guards, interceptors
│   │   ├── guards/           # Authentication guards
│   │   ├── interceptors/     # HTTP interceptors
│   │   ├── models/           # TypeScript interfaces
│   │   └── services/         # Core services (auth, HTTP)
│   ├── shared/               # Shared components and utilities
│   │   ├── components/       # Reusable components
│   │   ├── validators/       # Custom form validators
│   │   └── styles/           # Global styles and themes
│   ├── features/             # Feature modules
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Dashboard functionality
│   │   └── profile/          # Profile management
│   ├── layouts/              # Layout components
│   └── environments/         # Environment configurations
├── locale/                   # Translation files
└── styles.scss              # Global styles
```

## 👥 User Roles

### 🏥 Patient
- Personal health tracking and symptom logging
- Medication management
- Appointment scheduling
- Progress monitoring

### 👩‍⚕️ Healthcare Professional
- Patient management and monitoring
- Treatment planning and adjustments
- Clinical reporting and analytics
- Medical resource access

### 👨‍👩‍👧‍👦 Family Support Member
- Patient progress monitoring
- Communication with healthcare team
- Support group connections
- Educational resources

## 🔧 Configuration

### Environment Variables
- `apiUrl`: Backend API endpoint
- `production`: Production flag

### Authentication
- JWT token storage in localStorage
- Automatic token refresh (to be implemented)
- Secure logout with token cleanup

### Theming
The application uses a custom Angular Material theme with healthcare-focused colors:
- Primary: Calming Blue (#2E7D9A)
- Secondary: Healing Green (#4CAF50)
- Accent: Warm Orange (#FF7043)

## 🧪 Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run unit tests
- `npm lint` - Run ESLint

### Form Validation
- **Email validation** with proper pattern matching
- **Password strength** requirements
- **Username availability** checking
- **Role-specific validation** rules

### Error Handling
- **Global error handling** with user-friendly messages
- **Form validation** with real-time feedback
- **HTTP error interception** and handling
- **Loading states** and progress indicators

## 🔒 Security Features

- **Route protection** with authentication guards
- **JWT token management** with automatic expiration handling
- **CSRF protection** through HTTP interceptors
- **Secure password validation** with strength requirements
- **Input sanitization** and XSS prevention

## 🌐 Internationalization (i18n)

The application includes basic i18n structure:
- English (default)
- Brazilian Portuguese
- Easy to extend for additional languages

## 📱 Accessibility

- **ARIA labels** on all interactive elements
- **Keyboard navigation** support
- **Screen reader compatibility**
- **High contrast** color ratios
- **Focus management** and visual indicators

## 🚧 Future Enhancements

This foundational version provides the scaffolding for:
- Advanced health tracking features
- Real-time notifications
- Video consultation integration
- Advanced reporting and analytics
- Social features and support groups
- Mobile app companion

## 🤝 Contributing

This is a foundational version. Future development should follow:
1. Angular style guide and best practices
2. Component-based architecture
3. Reactive programming patterns
4. Accessibility guidelines
5. Security best practices

## 📄 License

This project is part of the Crohnnected digital health platform.

## 🆘 Support

For questions about this foundational implementation:
- Review the code comments and documentation
- Check the Angular and Angular Material documentation
- Refer to the backend API documentation for integration details
