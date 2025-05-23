# Update Dates Plugin - Technical Documentation

This document provides an in-depth explanation of the functions available in the Update Dates plugin.

## Core Functions

### Active File Operations

```typescript
/**
 * Highlights dates in the past for the currently active file
 * 
 * @param targetDate Optional date string in YYYY-MM-DD format. Dates before this will be highlighted. If not provided, today's date is used.
 */
async highlightPastDates(targetDate?: string)
```

```typescript
/**
 * Removes highlighting from dates in the currently active file
 */
async unhighlightDates()
```

```typescript
/**
 * Updates dates in the past to the specified date (or today) in the currently active file
 * 
 * @param targetDate Optional date string in YYYY-MM-DD format. Past dates will be changed to this date. If not provided, today's date is used.
 */
async updatePastDatesToToday(targetDate?: string)
```

### Folder Operations

```typescript
/**
 * Highlights dates in the past for all markdown files in the specified folder
 * 
 * @param folderPath Path to the folder containing markdown files
 * @param targetDate Optional date string in YYYY-MM-DD format. Dates before this will be highlighted. If not provided, today's date is used.
 */
async highlightPastDatesInFolder(folderPath: string, targetDate?: string)
```

```typescript
/**
 * Removes highlighting from dates in all markdown files in the specified folder
 * 
 * @param folderPath Path to the folder containing markdown files
 * @param targetDate Optional date string in YYYY-MM-DD format, not actually used but kept for API consistency
 */
async unhighlightPastDatesInFolder(folderPath: string, targetDate?: string)
```

```typescript
/**
 * Updates dates in the past to the specified date (or today) in all markdown files in the specified folder
 * 
 * @param folderPath Path to the folder containing markdown files
 * @param targetDate Optional date string in YYYY-MM-DD format. Past dates will be changed to this date. If not provided, today's date is used.
 */
async updatePastDatesInFolder(folderPath: string, targetDate?: string)
```

### Advanced Operations with Filtering

```typescript
/**
 * Highlights dates in the past for all markdown files in the specified folder, with exclusion and filtering options
 * 
 * @param folderPath Path to the folder containing markdown files
 * @param excludedFolders Array of folder paths to exclude from processing
 * @param targetDate Optional date string in YYYY-MM-DD format. Dates before this will be highlighted. If not provided, today's date is used.
 * @param dateType Which date type to process: 'due' for due dates (📅), 'scheduled' for scheduled dates (⏳), or 'both' for all dates
 * @param taskFilters Filters to apply to tasks:
 *   - status: 'unfinished', 'completed', or 'all'
 *   - priorities: Array of priority levels to include ('lowest', 'low', 'normal', 'medium', 'high', 'highest')
 *   - hasRecurring: Whether to only include recurring tasks (🔁)
 *   - hasDueDate: Whether to only include tasks with due dates (📅)
 *   - hasScheduledDate: Whether to only include tasks with scheduled dates (⏳)
 *   - hasStartDate: Whether to only include tasks with start dates (🛫)
 */
async highlightPastDatesInFolderWithExclusions(
    folderPath: string, 
    excludedFolders: string[] = [], 
    targetDate?: string, 
    dateType: string = 'both', 
    taskFilters?: {
        status?: string,
        priorities?: string[],
        hasRecurring?: boolean,
        hasDueDate?: boolean,
        hasScheduledDate?: boolean,
        hasStartDate?: boolean
    }
)
```

```typescript
/**
 * Removes highlighting from dates in all markdown files in the specified folder, with exclusion and filtering options
 * 
 * @param folderPath Path to the folder containing markdown files
 * @param excludedFolders Array of folder paths to exclude from processing
 * @param targetDate Optional date string in YYYY-MM-DD format, not actually used but kept for API consistency
 * @param dateType Which date type to process: 'due' for due dates (📅), 'scheduled' for scheduled dates (⏳), or 'both' for all dates
 */
async unhighlightPastDatesInFolderWithExclusions(
    folderPath: string, 
    excludedFolders: string[] = [], 
    targetDate?: string, 
    dateType: string = 'both'
)
```

