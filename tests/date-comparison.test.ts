import UpdateDatesPlugin from '../main';
import { MockApp, TFile, TFolder } from './__mocks__/obsidian';

describe('Date Comparison Logic (Issue #3)', () => {
  let plugin: UpdateDatesPlugin;
  let mockApp: MockApp;

  beforeEach(() => {
    mockApp = new MockApp();
    plugin = new UpdateDatesPlugin(mockApp as any, {} as any);
    plugin.settings = {
      taskFolder: 'test-folder',
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
        hasScheduledDate: false,
        hasStartDate: false
      }
    };
  });

  describe('Today to future date updates', () => {
    test('should update today\'s date to tomorrow (updatePastDatesToToday)', async () => {
      const testFile = new TFile('test.md');
      const today = '2020-01-15';
      const tomorrow = '2020-01-16';
      const testContent = `- [ ] Task from today 📅 ${today}`;

      mockApp.vault.setFileContent('test.md', testContent);
      jest.spyOn(mockApp.workspace, 'getActiveFile').mockReturnValue(testFile);

      await plugin.updatePastDatesToToday(tomorrow);

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContainDate(tomorrow);
      expect(finalContent).not.toContainDate(today);
    });

    test('should update today\'s date to future date (updatePastDatesInFolder)', async () => {
      const testFile = new TFile('test.md');
      const today = '2020-01-15';
      const futureDate = '2020-01-20';
      const testContent = `- [ ] Task from today 📅 ${today}`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolder('test-folder', futureDate);

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContainDate(futureDate);
      expect(finalContent).not.toContainDate(today);
    });

    test('should update today\'s date to future date (updatePastDatesInFolderWithExclusions)', async () => {
      const testFile = new TFile('test.md');
      const today = '2020-01-15';
      const futureDate = '2020-01-20';
      const testContent = `- [ ] Task from today 📅 ${today}`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        futureDate,
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContainDate(futureDate);
      expect(finalContent).not.toContainDate(today);
    });
  });

  describe('Mixed date scenarios', () => {
    test('should update past and current dates but not future dates', async () => {
      const testFile = new TFile('test.md');
      const targetDate = '2020-01-16';
      const testContent = `- [ ] Task from yesterday 📅 2020-01-14
- [ ] Task from today 📅 2020-01-15
- [ ] Task from tomorrow 📅 2020-01-16
- [ ] Task from next week 📅 2020-01-22`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        targetDate,
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');

      // Past and today should be updated
      expect(finalContent).toContainDate('2020-01-16'); // Should appear multiple times
      expect(finalContent).not.toContainDate('2020-01-14'); // Yesterday should be updated
      expect(finalContent).not.toContainDate('2020-01-15'); // Today should be updated

      // Future date should remain unchanged
      expect(finalContent).toContainDate('2020-01-22'); // Next week should not change

      // Verify the structure is preserved
      expect(finalContent).toContain('Task from yesterday');
      expect(finalContent).toContain('Task from today');
      expect(finalContent).toContain('Task from tomorrow');
      expect(finalContent).toContain('Task from next week');
    });

    test('should handle edge case where target date equals task date', async () => {
      const testFile = new TFile('test.md');
      const targetDate = '2020-01-15';
      const testContent = `- [ ] Task with same date 📅 ${targetDate}`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        targetDate,
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContainDate(targetDate);
      // Should still contain the date (no change needed, but operation should complete successfully)
    });
  });

  describe('Backward compatibility', () => {
    test('should still update past dates as expected', async () => {
      const testFile = new TFile('test.md');
      const targetDate = '2020-01-20';
      const testContent = `- [ ] Old task 📅 2020-01-10
- [ ] Another old task 📅 2020-01-05`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        targetDate,
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContainDate(targetDate);
      expect(finalContent).not.toContainDate('2020-01-10');
      expect(finalContent).not.toContainDate('2020-01-05');

      // Should contain exactly 2 instances of the new date
      const newDateMatches = (finalContent.match(/2020-01-20/g) || []).length;
      expect(newDateMatches).toBe(2);
    });

    test('should not update future dates to past or current dates', async () => {
      const testFile = new TFile('test.md');
      const targetDate = '2020-01-15'; // Earlier than the task date
      const testContent = `- [ ] Future task 📅 2020-01-25`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        targetDate,
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContainDate('2020-01-25'); // Future date should remain unchanged
      expect(finalContent).not.toContainDate(targetDate); // Should not contain target date
    });
  });

  describe('Complex date scenarios', () => {
    test('should handle multiple dates with mixed temporal relationships', async () => {
      const testFile = new TFile('test.md');
      const targetDate = '2020-01-16';
      const testContent = `- [ ] Task 1 📅 2020-01-10 ⏳ 2020-01-15 (past and today)
- [ ] Task 2 📅 2020-01-20 ⏳ 2020-01-25 (future dates)
- [ ] Task 3 📅 2020-01-14 ⏳ 2020-01-18 (past and future)`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        targetDate,
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');

      // Task 1: Both dates should be updated (both <= target)
      expect(finalContent).toContain(`📅 ${targetDate}`);
      expect(finalContent).toContain(`⏳ ${targetDate}`);
      expect(finalContent).not.toContainDate('2020-01-10');
      expect(finalContent).not.toContainDate('2020-01-15');

      // Task 2: Both dates should remain unchanged (both > target)
      expect(finalContent).toContainDate('2020-01-20');
      expect(finalContent).toContainDate('2020-01-25');

      // Task 3: Only past date should be updated, future date should remain
      expect(finalContent).toContainDate('2020-01-18'); // Future scheduled date unchanged
      expect(finalContent).not.toContainDate('2020-01-14'); // Past due date updated
    });

    test('should work correctly with emoji-prefixed dates', async () => {
      const testFile = new TFile('test.md');
      const targetDate = '2020-01-16';
      const testContent = `- [ ] Task with emoji dates 📅 2020-01-15 ⏳ 2020-01-15`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        targetDate,
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');

      // Both emoji-prefixed dates should be updated
      expect(finalContent).toContain(`📅 ${targetDate}`);
      expect(finalContent).toContain(`⏳ ${targetDate}`);
      expect(finalContent).not.toContainDate('2020-01-15');
    });
  });

  describe('Performance and edge cases', () => {
    test('should handle timezone differences gracefully', async () => {
      const testFile = new TFile('test.md');
      const targetDate = '2020-01-15';
      const testContent = `- [ ] Edge case task 📅 ${targetDate}`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Test with same date - should work due to <= comparison
      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        targetDate,
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContainDate(targetDate); // Should still contain the date
    });

    test('should maintain performance with large files', async () => {
      const testFile = new TFile('test.md');
      const targetDate = '2020-02-01';

      // Generate a large file with many dates
      let testContent = '';
      for (let i = 1; i <= 1000; i++) {
        const dateStr = `2020-01-${String(i % 28 + 1).padStart(2, '0')}`;
        testContent += `- [ ] Task ${i} 📅 ${dateStr}\n`;
      }

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      const startTime = Date.now();

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        targetDate,
        'both'
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Performance check: should complete within reasonable time (3 seconds)
      expect(duration).toBeLessThan(3000);

      const finalContent = mockApp.vault.getFileContent('test.md');

      // All dates should be updated to target date
      const targetDateMatches = (finalContent.match(/2020-02-01/g) || []).length;
      expect(targetDateMatches).toBe(1000); // All 1000 tasks should have the target date
    });
  });
});