import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then(m => m.routes)
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.routes').then(m => m.routes)
  },
  {
    path: 'posts',
    loadChildren: () => import('./features/posts/posts.routes').then(m => m.routes)
  }
];
