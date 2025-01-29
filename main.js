const { Plugin } = require('obsidian');

module.exports = class DateHighlighterPlugin extends Plugin {
    onload() {
        this.addCommand({
            id: 'highlight-past-dates',
            name: 'Highlight Past Dates',
            callback: () => {
                this.highlightPastDates();
            }
        });
    }

    async highlightPastDates() {
        const activeFile = this.app.workspace.getActiveFile();
        const content = await this.app.vault.read(activeFile);
        const today = new Date().toISOString().split('T')[0];
        const dateRegex = /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;

        const updatedContent = content.replace(dateRegex, (match) => {
            return new Date(match) < new Date(today) ? `==${match}==` : match;
        });

        await this.app.vault.modify(activeFile, updatedContent);
    }
};
