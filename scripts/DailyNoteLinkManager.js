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
 *      To change the date header level (default is <h3>):
 *      `$= const { DailyNoteLinkManager } = customJS; dv.span(DailyNoteLinkManager.generateDailyLinks({ dv: dv, headerLevel: 2 }));`
 *
 *   2. Debugging:
 *      If the script isn't working, enable debug mode to see detailed logs in the developer console.
 *      `$= const { DailyNoteLinkManager } = customJS; dv.span(DailyNoteLinkManager.generateDailyLinks({ dv: dv, debug: true, headerLevel: 3 }));`
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
    _getAllSortedDailyNotes(currentFile, debug = false) {
        if (!currentFile || !currentFile.parent) {
            if (debug) console.log("No current file or parent folder.");
            return [];
        }

        const parentFolder = currentFile.parent;
        const isMonthlyFolder = /^\d{4}-\d{2}$/.test(parentFolder.name);
        if (debug) console.log(`Parent folder: ${parentFolder.name}, isMonthly: ${isMonthlyFolder}`);

        let notesSource = [];

        if (isMonthlyFolder && parentFolder.parent) {
            if (debug) console.log("Monthly folder structure detected. Searching sibling folders.");
            const grandParentFolder = parentFolder.parent;

            // In Obsidian API, TFolder has a 'children' property, TFile does not. This is a safe way to identify folders.
            const monthlyFolders = grandParentFolder.children.filter(
                (child) => child.children && /^\d{4}-\d{2}$/.test(child.name)
            );
            if (debug) console.log(`Found ${monthlyFolders.length} monthly folders to search.`);

            for (const folder of monthlyFolders) {
                notesSource.push(...folder.children);
            }
        } else {
            if (debug) console.log("Standard folder structure detected. Searching current folder only.");
            notesSource = parentFolder.children;
        }

        const filteredAndSortedNotes = notesSource
            .filter(file => file.extension === 'md' && /^\d{4}-\d{2}-\d{2}$/.test(file.basename))
            .sort((a, b) => a.basename.localeCompare(b.basename));
        
        if (debug) console.log(`Found ${filteredAndSortedNotes.length} total daily notes after filtering.`);
        return filteredAndSortedNotes;
    }

    /**
     * Fetches all inbox entries from the same folder that correspond to the date of the current daily note.
     * @param {TFile} currentFile - The current daily note file.
     * @param {boolean} debug - Optional. Set to true to enable console logging for debugging.
     * @returns {string[]} An array of formatted markdown links for the inbox entries.
     */
    _getLocalInboxEntries(currentFile, debug = false) {
        if (!currentFile || !currentFile.parent) {
            return [];
        }

        const parentFolder = currentFile.parent;
        const dailyNoteBasename = currentFile.basename;

        const inboxFiles = parentFolder.children
            .filter(file =>
                file.extension === 'md' &&
                file.basename.startsWith(dailyNoteBasename) &&
                file.basename.length > dailyNoteBasename.length // Ensure it's not the daily note itself
            )
            .sort((a, b) => a.basename.localeCompare(b.basename));

        if (debug) console.log(`Found ${inboxFiles.length} inbox entries for ${dailyNoteBasename}.`);

        return inboxFiles.map(file => `[[${file.path}|${file.basename}]]`);
    }

    /**
     * Fetches all inbox entries from the entire vault that correspond to the date of the current daily note,
     * excluding those in the same folder as the current note.
     * @param {TFile} currentFile - The current daily note file.
     * @param {boolean} debug - Optional. Set to true to enable console logging for debugging.
     * @returns {Object.<string, string[]>} - An object where keys are parent paths and values are arrays of Markdown links.
     */
    _getVaultInboxEntries(currentFile, debug = false) {
        if (!currentFile) {
            return {}; // Return an object for grouped entries
        }

        const dailyNoteBasename = currentFile.basename;
        const localParentPath = currentFile.parent.path;

        const allFiles = app.vault.getMarkdownFiles();

        const vaultInboxFiles = allFiles.filter(file =>
            file.parent.path !== localParentPath && // Exclude local files
            file.basename.startsWith(dailyNoteBasename) &&
            file.basename.length > dailyNoteBasename.length
        );

        if (debug) console.log(`Found ${vaultInboxFiles.length} vault-wide inbox entries for ${dailyNoteBasename}.`);

        // Group by parent path
        const groupedByPath = vaultInboxFiles.reduce((acc, file) => {
            const parentPath = file.parent.path;
            if (!acc[parentPath]) {
                acc[parentPath] = [];
            }
            acc[parentPath].push(file); // Store the file object
            return acc;
        }, {});

        // Sort files within each group and format the links
        for (const path in groupedByPath) {
            groupedByPath[path] = groupedByPath[path]
                .sort((a, b) => a.basename.localeCompare(b.basename))
                .map(file => `[[${file.path}|${file.basename}]]`);
        }
        
        if (debug) console.log('Grouped vault entries:', groupedByPath);

        return groupedByPath;
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

        const allDailyNotes = this._getAllSortedDailyNotes(currentFile, debug);
        if (debug) console.log(`Found ${allDailyNotes.length} total daily notes in this folder.`);

        const currentIndex = allDailyNotes.findIndex(file => file.path === currentFile.path);
        if (debug) console.log(`Current note index: ${currentIndex}`);

        const currentNoteDate = window.moment(currentFile.basename, "YYYY-MM-DD");

        // --- Build Daily Nav Part ---
        let dailyNavPart;
        // The currentIndex check is crucial. If it's -1, something is wrong, but we must not crash.
        // We only attempt to get links if the current note is actually in our list.
        if (currentIndex !== -1) {
            const prevLink = this._createLink(allDailyNotes, currentIndex, -1, currentNoteDate);
            const nextLink = this._createLink(allDailyNotes, currentIndex, 1, currentNoteDate);
            dailyNavPart = [prevLink, nextLink].filter(Boolean).join(` | `);
        }
        
        if (!dailyNavPart) {
            dailyNavPart = "_No other daily notes found in this folder_";
        }
        if (debug) console.log("Daily Nav Part:", dailyNavPart);
        
        // --- Build Weekly Review Link ---
        const weekString = currentNoteDate.format("YYYY-[W]WW");
        const weeklyReviewLink = `[[Weekly Reviews/${weekString}]]`; // Corrected format
        if (debug) console.log("Weekly Review Link:", weeklyReviewLink);

        // --- Assemble Header ---
        const header = `${dailyNavPart} | ${weeklyReviewLink}`;
        if (debug) console.log("Header:", header);

        // --- Assemble Inbox Entries ---
        const localInboxLinks = this._getLocalInboxEntries(currentFile, debug);
        const vaultInboxGroups = this._getVaultInboxEntries(currentFile, debug);

        let inboxContent = "";
        const hasLocal = localInboxLinks.length > 0;
        const hasVault = Object.keys(vaultInboxGroups).length > 0;

        if (hasLocal || hasVault) {
            const inboxHeader = `**Today's Captures:**`;
            const sections = [];

            if (hasLocal) {
                const localLinksString = localInboxLinks.join('<br>');
                sections.push(`_Local:_<br>${localLinksString}<br>`);
            }

            if (hasVault) {
                const vaultEntries = Object.entries(vaultInboxGroups)
                    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
                    .map(([path, links]) => {
                        const linkList = links.map(link => `&nbsp;&nbsp;&nbsp;&nbsp;${link}`).join('<br>');
                        return `_${path}/_<br>${linkList}`;
                    }).join('<br>');
                sections.push(`${vaultEntries}`);
            }
            
            // Join sections with a single <br> for tighter spacing, and use a single \n after the header.
            inboxContent = `${inboxHeader}\n${sections.join('<br>')}`;
        }
        if (debug) console.log("Inbox Content:", `"${inboxContent}"`);

        // --- Combine Final Output ---
        // Join with a single newline to keep spacing tight, as it was originally.
        const finalOutput = [header, inboxContent].filter(Boolean).join("\n");

        if (debug) {
            console.log("Final Output:", `"${finalOutput}"`);
            console.log("--- DailyNoteLinkManager: Debug Mode OFF ---");
        }
        
        return finalOutput;
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
        
        let linkText;

        // For the 'previous' link
        if (offset === -1) {
            const isYesterday = targetDate.isSame(currentNoteDate.clone().subtract(1, 'day'), 'day');
            if (isYesterday) {
                // It's exactly one day before, show "Yesterday"
                linkText = "< Yesterday";
            } else {
                // It's a gap of more than one day, show the date with more arrows
                linkText = `<< ${targetFile.basename}`;
            }
        } 
        // For the 'next' link
        else if (offset === 1) {
            const isTomorrow = targetDate.isSame(currentNoteDate.clone().add(1, 'day'), 'day');
            if (isTomorrow) {
                // It's exactly one day after, show "Tomorrow"
                linkText = "Tomorrow >";
            } else {
                // It's a gap of more than one day, show the date with more arrows
                linkText = `${targetFile.basename} >>`;
            }
        }

        return `[[${targetFile.path}|${linkText}]]`;
    }
} 