---
id: language-in-path
title: Language in Path
sidebar_position: 1
---

# Language in Path

Prepend the active locale code to every URL: `/about` → `/es/sobreNosotros`.

## Enable

```typescript
provideNgxTranslateRoutes({
  enableLanguageInPath: true,
})
```

By default the default language is **not** included in the path (so `/en/about` stays as `/about`). To always include it:

```typescript
provideNgxTranslateRoutes({
  enableLanguageInPath: true,
  includeDefaultLanguageInPath: true,
})
```

## Result

| Locale | URL |
|--------|-----|
| `en` (default) | `/about` |
| `en` (with `includeDefaultLanguageInPath`) | `/en/about` |
| `es` | `/es/sobreNosotros` |

## App Component

Persist the selected language to storage and restore it on load:

```typescript
@Component({ /* ... */ })
export class AppComponent implements OnInit {
  private readonly translate = inject(TranslateService)

  ngOnInit() {
    const saved = localStorage.getItem('lang') ?? 'en'
    this.translate.use(saved)
  }

  switchLanguage(lang: string) {
    localStorage.setItem('lang', lang)
    this.translate.use(lang)
  }
}
```

:::info Back navigation
When the user presses the browser Back button, the library automatically maps the translated URL back to the Angular router's original path.
:::
