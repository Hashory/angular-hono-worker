import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-hono-worker');

  private http = inject(HttpClient);
  private api = inject(ApiService);

  // This data fetching is also executed during SSR (on Cloudflare Worker)
  protected readonly todoData = toSignal(this.http.get('https://jsonplaceholder.typicode.com/todos/1'));

  // Hono Client Data
  protected readonly honoData = toSignal(
    from(
      this.api.client.hono
        .$get({ query: { name: 'Visitor' } })
        .then((res) => res.text())
    )
  );
}
