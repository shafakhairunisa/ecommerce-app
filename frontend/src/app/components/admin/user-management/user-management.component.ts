import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, User } from '../../../services/admin.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  searchTerm = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.loading = false;
      },
      (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    );
  }

  updateUserRole(userId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value;

    this.adminService.updateUserRole(userId, newRole).subscribe(
      () => {
        const user = this.users.find((u) => u.id === userId);
        if (user) {
          user.role = newRole;
        }
      },
      (error) => console.error('Error updating user role:', error)
    );
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter((user) => user.id !== userId);
          this.filteredUsers = this.filteredUsers.filter(
            (user) => user.id !== userId
          );
        },
        (error) => console.error('Error deleting user:', error)
      );
    }
  }

  searchUsers() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.id.toString().includes(term)
    );
  }

  getAdminCount(): number {
    return this.users.filter((user) => user.role === 'admin').length;
  }

  getRegularUserCount(): number {
    return this.users.filter((user) => user.role === 'user').length;
  }

  getRecentUserCount(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.users.filter((user) => {
      const userDate = new Date(user.createdAt);
      return userDate >= thirtyDaysAgo;
    }).length;
  }
}
