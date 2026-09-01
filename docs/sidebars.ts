import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'installation',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/standalone',
        {
          type: 'doc',
          id: 'getting-started/module',
          label: 'NgModule App (deprecated)',
        },
      ],
    },
    'configuration',
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/language-in-path',
        'guides/ssr',
        'guides/query-params',
        'guides/custom-strategy',
        'guides/caching',
      ],
    },
    {
      type: 'category',
      label: 'Migration',
      items: ['migration/v2-to-v3'],
    },
  ],
}

export default sidebars
