import { Component, inject, resource } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-posts',
  imports: [],
  template: `
    <div class="card">
      <h2>Posts (via ApiService)</h2>
      @if (posts.isLoading()) {
        <p>Loading posts...</p>
      } @else if (posts.error()) {
        <p class="error">Error loading posts.</p>
      } @else {
        <div class="posts-grid">
          @for (post of posts.value(); track post.id) {
            <article class="post-item">
              <h3>{{ post.title }}</h3>
              <p>{{ post.content }}</p>
              <small>Author ID: {{ post.authorId }}</small>
            </article>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; padding: 2rem; }
    .card { padding: 1rem; border: 1px solid #eee; border-radius: 8px; }
    .error { color: red; }
    .posts-grid { display: flex; flex-direction: column; gap: 1rem; }
    .post-item { padding: 1rem; background: #fdfdfd; border: 1px solid #f0f0f0; border-radius: 4px; }
    h3 { margin-top: 0; }
  `]
})
export class PostsComponent {
  private api = inject(ApiService);

  protected readonly posts = resource({
    defaultValue: this.api.getCached<any[]>('/posts') || [],
    loader: async () => {
      const client = this.api.client as any;
      const res = await client.posts.$get();
      return res.json();
    }
  });
}
