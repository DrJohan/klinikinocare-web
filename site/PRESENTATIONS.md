# Training presentation registry

The landing page navigation and GitHub Pages deployment both read from
`presentations.json`. Add one entry there for each presentation repository.

## Add a presentation

```json
{
  "id": "knee-care-training",
  "title": "Knee Care Training",
  "description": "Clinical reveal presentation",
  "repository": "DrJohan/knee-care-training",
  "branch": "main",
  "path": "training/knee-care",
  "sourceDir": ".",
  "enabled": true
}
```

- `id`: Unique lowercase identifier using letters, numbers and hyphens.
- `title`: Label shown beneath the Training navigation.
- `description`: Short supporting text shown in the desktop menu.
- `repository`: Public GitHub repository in `owner/repository` format.
- `branch`: Branch to publish, normally `main`.
- `path`: Deployment path. Keep the existing Bioprotein presentation at
  `training`; use a unique nested path such as `training/knee-care` for every
  additional presentation.
- `sourceDir`: Folder containing deploy-ready static files inside the
  presentation repository. Use `.` when they are stored at its root.
- `enabled`: Set to `false` to hide and exclude a presentation without deleting
  its configuration.

The deployment validates identifiers, repository names, branches, source
directories and destination paths before cloning. Presentation repositories
must contain deploy-ready static files and must be public unless the workflow is
later configured with credentials for private repositories.

After editing the registry, commit and push this portal repository. GitHub Pages
will rebuild the landing page, clone every enabled presentation repository and
publish each one at its configured path.
