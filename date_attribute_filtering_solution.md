# Date Attribute Filtering Solution

To fix the date attribute filtering as required, here's the code that should be used to replace the current filtering logic in both `highlightPastDatesInFolderWithExclusions` and `updatePastDatesInFolderWithExclusions` methods:

```typescript
// Replace the current date attribute filtering section:

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

// With this new implementation:

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

This solution implements the requirements:

1. If no attributes are selected (`selectedAttributes.length === 0`), no filtering is applied and all tasks are processed
2. If one attribute is selected (e.g., only Scheduled Date), only tasks with that attribute are processed
3. If multiple attributes are selected (e.g., scheduled date AND recurring), only tasks that have ALL selected attributes are processed

This ensures:
- When no attribute filters are selected, all tasks are affected
- When only Scheduled Date is selected, only tasks with scheduled dates are affected
- When both scheduled date and recurring are selected, only tasks that have BOTH attributes are affected

Apply this change to both the highlight and update methods for consistent behavior.