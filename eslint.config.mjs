import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import angular from 'angular-eslint'
import prettier from 'eslint-config-prettier/flat'

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'coverage/',
      'node_modules/',
      '**/*.spec.ts',
      '**/test.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
      // The Angular 22 update schematic set every existing component to
      // ChangeDetectionStrategy.Eager to preserve pre-v22 default behavior.
      // Migrating them to genuine OnPush needs an explicit markForCheck()
      // audit per component; tracked as follow-up, not part of a version-bump pass.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  {
    files: ['projects/ngx-translate-routes/**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'ngx', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'ngx', style: 'camelCase' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
  },
  prettier,
)
