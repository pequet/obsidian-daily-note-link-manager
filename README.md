# Obsidian Daily Note Link Manager

A script for Obsidian's [CustomJS](https://github.com/saml-dev/obsidian-custom-js) plugin that generates inline links to the previous and next daily notes, displayed in an intuitive format. This project is structured to be developed with AI assistance, leveraging a "memory bank" system for context and continuity.

## Purpose
This script creates "Previous" and "Next" links in daily notes based on available notes, displaying:
- **Yesterday** or **Tomorrow** if they’re within the same month.
- The full date (`YYYY-MM-DD`) if they’re in a different month.

It is designed to be folder-structure-agnostic, working whether your daily notes are in a single flat folder or organized into `YYYY-MM` subfolders.

## Prerequisites
1.  **Obsidian**: You need to have Obsidian installed.
2.  **CustomJS Plugin**: This script requires the CustomJS plugin to run within Obsidian.

## Usage
To use this script:
1.  Copy the `DailyNoteLinkManager.js` file into your CustomJS script folder in Obsidian.
2.  Place the following inline code into your daily note template to generate the links:

```javascript
`$= const { DailyNoteLinkManager } = customJS; DailyNoteLinkManager.generateDailyLinks({ dv: dv });`
```

This will dynamically insert navigation links into your daily notes.

## Development Context

This project utilizes a boilerplate designed for AI-assisted development. Key elements of this structure include:

*   **`memory-bank/`**: This directory contains all the contextual information for the AI, such as the project brief, development status, and technical context. This allows the AI to maintain long-term memory about the project.
*   **`.cursor/rules/`**: This folder contains rules that guide the AI's behavior, ensuring it adheres to the project's standards and conventions.
*   **AI Tools**: The development process is intended to be used with AI tools like `vibe-tools` to automate tasks and assist with coding.

For more details on the development framework, see the documentation in the `docs/` folder.

## License

This project is licensed under the MIT License.

## Support the Project

If you find this project useful and would like to show your appreciation, you can:

- [Buy Me a Coffee](https://buymeacoffee.com/pequet)
- [Sponsor on GitHub](https://github.com/sponsors/pequet)

Your support helps in maintaining and improving this project. Thank you! 

