# Update Dates Plugin Test Files

This directory contains files to test the functionality of the Update Dates plugin.

## Test Files

1. **test_tasks.md** - Main test file with a comprehensive set of task types
2. **subfolder/test_tasks_subfolder.md** - Test file in a subfolder for testing folder operations

## How to Use These Test Files

1. **Setup**:
   - Copy these files to your Obsidian vault
   - Set up the Update Dates plugin with the folder containing these files as your task folder

2. **Testing Basic Functionality**:
   - Use the "Highlight past dates" action to see which dates are in the past
   - Use the "Update past dates" action to move past dates to today
   - Use the "Unhighlight past dates" to remove highlighting

3. **Testing Filtering**:
   - Try different combinations of priority filters
   - Test filtering by task attributes (recurring, due date, scheduled date, start date)
   - Test filtering by task status (unfinished, completed, all)

4. **Testing Folder Exclusion**:
   - Add "subfolder" to the excluded folders and verify that tasks in the subfolder remain unchanged
   - Remove the exclusion and verify that the subfolder tasks are now affected

5. **Testing Date Type Selection**:
   - Use the "Due dates (📅)" option to only affect due dates
   - Use the "Scheduled dates (⏳)" option to only affect scheduled dates
   - Use "Both date types" to affect all dates

## Expected Results

- Only tasks with dates in the past should be highlighted or updated
- Only tasks matching the selected filters should be affected
- Tasks in excluded folders should remain unchanged
- Only the selected date types should be affected

## Tips

- Before each test, you may want to revert to the original file state
- For testing with current dates, update the "current date" tasks to today's date before testing