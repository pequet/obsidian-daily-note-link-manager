/*
 *  ███   Obsidian Daily Note Link Manager (CustomJS)
 * █ ███  Version: 1.0.0
 * █ ███  Author: Benjamin Pequet
 *  ███   GitHub: https://github.com/pequet/obsidian-daily-note-link-manager/
 *
 * Purpose:
 *   This script dynamically links to previous and next Daily Notes based on available dates.
 *   It is designed to be folder-agnostic, working automatically whether daily notes
 *   are in a single flat folder or organized into monthly "YYYY-MM" subfolders.
 *
 * Prerequisites:
 *   - Obsidian.md with the CustomJS plugin installed.
 *   - Daily notes must be named in the "YYYY-MM-DD.md" format.
 *
 * Usage:
 *   Add the following inline code to your daily note template:
 *   `$= const { DailyNoteLinkManager } = customJS; dv.span(DailyNoteLinkManager.generateDailyLinks({ dv: dv }));`
 *
 * Changelog:
 *   1.0.0 - 2025-07-25 - Initial release.
 *
 * Support the Project:
 *   - Buy Me a Coffee: https://buymeacoffee.com/pequet
 *   - GitHub Sponsors: https://github.com/sponsors/pequet
 */

// --- Class Definition ---
class DailyNoteLinkManager {
    /**
     * Fetches all daily notes from the vault, filters for the correct format,
     * and sorts them chronologically. This is the single source of truth for the note list.
     * @returns {TFile[]} An array of sorted daily note files.
     */
    _getAllSortedDailyNotes() {
        return app.vault.getMarkdownFiles()
            .filter(file => /\d{4}-\d{2}-\d{2}\.md$/.test(file.basename))
            .sort((a, b) => a.basename.localeCompare(b.basename));
    }

    /**
     * Generates the navigation links for the current daily note. This is the main public method.
     * @param {object} context - The context object passed from CustomJS, containing the dataview instance.
     * @returns {string} - The generated HTML string with the navigation links.
     */
    generateDailyLinks({ dv }) {
        const currentFile = app.workspace.getActiveFile();
        if (!currentFile || !/\d{4}-\d{2}-\d{2}\.md$/.test(currentFile.basename)) {
            return "Not a valid daily note.";
        }

        const allDailyNotes = this._getAllSortedDailyNotes();
        const currentIndex = allDailyNotes.findIndex(file => file.path === currentFile.path);

        if (currentIndex === -1) {
            return "Could not find current note in the vault's daily notes.";
        }

        const today = window.moment();
        const prevLink = this._createLink(allDailyNotes, currentIndex, -1, today);
        const nextLink = this._createLink(allDailyNotes, currentIndex, 1, today);

        // Construct the final output string, joined by a separator if both links exist.
        return [prevLink, nextLink].filter(Boolean).join(" | ");
    }

    /**
     * Helper method to create a single navigation link (previous or next).
     * @param {TFile[]} allDailyNotes - The complete sorted list of all daily notes.
     * @param {number} currentIndex - The index of the current note in the list.
     * @param {number} offset - The offset to find the target note (-1 for previous, 1 for next).
     * @param {moment} today - The current moment object for date comparisons.
     * @returns {string|null} - The formatted Markdown link, or null if no link is created.
     */
    _createLink(allDailyNotes, currentIndex, offset, today) {
        const targetIndex = currentIndex + offset;

        if (targetIndex < 0 || targetIndex >= allDailyNotes.length) {
            return null; // Out of bounds
        }

        const targetFile = allDailyNotes[targetIndex];
        const targetDate = window.moment(targetFile.basename, "YYYY-MM-DD");
        
        let linkText = targetFile.basename; // Default to the full date

        if (offset === -1 && targetDate.isSame(today.clone().subtract(1, 'day'), 'day')) {
            linkText = "Yesterday";
        } else if (offset === 1 && targetDate.isSame(today.clone().add(1, 'day'), 'day')) {
            linkText = "Tomorrow";
        }

        return `[[${targetFile.path}|${linkText}]]`;
    }
} 