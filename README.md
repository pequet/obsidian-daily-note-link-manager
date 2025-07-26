# Obsidian Daily Note Link Manager

A script for Obsidian's [CustomJS](https://github.com/saml-dev/obsidian-custom-js) plugin that generates a dynamic header for daily notes, including navigation links, a link to the weekly review, and a list of inbox items captured on the same day.

## Purpose
This script enhances daily notes by creating a dynamic header and a list of related inbox entries.

- **Navigation Header**:
  - Displays links for "Yesterday" and "Tomorrow" or the full `YYYY-MM-DD` for non-adjacent dates.
  - Includes a link to the corresponding weekly review note (e.g., `[[Weekly Reviews/2025-W30]]`).
  - The entire header is wrapped in `<<` and `>>` markers.
- **Inbox Entries**:
  - Below the header, it lists all notes in the same folder that start with the same `YYYY-MM-DD` prefix as the current daily note.
  - This is useful for quickly seeing all items captured on a specific day.

It is designed to be simple and reliable, searching for notes only within the same folder as the current daily note.

## Prerequisites
1.  **Obsidian**: You need to have Obsidian installed.
2.  **CustomJS Plugin**: This script requires the CustomJS plugin to run.
3.  **Dataview Plugin**: CustomJS relies on Dataview for its functionality.
    - In Dataview's settings, you must enable **"Enable JavaScript Queries"** and **"Enable Inline JavaScript Queries"**.

## Usage
To use this script:
1.  Copy the `DailyNoteLinkManager.js` file into your CustomJS script folder in Obsidian.
2.  Place the following inline code into your daily note template.

```javascript
`$= const { DailyNoteLinkManager } = customJS; dv.span(DailyNoteLinkManager.generateDailyLinks({ dv: dv }));`
```

This will dynamically insert the navigation header and a list of that day's inbox entries into your daily notes.

### Debugging
If the script isn't working as expected, you can enable a debug mode to get detailed logs in the developer console.

```javascript
`$= const { DailyNoteLinkManager } = customJS; dv.span(DailyNoteLinkManager.generateDailyLinks({ dv: dv, debug: true }));`
```

## Development Context

This project utilizes a boilerplate designed for AI-assisted development. Key elements of this structure include:

## License

This project is licensed under the MIT License.

## Support the Project

If you find this project useful and would like to show your appreciation, you can:

- [Buy Me a Coffee](https://buymeacoffee.com/pequet)
- [Sponsor on GitHub](https://github.com/sponsors/pequet)

Your support helps in maintaining and improving this project. Thank you! 

