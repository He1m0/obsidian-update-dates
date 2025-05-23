import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Menu, TFile, TFolder, TAbstractFile } from 'obsidian';
import { ActionSelectionModal } from './ActionSelectionModal';

// Remember to rename these classes and interfaces!

interface UpdateDatesSettings {
	taskFolder: string;
	// Default values for action window
	defaultExcludedFolders: string;
	defaultDateType: string;
	defaultTaskStatus: string;
	defaultPriorities: {
		lowest: boolean;
		low: boolean;
		normal: boolean;
		medium: boolean;
		high: boolean;
		highest: boolean;
	};
	defaultAttributes: {
		hasRecurring: boolean;
		hasDueDate: boolean;
		hasScheduledDate: boolean;
		hasStartDate: boolean;
	};
}

const DEFAULT_SETTINGS: UpdateDatesSettings = {
	taskFolder: 'tasks',
	// Default values for action window
	defaultExcludedFolders: '',
	defaultDateType: 'both',
	defaultTaskStatus: 'unfinished',
	defaultPriorities: {
		lowest: false,
		low: false,
		normal: false,
		medium: false,
		high: false,
		highest: false
	},
	defaultAttributes: {
		hasRecurring: false,
		hasDueDate: false,
		hasScheduledDate: true,
		hasStartDate: false
	}
}

export default class UpdateDatesPlugin extends Plugin {
	settings: UpdateDatesSettings;

