# Health Camp Management Database Schema

This document describes the database schema extracted from the SQL dump and the corresponding UI components generated.

## Database: `health_camp_management`

### Tables Overview

1. **camps** - Master camp definitions
2. **camp_locations** - Location associations for camps
3. **camp_location_versions** - Historical versioning of location details
4. **camp_runs** - Actual camp execution instances
5. **camp_plans** - Planned camp schedules
6. **camp_schedule_templates** - Recurring schedule templates
7. **camp_run_staff** - Staff assignments to camp runs
8. **camp_users** - User-camp associations
9. **camp_stock** - Medicine stock for camps
10. **camp_pharmacy_purchase_order** - Pharmacy purchase orders/stock
11. **patients** - Patient master data
12. **visits** - Patient visit records
13. **consultations** - Consultation details for visits
14. **consultation_medications** - Medications prescribed in consultations
15. **medicine_lookup** - Medicine master data
16. **pharmacy_supplier** - Medicine supplier information
17. **users** - System users (doctors, volunteers, admins)

## UI Components Generated

### Main Modules

1. **Camps Management** (`/camps`)
   - List all camps
   - Create/Edit/Delete camps
   - Camp status management

2. **Camp Runs** (`/camp-runs`)
   - Manage actual camp executions
   - Track planned vs actual dates
   - Status management (PLANNED, STARTED, CLOSED, CANCELLED)

3. **Patients** (`/patients`)
   - Patient registration and management
   - Search and filter patients
   - View patient details

4. **Visits & Consultations** (`/visits`)
   - Register patient visits (CAMP or EMERGENCY)
   - Create consultations with vitals
   - Track visit history

5. **Medicines & Pharmacy** (`/medicines`)
   - Medicine master data management
   - Supplier management
   - Medicine catalog

6. **Staff Management** (`/staff`)
   - User management
   - Role-based access (ADMIN, DOCTOR, VOLUNTEER, FRONT_DESK)
   - Staff assignment to camps

7. **Dashboard** (`/dashboard`)
   - Overview statistics
   - Key metrics and charts

8. **Reports** (`/reports`)
   - Analytics and reporting
   - Revenue trends
   - Department distribution

## Key Relationships

- **Camp → Location**: One camp can have multiple locations
- **Camp → Camp Run**: One camp can have multiple runs
- **Camp Run → Visit**: One camp run can have multiple visits
- **Visit → Consultation**: One-to-one relationship
- **Consultation → Medications**: One consultation can have multiple medications
- **User → Camp**: Many-to-many through `camp_users`
- **Camp Run → Staff**: Many-to-many through `camp_run_staff`

## Features Implemented

✅ CRUD operations for major entities
✅ Search and filtering
✅ Status management
✅ Form validation
✅ Responsive design
✅ PrimeNG and Angular Material integration
✅ Data tables with pagination
✅ Dialog-based forms
✅ Status tags and indicators

## Future Enhancements

- [ ] Location versioning management UI
- [ ] Schedule template management
- [ ] Camp plan management
- [ ] Stock management for camps
- [ ] Purchase order management
- [ ] Medication prescription workflow
- [ ] Advanced reporting and analytics
- [ ] User authentication and authorization
- [ ] API integration
- [ ] Print functionality for reports

