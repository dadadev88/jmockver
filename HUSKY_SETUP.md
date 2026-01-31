# Husky & Commitlint Setup Guide

## Overview
Your repository is now configured with:
- **Husky**: Git hooks manager
- **Lint-staged**: Run linters on staged files only
- **Commitlint**: Validate commit messages against a custom format

## Commit Message Format

Your commits must follow this format:
```
<type>[optional scope]: DADA-<number> <description (max 72 chars)>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `chore`: Maintenance tasks

### Valid Examples ✓
```bash
feat: DADA-4123 add user authentication
fix(api): DADA-123 resolve login bug
docs(api): DADA-4567 update API documentation
chore: DADA-999 update dependencies
```

### Invalid Examples ✗
```bash
feat add user authentication                    # Missing DADA number
fix: resolve login bug                          # Missing DADA number
docs: DADA- update API documentation          # Invalid DADA format (needs number)
feat: DADA-4567 this is a very long description that exceeds the 72 character limit
```

## How It Works

### Pre-commit Hook (`.husky/pre-commit`)
- Runs before you commit
- Executes ESLint on modified `.ts` and `.js` files
- Automatically fixes and stages lint issues
- Stages modified `.json` and `.md` files

### Commit-msg Hook (`.husky/commit-msg`)
- Runs after you write your commit message
- Validates the message format using commitlint
- Rejects commits that don't follow the required format
- Shows helpful error messages

## Testing the Setup

### Test a Valid Commit
```bash
git add .
git commit -m "feat: DADA-1234 add new feature"
```

### Test an Invalid Commit
```bash
git add .
git commit -m "add new feature"  # Will be rejected
```

## Configuration Files

### `commitlint.config.js`
- Defines commit message rules
- Enforces the custom DADA number format
- Provides helpful error messages

### `.lintstagedrc.json`
- Specifies which files to lint on each commit
- TypeScript and JavaScript files: ESLint with auto-fix
- JSON and Markdown files: staged automatically

### `.husky/pre-commit`
- Runs lint-staged before each commit

### `.husky/commit-msg`
- Validates commit message with commitlint

## NPM Scripts

```bash
# Manually run lint-staged
npm run lint:staged

# Manually validate a commit message
npm run commitlint -- --edit <file>
```

## Troubleshooting

### Hooks Not Running?
```bash
# Reinstall husky
npm run prepare
```

### Need to Bypass Hooks?
```bash
# Skip all hooks (not recommended)
git commit --no-verify

# Skip only pre-commit hook
git commit -m "..." --no-verify
```

### Lint Issues Preventing Commits?
The pre-commit hook will automatically fix ESLint issues. If it fails:
1. Check the error message
2. Manually fix the issues
3. Stage the files again
4. Retry the commit

## Next Steps

1. Try committing with a valid message format
2. The hooks will run automatically
3. Fix any lint errors as needed
4. Your commits will be validated!
