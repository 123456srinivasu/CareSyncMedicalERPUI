import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PatientService } from '../../core/services/patient.service';
import { filter } from 'rxjs/operators';

interface SubMenuItem {
  label: string;
  route: string;
}

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  items?: SubMenuItem[];
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    AutoCompleteModule,
    CommonModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    DrawerModule,
    TieredMenuModule,
    TooltipModule,
    FormsModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  opened = true;
  collapsed = false;
  expandedMenus: { [key: string]: boolean } = {};
  loading: boolean = false;
  isLoading: boolean = false;
  selectedPatient: any;
  searchText: string = '';
  filteredPatients: any[] = [];
  showSearch: boolean = false;

  private patientService = inject(PatientService);
  private router = inject(Router);

  menuItems: MenuItem[] = [
    // { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    { label: 'Patients', icon: 'pi-users', route: '/patients' },
    // { label: 'Visits', icon: 'pi-calendar-plus', route: '/visits' },
    { label: 'Camps', icon: 'pi-building', route: '/camps' },
    // { label: 'Camp Runs', icon: 'pi-calendar', route: '/camp-runs' },
    // { label: 'Medicines', icon: 'pi-shopping-cart', route: '/medicines' },
    {
      label: 'Stock',
      icon: 'pi pi-box',
      items: [
        { label: 'Stock Report', route: '/stock/current' },
        { label: 'Add Stock', route: '/stock/add' },
        { label: 'Purchase Medicine', route: '/stock/purchase-medicine' },
        { label: 'Purchase Orders Report', route: '/stock/purchase-medicine-orders-report' },
        { label: 'Camp - Accept Order', route: '/stock/camp-accept-order' },
        { label: 'Camp - Accept Order Report', route: '/stock/camp-accept-order-report' },
      ],
    },
    {
      label: 'User List',
      icon: 'pi pi-box',
      items: [
        { label: 'patient all list', route: '/patient-list' },
        { label: 'Camp list', route: '/stock/add' },
        { label: 'Doctor list ', route: '/stock/add' },
      ],
    },
    // { label: 'Staff', icon: 'pi-id-card', route: '/staff' },
    // { label: 'Reports', icon: 'pi-chart-bar', route: '/reports' }
  ];
  userMenuItems = [
    { label: 'Profile', icon: 'pi pi-user', command: () => { } },
    { label: 'Settings', icon: 'pi pi-cog', command: () => { } },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => { } },
  ];

  ngOnInit(): void {
    // Check screen size for responsive behavior
    if (window.innerWidth < 768) {
      this.opened = false;
    }

    // Subscribe to router events to toggle search visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showSearch = event.url.includes('patient-soap'); // Adjust logic as needed
    });
  }

  toggleSidenav(): void {
    this.opened = !this.opened;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  getDrawerWidth(): string {
    if (!this.opened) {
      return '0px';
    }
    return this.collapsed ? '80px' : '260px';
  }

  toggleSubMenu(menuLabel: string): void {
    if (this.collapsed) return;
    this.expandedMenus[menuLabel] = !this.expandedMenus[menuLabel];
  }

  onPatientSelect(event: any) {
    const patientData = event.value;
    this.selectedPatient = patientData;

    // Use optional chaining to safely access propertied and handle potential differences in API response structure
    const patientId = this.selectedPatient?.tblPatientId || this.selectedPatient?.patient_id;

    if (patientId) {
      this.router.navigate(['/patient-soap', patientId], {
        state: { patient: this.selectedPatient }
      });
      // Clear search after navigation
      this.searchText = '';
    }
  }

  onSearch($event: any) {
    if (this.searchText.length < 2) {
      return;
    }

    this.loading = true;
    this.patientService.searchPatientsByMobile(this.searchText).subscribe({
      next: (data) => {
        this.filteredPatients = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error searching patients:', err);
        this.loading = false;
        this.filteredPatients = [];
      },
    });
  }

  isSubMenuExpanded(menuLabel: string): boolean {
    return this.expandedMenus[menuLabel] || false;
  }

  hasSubMenu(item: MenuItem): boolean {
    return !!(item.items && item.items.length > 0);
  }
}
