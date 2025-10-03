# Andhra Pradesh Education Analytics Dashboard

## Project Overview
A comprehensive dropout risk prediction dashboard for the Andhra Pradesh Education project, featuring AI-powered data analysis, real-time monitoring, and intervention management.

## Purpose
Track and predict student dropout risk across Andhra Pradesh districts using AI/ML models, monitor government education schemes, and manage interventions for at-risk students.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **AI/ML**: OpenAI API for dropout risk prediction
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query v5)

## Key Features

### 1. AI-Powered Data Upload System (Highlighted Feature)
- CSV/Excel file upload with drag-and-drop interface
- Automatic data validation and error detection
- AI-powered analysis using OpenAI for dropout risk prediction
- Batch processing with progress tracking
- File upload history and status tracking

### 2. Dashboard & Analytics
- State-level enrollment and dropout statistics
- District-wise risk analysis with color-coded alerts
- Government scheme coverage and beneficiary tracking
- Trend visualization and comparative analysis

### 3. AI Risk Prediction
- Student-level dropout risk assessment
- Risk factors identification and analysis
- Personalized intervention recommendations
- Batch prediction support

### 4. Real-Time Monitoring
- Live alert system for critical student situations
- System health monitoring
- Automated notifications for high-risk students
- Alert categorization (Critical, Warning, Info)

### 5. Intervention Tracker
- Track interventions for at-risk students
- Measure intervention effectiveness
- Schedule and manage follow-ups
- Status tracking (In Progress, Completed, Cancelled)

### 6. DLI Indicators
- Disbursement-Linked Indicators monitoring
- Target vs. achievement tracking
- Quarterly reporting
- Performance visualization

### 7. Scheme Analytics
- Government scheme effectiveness analysis
- Beneficiary coverage tracking
- Scheme comparison and trends

### 8. Role-Based Access Control (RBAC)
- Multi-role authentication system
- Three user roles: State Administrator, District Official, Data Analyst
- Permission-based access to features and data
- District-scoped data access for District Officials

## Project Architecture

### Database Schema
The application uses PostgreSQL with the following main tables:
- `users` - User accounts with role-based permissions
- `districts` - Andhra Pradesh districts with risk metrics
- `students` - Student records with academic and demographic data
- `schemes` - Government education schemes
- `scheme_enrollments` - Student enrollment in schemes
- `interventions` - Intervention records for at-risk students
- `uploaded_files` - File upload tracking and AI analysis results
- `alerts` - Real-time alert system
- `dli_indicators` - DLI performance tracking

### User Roles
1. **State Administrator** - Full system access, can view all districts, manage users
2. **District Official** - Limited to own district data, can manage interventions
3. **Data Analyst** - Read-only access, can generate reports and view analytics

### Application Pages
1. **Dashboard** (`/`) - State overview with key metrics
2. **Scheme Analytics** (`/scheme-analytics`) - Government scheme analysis
3. **AI Risk Prediction** (`/ai-risk-prediction`) - AI-powered dropout predictions
4. **Data Upload** (`/data-upload`) - AI-powered file upload system
5. **Real-Time Monitoring** (`/real-time-monitoring`) - Live alerts and monitoring
6. **DLI Indicators** (`/dli-indicators`) - DLI performance tracking
7. **Intervention Tracker** (`/intervention-tracker`) - Intervention management

## Development Setup

### Running the Application
```bash
npm run dev
```
This starts both the Express backend and Vite frontend on port 5000.

### Database Operations
```bash
# Push schema changes to database
npm run db:push

# Force push schema (use when migrations fail)
npm run db:push --force
```

### Environment Variables
Required secrets (configured in Replit):
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Express session secret
- `OPENAI_API_KEY` - OpenAI API key for AI predictions (optional but recommended)

## Sample Data
The database is seeded with:
- **13 districts** from Andhra Pradesh (Krishna, Guntur, Visakhapatnam, etc.)
- **7 government schemes** (Mid-Day Meal, Jagananna Vidya Deevena, Amma Vodi, etc.)
- **8 sample students** with varying risk levels
- **6 DLI indicators** for FY 2024-25 Q2

## UI Design
- **Color Scheme**: Professional blue theme matching AP government branding
- **Primary Color**: Blue (#3b82f6)
- **Responsive**: Mobile-first design with collapsible sidebar
- **Components**: shadcn/ui for consistent, accessible UI components
- **Icons**: Lucide React for action icons

## Code Conventions

### Frontend
- Use TypeScript for all components
- React Query for all data fetching with proper type annotations
- React Hook Form + Zod for form validation
- Tailwind CSS for styling (avoid custom CSS when possible)
- Add `data-testid` attributes for interactive elements

### Backend
- Keep routes thin - business logic in storage layer
- Validate all inputs using Zod schemas
- Use storage interface for all CRUD operations
- Return proper HTTP status codes and error messages

### Type Safety
- Define types in `shared/schema.ts` for consistency
- Use Drizzle schema types (`$inferSelect`) for database records
- Use Zod inferred types (`z.infer`) for insert operations
- Type all API responses in React Query hooks

## Recent Changes (October 2025)
- **Phase 1 - Data Integrity**: Replaced all mock data with real database calculations
- **Phase 2 - Alert System**: Implemented automated alert generation with proper deduplication
- **Phase 3 - PDF Reports**: Added district and state-level PDF report generation
- **Phase 4 - RBAC**: Implemented role-based access control with three user types
- Fixed Tailwind CSS opacity modifier errors in utility classes
- Added TypeScript type annotations to all API response queries
- Installed missing type packages (@types/multer, @types/papaparse, @types/pdfkit)
- Seeded database with comprehensive sample data
- Fixed iterator compatibility issues in AI prediction service
- All pages tested and verified working

## Testing
- End-to-end testing using Playwright
- All 7 main pages verified loading correctly
- Dashboard statistics and charts rendering properly
- Data upload interface functional
- Navigation between pages working smoothly

## Future Enhancements
1. Expand file upload testing to cover full upload workflow
2. Add more comprehensive AI model training data
3. Implement real-time WebSocket connections for live alerts
4. Add data export functionality
5. Enhance DLI indicator automation

## Notes
- The application emphasizes the AI-powered data upload system as a key differentiator
- Uses PostgreSQL development database (production DB managed separately)
- Designed for Andhra Pradesh Education Department use case
- Supports multiple districts and government schemes
- Focus on early intervention for at-risk students
