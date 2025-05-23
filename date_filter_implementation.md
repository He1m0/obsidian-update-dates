# Date Attribute Filtering - Implementation Guide

## Problem Statement
Currently, when multiple date attributes (like "Due Date" and "Scheduled Date") are selected in the filters, they behave as OR conditions, meaning a task with either one of these attributes will be processed. 

However, the requirement is:
1. If no attributes are selected, all tasks should be processed
2. If one attribute is selected (e.g., Scheduled Date only), only tasks with that specific attribute should be processed
3. If multiple attributes are selected (e.g., Scheduled Date AND Recurring), only tasks that have ALL selected attributes should be processed (AND logic)

## Solution

### Step 1: Find the Filter Code in Both Functions

Locate the following code sections in both the `highlightPastDatesInFolderWithExclusions` and `updatePastDatesInFolderWithExclusions` functions:

```typescript
// Check for recurring tasks
if (taskFilters.hasRecurring && !line.includes('🔁')) {
    return line;
}

// Check for due date
if (taskFilters.hasDueDate && !line.includes('📅')) {
    return line;
}

// Check for scheduled date
if (taskFilters.hasScheduledDate && !line.includes('⏳')) {
    return line;
}

// Check for start date
if (taskFilters.hasStartDate && !line.includes('🛫')) {
    return line;
}
```

### Step 2: Replace with AND Logic Implementation

Replace the above code with this new implementation:

```typescript
// Build a list of selected date attributes
const selectedAttributes = [];
if (taskFilters.hasRecurring) selectedAttributes.push('🔁');
if (taskFilters.hasDueDate) selectedAttributes.push('📅');
if (taskFilters.hasScheduledDate) selectedAttributes.push('⏳');
if (taskFilters.hasStartDate) selectedAttributes.push('🛫');

// If attributes are selected, apply AND logic
if (selectedAttributes.length > 0) {
    // Check that ALL selected attributes are present in the line
    const missingAttribute = selectedAttributes.some(emoji => !line.includes(emoji));
    if (missingAttribute) {
        return line; // Skip this task if any required attribute is missing
    }
}
```

### Step 3: Apply Changes to Both Functions

Make sure to apply this change in both:
1. `highlightPastDatesInFolderWithExclusions` function
2. `updatePastDatesInFolderWithExclusions` function

## Explanation

The key changes in this implementation:

1. We first collect all the selected date attributes in an array
2. If any attributes are selected (`selectedAttributes.length > 0`), we check if ALL of them are present in the task
3. The `some(emoji => !line.includes(emoji))` checks if ANY of the required emojis are missing
4. If any are missing (`missingAttribute` is true), we skip processing this task

This ensures:
- With no attributes selected: No filtering occurs, all tasks are processed
- With one attribute selected: Only tasks with that attribute are processed
- With multiple attributes selected: Only tasks with ALL selected attributes are processed

## Testing

After implementing these changes, test with:
1. No attributes selected - should process all tasks
2. Only "Scheduled Date" selected - should only process tasks with scheduled dates
3. Both "Scheduled Date" and "Recurring" selected - should only process tasks that have BOTH attributes