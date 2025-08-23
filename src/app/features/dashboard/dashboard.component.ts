
import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../core/models/user.model';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MainLayoutComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;

  constructor() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getWelcomeMessage(): string {
    if (this.currentUser) {
      const timeOfDay = this.getTimeOfDay();
      return `${timeOfDay}, ${this.currentUser.firstName}!`;
    }
    return 'Welcome to Crohnnected!';
  }

  getRoleBasedMessage(): string {
    if (!this.currentUser) return '';
    
    switch (this.currentUser.role) {
      case UserRole.PATIENT:
        return 'Manage your Crohn\'s disease with our comprehensive tracking and support tools.';
      case UserRole.HEALTHCARE_PROFESSIONAL:
        return 'Access patient information, manage treatments, and provide better care.';
      case UserRole.FAMILY_SUPPORT_MEMBER:
        return 'Stay connected and provide support to your loved ones managing Crohn\'s disease.';
      default:
        return 'Your health management journey starts here.';
    }
  }

  getQuickActions() {
    if (!this.currentUser) return [];

    const commonActions = [
      {
        title: 'Profile',
        description: 'Update your personal information',
        icon: 'person',
        route: '/profile',
        color: 'primary'
      }
    ];

    const roleSpecificActions: { [key in UserRole]: any[] } = {
      [UserRole.PATIENT]: [
        {
          title: 'Log Symptoms',
          description: 'Track your daily symptoms',
          icon: 'healing',
          route: '/symptoms',
          color: 'accent'
        },
        {
          title: 'Medications',
          description: 'Manage your medications',
          icon: 'medication',
          route: '/medications',
          color: 'primary'
        },
        {
          title: 'Appointments',
          description: 'View upcoming appointments',
          icon: 'calendar_today',
          route: '/appointments',
          color: 'primary'
        },
        {
          title: 'Reports',
          description: 'View your health reports',
          icon: 'analytics',
          route: '/reports',
          color: 'accent'
        }
      ],
      [UserRole.HEALTHCARE_PROFESSIONAL]: [
        {
          title: 'Patients',
          description: 'Manage your patients',
          icon: 'group',
          route: '/patients',
          color: 'primary'
        },
        {
          title: 'Appointments',
          description: 'View today\'s schedule',
          icon: 'calendar_today',
          route: '/appointments',
          color: 'accent'
        },
        {
          title: 'Reports',
          description: 'Patient analytics',
          icon: 'analytics',
          route: '/reports',
          color: 'primary'
        },
        {
          title: 'Resources',
          description: 'Clinical resources',
          icon: 'library_books',
          route: '/resources',
          color: 'accent'
        }
      ],
      [UserRole.FAMILY_SUPPORT_MEMBER]: [
        {
          title: 'Patient Care',
          description: 'Monitor patient progress',
          icon: 'favorite',
          route: '/patient-care',
          color: 'accent'
        },
        {
          title: 'Support Groups',
          description: 'Connect with other families',
          icon: 'support',
          route: '/support-groups',
          color: 'primary'
        },
        {
          title: 'Resources',
          description: 'Learn about Crohn\'s disease',
          icon: 'library_books',
          route: '/resources',
          color: 'primary'
        },
        {
          title: 'Communication',
          description: 'Stay in touch with healthcare team',
          icon: 'chat',
          route: '/communication',
          color: 'accent'
        }
      ]
    };

    return [...commonActions, ...roleSpecificActions[this.currentUser.role]];
  }

  getRecentActivity() {
    // Mock data - In real app, this would come from a service
    return [
      {
        icon: 'healing',
        title: 'Symptom logged',
        description: 'Mild abdominal pain recorded',
        time: '2 hours ago',
        type: 'symptom'
      },
      {
        icon: 'medication',
        title: 'Medication taken',
        description: 'Mesalamine 400mg',
        time: '5 hours ago',
        type: 'medication'
      },
      {
        icon: 'calendar_today',
        title: 'Appointment scheduled',
        description: 'Follow-up with Dr. Smith',
        time: '1 day ago',
        type: 'appointment'
      }
    ];
  }

  getHealthMetrics() {
    // Mock data - In real app, this would come from a service
    return [
      {
        title: 'Symptom Score',
        value: 3.2,
        unit: '/10',
        icon: 'healing',
        trend: 'down',
        color: 'accent'
      },
      {
        title: 'Medication Adherence',
        value: 95,
        unit: '%',
        icon: 'medication',
        trend: 'up',
        color: 'primary'
      },
      {
        title: 'Quality of Life',
        value: 8.1,
        unit: '/10',
        icon: 'favorite',
        trend: 'up',
        color: 'accent'
      }
    ];
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }
}
