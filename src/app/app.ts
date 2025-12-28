import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
      <a routerLink="/users" routerLinkActive="active">Users</a>
      <a routerLink="/posts" routerLinkActive="active">Posts</a>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      gap: 1rem;
      padding: 1rem 2rem;
      background: #333;
      color: white;
    }
    .navbar a {
      color: #ccc;
      text-decoration: none;
      font-weight: bold;
    }
    .navbar a.active {
      color: white;
      border-bottom: 2px solid white;
    }
    main {
      padding: 1rem;
    }
  `]
})
export class App { }
