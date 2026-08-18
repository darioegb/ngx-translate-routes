import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'NgxTranslateRoutes',
  tagline: 'Translate Angular route paths and page titles automatically',
  favicon: 'img/favicon.ico',
  url: 'https://darioegb.github.io',
  baseUrl: '/ngx-translate-routes/',
  organizationName: 'darioegb',
  projectName: 'ngx-translate-routes',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr' },
      es: { label: 'Español', direction: 'ltr' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/darioegb/ngx-translate-routes/tree/main/docs/',
          lastVersion: 'current',
          versions: {
            current: {
              label: '2.x',
              badge: true,
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
    },
    navbar: {
      title: 'NgxTranslateRoutes',
      logo: {
        alt: 'NgxTranslateRoutes logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/ngx-translate-routes',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/darioegb/ngx-translate-routes',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/' },
            { label: 'Installation', to: '/installation' },
            { label: 'Configuration', to: '/configuration' },
          ],
        },
        {
          title: 'Guides',
          items: [
            { label: 'Language in Path', to: '/guides/language-in-path' },
            { label: 'SSR Setup', to: '/guides/ssr' },
            { label: 'Query Params', to: '/guides/query-params' },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'npm package',
              href: 'https://www.npmjs.com/package/ngx-translate-routes',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/darioegb/ngx-translate-routes',
            },
            {
              label: 'Stackblitz SSR',
              href: 'https://stackblitz.com/edit/ngx-translate-routes-example-standalone',
            },
            {
              label: 'Stackblitz Modules',
              href: 'https://stackblitz.com/edit/ngx-translate-routes-example',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NgxTranslateRoutes. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
