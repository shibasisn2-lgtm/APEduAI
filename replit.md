# Overview

This is an education analytics platform designed to predict and prevent student dropout through AI-powered risk assessment. The system tracks student attendance, academic performance, and socio-economic factors to identify at-risk students and recommend targeted interventions. It provides state-level oversight of districts, analyzes government scheme effectiveness, and monitors DLI (Disbursement Linked Indicators) for educational programs.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: React 18 with TypeScript, using Wouter for client-side routing and TanStack Query for server state management.

**UI Framework**: Shadcn UI components built on Radix UI primitives with Tailwind CSS for styling. The design system uses CSS variables for theming with support for light/dark modes.

**State Management**: TanStack React Query handles all server state with aggressive caching (`staleTime: Infinity`). No global client state management library - component state is managed locally with React hooks.

**Component Structure**: 
- Page components in `client/src/pages/` handle routing and data fetching
- Layout components (`Sidebar`, `Header`) provide navigation and application shell
- Reusable chart components use Recharts library for data visualization
- File upload features use react-dropzone for drag-and-drop functionality

**Responsive Design**: Mobile-first approach with collapsible sidebar, mobile menu overlay, and breakpoint at 768px (defined in `use-mobile` hook).

## Backend Architecture

**Technology Stack**: Express.js server with TypeScript, using ESM modules throughout.

**API Design**: RESTful endpoints under `/api` prefix:
- `/api/districts` - District management
- `/api/students` - Student records and risk assessments
- `/api/interventions` - Intervention tracking
- `/api/schemes` - Government scheme analytics
- `/api/upload` - File upload with AI processing

**File Processing**: Multer middleware handles file uploads with 50MB limit. Supports CSV, XLS, and XLSX formats. PapaCSV and XLSX libraries parse uploaded data.

**AI Integration**: OpenAI API integration for predictive analytics via `AIPredictionService`. The service validates student data and generates risk predictions with confidence scores and recommendations.

**Data Validation**: Zod schemas (via drizzle-zod) validate all incoming data against database schema definitions.

**Build System**: Vite for frontend bundling, esbuild for backend compilation. Development mode uses Vite middleware for HMR. Production builds static frontend to `dist/public` and bundles backend to `dist/index.js`.

## Database Architecture

**ORM**: Drizzle ORM with PostgreSQL dialect (configured for Neon serverless).

**Schema Design**:
- `users` - Authentication (username/password)
- `districts` - Geographic regions with risk metrics
- `students` - Core student data with risk scores and demographic information
- `schemes` - Government programs (mid-day meal, uniforms, etc.)
- `schemeEnrollments` - Many-to-many relationship between students and schemes
- `interventions` - Tracking of support actions for at-risk students
- `alerts` - System notifications with read/unread status
- `dliIndicators` - Disbursement Linked Indicators for program monitoring
- `uploadedFiles` - Audit trail for data imports

**Key Relationships**:
- Students belong to districts (foreign key relationship)
- Interventions link to students
- Scheme enrollments create many-to-many between students and schemes

**Data Types**: Uses decimals for precision-critical fields (attendance, performance, risk scores). UUID primary keys generated via PostgreSQL's `gen_random_uuid()`.

**Storage Layer**: Abstracted via `IStorage` interface in `server/storage.ts`, allowing for future implementation swapping while maintaining consistent API.

# External Dependencies

## Database Service
- **Neon Serverless PostgreSQL**: Managed PostgreSQL with WebSocket support for serverless environments
- Connection pooling via `@neondatabase/serverless` package
- Requires `DATABASE_URL` environment variable

## AI/ML Services
- **OpenAI API**: Used for student dropout risk prediction and data analysis
- Requires `OPENAI_API_KEY` environment variable
- Currently configured for GPT-5 model (per inline comment in ai-prediction service)

## UI Component Library
- **Radix UI**: Accessible component primitives (40+ components imported)
- **Shadcn UI**: Pre-styled component library built on Radix, configured via `components.json`

## Development Tools (Replit-specific)
- `@replit/vite-plugin-runtime-error-modal`: Error overlay for development
- `@replit/vite-plugin-cartographer`: Development tool integration
- `@replit/vite-plugin-dev-banner`: Development environment banner

## Data Processing
- **PapaParse**: CSV file parsing
- **XLSX**: Excel file reading and writing
- **Multer**: Multipart form data handling for file uploads

## Charting and Visualization
- **Recharts**: React charting library for data visualization (line charts, pie charts)

## Form Management
- **React Hook Form**: Form state management with `@hookform/resolvers` for validation
- **Zod**: Schema validation integrated with React Hook Form

## Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **tailwind-merge**: Intelligent Tailwind class merging