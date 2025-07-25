# DailyNoteLinkManager Script

A script for Obsidian's [CustomJS](https://github.com/saml-dev/obsidian-custom-js) plugin that generates inline links to the previous and next daily notes, displayed in an intuitive format.

## Purpose

This script creates "Previous" and "Next" navigation links in your daily notes based on the actual notes available in your vault.

-   It displays **"Yesterday"** or **"Tomorrow"** for consecutive notes.
-   It displays the full date (`YYYY-MM-DD`) for non-consecutive notes (e.g., jumping over a weekend).

It is designed to be **folder-structure-agnostic**, working automatically whether your daily notes are in a single flat folder or organized into monthly (`YYYY-MM`) subfolders.

## Prerequisites

1.  **Obsidian**: You need to have Obsidian installed.
2.  **Naming Convention**: Each daily note must be named `YYYY-MM-DD.md` (e.g., `2024-11-03.md`).
3.  **Required Plugin**:
    -   **CustomJS**: This script is designed to be run by the CustomJS plugin.

## Usage

To use this script:

1.  Copy the `DailyNoteLinkManager.js` file to your designated CustomJS script folder in Obsidian.
2.  Place the following inline code in your daily note template to generate the links:

```javascript
`$= const { DailyNoteLinkManager } = customJS; dv.span(DailyNoteLinkManager.generateDailyLinks({ dv: dv }));`
```

This will render the navigation links directly in your note where you place the code. 