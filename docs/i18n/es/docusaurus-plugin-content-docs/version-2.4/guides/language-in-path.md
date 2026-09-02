---
id: language-in-path
title: Idioma en la URL
sidebar_position: 1
---

# Idioma en la URL

Agrega el código del locale activo a cada URL: `/about` → `/es/sobreNosotros`.

## Activar

```typescript
provideNgxTranslateRoutes({
  enableLanguageInPath: true,
})
```

Por defecto el idioma predeterminado **no** se incluye en el path (por lo que `/en/about` queda como `/about`). Para incluirlo siempre:

```typescript
provideNgxTranslateRoutes({
  enableLanguageInPath: true,
  includeDefaultLanguageInPath: true,
})
```

## Resultado

| Locale | URL |
|--------|-----|
| `en` (por defecto) | `/about` |
| `en` (con `includeDefaultLanguageInPath`) | `/en/about` |
| `es` | `/es/sobreNosotros` |

## Componente Raíz

Persiste el idioma seleccionado y recupéralo al cargar:

```typescript
@Component({ /* ... */ })
export class AppComponent implements OnInit {
  private readonly translate = inject(TranslateService)

  ngOnInit() {
    const guardado = localStorage.getItem('lang') ?? 'en'
    this.translate.use(guardado)
  }

  cambiarIdioma(lang: string) {
    localStorage.setItem('lang', lang)
    this.translate.use(lang)
  }
}
```

:::info Navegación con el botón Atrás
Cuando el usuario presiona Atrás en el navegador, la librería mapea automáticamente la URL traducida de vuelta al path original del router de Angular.
:::
