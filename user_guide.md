# Update Dates Plugin - User Guide

This guide provides detailed instructions for using the Update Dates plugin for Obsidian.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Using the Action Window](#using-the-action-window)
3. [Configuration Options](#configuration-options)
4. [Step-by-Step Workflows](#step-by-step-workflows)
5. [Tips & Tricks](#tips--tricks)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

1. Open Obsidian and go to Settings
2. Navigate to "Community plugins" and disable "Safe mode"
3. Click "Browse" and search for "Update Dates"
4. Click "Install" and then "Enable"
5. You should now see a calendar icon in the left ribbon

### Initial Setup

1. Click the gear icon in the left ribbon to open Settings
2. Navigate to "Update Dates" in the "Plugin options" section
3. Configure your default task folder (e.g., "tasks" or "Daily Notes")
4. Set up any default filters or excluded folders you want to use regularly
5. Click the X to close settings

## Using the Action Window

### Opening the Action Window

- Click the calendar icon in the left ribbon, or
- Use the command palette (Ctrl/Cmd+P) and search for any of the Update Dates commands

### Available Actions

The Action window provides three main operations at the top:

1. **Highlight past dates**
   - Scans for tasks with dates in the past
   - Adds highlight formatting (`==date==`) around past dates
   - Useful for quickly identifying tasks that need attention

2. **Unhighlight past dates**
   - Removes highlighting from dates
   - Useful after reviewing tasks or after making changes

3. **Update past dates**
   - Changes past dates to the selected target date (defaults to today)
   - Helps reschedule overdue tasks quickly

### Settings Section

In the middle of the Action window, you can configure:

- **Target folder** - The folder containing tasks to process
- **Excluded folders** - Comma-separated list of folders to skip
- **Target date** - The date to use when updating tasks (defaults to today)
- **Date type** - Whether to process due dates, scheduled dates, or both

### Task Filtering Section

At the bottom of the Action window, you can filter which tasks will be processed:

- **Task Status** - Choose between unfinished tasks, completed tasks, or all tasks
- **Priority Filters** - Toggle which priority levels to include
- **Date Attributes** - Toggle which task attributes are required (recurring, due date, etc.)

## Configuration Options

### Plugin Settings

Access these by going to Settings → Community Plugins → Update Dates:

- **Task folder** - Default folder path for task operations
- **Default excluded folders** - Folders that should be skipped by default
- **Default date type** - Which type of dates to process by default
- **Default task status** - Which task status to filter by default
- **Default priority filters** - Which priority levels to include by default
- **Default date attributes** - Which task attributes to filter by default

### Command Palette Options

The plugin adds several commands to the palette (Ctrl/Cmd+P):

- **Highlight Past Dates** - Highlight dates in the current file
- **Unhighlight All Dates** - Remove highlighting in the current file
- **Update past dates to today** - Update past dates in current file to today
- **Update past dates to custom date** - Update past dates in current file to a chosen date
- **Update past dates in task-folder to custom date** - Update past dates in your task folder
- **Highlight past dates from custom date** - Highlight dates before a specific date

## Step-by-Step Workflows

### Basic Task Review

1. **Identify overdue tasks**
   - Click the calendar icon in the left ribbon
   - In the Actions section, click the "Execute" button next to "Highlight past dates"
   - Review your notes to see tasks with highlighted dates

2. **Handle overdue tasks**
   - For tasks you want to reschedule, click the calendar icon again
   - Click "Execute" next to "Update past dates"
   - All highlighted dates will be updated to today (or your selected date)

3. **Clean up highlights**
   - Click the calendar icon again
   - Click "Execute" next to "Unhighlight past dates"
   - All highlighting will be removed

### Advanced Filtering Workflow

1. **Set up filters**
   - Click the calendar icon to open the Action window
   - In the Task Filtering section:
     - Set Task Status (e.g., "Unfinished tasks")
     - Toggle on desired Priority Filters (e.g., High and Highest)
     - Toggle on required attributes (e.g., Due Date)

2. **Review filtered tasks**
   - Click "Execute" next to "Highlight past dates"
   - Only tasks matching your filters will be highlighted

3. **Update specific task types**
   - With the same filters still applied, click "Execute" next to "Update past dates"
   - Only the tasks matching your filters will be updated

### Processing Multiple Folders

1. **Set the target folder**
   - In the Action window, set the Target folder to a parent folder (e.g., "Projects")

2. **Exclude specific subfolders**
   - In the Excluded folders field, enter comma-separated subfolder names (e.g., "Archive,Templates")

3. **Process the folders**
   - Click "Execute" on your desired action
   - The plugin will process all files in the target folder except those in excluded folders

## Tips & Tricks

### Keyboard Shortcuts

You can assign keyboard shortcuts to any of the commands through Obsidian's Hotkeys settings:

1. Go to Settings → Hotkeys
2. Search for "Update Dates"
3. Click the + icon next to any command to assign a shortcut

### Combining with Tasks Plugin

When used with the Tasks Plugin, you can:

- Use Update Dates to reschedule overdue tasks
- Use Tasks queries to find tasks that need attention
- Combine both plugins for powerful task management

### Date Formats

- The plugin recognizes dates in YYYY-MM-DD format
- It supports both plain dates and dates with emoji prefixes (📅, ⏳, 🛫)
- It can handle Tasks Plugin's special formatting for recurring tasks (🔁)

### Bulk Operations

- To update many tasks at once, process an entire folder rather than individual files
- Use specific filters to target exactly the tasks you want to modify
- Save commonly used configurations in the plugin settings as defaults

## Troubleshooting

### Common Issues

- **No dates are being highlighted**
  - Check that your dates are in YYYY-MM-DD format
  - Verify that the dates are actually in the past
  - Ensure your task format matches what the plugin expects

- **Some tasks are being skipped**
  - Check your filter settings - you may have filters that exclude these tasks
  - Verify that excluded folders aren't catching more files than intended

- **Error processing folder**
  - Double-check that the folder path is correct
  - Ensure you have proper permissions to modify files in that folder

### Getting Help

- Check the plugin's GitHub page for known issues
- Submit bugs or feature requests on the GitHub repository
- Ask for help in the Obsidian community forums