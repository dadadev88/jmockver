const JIRA_ISSUE_PREFIX = 'DADA';

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'issue-format': (parsed) => {
          const { header } = parsed;
          const pattern = new RegExp(`^(feat|fix|docs|style|refactor|perf|test|chore|ci)(\\([\\w\\s]+\\))?: ${JIRA_ISSUE_PREFIX}-\\d+ .{5,72}$`);

          if (!pattern.test(header)) {
            return [
              false,
          `Commit message must follow the format:

------------  Jira issue prefix: ${JIRA_ISSUE_PREFIX} (if is different, update the commitlint.config.js file)

------------  Format required: <type>[optional scope]: ${JIRA_ISSUE_PREFIX}-<number> <description (5-72 chars)>

------------  ✅ Valid commit examples:
------------  ✓ feat: ${JIRA_ISSUE_PREFIX}-4123 add user authentication
------------  ✓ fix(api): ${JIRA_ISSUE_PREFIX}-123 resolve login bug
------------  ✓ docs(api): ${JIRA_ISSUE_PREFIX}-4567 update API documentation

------------  ❌ Invalid commit examples:
------------  ✗ Invalid prefix
------------    feat: JIRA-23 pruebas
------------  ✗ Missing ${JIRA_ISSUE_PREFIX}-<number>
------------    feat: add user authentication
------------  ✗ Description too short — min 5 chars
------------    feat: ${JIRA_ISSUE_PREFIX}-1234 fix
------------  ✗ Description too short — max 72 chars
------------    feat: ${JIRA_ISSUE_PREFIX}-23 this is a commit message too large because has more than 72 chars

------------  Commit message received: "${header}"`.replaceAll('------------', '')
            ];
          }
          return [true];
        }
      }
    }
  ],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci']
    ],
    'subject-case': [0],
    'issue-format': [2, 'always']
  }
};
