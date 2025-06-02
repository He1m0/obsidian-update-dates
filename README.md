# Update Dates Plugin for Obsidian

## Introduction

This plugin provides tools to easily manage and update dates within task lists in [Obsidian](https://obsidian.md). It's particularly useful for maintaining task lists with the Tasks community plugin, allowing you to highlight, update, and manage dates in past tasks.

Key features:
- **Highlight past dates** - Visually highlight dates in the past
- **Update past dates** - Change past dates to today or any selected date
- **Filter tasks** - Process only specific tasks based on attributes
- **Multi-folder support** - Apply actions to entire folders with exclusion options

## Installation

1. Open Obsidian and go to Settings
2. Navigate to "Community plugins" and disable "Safe mode"
3. Click "Browse" and search for "Update Dates"
4. Install the plugin and enable it

## Usage

### Quick Start

1. Click the calendar icon in the left ribbon
2. Select an action (highlight, unhighlight, or update dates)
3. Choose your preferred settings
4. Click "Execute" on your selected action

### Main Actions

The plugin provides three main actions:

1. **Highlight past dates**
   - Adds highlighting (`==date==`) around dates in the past
   - Makes it easy to visually identify tasks with past dates

2. **Unhighlight past dates**
   - Removes highlighting from dates
   - Useful after reviewing highlighted tasks

3. **Update past dates**
   - Changes past dates to today's date or a selected date
   - Helps reschedule overdue tasks quickly

### Advanced Filtering

You can filter which tasks are processed based on:

- **Task status**
  - Unfinished tasks (default)
  - Completed tasks
  - All tasks

- **Priority levels**
  - Lowest (⏬)
  - Low (🔽)
  - Normal
  - Medium (🔼) 
  - High (⏫)
  - Highest (🔺)

- **Task attributes**
  - Recurring tasks (🔁)
  - Tasks with due dates (📅)
  - Tasks with scheduled dates (⏳)
  - Tasks with start dates (🛫)

### Date Type Selection

You can specify which types of dates to process:

- Both date types (default)
- Due dates only (📅)
- Scheduled dates only (⏳)

### Folder Settings

- **Target folder** - Path of the folder to process
- **Excluded folders** - Comma-separated list of folders to skip

### Commands

The plugin adds several commands that can be accessed via the command palette (Ctrl/Cmd+P):

- Highlight Past Dates
- Unhighlight All Dates
- Update past dates to today
- Update past dates to custom date
- Update past dates in task-folder to custom date
- Highlight past dates from custom date

### Settings

You can configure default settings for:

- Default task folder
- Default excluded folders
- Default date type to process
- Default task status filter
- Default priority filters
- Default attribute filters

## Programmatic API

You can also call the plugin functions from other plugins or scripts:

```javascript
// Get the plugin instance
const updateDatesPlugin = app.plugins.plugins["update-dates"];

// Highlight past dates in the active note
await updateDatesPlugin.highlightPastDates();

// Highlight past dates in a specific folder
await updateDatesPlugin.highlightPastDatesInFolder("tasks");

// Unhighlight dates in the active note
await updateDatesPlugin.unhighlightDates();

// Unhighlight dates in a specific folder
await updateDatesPlugin.unhighlightPastDatesInFolder("tasks");

// Update past dates to today in the active note
await updateDatesPlugin.updatePastDatesToToday();

// Update past dates in a specific folder
await updateDatesPlugin.updatePastDatesInFolder("tasks");

// Advanced highlighting with filters
await updateDatesPlugin.highlightPastDatesInFolderWithExclusions(
  "tasks",                // target folder
  ["archive", "drafts"],  // excluded folders
  "2023-11-01",          // target date (optional, defaults to today)
  "due",                 // date type: "due", "scheduled", or "both"
  {                      // filters (all optional)
    status: "unfinished",
    priorities: ["high", "highest"],
    hasRecurring: true,
    hasDueDate: true,
    hasScheduledDate: false,
    hasStartDate: false
  }
);
```

## Examples

### Basic Workflow

1. Open your tasks folder
2. Click the plugin icon in the left sidebar
3. Select "Highlight past dates" to see which tasks have past dates
4. Review your highlighted tasks and decide which ones to reschedule
5. Click the plugin icon again and select "Update past dates" to reschedule them to today
6. Or use "Unhighlight past dates" if you want to keep the original dates

### Selective Task Updates

1. Open the plugin modal
2. Select "Update past dates"
3. Configure filters to only update high-priority tasks with due dates
4. Click "Execute"

## Compatibility

- Works with standard Markdown task lists `- [ ] Task`
- Compatible with the [Tasks Plugin](https://github.com/obsidian-tasks-group/obsidian-tasks) date formats
- Supports priority formatting used by Tasks Plugin

## Troubleshooting

- **Date not updating?** Make sure it's in YYYY-MM-DD format and is a past date
- **Task not highlighted?** Check if it matches your selected filters
- **Folder not processing?** Verify the folder path is correct

## Known Issues
- Task Filtering does not work as expected when multiple date attributes are selected. This is due to the current implementation using OR logic instead of AND logic. A fix is in progress.
- Task Filtering currently tries to implement AND logic. Need to implement possibility to use OR logic as well.
- Updating and highlighting dates when "Date type: Both date types" only updates/highlights the first date found in the line. 
- Updating tasks with date set to today to another date in the future will not work (because comparison is still done to today?)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Todo
- [ ] Fix AND logic for task filtering
- [ ] Fix date type selection for highlighting and updating
- [ ] Add to switch between AND and OR logic for task filtering
- [ ] Fix updating todays date to a future date

## License

This project is licensed under the MIT License - see the LICENSE file for details.
