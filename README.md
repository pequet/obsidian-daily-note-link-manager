# Obsidian Daily Note Link Manager

A script for Obsidian's [CustomJS](https://github.com/saml-dev/obsidian-custom-js) plugin that generates inline links to the previous and next daily notes found within the same folder.

## Purpose
This script creates "Previous" and "Next" links in daily notes based on available notes in the current folder, displaying:
- **Yesterday** or **Tomorrow** for adjacent dates.
- The full date (`YYYY-MM-DD`) for all other notes.

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

This will dynamically insert navigation links into your daily notes.

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

