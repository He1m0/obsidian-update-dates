# Update Dates Plugin
## Introduction
This plugin is basically a collection of basic functions to improve the experience with the Tasks community plugin.
The idea was to implement a way to easily modify all dates of tasks that are unfinished and in the past.
## Usage
The plugin implements a ribbon element that enable highlighting, unhighlighting and updating the dates of past, unfinished tasks in your tasks folder.
You can change your tasks folder in the plugin settings.
Additionally you can use the functions implemented by the plugin yourself:
- highlightPastDates()
- highlightPastDatesInFolder(folderPath)
- unhighlightDates()
- unhighlightPastDatesInFolder(folderPath)
- updatePastDatesToToday()
- updatePastDatesInFolder(folderPath)

# Todo
- [ ] Instead of using the ribbon, add a window to select the action to perform.
- [ ] In the action window add a setting to select the folder to be used.
- [ ] In the action window add a setting to select folders that should be excluded.
- [ ] In the action window add a setting to select the date to which the dates should be updated.
- [ ] In the plugins setting add a setting to select folder that should be excluded by default.
- [ ] In the plugins setting add a setting to select a default folder to be used if no folder is selected in the action window.
- [ ] In the plugins setting add a setting to select a default date to be used if no date is selected in the action window.
