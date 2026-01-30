import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Constraint: UI cannot import Domain/Infra/Database/Prisma
    files: ['src/ui/**/*', 'src/components/**/*', 'src/features/**/*', 'src/app/(public)/**/*', 'src/lib/hooks/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/domain', '@/domain/*', '@/Database', '@/Database/*', '@/infra', '@/infra/*', '@prisma/client'],
              message: 'UI/Client components cannot directly import Domain, Database, or Infra layers. Use BFF endpoints instead.',
            },
            {
              group: ['@/infra/mock/legacy', '@/infra/mock/legacy/*'],
              message: 'DEPRECATED: Using the legacy database shim in UI components is strictly forbidden. Please use services via BFF instead.',
            },
            {
              group: ['src/domain/*', 'src/Database/*', 'src/infra/*'],
              message: 'Do not use relative imports for architecture layers.',
            },
          ],
        },
      ],
    },
  },
  {
    // Constraint: Domain cannot import UI/Next
    files: ['src/domain/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'next/*', '@/ui/*', '@/features/*', '@/components/*'],
              message: 'Domain layer must be pure TypeScript and independent of UI/Framework.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'dist/**'],
  },
];

export default eslintConfig;
