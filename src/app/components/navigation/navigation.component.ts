import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TooltipModule } from 'primeng/tooltip';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    DrawerModule,
    TieredMenuModule,
    TooltipModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  opened = true;
  collapsed = false;
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    { label: 'Patients', icon: 'pi-users', route: '/patients' },
    { label: 'Visits', icon: 'pi-calendar-plus', route: '/visits' },
    { label: 'Camps', icon: 'pi-building', route: '/camps' },
    { label: 'Camp Runs', icon: 'pi-calendar', route: '/camp-runs' },
    { label: 'Medicines', icon: 'pi-shopping-cart', route: '/medicines' },
    { label: 'Staff', icon: 'pi-id-card', route: '/staff' },
    { label: 'Reports', icon: 'pi-chart-bar', route: '/reports' }
  ];
  userMenuItems = [
    { label: 'Profile', icon: 'pi pi-user', command: () => {} },
    { label: 'Settings', icon: 'pi pi-cog', command: () => {} },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => {} }
  ];

  ngOnInit(): void {
    // Check screen size for responsive behavior
    if (window.innerWidth < 768) {
      this.opened = false;
    }
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
}

