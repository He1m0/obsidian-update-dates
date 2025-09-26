import UpdateDatesPlugin from '../main';
import { MockApp, TFile, TFolder } from './__mocks__/obsidian';

describe('Priority Filtering Logic (Issue #1)', () => {
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

  describe('Priority validation', () => {
    test('should prevent mutually exclusive priority combinations (normal + emoji)', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Normal task 📅 2020-01-01\n- [ ] High priority task ⏫ 📅 2020-01-02';

      mockApp.vault.setFileContent('test.md', testContent);

      // Mock the folder structure
      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Try to filter with both normal and high priority (should be prevented)
      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both',
        {
          status: 'unfinished',
          priorities: ['normal', 'high'], // This combination should be prevented
          hasRecurring: false,
          hasDueDate: false,
          hasScheduledDate: false,
          hasStartDate: false
        }
      );

      // Content should remain unchanged due to invalid combination
      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toBe(testContent);
      expect(finalContent).not.toHaveHighlightedDate('2020-01-01');
      expect(finalContent).not.toHaveHighlightedDate('2020-01-02');
    });

    test('should prevent multiple emoji priorities', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] High priority task ⏫ 📅 2020-01-01\n- [ ] Low priority task 🔽 📅 2020-01-02';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Try to filter with multiple emoji priorities (should be prevented)
      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both',
        {
          status: 'unfinished',
          priorities: ['high', 'low'], // This combination should be prevented
          hasRecurring: false,
          hasDueDate: false,
          hasScheduledDate: false,
          hasStartDate: false
        }
      );

      // Content should remain unchanged due to invalid combination
      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toBe(testContent);
      expect(finalContent).not.toHaveHighlightedDate('2020-01-01');
      expect(finalContent).not.toHaveHighlightedDate('2020-01-02');
    });
  });

  describe('Single priority selection (should work as before)', () => {
    test('should process normal priority tasks only', async () => {
      const testFile = new TFile('test.md');
      const testContent =
        '- [ ] Normal task 📅 2020-01-01\n' +
        '- [ ] High priority task ⏫ 📅 2020-01-02\n' +
        '- [ ] Another normal task 📅 2020-01-03';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both',
        {
          status: 'unfinished',
          priorities: ['normal'],
          hasRecurring: false,
          hasDueDate: false,
          hasScheduledDate: false,
          hasStartDate: false
        }
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toHaveHighlightedDate('2020-01-01');
      expect(finalContent).not.toHaveHighlightedDate('2020-01-02'); // High priority should not be highlighted
      expect(finalContent).toHaveHighlightedDate('2020-01-03');
    });

    test('should process high priority tasks only', async () => {
      const testFile = new TFile('test.md');
      const testContent =
        '- [ ] Normal task 📅 2020-01-01\n' +
        '- [ ] High priority task ⏫ 📅 2020-01-02\n' +
        '- [ ] Low priority task 🔽 📅 2020-01-03';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
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

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).not.toHaveHighlightedDate('2020-01-01'); // Normal should not be highlighted
      expect(finalContent).toHaveHighlightedDate('2020-01-02');
      expect(finalContent).not.toHaveHighlightedDate('2020-01-03'); // Low priority should not be highlighted
    });
  });

  describe('No priority filters (should process all tasks)', () => {
    test('should process all tasks when no priority filters are specified', async () => {
      const testFile = new TFile('test.md');
      const testContent =
        '- [ ] Normal task 📅 2020-01-01\n' +
        '- [ ] High priority task ⏫ 📅 2020-01-02\n' +
        '- [ ] Low priority task 🔽 📅 2020-01-03';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both',
        {
          status: 'unfinished',
          priorities: [], // No priority filters
          hasRecurring: false,
          hasDueDate: false,
          hasScheduledDate: false,
          hasStartDate: false
        }
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toHaveHighlightedDate('2020-01-01');
      expect(finalContent).toHaveHighlightedDate('2020-01-02');
      expect(finalContent).toHaveHighlightedDate('2020-01-03');
    });
  });

  describe('Date update operations', () => {
    test('should apply priority validation to date updates as well', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] High priority task ⏫ 📅 2020-01-01\n- [ ] Low priority task 🔽 📅 2020-01-02';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Try to update with invalid priority combination
      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both',
        {
          status: 'unfinished',
          priorities: ['high', 'low'], // Invalid combination
          hasRecurring: false,
          hasDueDate: false,
          hasScheduledDate: false,
          hasStartDate: false
        }
      );

      // Content should remain unchanged
      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toBe(testContent);
      expect(finalContent).toContainDate('2020-01-01');
      expect(finalContent).toContainDate('2020-01-02');
    });

    test('should successfully update dates for valid single priority selection', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] High priority task ⏫ 📅 2020-01-01\n- [ ] Normal task 📅 2020-01-02';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      // Update only high priority tasks
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

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContainDate('2020-02-01'); // High priority task should be updated
      expect(finalContent).toContainDate('2020-01-02'); // Normal task should remain unchanged
      expect(finalContent).not.toContainDate('2020-01-01'); // Original high priority date should be gone
    });
  });
});