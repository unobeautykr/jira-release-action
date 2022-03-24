# Usage

```
- name: Create release in jira
  uses: unobeautykr/jira-release-action@v1.0.0
  with:
    account: user@example.com
    apiKey: API_KEY_FROM_SECRETS
    domain: unocare
    projectId: 12345
    projectKey: CRM
    version: "v3.0.5" 
```
