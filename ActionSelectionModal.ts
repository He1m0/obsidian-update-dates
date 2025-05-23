import { App, Modal, Notice, Setting, TFolder } from 'obsidian';
import UpdateDatesPlugin from './main';

export class ActionSelectionModal extends Modal {
	plugin: UpdateDatesPlugin;

	constructor(app: App, plugin: UpdateDatesPlugin) {
		super(app);
		this.plugin = plugin;
	}
	onOpen() {
		const {contentEl} = this;
		contentEl.empty();
		
		contentEl.createEl('h2', {text: 'Update Dates Actions'});
		
			// Initialize all state variables using plugin default settings
		let selectedFolder = this.plugin.settings.taskFolder;
		let excludedFolders: string[] = this.plugin.settings.defaultExcludedFolders ? 
			this.plugin.settings.defaultExcludedFolders.split(',').map(folder => folder.trim()) : [];
		let targetDate = new Date().toISOString().split('T')[0]; // Default to today
		let selectedDateType = this.plugin.settings.defaultDateType;
		let taskStatus = this.plugin.settings.defaultTaskStatus;
		
		// Priority toggles
		let priorityLowest = this.plugin.settings.defaultPriorities.lowest;
		let priorityLow = this.plugin.settings.defaultPriorities.low;
		let priorityNormal = this.plugin.settings.defaultPriorities.normal; 
		let priorityMedium = this.plugin.settings.defaultPriorities.medium;
		let priorityHigh = this.plugin.settings.defaultPriorities.high;
		let priorityHighest = this.plugin.settings.defaultPriorities.highest;
		
		// Task attributes filter
		let hasRecurring = this.plugin.settings.defaultAttributes.hasRecurring;
		let hasDueDate = this.plugin.settings.defaultAttributes.hasDueDate;
		let hasScheduledDate = this.plugin.settings.defaultAttributes.hasScheduledDate;
		let hasStartDate = this.plugin.settings.defaultAttributes.hasStartDate;
		
		// Helper function to create the priorities array
		const getSelectedPriorities = () => {
			const selectedPriorities: string[] = [];
			if (priorityLowest) selectedPriorities.push('lowest');
			if (priorityLow) selectedPriorities.push('low');
			if (priorityNormal) selectedPriorities.push('normal');
			if (priorityMedium) selectedPriorities.push('medium');
			if (priorityHigh) selectedPriorities.push('high');
			if (priorityHighest) selectedPriorities.push('highest');
			return selectedPriorities;
		};
		
		// SECTION 1: Available Actions (moved to the top)
		contentEl.createEl('h3', {text: 'Available Actions'});
		
		// Highlight dates in task-folder
		new Setting(contentEl)
			.setName('Highlight past dates')
			.setDesc(`Highlight all past dates in folder: ${selectedFolder}`)
			.addButton(button => button
				.setButtonText('Execute')
				.setIcon('eye')
				.onClick(() => {
					this.plugin.highlightPastDatesInFolderWithExclusions(selectedFolder, excludedFolders, targetDate, selectedDateType, {
						status: taskStatus,
						priorities: getSelectedPriorities(),
						hasRecurring: hasRecurring,
						hasDueDate: hasDueDate,
						hasScheduledDate: hasScheduledDate,
						hasStartDate: hasStartDate
					});
					new Notice(`Highlighted dates in folder: ${selectedFolder} (before ${targetDate})`);
					this.close();
				}));

		// Unhighlight dates in task-folder
		new Setting(contentEl)
			.setName('Unhighlight past dates')
			.setDesc(`Remove highlighting from all dates in folder: ${selectedFolder}`)
			.addButton(button => button
				.setButtonText('Execute')
				.setIcon('eye-off')
				.onClick(() => {
					this.plugin.unhighlightPastDatesInFolderWithExclusions(selectedFolder, excludedFolders, undefined, selectedDateType);
					new Notice(`Unhighlighted dates in folder: ${selectedFolder} (${selectedDateType} dates)`);
					this.close();
				}));

		// Update dates in task-folder
		new Setting(contentEl)
			.setName('Update past dates')
			.setDesc(`Update all past dates in folder: ${selectedFolder} to selected date`)
			.addButton(button => button
				.setButtonText('Execute')
				.setIcon('calendar-check-2')
				.onClick(() => {
					this.plugin.updatePastDatesInFolderWithExclusions(selectedFolder, excludedFolders, targetDate, selectedDateType, {
						status: taskStatus,
						priorities: getSelectedPriorities(),
						hasRecurring: hasRecurring,
						hasDueDate: hasDueDate,
						hasScheduledDate: hasScheduledDate,
						hasStartDate: hasStartDate
					});
					new Notice(`Updated dates in folder: ${selectedFolder} to ${targetDate} (${selectedDateType} dates)`);
					this.close();
					}));
				
		// SECTION 2: Folder and Date Selection
		contentEl.createEl('h3', {text: 'Settings'});
		
		new Setting(contentEl)
			.setName('Target folder')
			.setDesc('Select the folder to process')
			.addText(text => text
				.setPlaceholder('folder path')
				.setValue(selectedFolder)
				.onChange(value => {
					selectedFolder = value;
					// Update the action descriptions with the new folder
					contentEl.querySelectorAll('.setting-item-description').forEach(el => {
						if (el.textContent?.includes('Highlight all past dates in folder')) {
							el.textContent = `Highlight all past dates in folder: ${selectedFolder}`;
						} else if (el.textContent?.includes('Remove highlighting from all dates in folder')) {
							el.textContent = `Remove highlighting from all dates in folder: ${selectedFolder}`;
						} else if (el.textContent?.includes('Update all past dates in folder')) {
							el.textContent = `Update all past dates in folder: ${selectedFolder} to selected date`;
						}
					});
				}));
				
		new Setting(contentEl)
			.setName('Excluded folders')
			.setDesc('Comma-separated list of folders to exclude (e.g. archived,personal)')
			.addText(text => text
				.setPlaceholder('folder1,folder2,folder3')
				.setValue(this.plugin.settings.defaultExcludedFolders)
				.onChange(value => {
					if (value) {
						excludedFolders = value.split(',').map(folder => folder.trim());
					} else {
						excludedFolders = [];
					}
				}));
				
		// Add date picker for target date
		new Setting(contentEl)
			.setName('Target date')
			.setDesc('Select the date to use for updates (defaults to today if not specified)')
			.addText(text => {
				const input = text
					.setPlaceholder('YYYY-MM-DD')
					.setValue(targetDate)
					.onChange(value => {
						targetDate = value;
					});
				
				// Make it a date input
				input.inputEl.type = 'date';
				
				return input;
			});
			
		// Add date type selection
		new Setting(contentEl)
			.setName('Date type')
			.setDesc('Select which type of dates to update')
			.addDropdown(dropdown => dropdown
				.addOptions({
					'both': 'Both date types',
					'due': 'Due dates (📅)',
					'scheduled': 'Scheduled dates (⏳)'
				})
				.setValue(selectedDateType)
				.onChange(value => {
					selectedDateType = value;
				})
			);
			
		// SECTION 3: Task Filtering Options
		contentEl.createEl('h3', {text: 'Task Filtering'});
		
		// Task status filter
		new Setting(contentEl)
			.setName('Task Status')
			.setDesc('Select which tasks to process based on their completion status')
			.addDropdown(dropdown => dropdown
				.addOptions({
					'unfinished': 'Unfinished tasks',
					'completed': 'Completed tasks',
					'all': 'All tasks'
				})
				.setValue(taskStatus)
				.onChange(value => {
					taskStatus = value;
				})
			);
			
		// Priority filters section
		contentEl.createEl('h4', {text: 'Priority Filters'});
		
		new Setting(contentEl)
			.setName('Lowest Priority (⏬)')
			.addToggle(toggle => toggle
				.setValue(priorityLowest)
				.onChange(value => {
					priorityLowest = value;
				})
			);
			
		new Setting(contentEl)
			.setName('Low Priority (🔽)')
			.addToggle(toggle => toggle
				.setValue(priorityLow)
				.onChange(value => {
					priorityLow = value;
				})
			);
			
		new Setting(contentEl)
			.setName('Normal Priority')
			.addToggle(toggle => toggle
				.setValue(priorityNormal)
				.onChange(value => {
					priorityNormal = value;
				})
			);
			
		new Setting(contentEl)
			.setName('Medium Priority (🔼)')
			.addToggle(toggle => toggle
				.setValue(priorityMedium)
				.onChange(value => {
					priorityMedium = value;
				})
			);
			
		new Setting(contentEl)
			.setName('High Priority (⏫)')
			.addToggle(toggle => toggle
				.setValue(priorityHigh)
				.onChange(value => {
					priorityHigh = value;
				})
			);
			
		new Setting(contentEl)
			.setName('Highest Priority (🔺)')
			.addToggle(toggle => toggle
				.setValue(priorityHighest)
				.onChange(value => {
					priorityHighest = value;
				})
			);
		
		// Date attributes section
		contentEl.createEl('h4', {text: 'Date Attributes'});
		
		new Setting(contentEl)
			.setName('Recurring (🔁)')
			.addToggle(toggle => toggle
				.setValue(hasRecurring)
				.setTooltip('Filter for recurring tasks (🔁)')
				.onChange(value => {
					hasRecurring = value;
				})
			);
			
		new Setting(contentEl)
			.setName('Due Date (📅)')
			.addToggle(toggle => toggle
				.setValue(hasDueDate)
				.setTooltip('Filter for tasks with due dates (📅)')
				.onChange(value => {
					hasDueDate = value;
				})
			);
			
		new Setting(contentEl)
			.setName('Scheduled Date (⏳)')
			.addToggle(toggle => toggle
				.setValue(hasScheduledDate)
				.setTooltip('Filter for tasks with scheduled dates (⏳)')
				.onChange(value => {
					hasScheduledDate = value;
				})
			);
			
		new Setting(contentEl)
			.setName('Start Date (🛫)')
			.addToggle(toggle => toggle
				.setValue(hasStartDate)
				.setTooltip('Filter for tasks with start dates (🛫)')
				.onChange(value => {
					hasStartDate = value;
				})
			);
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}