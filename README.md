# Obsidian Daily Note Link Manager

A script for Obsidian's [CustomJS](https://github.com/saml-dev/obsidian-custom-js) plugin that generates a dynamic header for Daily Notes, including navigation links, a link to the weekly review, and a list of inbox items captured on the same day.

## Purpose
This script enhances Daily Notes by creating a dynamic header and a list of related inbox entries.

- **Navigation Header**:
  - Displays links for "Yesterday" and "Tomorrow" or the full `YYYY-MM-DD` for non-adjacent dates.
  - Includes a link to the corresponding weekly review note (e.g., `[[Weekly Reviews/2025-W30]]`).
- **Inbox Entries**:
  - Below the header, it lists all notes in the same folder that start with the same `YYYY-MM-DD` prefix as the current Daily Note.
  - This is useful for quickly seeing all items captured on a specific day.

It is designed to be simple and reliable, searching for notes only within the same folder as the current Daily Note, or Daily Notes organized as `YYYY-MM/YYYY-MM-DD.md`.

## Prerequisites
1.  **Obsidian**: You need to have Obsidian installed.
2.  **CustomJS Plugin**: This script requires the CustomJS plugin to run.
3.  **Dataview Plugin**: CustomJS relies on Dataview for its functionality.
    - In Dataview's settings, you must enable **"Enable JavaScript Queries"** and **"Enable Inline JavaScript Queries"**.

## Usage
To use this script:
1.  Copy the `DailyNoteLinkManager.js` file into your CustomJS script folder in Obsidian.
2.  Place the following inline code into your Daily Note template.

```javascript
`$= const { DailyNoteLinkManager } = customJS; dv.span(DailyNoteLinkManager.generateDailyLinks({ dv: dv }));`
```

This will dynamically insert the navigation header and a list of that day's inbox entries into your Daily Notes.

## License

This project is licensed under the MIT License.

## Support the Project

If you find this project useful and would like to show your appreciation, you can:

- [Buy Me a Coffee](https://buymeacoffee.com/pequet)
- [Sponsor on GitHub](https://github.com/sponsors/pequet)

Your support helps in maintaining and improving this project. Thank you! 

