
import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnDestroy {
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  isHandset = false;

  navigationItems = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      roles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL', 'FAMILY_SUPPORT_MEMBER']
    },
    {
      icon: 'person',
      label: 'Profile',
      route: '/profile',
      roles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL', 'FAMILY_SUPPORT_MEMBER']
    },
    {
      icon: 'medical_services',
      label: 'Health Records',
      route: '/health-records',
      roles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL', 'FAMILY_SUPPORT_MEMBER']
    },
    {
      icon: 'calendar_today',
      label: 'Appointments',
      route: '/appointments',
      roles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL']
    },
    {
      icon: 'medication',
      label: 'Medications',
      route: '/medications',
      roles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL', 'FAMILY_SUPPORT_MEMBER']
    },
    {
      icon: 'analytics',
      label: 'Reports',
      route: '/reports',
      roles: ['HEALTHCARE_PROFESSIONAL']
    },
    {
      icon: 'group',
      label: 'Patients',
      route: '/patients',
      roles: ['HEALTHCARE_PROFESSIONAL']
    },
    {
      icon: 'support',
      label: 'Support',
      route: '/support',
      roles: ['PATIENT', 'FAMILY_SUPPORT_MEMBER']
    }
  ];

  constructor() {
    // Subscribe to user changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    // Subscribe to breakpoint changes
    this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isHandset = result.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getVisibleNavigationItems() {
    if (!this.currentUser) return [];
    
    return this.navigationItems.filter(item => 
      item.roles.includes(this.currentUser!.role)
    );
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return 'User';
  }

  getUserRole(): string {
    if (this.currentUser?.role) {
      switch (this.currentUser.role) {
        case 'PATIENT':
          return 'Patient';
        case 'HEALTHCARE_PROFESSIONAL':
          return 'Healthcare Professional';
        case 'FAMILY_SUPPORT_MEMBER':
          return 'Family Support Member';
        default:
          return 'User';
      }
    }
    return 'User';
  }

  onLogout(): void {
    this.authService.logout();
  }
}
