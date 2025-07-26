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
 *   - The "Dataview" plugin must be installed and enabled.
 *   - In Dataview settings, "Enable JavaScript Queries" and "Enable Inline JavaScript Queries" must be ON.
 *   - Daily notes must be named in the "YYYY-MM-DD.md" format.
 *
 * Recommendations:
 *   - While not required, the "Templater" plugin is recommended for inserting the
 *     script into new daily notes automatically.
 *
 * Usage:
 *   The DailyNoteLinkManager class is automatically available via the `customJS` object.
 *
 *   1. Generate Daily Links:
 *      Add this to your daily note template to generate the navigation links.
 *      `$= const { DailyNoteLinkManager } = customJS; dv.span(DailyNoteLinkManager.generateDailyLinks({ dv: dv }));`
 *
 *   2. Debugging:
 *      If the script isn't working, enable debug mode to see detailed logs in the developer console.
 *      `$= const { DailyNoteLinkManager } = customJS; dv.span(DailyNoteLinkManager.generateDailyLinks({ dv: dv, debug: true }));`
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
    constructor() {
        console.log("DailyNoteLinkManager class loaded and ready 🤖");
    }

    /**
     * Fetches all daily notes from the vault, filters for the correct format,
     * and sorts them chronologically. This is the single source of truth for the note list.
     * @returns {TFile[]} An array of sorted daily note files.
     */
    _getAllSortedDailyNotes(currentFile) {
        if (!currentFile || !currentFile.parent) {
            return [];
        }

        const parentFolder = currentFile.parent;
        // The TFolder.children property gives us all files and subfolders.
        // We filter to get only TFile objects that match our daily note format.
        return parentFolder.children
            .filter(file => file.extension === 'md' && /^\d{4}-\d{2}-\d{2}$/.test(file.basename))
            .sort((a, b) => a.basename.localeCompare(b.basename));
    }

    /**
     * Generates the navigation links for the current daily note. This is the main public method.
     * @param {object} context - The context object passed from CustomJS, containing the dataview instance.
     * @param {boolean} [context.debug=false] - Optional. Set to true to enable console logging for debugging.
     * @returns {string} - The generated HTML string with the navigation links.
     */
    generateDailyLinks({ dv, debug = false }) {
        if (debug) console.log("--- DailyNoteLinkManager: Debug Mode ON ---");

        const currentFile = app.workspace.getActiveFile();
        if (debug) console.log("Current File:", currentFile ? currentFile.path : "No active file");

        if (!currentFile || !/^\d{4}-\d{2}-\d{2}$/.test(currentFile.basename)) {
            if (debug) {
                console.log("Validation failed:");
                console.log("  - Is current file valid?", !!currentFile);
                if (currentFile) {
                    console.log("  - Current file basename:", currentFile.basename);
                    console.log("  - Does basename match format?", /^\d{4}-\d{2}-\d{2}$/.test(currentFile.basename));
                }
            }
            return "Not a valid daily note.";
        }

        if (debug) console.log("Current file is a valid daily note:", currentFile.path);

        const allDailyNotes = this._getAllSortedDailyNotes(currentFile);
        if (debug) console.log(`Found ${allDailyNotes.length} total daily notes in this folder.`);

        const currentIndex = allDailyNotes.findIndex(file => file.path === currentFile.path);
        if (debug) console.log(`Current note index: ${currentIndex}`);

        if (currentIndex === -1) {
            if (debug) console.log("Error: Could not find current note in the sorted list of daily notes.");
            return "Could not find current note in the vault's daily notes.";
        }

        const currentNoteDate = window.moment(currentFile.basename, "YYYY-MM-DD");
        const prevLink = this._createLink(allDailyNotes, currentIndex, -1, currentNoteDate);
        const nextLink = this._createLink(allDailyNotes, currentIndex, 1, currentNoteDate);
        if (debug) {
            console.log("Previous Link:", prevLink);
            console.log("Next Link:", nextLink);
        }

        const result = [prevLink, nextLink].filter(Boolean).join(" | ");
        if (debug) {
            console.log("Final Output:", result);
            if (!result) {
                console.log("No previous or next links were generated. Displaying fallback message.");
            }
            console.log("--- DailyNoteLinkManager: Debug Mode OFF ---");
        }
        
        return result || "_No other daily notes found in this folder_";
    }

    /**
     * Helper method to create a single navigation link (previous or next).
     * @param {TFile[]} allDailyNotes - The complete sorted list of all daily notes.
     * @param {number} currentIndex - The index of the current note in the list.
     * @param {number} offset - The offset to find the target note (-1 for previous, 1 for next).
     * @param {moment} currentNoteDate - The moment object for the current note's date.
     * @returns {string|null} - The formatted Markdown link, or null if no link is created.
     */
    _createLink(allDailyNotes, currentIndex, offset, currentNoteDate) {
        const targetIndex = currentIndex + offset;

        if (targetIndex < 0 || targetIndex >= allDailyNotes.length) {
            return null; // Out of bounds
        }

        const targetFile = allDailyNotes[targetIndex];
        const targetDate = window.moment(targetFile.basename, "YYYY-MM-DD");
        
        let linkText = targetFile.basename; // Default to YYYY-MM-DD

        if (offset === -1 && targetDate.isSame(currentNoteDate.clone().subtract(1, 'day'), 'day')) {
            linkText = "Yesterday";
        } else if (offset === 1 && targetDate.isSame(currentNoteDate.clone().add(1, 'day'), 'day')) {
            linkText = "Tomorrow";
        }

        return `[[${targetFile.path}|${linkText}]]`;
    }
} 