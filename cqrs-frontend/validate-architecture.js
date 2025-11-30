#!/usr/bin/env node

/**
 * Architecture Validation Script
 *
 * This script validates that the clean separation of concerns
 * is properly implemented by checking:
 * 1. No business logic in UI components
 * 2. No inline styles in pages
 * 3. Proper import structure
 * 4. Barrel exports are used
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcPath = path.join(__dirname, 'src');

// Validation rules
const validationRules = {
  pages: {
    shouldNotContain: [
      'useState.*=.*{', // Complex state management
      'useEffect.*fetch', // Direct API calls
      'px=\\{|py=\\{|bg=\\{', // Inline styles
      'borderRadius=\\{|shadow=\\{', // Inline styles
    ],
    shouldContain: [
      'import.*from.*components/ui', // Using UI components
      'import.*from.*hooks', // Using custom hooks
    ]
  },
  uiComponents: {
    shouldNotContain: [
      'fetch\\(', // API calls
      'useState.*\\[.*,.*\\].*=.*', // Complex state
      'localStorage', // Side effects
      'sessionStorage', // Side effects
    ],
    shouldContain: [
      'interface.*Props', // TypeScript interfaces
      'export function', // Proper exports
    ]
  },
  hooks: {
    shouldContain: [
      'useState|useEffect|useMemo|useCallback', // React hooks
      'export function use', // Custom hook naming
    ],
    shouldNotContain: [
      'import.*Box|import.*Heading', // UI components
      'jsx|tsx elements', // No JSX in hooks
    ]
  }
};

function validateFile(filePath, rules) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Check shouldNotContain rules
  rules.shouldNotContain?.forEach(pattern => {
    const regex = new RegExp(pattern, 'g');
    if (regex.test(content)) {
      issues.push(`❌ Contains pattern that should not be there: ${pattern}`);
    }
  });

  // Check shouldContain rules
  rules.shouldContain?.forEach(pattern => {
    const regex = new RegExp(pattern, 'g');
    if (!regex.test(content)) {
      issues.push(`⚠️  Missing expected pattern: ${pattern}`);
    }
  });

  return issues;
}

function validateDirectory(dirPath, rules, fileExtensions = ['.tsx', '.ts']) {
  const results = [];

  if (!fs.existsSync(dirPath)) {
    return results;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results.push(...validateDirectory(filePath, rules, fileExtensions));
    } else if (fileExtensions.some(ext => file.endsWith(ext))) {
      const issues = validateFile(filePath, rules);
      if (issues.length > 0) {
        results.push({
          file: filePath.replace(srcPath, '').replace(/\\/g, '/'),
          issues
        });
      }
    }
  });

  return results;
}

function runValidation() {
  console.log('🔍 Running Architecture Validation...\n');

  // Validate Pages
  console.log('📄 Validating Pages...');
  const pageResults = validateDirectory(
    path.join(srcPath, 'pages'),
    validationRules.pages
  );

  // Validate UI Components
  console.log('🧩 Validating UI Components...');
  const uiResults = validateDirectory(
    path.join(srcPath, 'components', 'ui'),
    validationRules.uiComponents
  );

  // Validate Hooks
  console.log('🎣 Validating Hooks...');
  const hookResults = validateDirectory(
    path.join(srcPath, 'hooks'),
    validationRules.hooks,
    ['.ts'] // Hooks should be .ts, not .tsx
  );

  // Report results
  console.log('\n📊 Validation Results:\n');

  const allResults = [
    { category: 'Pages', results: pageResults },
    { category: 'UI Components', results: uiResults },
    { category: 'Hooks', results: hookResults },
  ];

  let totalIssues = 0;

  allResults.forEach(({ category, results }) => {
    if (results.length === 0) {
      console.log(`✅ ${category}: All good!`);
    } else {
      console.log(`⚠️  ${category}: Found ${results.length} file(s) with issues:`);
      results.forEach(({ file, issues }) => {
        console.log(`   ${file}:`);
        issues.forEach(issue => console.log(`     ${issue}`));
      });
      totalIssues += results.length;
    }
    console.log();
  });

  // Final summary
  if (totalIssues === 0) {
    console.log('🎉 Architecture validation passed! Clean separation of concerns is properly implemented.');
  } else {
    console.log(`⚠️  Found ${totalIssues} file(s) with potential architecture violations.`);
    console.log('💡 Consider refactoring these files to better align with the clean architecture principles.');
  }

  return totalIssues === 0;
}

// Check if we have the required structure
const requiredDirs = ['pages', 'components/ui', 'components/conversation', 'hooks', 'styles'];
const missingDirs = requiredDirs.filter(dir => !fs.existsSync(path.join(srcPath, dir)));

if (missingDirs.length > 0) {
  console.log('❌ Missing required directories:', missingDirs.join(', '));
  console.log('Please ensure the clean architecture structure is in place.');
  process.exit(1);
}

// Check for barrel exports
console.log('📦 Checking Barrel Exports...');
const barrelFiles = [
  'components/ui/index.ts',
  'components/conversation/index.ts',
  'hooks/index.ts'
];

const missingBarrels = barrelFiles.filter(file =>
  !fs.existsSync(path.join(srcPath, file))
);

if (missingBarrels.length > 0) {
  console.log('⚠️  Missing barrel export files:', missingBarrels.join(', '));
} else {
  console.log('✅ All barrel export files found!');
}

console.log();

// Run main validation
const isValid = runValidation();

process.exit(isValid ? 0 : 1);
