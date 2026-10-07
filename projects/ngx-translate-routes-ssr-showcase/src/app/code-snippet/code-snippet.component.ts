import { DOCUMENT } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core'

const COPIED_FEEDBACK_MS = 1500

/** Global provider setup shown on the "Setup" tab. */
export const SETUP_SNIPPET = `import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNgxTranslateRoutes({
      enableLanguageInPath: true,
      includeDefaultLanguageInPath: true,
      availableLanguages: ['en', 'es'],
    }),
  ],
}`

/** Route + translation example shown on the "Usage" tab. */
export const USAGE_SNIPPET = `// app.routes.ts — each path segment and the page title get translated
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // skipTranslation keeps the path + title as-is
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
    data: { skipTranslation: true },
  },
  { path: 'aboutAs', component: AboutComponent, data: { title: 'aboutAs' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'profile' } },
  {
    path: 'myAccount',
    component: MyAccountComponent,
    data: { title: 'myAccount' },
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.routes').then((r) => r.usersRoutes),
  },
]

// assets/i18n/es.json
{
  "routes": {
    "profile": "perfil",
    "aboutAs": {
      "root": "sobreNosotros",
      "params": { "name": "nombre", "email": "correo" }
    },
    "myAccount": "miCuenta",
    "users": { "root": "usuarios", "profile": "perfil", "myAccount": "miCuenta" }
  },
  "titles": {
    "profile": "Perfil",
    "aboutAs": "Sobre Nosotros",
    "myAccount": "Mi cuenta",
    "users": { "root": "Usuarios", "profile": "Perfil de Usuario {{userId}}" }
  }
}`

type SnippetTab = 'usage' | 'setup'

@Component({
  selector: 'app-code-snippet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card shadow-sm h-100">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
        <span class="fw-semibold">Code</span>
        <ul class="nav nav-pills nav-sm">
          <li class="nav-item">
            <button
              type="button"
              class="nav-link py-1"
              [class.active]="activeTab() === 'setup'"
              (click)="activeTab.set('setup')"
            >
              Setup
            </button>
          </li>
          <li class="nav-item">
            <button
              type="button"
              class="nav-link py-1"
              [class.active]="activeTab() === 'usage'"
              (click)="activeTab.set('usage')"
            >
              Usage
            </button>
          </li>
        </ul>
      </div>
      <div class="card-body position-relative p-0">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary copy-btn"
          (click)="copy()"
        >
          {{ copied() ? 'Copied!' : 'Copy' }}
        </button>
        <pre class="code mb-0"><code>{{ snippet() }}</code></pre>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .code {
      min-height: 100%;
      padding: 2.75rem 1rem 1rem;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    .copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      z-index: 1;
    }
  `,
})
export class CodeSnippetComponent {
  private readonly document = inject(DOCUMENT)
  readonly usage = input(USAGE_SNIPPET)
  readonly setup = input(SETUP_SNIPPET)
  readonly activeTab = signal<SnippetTab>('setup')
  readonly copied = signal(false)
  readonly snippet = computed(() =>
    this.activeTab() === 'usage' ? this.usage() : this.setup(),
  )

  async copy(): Promise<void> {
    try {
      await this.document.defaultView?.navigator.clipboard.writeText(
        this.snippet(),
      )
    } catch {
      return
    }
    this.copied.set(true)
    setTimeout(() => this.copied.set(false), COPIED_FEEDBACK_MS)
  }
}
