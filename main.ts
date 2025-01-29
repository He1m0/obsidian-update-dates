import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface UpdateDatesSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: UpdateDatesSettings = {
	mySetting: 'default'
}

export default class UpdateDatesPlugin extends Plugin {
	settings: UpdateDatesSettings;

	async onload() {
		await this.loadSettings();

		console.log('loading plugin')
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Update Dates', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

        this.addCommand({
            id: 'highlight-past-dates',
            name: 'Highlight Past Dates',
            callback: () => {
                this.highlightPastDates();
            }
        });

		this.addCommand({
            id: 'unhighlight-dates',
            name: 'Unhighlight All Dates',
            callback: () => {
                this.unhighlightDates();
            }
        });

		this.addCommand({
			id: 'update-past-dates-to-today',
			name: 'Update past dates to today',
			callback: () => {
				this.updatePastDatesToToday();
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

	async unhighlightDates() {
        const activeFile = this.app.workspace.getActiveFile();
        const content = await this.app.vault.read(activeFile);
        const dateRegex = /==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;

        const updatedContent = content.replace(dateRegex, (match) => {
            return match.slice(2, -2)
        });

        await this.app.vault.modify(activeFile, updatedContent);
    }

	async updatePastDatesToToday() {
        const activeFile = this.app.workspace.getActiveFile();
        const content = await this.app.vault.read(activeFile);
        const today = new Date().toISOString().split('T')[0];
        const dateRegex = /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;

        const updatedContent = content.replace(dateRegex, (match) => {
            return new Date(match) < new Date(today) ? today : match;
        });

        await this.app.vault.modify(activeFile, updatedContent);
    }

	onunload() {
		console.log('unloading plugin')
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: UpdateDatesPlugin;

	constructor(app: App, plugin: UpdateDatesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
