import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Menu, TFile, TFolder, TAbstractFile } from 'obsidian';

// Remember to rename these classes and interfaces!

interface UpdateDatesSettings {
	taskFolder: string;
}

const DEFAULT_SETTINGS: UpdateDatesSettings = {
	taskFolder: 'tasks'
}

export default class UpdateDatesPlugin extends Plugin {
	settings: UpdateDatesSettings;

	async onload() {
		await this.loadSettings();

		console.log('loading plugin')
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('calendar-arrow-down', 'Update Dates', (evt: MouseEvent) => {
			const menu = new Menu();			
			
			menu.addItem((item) =>
				item
				.setTitle('Highlight dates in task-folder')
				.setIcon('eye')
				.onClick(() => {
					this.highlightPastDatesInFolder(this.settings.taskFolder);
					new Notice('Highlighted dates in task-folder: ' + this.settings.taskFolder);
				})
			);			menu.addItem((item) =>
				item
				.setTitle('Unhighlight dates in task-folder')
				.setIcon('eye-off')
				.onClick(() => {
					this.unhighlightPastDatesInFolder(this.settings.taskFolder);
					new Notice('Unhighlighted dates in task-folder: ' + this.settings.taskFolder);
				})
			);
			
			menu.addItem((item) =>
				item
				.setTitle('Update dates in task-folder')
				.setIcon('calendar-check-2')
				.onClick(() => {
					this.updatePastDatesInFolder(this.settings.taskFolder);
					new Notice('Updated dates in task-folder: ' + this.settings.taskFolder);
				})
			);
			
			menu.addItem((item) =>
				item
				.setTitle('Update dates in task-folder to custom date')
				.setIcon('calendar-plus')
				.onClick(() => {
					const modal = new DateSelectionModal(this.app, (date: string) => {
						this.updatePastDatesInFolder(this.settings.taskFolder, date);
						new Notice(`Updated dates in task-folder ${this.settings.taskFolder} to ${date}`);
					});
					modal.open();
				})
			);

			menu.showAtMouseEvent(evt);
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

		this.addCommand({
			id: 'update-past-dates-to-custom-date',
			name: 'Update past dates to custom date',
			callback: () => {
				const modal = new DateSelectionModal(this.app, (date: string) => {
					this.updatePastDatesToToday(date);
					new Notice(`Updated past dates to ${date}`);
				});
				modal.open();
			}
		});

		this.addCommand({
			id: 'update-past-dates-in-folder-to-custom-date',
			name: 'Update past dates in task-folder to custom date',
			callback: () => {
				const modal = new DateSelectionModal(this.app, (date: string) => {
					this.updatePastDatesInFolder(this.settings.taskFolder, date);
					new Notice(`Updated past dates in ${this.settings.taskFolder} to ${date}`);
				});
				modal.open();
			}
		});

		this.addCommand({
			id: 'highlight-past-dates-from-custom-date',
			name: 'Highlight past dates from custom date',
			callback: () => {
				const modal = new DateSelectionModal(this.app, (date: string) => {
					this.highlightPastDates(date);
					new Notice(`Highlighted past dates from ${date}`);
				});
				modal.open();
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
	}    async highlightPastDates(targetDate?: string) {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) return;
        
        const content = await this.app.vault.read(activeFile);
        const today = targetDate || new Date().toISOString().split('T')[0];
		const unfinishedDateRegex = /- \[ \] .*?\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
        const dateRegex = /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;

        const updatedContent = content.replace(unfinishedDateRegex, (line) => {
			return line.replace(dateRegex, (match) => {
				return new Date(match) < new Date(today) ? `==${match}==` : match;
			});
		})

        await this.app.vault.modify(activeFile, updatedContent);
    }
	async highlightPastDatesInFolder(folderPath: string, targetDate?: string) {
		const folder = this.app.vault.getAbstractFileByPath(folderPath) as TFolder;
	
		if (!folder || !folder.children) {
			console.error("Invalid folder path");
			return;
		}
	
		const today = targetDate || new Date().toISOString().split('T')[0];
		const unfinishedDateRegex = /- \[ \] .*?\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
		const dateRegex = /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
	
		const processFile = async (file: TFile) => {
			if (file.extension === "md") { // Process only markdown files
				const content = await this.app.vault.read(file);
				const updatedContent = content.replace(unfinishedDateRegex, (line) => {
					return line.replace(dateRegex, (match) => {
						return new Date(match) < new Date(today) ? `==${match}==` : match;
					});
				})
	
				if (content !== updatedContent) {
					await this.app.vault.modify(file, updatedContent);
				}
			}
		};
	
		const processFolder = async (folder: TFolder) => {
			for (const child of folder.children) {
				if (child instanceof TFile) {
					await processFile(child);
				} else if (child instanceof TFolder) {
					await processFolder(child);
				}
			}
		};
	
		await processFolder(folder);
	}
	
	async unhighlightDates() {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) return;
        
        const content = await this.app.vault.read(activeFile);
		const unfinishedDateRegex = /- \[ \] .*?==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;
        const dateRegex = /==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;

        const updatedContent = content.replace(unfinishedDateRegex, (line) => {
			return line.replace(dateRegex, (match) => {
				return match.slice(2, -2)
			});
		})

        await this.app.vault.modify(activeFile, updatedContent);
    }

	async unhighlightPastDatesInFolder(folderPath: string, targetDate?: string) {
		const folder = this.app.vault.getAbstractFileByPath(folderPath) as TFolder;
	
		if (!folder || !folder.children) {
			console.error("Invalid folder path");
			return;
		}
	
		const today = targetDate || new Date().toISOString().split('T')[0];
		const unfinishedDateRegex = /- \[ \] .*?==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;
		const dateRegex = /==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;

		const processFile = async (file: TFile) => {
			if (file.extension === "md") { // Process only markdown files
				const content = await this.app.vault.read(file);
				const updatedContent = content.replace(unfinishedDateRegex, (line) => {
					return line.replace(dateRegex, (match) => {
						return match.slice(2, -2)
					});
				})
	
				if (content !== updatedContent) {
					await this.app.vault.modify(file, updatedContent);
				}
			}
		};
	
		const processFolder = async (folder: TFolder) => {
			for (const child of folder.children) {
				if (child instanceof TFile) {
					await processFile(child);
				} else if (child instanceof TFolder) {
					await processFolder(child);
				}
			}
		};
	
		await processFolder(folder);
	}
	async updatePastDatesToToday(targetDate?: string) {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) return;
        
        const content = await this.app.vault.read(activeFile);
        const today = targetDate || new Date().toISOString().split('T')[0];
		const unfinishedDateRegex = /- \[ \] .*?\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
        const dateRegex = /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;

        const updatedContent = content.replace(unfinishedDateRegex, (line) => {
			console.log(line)
            return line.replace(dateRegex, (dateMatch) => {
				return new Date(dateMatch) < new Date(today) ? today : dateMatch;
			})
        });

        await this.app.vault.modify(activeFile, updatedContent);
    }
	async updatePastDatesInFolder(folderPath: string, targetDate?: string) {
		const folder = this.app.vault.getAbstractFileByPath(folderPath) as TFolder;
	
		if (!folder || !folder.children) {
			console.error("Invalid folder path");
			return;
		}
	
		const today = targetDate || new Date().toISOString().split('T')[0];
		const unfinishedDateRegex = /- \[ \] .*?\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
		const dateRegex = /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
	
		const processFile = async (file: TFile) => {
			if (file.extension === "md") { // Process only markdown files
				const content = await this.app.vault.read(file);
				const updatedContent = content.replace(unfinishedDateRegex, (line) => {
					console.log(line)
					return line.replace(dateRegex, (dateMatch) => {
						return new Date(dateMatch) < new Date(today) ? today : dateMatch;
					})
				});
	
				if (content !== updatedContent) {
					await this.app.vault.modify(file, updatedContent);
				}
			}
		};
	
		const processFolder = async (folder: TFolder) => {
			for (const child of folder.children) {
				if (child instanceof TFile) {
					await processFile(child);
				} else if (child instanceof TFolder) {
					await processFolder(child);
				}
			}
		};
	
		await processFolder(folder);
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
			.setName('Task folder')
			.setDesc('This should be a folder of task lists of which you want to modify the dates.')
			.addText(text => text
				.setPlaceholder('folder')
				.setValue(this.plugin.settings.taskFolder)
				.onChange(async (value) => {
					this.plugin.settings.taskFolder = value;
					await this.plugin.saveSettings();
				}));
	}
}

class DateSelectionModal extends Modal {
	callback: (date: string) => void;

	constructor(app: App, callback: (date: string) => void) {
		super(app);
		this.callback = callback;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl('h3', {text: 'Enter date (YYYY-MM-DD)'});
		
		const inputEl = contentEl.createEl('input');
		inputEl.type = 'date';
		inputEl.value = new Date().toISOString().split('T')[0]; // Current date as default
		
		const buttonEl = contentEl.createEl('button', {text: 'Submit'});
		buttonEl.addEventListener('click', () => {
			this.callback(inputEl.value);
			this.close();
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
