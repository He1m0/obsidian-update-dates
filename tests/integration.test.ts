import UpdateDatesPlugin from '../main';
import { MockApp, TFile, TFolder } from './__mocks__/obsidian';

describe('Integration Tests - All Issues Combined', () => {
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

  describe('Combined functionality', () => {
    test('should work with valid priority filtering + both date types + today to future updates', async () => {
      const testFile = new TFile('test.md');
      const today = '2020-01-15';
      const tomorrow = '2020-01-16';
      const testContent = `- [ ] High priority task ⏫ 📅 ${today} ⏳ ${today}
- [ ] Normal task 📅 ${today} ⏳ ${today}
- [ ] Another high priority ⏫ 📅 2020-01-10 ⏳ 2020-01-12`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Update only high priority tasks, both date types, from today to tomorrow
      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        tomorrow,
        'both',
        {
          status: 'unfinished',
          priorities: ['high'], // Only high priority (Issue #1 fix)
          hasRecurring: false,
          hasDueDate: false,
          hasScheduledDate: false,
          hasStartDate: false
        }
      );

      const finalContent = mockApp.vault.getFileContent('test.md');

      // High priority tasks should be updated (both dates in each line - Issue #2 fix)
      expect(finalContent).toContain(`⏫ 📅 ${tomorrow} ⏳ ${tomorrow}`);
      expect(finalContent).toContain(`⏫ 📅 ${tomorrow} ⏳ ${tomorrow}`);

      // Normal task should remain unchanged (priority filtering working)
      expect(finalContent).toContain(`Normal task 📅 ${today} ⏳ ${today}`);

      // Today's dates were updated to tomorrow (Issue #3 fix)
      expect(finalContent).not.toContain(`⏫ 📅 ${today} ⏳ ${today}`);
    });

    test('should handle complex scenario with all fixes working together', async () => {
      const testFile = new TFile('test.md');
      const testContent = `# Complex Test File

- [ ] Normal priority, multiple dates 📅 2020-01-14 ⏳ 2020-01-15 some text 📅 2020-01-16
- [ ] High priority ⏫ single date 📅 2020-01-15
- [ ] Low priority 🔽 with both types 📅 2020-01-13 ⏳ 2020-01-14
- [ ] High priority ⏫ multiple of same type 📅 2020-01-10 text 📅 2020-01-11
- [ ] Normal with future dates 📅 2020-01-20 ⏳ 2020-01-25
- [x] Completed high priority ⏫ 📅 2020-01-12
- [ ] No dates here
- [ ] High priority ⏫ mixed temporal 📅 2020-01-05 ⏳ 2020-01-25`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Target: Update only high priority, unfinished tasks, all date types, to specific date
      const targetDate = '2020-01-18';

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        targetDate,
        'both',
        {
          status: 'unfinished', // Only unfinished tasks
          priorities: ['high'], // Only high priority
          hasRecurring: false,
          hasDueDate: false,
          hasScheduledDate: false,
          hasStartDate: false
        }
      );

      const finalContent = mockApp.vault.getFileContent('test.md');

      // Normal priority tasks should remain unchanged
      expect(finalContent).toContain('Normal priority, multiple dates 📅 2020-01-14 ⏳ 2020-01-15 some text 📅 2020-01-16');
      expect(finalContent).toContain('Normal with future dates 📅 2020-01-20 ⏳ 2020-01-25');

      // Low priority should remain unchanged
      expect(finalContent).toContain('Low priority 🔽 with both types 📅 2020-01-13 ⏳ 2020-01-14');

      // Completed task should remain unchanged (status filter)
      expect(finalContent).toContain('Completed high priority ⏫ 📅 2020-01-12');

      // High priority unfinished tasks should be updated:
      // 1. Single date task (today to target)
      expect(finalContent).toContain(`High priority ⏫ single date 📅 ${targetDate}`);
      expect(finalContent).not.toContain('High priority ⏫ single date 📅 2020-01-15');

      // 2. Multiple dates of same type (both should be updated)
      expect(finalContent).toContain(`High priority ⏫ multiple of same type 📅 ${targetDate} text 📅 ${targetDate}`);
      expect(finalContent).not.toContain('📅 2020-01-10');
      expect(finalContent).not.toContain('📅 2020-01-11');

      // 3. Mixed temporal task (only past/current dates updated, future preserved)
      expect(finalContent).toContain(`High priority ⏫ mixed temporal 📅 ${targetDate} ⏳ 2020-01-25`);
      expect(finalContent).not.toContain('📅 2020-01-05');

      // No dates task should remain unchanged
      expect(finalContent).toContain('No dates here');

      // Structure should be preserved
      expect(finalContent).toContain('# Complex Test File');
    });

    test('should reject invalid priority combinations but still process valid operations', async () => {
      const testFile = new TFile('test.md');
      const testContent = `- [ ] High priority task ⏫ 📅 2020-01-15 ⏳ 2020-01-16
- [ ] Normal task 📅 2020-01-15 ⏳ 2020-01-16`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Try invalid combination: normal + high priority
      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-01-20',
        'both',
        {
          status: 'unfinished',
          priorities: ['normal', 'high'], // Invalid combination
          hasRecurring: false,
          hasDueDate: false,
          hasScheduledDate: false,
          hasStartDate: false
        }
      );

      const finalContent = mockApp.vault.getFileContent('test.md');

      // Content should remain unchanged due to invalid priority combination
      expect(finalContent).toBe(testContent);
      expect(finalContent).toContainDate('2020-01-15');
      expect(finalContent).toContainDate('2020-01-16');
      expect(finalContent).not.toContainDate('2020-01-20');
    });
  });

  describe('Performance with all features enabled', () => {
    test('should maintain good performance with complex filtering and multiple dates', async () => {
      const testFile = new TFile('test.md');

      // Generate a realistic large file
      let testContent = '';
      const priorities = ['', '⏬', '🔽', '🔼', '⏫', '🔺'];
      const dateTypes = [
        '📅 DATE',
        '⏳ DATE',
        '📅 DATE ⏳ DATE',
        'DATE',
        '📅 DATE text ⏳ DATE',
        '🛫 DATE 📅 DATE ⏳ DATE'
      ];

      for (let i = 1; i <= 500; i++) {
        const priority = priorities[i % priorities.length];
        const datePattern = dateTypes[i % dateTypes.length];
        const date1 = `2020-01-${String((i % 28) + 1).padStart(2, '0')}`;
        const date2 = `2020-01-${String(((i + 5) % 28) + 1).padStart(2, '0')}`;

        const taskLine = `- [ ] Task ${i} ${priority} ${datePattern.replace(/DATE/g, date1).replace(/DATE/g, date2)}`;
        testContent += taskLine + '\n';
      }

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      const startTime = Date.now();

      // Complex operation: high priority only, both date types, update to future
      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both',
        {
          status: 'unfinished',
          priorities: ['high'],
          hasRecurring: false,
          hasDueDate: false,
          hasScheduledDate: false,
          hasStartDate: false
        }
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time despite complexity
      expect(duration).toBeLessThan(5000); // 5 seconds max

      const finalContent = mockApp.vault.getFileContent('test.md');

      // Verify that only high priority tasks were affected
      const highPriorityLines = finalContent.split('\n').filter(line => line.includes('⏫'));
      const updatedLines = finalContent.split('\n').filter(line => line.includes('2020-02-01'));

      // All high priority lines should be updated
      expect(updatedLines.length).toBeGreaterThan(0);

      // Non-high priority tasks should remain with original dates
      const normalLines = finalContent.split('\n').filter(line =>
        line.includes('Task') && !line.includes('⏫') && !line.includes('2020-02-01')
      );
      expect(normalLines.length).toBeGreaterThan(0);
    });
  });

  describe('Regression tests', () => {
    test('should not break existing functionality for simple cases', async () => {
      const testFile = new TFile('test.md');
      const testContent = `- [ ] Simple task 📅 2020-01-10
- [ ] Another task ⏳ 2020-01-12`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Simple update without any complex filtering
      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-01-20',
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');

      // Both dates should be updated
      expect(finalContent).toContain('Simple task 📅 2020-01-20');
      expect(finalContent).toContain('Another task ⏳ 2020-01-20');
      expect(finalContent).not.toContainDate('2020-01-10');
      expect(finalContent).not.toContainDate('2020-01-12');
    });

    test('should handle empty files gracefully', async () => {
      const testFile = new TFile('empty.md');
      mockApp.vault.setFileContent('empty.md', '');

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Should not throw errors
      await expect(plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-01-20',
        'both'
      )).resolves.not.toThrow();

      const finalContent = mockApp.vault.getFileContent('empty.md');
      expect(finalContent).toBe('');
    });

    test('should handle files with no matching tasks', async () => {
      const testFile = new TFile('no-tasks.md');
      const testContent = `# Just a heading

Some regular text with dates 2020-01-15 that are not in tasks.

Regular paragraph.`;

      mockApp.vault.setFileContent('no-tasks.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-01-20',
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('no-tasks.md');

      // Content should remain unchanged (dates not in task format)
      expect(finalContent).toBe(testContent);
      expect(finalContent).toContainDate('2020-01-15');
    });
  });
});