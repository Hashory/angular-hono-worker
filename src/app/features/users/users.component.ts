import { Component, inject, resource } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-users',
  imports: [],
  template: `
    <div class="card">
      <h2>Users (via ApiService)</h2>
      @if (users.isLoading()) {
        <p>Loading users...</p>
      } @else if (users.error()) {
        <p class="error">Error loading users.</p>
      } @else {
        <ul>
          @for (user of users.value(); track user.id) {
            <li>
              <strong>{{ user.name }}</strong> ({{ user.email }})
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    :host { display: block; padding: 2rem; }
    .card { padding: 1rem; border: 1px solid #eee; border-radius: 8px; }
    .error { color: red; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.5rem 0; border-bottom: 1px solid #f9f9f9; }
  `]
})
export class UsersComponent {
  private api = inject(ApiService);

  protected readonly users = resource({
    defaultValue: this.api.getCached<any[]>('/users') || [],
    loader: async () => {
      const res = await this.api.users.$get();
      return res.json();
    }
  });
}
