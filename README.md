# CareSync Medical ERP UI v2.0

A modern, comprehensive Medical ERP (Enterprise Resource Planning) system built with Angular 19, PrimeNG, and Angular Material.

## Features

- **Dashboard**: Overview of key metrics, statistics, and quick actions
- **Patient Management**: Complete patient records, search, and management
- **Appointment Scheduling**: Manage appointments with calendar views
- **Staff Management**: Healthcare staff directory and management
- **Reports & Analytics**: Revenue trends, department distribution, and comprehensive reporting

## Technology Stack

- **Angular**: 19.0.0
- **PrimeNG**: 19.0.0 - UI Component Library
- **Angular Material**: 19.0.0 - Material Design Components
- **TypeScript**: 5.7.2
- **RxJS**: 7.8.1

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.x or higher)
- npm (v9.x or higher) or yarn
- Angular CLI 19.0.0

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:4200
   ```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Dashboard with statistics and charts
│   │   ├── patients/           # Patient management module
│   │   ├── appointments/       # Appointment scheduling
│   │   ├── staff/              # Staff management
│   │   ├── reports/            # Reports and analytics
│   │   └── navigation/         # Main navigation component
│   ├── app.component.ts        # Root component
│   ├── app.routes.ts           # Application routes
│   └── app.config.ts           # Application configuration
├── assets/                     # Static assets
├── styles.scss                 # Global styles
├── index.html                  # Main HTML file
└── main.ts                     # Application entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run watch` - Build and watch for changes

## Key Features Explained

### Dashboard
- Real-time statistics (Patients, Appointments, Staff, Revenue)
- Interactive charts showing trends
- Quick action buttons for common tasks

### Patient Management
- Searchable patient database
- Detailed patient information
- Status tracking (Active/Inactive)
- Action buttons for viewing and editing

### Appointments
- Today's appointments view
- Upcoming appointments
- Filter by status (Scheduled, Confirmed, Completed)
- Calendar integration ready

### Staff Management
- Staff directory with roles and departments
- Contact information management
- Status tracking
- Role-based filtering

### Reports & Analytics
- Revenue trend analysis
- Department distribution charts
- Export functionality
- Customizable report types (Daily, Weekly, Monthly, Yearly)

## UI Components

This project uses both **PrimeNG** and **Angular Material** components:

### PrimeNG Components Used
- Tables (p-table)
- Cards (p-card)
- Charts (p-chart)
- Buttons (p-button)
- Tags (p-tag)
- Avatar (p-avatar)

### Angular Material Components Used
- Sidebar Navigation (mat-sidenav)
- Toolbar (mat-toolbar)
- Cards (mat-card)
- Buttons (mat-button)
- Icons (mat-icon)
- Tabs (mat-tabs)
- Form Fields (mat-form-field)

## Customization

### Themes

#### PrimeNG Theme
The default theme is `lara-light-blue`. To change it:
1. Update the theme import in `angular.json`:
   ```json
   "styles": [
     "node_modules/primeng/resources/themes/YOUR_THEME/theme.css"
   ]
   ```

#### Angular Material Theme
The default theme is `indigo-pink`. To customize:
1. Edit `angular.json` and update the Material theme import
2. Or create a custom theme in `styles.scss`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

- Use TypeScript strict mode
- Follow Angular style guide
- Use standalone components
- Implement proper error handling
- Write unit tests for critical functionality

## Future Enhancements

- [ ] Authentication and Authorization
- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Export to PDF/Excel
- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@caresync.com or create an issue in the repository.

---

**Note**: This is a sample application. In a production environment, you would need to:
- Implement proper authentication/authorization
- Connect to a backend API
- Add form validation
- Implement error handling
- Add unit and integration tests
- Set up CI/CD pipelines

