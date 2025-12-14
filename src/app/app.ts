import { Component, signal, inject, TransferState, makeStateKey, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JsonPipe, isPlatformServer } from '@angular/common';
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
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  // This data fetching is also executed during SSR (on Cloudflare Worker)
  protected readonly todoData = toSignal(this.http.get('https://jsonplaceholder.typicode.com/todos/1'));

  // Hono Client Data
  protected readonly honoData = toSignal(
    from(this.getHonoData())
  );

  private async getHonoData() {
    const key = makeStateKey<string>('HONO_DATA');

    if (this.transferState.hasKey(key)) {
      return this.transferState.get(key, '');
    }

    const res = await this.api.client.hono.$get({ query: { name: 'Visitor' } });
    const text = await res.text();

    if (isPlatformServer(this.platformId)) {
      this.transferState.set(key, text);
    }

    return text;
  }
}