	async onload() {
		await this.loadSettings();
		console.log('loading plugin')
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('calendar-arrow-down', 'Update Dates', (evt: MouseEvent) => {
			// Open the action selection modal window
			const modal = new ActionSelectionModal(this.app, this);
			modal.open();
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
		this.addSettingTab(new UpdateDatesSettingTab(this.app, this));

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
	async unhighlightPastDatesInFolder(folderPath: string, targetDate?: string, excludedFolders: string[] = []) {
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
				if (child instanceof TFolder) {
					// Skip this folder if it's in the excluded list
					if (excludedFolders.some(excludedPath => 
						child.path === excludedPath || 
						child.path.startsWith(excludedPath + '/') ||
						child.name === excludedPath
					)) {
						continue;
					}
					await processFolder(child);
				} else if (child instanceof TFile) {
					await processFile(child);
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
	}	async highlightPastDatesInFolderWithExclusions(folderPath: string, excludedFolders: string[] = [], targetDate?: string, dateType: string = 'both', taskFilters?: {
		status?: string;
		priorities?: string[];
		hasRecurring?: boolean;
		hasDueDate?: boolean;
		hasScheduledDate?: boolean;
		hasStartDate?: boolean;
	}) {
		const folder = this.app.vault.getAbstractFileByPath(folderPath) as TFolder;
	
		if (!folder || !folder.children) {
			console.error("Invalid folder path");
			return;
		}
	
		const today = targetDate || new Date().toISOString().split('T')[0];
		
		// Define regex patterns based on date type
		let unfinishedDateRegex: RegExp;
		let dateRegex: RegExp;
		let taskStatusRegex = /- \[ \] /;  // Default to unfinished tasks
		
		// Handle task status filtering
		if (taskFilters?.status === 'completed') {
			taskStatusRegex = /- \[x\] /;  // Match completed tasks
		} else if (taskFilters?.status === 'all') {
			taskStatusRegex = /- \[[ x]\] /;  // Match both completed and uncompleted tasks
		}
		
		// Handle date type filtering
		if (dateType === 'due') {
			// Only match due dates (📅)
			unfinishedDateRegex = new RegExp(taskStatusRegex.source + `.*?📅 \\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\\b`, 'g');
			dateRegex = /📅 \b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
		} else if (dateType === 'scheduled') {
			// Only match scheduled dates (⏳)
			unfinishedDateRegex = new RegExp(taskStatusRegex.source + `.*?⏳ \\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\\b`, 'g');
			dateRegex = /⏳ \b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
		} else {
			// Match both date types (with or without emoji)
			unfinishedDateRegex = new RegExp(taskStatusRegex.source + `.*?\\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\\b`, 'g');
			dateRegex = /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
		}
		
		const processFile = async (file: TFile) => {
			if (file.extension === "md") { // Process only markdown files
				const content = await this.app.vault.read(file);
				let updatedContent = content;
				
				// Process each task line that matches our criteria				
				updatedContent = content.replace(unfinishedDateRegex, (line: string) => {					// Skip if line doesn't match attribute filters
					if (taskFilters) {
						// Check priority filters
						if (taskFilters.priorities && taskFilters.priorities.length > 0) {
							const priorityEmojis: Record<string, string> = {
								'lowest': '⏬',
								'low': '🔽',
								'medium': '🔼',
								'high': '⏫',
								'highest': '🔺'
							};
							
							// Check if any of the selected priorities match
							let priorityMatched = false;
							
							// For normal priority (no emoji)
							if (taskFilters.priorities.includes('normal')) {
								const hasAnyPriorityEmoji = Object.values(priorityEmojis).some(e => line.includes(e));
								if (!hasAnyPriorityEmoji) {
									priorityMatched = true;
								}
							}
							
							// For emoji-based priorities
							for (const priority of taskFilters.priorities) {
								if (priority !== 'normal' && line.includes(priorityEmojis[priority])) {
									priorityMatched = true;
									break;
								}
							}
							
							// Skip if no priorities match
							if (!priorityMatched) {
								return line;
							}
						}
								// New attribute filtering logic:
						// If any attribute filter is enabled, check for exact attribute matching
						const attributesSelected = !!(taskFilters.hasRecurring || 
													taskFilters.hasDueDate || 
													taskFilters.hasScheduledDate || 
													taskFilters.hasStartDate);
						
						if (attributesSelected) {
							// Check which attributes are present in the line
							const hasRecurring = line.includes('🔁');
							const hasDueDate = line.includes('📅');
							const hasScheduledDate = line.includes('⏳');
							const hasStartDate = line.includes('🛫');
							
							// Only proceed if the task has exactly the selected attributes and no others
							if (taskFilters.hasRecurring !== hasRecurring ||
								taskFilters.hasDueDate !== hasDueDate ||
								taskFilters.hasScheduledDate !== hasScheduledDate ||
								taskFilters.hasStartDate !== hasStartDate) {
								return line;  // Skip this line if attributes don't exactly match
							}
						}
					}
							// Apply the date highlights
					return line.replace(dateRegex, (match: string) => {
						// Extract just the date part without the emoji
						const dateMatch = match.match(/\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/);
						if (dateMatch && new Date(dateMatch[0]) < new Date(today)) {
							return match.includes(dateMatch[0]) ? match.replace(dateMatch[0], `==${dateMatch[0]}==`) : match;
						}
						return match;
					});
				});
				
				if (content !== updatedContent) {
					await this.app.vault.modify(file, updatedContent);
				}
			}
		};
	
		const processFolder = async (folder: TFolder) => {
			for (const child of folder.children) {
				if (child instanceof TFolder) {
					// Skip this folder if it's in the excluded list
					if (excludedFolders.some(excludedPath => 
						child.path === excludedPath || 
						child.path.startsWith(excludedPath + '/') ||
						child.name === excludedPath
					)) {
						continue;
					}
					await processFolder(child);
				} else if (child instanceof TFile) {
					await processFile(child);
				}
			}
		};
	
		await processFolder(folder);
	}
	
	async unhighlightPastDatesInFolderWithExclusions(folderPath: string, excludedFolders: string[] = [], targetDate?: string, dateType: string = 'both') {
		const folder = this.app.vault.getAbstractFileByPath(folderPath) as TFolder;
	
		if (!folder || !folder.children) {
			console.error("Invalid folder path");
			return;
		}
	
		const today = targetDate || new Date().toISOString().split('T')[0];
		
		// Define regex patterns based on date type
		let unfinishedDateRegex: RegExp;
		let dateRegex: RegExp;
		
		if (dateType === 'due') {
			// Only match due dates (📅)
			unfinishedDateRegex = /- \[ \] .*?📅 .*?==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;
			dateRegex = /==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;
		} else if (dateType === 'scheduled') {
			// Only match scheduled dates (⏳)
			unfinishedDateRegex = /- \[ \] .*?⏳ .*?==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;
			dateRegex = /==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;
		} else {
			// Match both date types
			unfinishedDateRegex = /- \[ \] .*?==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;
			dateRegex = /==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g;
		}

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
				if (child instanceof TFolder) {
					// Skip this folder if it's in the excluded list
					if (excludedFolders.some(excludedPath => 
						child.path === excludedPath || 
						child.path.startsWith(excludedPath + '/') ||
						child.name === excludedPath
					)) {
						continue;
					}
					await processFolder(child);
				} else if (child instanceof TFile) {
					await processFile(child);
				}
			}
		};		await processFolder(folder);
	}
	
	async updatePastDatesInFolderWithExclusions(folderPath: string, excludedFolders: string[] = [], targetDate?: string, dateType: string = 'both', taskFilters?: {
	status?: string;
	priorities?: string[];
	hasRecurring?: boolean;
	hasDueDate?: boolean;
	hasScheduledDate?: boolean;
	hasStartDate?: boolean;
}) {
		const folder = this.app.vault.getAbstractFileByPath(folderPath) as TFolder;
	
		if (!folder || !folder.children) {
			console.error("Invalid folder path");
			return;
		}
	
		const today = targetDate || new Date().toISOString().split('T')[0];
		
		// Define regex patterns based on date type and status
		let taskStatusRegex = /- \[ \] /;  // Default to unfinished tasks
		
		// Handle task status filtering
		if (taskFilters?.status === 'completed') {
			taskStatusRegex = /- \[x\] /;  // Match completed tasks
		} else if (taskFilters?.status === 'all') {
			taskStatusRegex = /- \[[ x]\] /;  // Match both completed and uncompleted tasks
		}
		
		// Define regex patterns based on date type
		let taskRegex: RegExp;
		let dateRegex: RegExp;
		
		if (dateType === 'due') {
			// Only match due dates (📅)
			taskRegex = new RegExp(taskStatusRegex.source + `.*?📅 \\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\\b`, 'g');
			dateRegex = /📅 \b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
		} else if (dateType === 'scheduled') {
			// Only match scheduled dates (⏳)
			taskRegex = new RegExp(taskStatusRegex.source + `.*?⏳ \\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\\b`, 'g');
			dateRegex = /⏳ \b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
		} else {
			// Match both date types
			taskRegex = new RegExp(taskStatusRegex.source + `.*?\\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\\b`, 'g');
			dateRegex = /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
		}
	
		const processFile = async (file: TFile) => {
			if (file.extension === "md") { // Process only markdown files
				const content = await this.app.vault.read(file);
				let updatedContent = content;
				
				// Process each task line that matches our criteria				
				updatedContent = content.replace(taskRegex, (line: string) => {
					// Skip if line doesn't match attribute filters
					if (taskFilters) {
						// Check priority filters
						if (taskFilters.priorities && taskFilters.priorities.length > 0) {
							const priorityEmojis: Record<string, string> = {
								'lowest': '⏬',
								'low': '🔽',
								'medium': '🔼',
								'high': '⏫',
								'highest': '🔺'
							};
							
							// Check if any of the selected priorities match
							let priorityMatched = false;
							
							// For normal priority (no emoji)
							if (taskFilters.priorities.includes('normal')) {
								const hasAnyPriorityEmoji = Object.values(priorityEmojis).some(e => line.includes(e));
								if (!hasAnyPriorityEmoji) {
									priorityMatched = true;
								}
							}
							
							// For emoji-based priorities
							for (const priority of taskFilters.priorities) {
								if (priority !== 'normal' && line.includes(priorityEmojis[priority])) {
									priorityMatched = true;
									break;
								}
							}
							
							// Skip if no priorities match
							if (!priorityMatched) {
								return line;
							}
						}
								// New attribute filtering logic:
						// If any attribute filter is enabled, check for exact attribute matching
						const attributesSelected = !!(taskFilters.hasRecurring || 
													taskFilters.hasDueDate || 
													taskFilters.hasScheduledDate || 
													taskFilters.hasStartDate);
						
						if (attributesSelected) {
							// Check which attributes are present in the line
							const hasRecurring = line.includes('🔁');
							const hasDueDate = line.includes('📅');
							const hasScheduledDate = line.includes('⏳');
							const hasStartDate = line.includes('🛫');
							
							// Only proceed if the task has exactly the selected attributes and no others
							if (taskFilters.hasRecurring !== hasRecurring ||
								taskFilters.hasDueDate !== hasDueDate ||
								taskFilters.hasScheduledDate !== hasScheduledDate ||
								taskFilters.hasStartDate !== hasStartDate) {
								return line;  // Skip this line if attributes don't exactly match
							}
						}
					}
					
					// Apply the update to dates
					return line.replace(dateRegex, (match) => {
						// Extract just the date part without the emoji
						const dateMatch = match.match(/\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/);
						if (dateMatch && new Date(dateMatch[0]) < new Date(today)) {
							return match.replace(dateMatch[0], today);
						}
						return match;
					});
				});
				
				if (content !== updatedContent) {
					await this.app.vault.modify(file, updatedContent);
				}
			}
		};
	
		const processFolder = async (folder: TFolder) => {
			for (const child of folder.children) {
				if (child instanceof TFolder) {
					// Skip this folder if it's in the excluded list
					if (excludedFolders.some(excludedPath => 
						child.path === excludedPath || 
						child.path.startsWith(excludedPath + '/') ||
						child.name === excludedPath
					)) {
						continue;
					}
					await processFolder(child);
				} else if (child instanceof TFile) {
					await processFile(child);
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

class UpdateDatesSettingTab extends PluginSettingTab {
	plugin: UpdateDatesPlugin;

	constructor(app: App, plugin: UpdateDatesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Update Dates Plugin Settings'});
		
		// Basic Settings
		containerEl.createEl('h3', {text: 'Basic Settings'});

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
				
		// Default Action Window Settings
		containerEl.createEl('h3', {text: 'Default Action Window Settings'});
		containerEl.createEl('p', {text: 'These settings will be pre-selected when opening the action window.'});
		
		new Setting(containerEl)
			.setName('Default excluded folders')
			.setDesc('Comma-separated list of folders to exclude by default (e.g. archived,personal)')
			.addText(text => text
				.setPlaceholder('folder1,folder2,folder3')
				.setValue(this.plugin.settings.defaultExcludedFolders)
				.onChange(async (value) => {
					this.plugin.settings.defaultExcludedFolders = value;
					await this.plugin.saveSettings();
				}));
				
		new Setting(containerEl)
			.setName('Default date type')
			.setDesc('Select which type of dates to update by default')
			.addDropdown(dropdown => dropdown
				.addOptions({
					'both': 'Both date types',
					'due': 'Due dates (📅)',
					'scheduled': 'Scheduled dates (⏳)'
				})
				.setValue(this.plugin.settings.defaultDateType)
				.onChange(async (value) => {
					this.plugin.settings.defaultDateType = value;
					await this.plugin.saveSettings();
				})
			);
			
		new Setting(containerEl)
			.setName('Default task status')
			.setDesc('Select which tasks to process based on their completion status')
			.addDropdown(dropdown => dropdown
				.addOptions({
					'unfinished': 'Unfinished tasks',
					'completed': 'Completed tasks',
					'all': 'All tasks'
				})
				.setValue(this.plugin.settings.defaultTaskStatus)
				.onChange(async (value) => {
					this.plugin.settings.defaultTaskStatus = value;
					await this.plugin.saveSettings();
				})
			);
			
		// Priority defaults
		containerEl.createEl('h4', {text: 'Default Priority Filters'});
		
		new Setting(containerEl)
			.setName('Lowest Priority (⏬)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultPriorities.lowest)
				.onChange(async (value) => {
					this.plugin.settings.defaultPriorities.lowest = value;
					await this.plugin.saveSettings();
				})
			);
			
		new Setting(containerEl)
			.setName('Low Priority (🔽)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultPriorities.low)
				.onChange(async (value) => {
					this.plugin.settings.defaultPriorities.low = value;
					await this.plugin.saveSettings();
				})
			);
			
		new Setting(containerEl)
			.setName('Normal Priority')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultPriorities.normal)
				.onChange(async (value) => {
					this.plugin.settings.defaultPriorities.normal = value;
					await this.plugin.saveSettings();
				})
			);
			
		new Setting(containerEl)
			.setName('Medium Priority (🔼)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultPriorities.medium)
				.onChange(async (value) => {
					this.plugin.settings.defaultPriorities.medium = value;
					await this.plugin.saveSettings();
				})
			);
			
		new Setting(containerEl)
			.setName('High Priority (⏫)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultPriorities.high)
				.onChange(async (value) => {
					this.plugin.settings.defaultPriorities.high = value;
					await this.plugin.saveSettings();
				})
			);
			
		new Setting(containerEl)
			.setName('Highest Priority (🔺)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultPriorities.highest)
				.onChange(async (value) => {
					this.plugin.settings.defaultPriorities.highest = value;
					await this.plugin.saveSettings();
				})
			);
		
		// Date attribute defaults
		containerEl.createEl('h4', {text: 'Default Date Attributes'});
		
		new Setting(containerEl)
			.setName('Recurring (🔁)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultAttributes.hasRecurring)
				.onChange(async (value) => {
					this.plugin.settings.defaultAttributes.hasRecurring = value;
					await this.plugin.saveSettings();
				})
			);
			
		new Setting(containerEl)
			.setName('Due Date (📅)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultAttributes.hasDueDate)
				.onChange(async (value) => {
					this.plugin.settings.defaultAttributes.hasDueDate = value;
					await this.plugin.saveSettings();
				})
			);
			
		new Setting(containerEl)
			.setName('Scheduled Date (⏳)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultAttributes.hasScheduledDate)
				.onChange(async (value) => {
					this.plugin.settings.defaultAttributes.hasScheduledDate = value;
					await this.plugin.saveSettings();
				})
			);
			
		new Setting(containerEl)
			.setName('Start Date (🛫)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.defaultAttributes.hasStartDate)
				.onChange(async (value) => {
					this.plugin.settings.defaultAttributes.hasStartDate = value;
					await this.plugin.saveSettings();
				})
			);
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

// ActionSelectionModal is now imported from ActionSelectionModal.ts
