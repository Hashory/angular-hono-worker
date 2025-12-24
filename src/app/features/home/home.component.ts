import { Component, signal, inject, resource } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  imports: [JsonPipe],
  template: `
    <div class="card">
      <h2>SSR Data Test (Angular HttpClient)</h2>
      <p>Data fetched from server (Worker):</p>
      <pre><code>{{ todoData() | json }}</code></pre>
    </div>

    <div class="card">
      <h2>Hono Client Data Test</h2>
      <p>Data fetched from Hono (Worker):</p>
      <pre><code>{{ honoData.value() }}</code></pre>
    </div>
  `,
  styles: [`
    :host {
      font-family: sans-serif;
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .card {
      margin-top: 1.5rem;
      padding: 1rem;
      border: 1px dashed #ccc;
      border-radius: 0.5rem;
    }
    h2 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      margin-top: 0;
    }
    p {
      margin-bottom: 0.5rem;
    }
    pre {
      background: #f5f5f5;
      padding: 0.5rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 0;
    }
  `]
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