```typescript
/**
 * Updates dates in the past to the specified date (or today) in all markdown files in the specified folder, with exclusion and filtering options
 * 
 * @param folderPath Path to the folder containing markdown files
 * @param excludedFolders Array of folder paths to exclude from processing
 * @param targetDate Optional date string in YYYY-MM-DD format. Past dates will be changed to this date. If not provided, today's date is used.
 * @param dateType Which date type to process: 'due' for due dates (📅), 'scheduled' for scheduled dates (⏳), or 'both' for all dates
 */
async updatePastDatesInFolderWithExclusions(
    folderPath: string, 
    excludedFolders: string[] = [], 
    targetDate?: string, 
    dateType: string = 'both'
)
```

## Plugin Settings

### UpdateDatesSettings Interface

```typescript
/**
 * Settings interface for the Update Dates plugin
 */
interface UpdateDatesSettings {
    /**
     * Path to the default task folder
     */
    taskFolder: string;

    /**
     * Comma-separated list of folders to exclude by default
     */
    defaultExcludedFolders: string;

    /**
     * Default date type to process: 'due', 'scheduled', or 'both'
     */
    defaultDateType: string;

    /**
     * Default task status filter: 'unfinished', 'completed', or 'all'
     */
    defaultTaskStatus: string;

    /**
     * Default priority filters
     */
    defaultPriorities: {
        lowest: boolean;
        low: boolean;
        normal: boolean;
        medium: boolean;
        high: boolean;
        highest: boolean;
    };

    /**
     * Default task attribute filters
     */
    defaultAttributes: {
        hasRecurring: boolean;
        hasDueDate: boolean;
        hasScheduledDate: boolean;
        hasStartDate: boolean;
    };
}
```

## Modal Windows

### DateSelectionModal

Dialog for selecting a custom date for operations.

### ActionSelectionModal

The main plugin dialog that presents all actions and filtering options.

## Regex Patterns Used

The plugin uses several regex patterns to match and update dates in tasks:

1. **Unfinished task with date**
   ```regex
   /- \[ \] .*?\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g
   ```

2. **Date format (YYYY-MM-DD)**
   ```regex
   /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g
   ```

3. **Highlighted date**
   ```regex
   /==\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b==/g
   ```

4. **Due date (with emoji)**
   ```regex
   /📅 \b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g
   ```

5. **Scheduled date (with emoji)**
   ```regex
   /⏳ \b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g
   ```

## Advanced Usage Examples

### Update All Tasks in a Vault with Multiple Exclusions

```javascript
await updateDatesPlugin.updatePastDatesInFolderWithExclusions(
  "/",                          // Process entire vault
  ["archive", "journal", "templates"],  // Exclude these folders
  "2023-11-15",                // Set dates to this value
  "both",                      // Process both due and scheduled dates
  {                            
    status: "unfinished",      // Only update unfinished tasks
    priorities: ["high", "highest"], // Only update high priority tasks
    hasRecurring: false,       // Don't require recurring flag
    hasDueDate: false,         // Don't require due date flag
    hasScheduledDate: false,   // Don't require scheduled date flag
    hasStartDate: false        // Don't require start date flag
  }
);
```

### Highlight Only Specific Types of Tasks

```javascript
await updateDatesPlugin.highlightPastDatesInFolderWithExclusions(
  "projects",                 // Process only the projects folder
  [],                         // No exclusions
  undefined,                  // Use today's date
  "due",                      // Only process due dates
  {                           
    status: "all",            // Process both completed and unfinished tasks
    priorities: ["normal"],   // Only process normal priority tasks
    hasRecurring: true,       // Only recurring tasks
    hasDueDate: true,         // Only tasks with due dates
    hasScheduledDate: false,  // Don't filter by scheduled date
    hasStartDate: false       // Don't filter by start date
  }
);
```