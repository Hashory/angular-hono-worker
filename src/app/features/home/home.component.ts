import { Component, signal, inject, resource } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class Home {
  protected readonly title = signal('angular-hono-worker');

  private http = inject(HttpClient);
  private api = inject(ApiService);

  // This data fetching is also executed during SSR (on Cloudflare Worker)
  protected readonly todoData = toSignal(this.http.get('https://jsonplaceholder.typicode.com/todos/1'));

  protected readonly honoData = resource({
    defaultValue: this.api.getCached<any>('/hono?name=Visitor') as any,
    loader: () => this.api.client.hono.$get({ query: { name: 'Visitor' } }).then(res => res.text())
  });
}
