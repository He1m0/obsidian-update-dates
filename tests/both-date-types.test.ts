import UpdateDatesPlugin from '../main';
import { MockApp, TFile, TFolder } from './__mocks__/obsidian';

describe('Both Date Types Processing (Issue #2)', () => {
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

  describe('Multiple dates in single task line', () => {
    test('should process both due date and scheduled date in the same line', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Complete project 📅 2020-01-15 ⏳ 2020-01-20';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toHaveHighlightedDate('2020-01-15');
      expect(finalContent).toHaveHighlightedDate('2020-01-20');
    });

    test('should process multiple dates of the same type', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Task with multiple due dates 📅 2020-01-10 some text 📅 2020-01-25';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toHaveHighlightedDate('2020-01-10');
      expect(finalContent).toHaveHighlightedDate('2020-01-25');
    });

    test('should process mixed emoji and plain dates', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Mixed dates ⏳ 2020-01-12 and also 2020-01-18';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toHaveHighlightedDate('2020-01-12');
      expect(finalContent).toHaveHighlightedDate('2020-01-18');
    });
  });

  describe('Date updates with multiple dates', () => {
    test('should update all dates in a task line when using "both" mode', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Task with multiple dates 📅 2020-01-15 ⏳ 2020-01-20';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContainDate('2020-02-01');
      expect(finalContent).not.toContainDate('2020-01-15');
      expect(finalContent).not.toContainDate('2020-01-20');

      // Should contain exactly 2 instances of the new date (both dates updated)
      const newDateMatches = (finalContent.match(/2020-02-01/g) || []).length;
      expect(newDateMatches).toBe(2);
    });

    test('should preserve emoji prefixes when updating dates', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Task 📅 2020-01-15 ⏳ 2020-01-20';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.updatePastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toContain('📅 2020-02-01');
      expect(finalContent).toContain('⏳ 2020-02-01');
    });
  });

  describe('Comparison with single date type modes', () => {
    test('should only process due dates when dateType is "due"', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Task with both dates 📅 2020-01-15 ⏳ 2020-01-20';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'due' // Only due dates
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toHaveHighlightedDate('2020-01-15'); // Due date should be highlighted
      expect(finalContent).not.toHaveHighlightedDate('2020-01-20'); // Scheduled date should not be highlighted
    });

    test('should only process scheduled dates when dateType is "scheduled"', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Task with both dates 📅 2020-01-15 ⏳ 2020-01-20';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'scheduled' // Only scheduled dates
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).not.toHaveHighlightedDate('2020-01-15'); // Due date should not be highlighted
      expect(finalContent).toHaveHighlightedDate('2020-01-20'); // Scheduled date should be highlighted
    });

    test('should process both types when dateType is "both"', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Task with both dates 📅 2020-01-15 ⏳ 2020-01-20';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both' // Both date types
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).toHaveHighlightedDate('2020-01-15'); // Due date should be highlighted
      expect(finalContent).toHaveHighlightedDate('2020-01-20'); // Scheduled date should be highlighted
    });
  });

  describe('Complex scenarios', () => {
    test('should handle tasks with multiple lines and different date patterns', async () => {
      const testFile = new TFile('test.md');
      const testContent = `- [ ] Task 1 📅 2020-01-15 ⏳ 2020-01-20
- [ ] Task 2 📅 2020-01-10 some text 📅 2020-01-25
- [ ] Task 3 ⏳ 2020-01-12 and also 2020-01-18
- [ ] Task 4 with no dates
- [ ] Task 5 📅 2025-01-01 (future date)`;

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');

      // Task 1: Both dates should be highlighted
      expect(finalContent).toHaveHighlightedDate('2020-01-15');
      expect(finalContent).toHaveHighlightedDate('2020-01-20');

      // Task 2: Both dates should be highlighted
      expect(finalContent).toHaveHighlightedDate('2020-01-10');
      expect(finalContent).toHaveHighlightedDate('2020-01-25');

      // Task 3: Both dates should be highlighted
      expect(finalContent).toHaveHighlightedDate('2020-01-12');
      expect(finalContent).toHaveHighlightedDate('2020-01-18');

      // Task 5: Future date should not be highlighted
      expect(finalContent).not.toHaveHighlightedDate('2025-01-01');
    });

    test('should preserve performance with large files containing many multi-date tasks', async () => {
      const testFile = new TFile('test.md');

      // Generate a large file with many multi-date tasks
      let testContent = '';
      for (let i = 1; i <= 100; i++) {
        testContent += `- [ ] Task ${i} 📅 2020-01-${String(i % 28 + 1).padStart(2, '0')} ⏳ 2020-01-${String((i % 28 + 1) + 1).padStart(2, '0')}\n`;
      }

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      const startTime = Date.now();

      await plugin.highlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        '2020-02-01',
        'both'
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Performance check: should complete within reasonable time (2 seconds)
      expect(duration).toBeLessThan(2000);

      const finalContent = mockApp.vault.getFileContent('test.md');

      // Verify that all dates were processed (should have many highlighted dates)
      const highlightMatches = (finalContent.match(/==/g) || []).length;
      expect(highlightMatches).toBeGreaterThan(100); // Should have many highlighted dates
    });
  });

  describe('Unhighlighting operations', () => {
    test('should remove highlights from all dates when using "both" mode', async () => {
      const testFile = new TFile('test.md');
      const testContent = '- [ ] Task ==📅== ==2020-01-15== ==⏳== ==2020-01-20==';

      mockApp.vault.setFileContent('test.md', testContent);

      const mockFolder = new TFolder('test-folder', [testFile]);
      jest.spyOn(mockApp.vault, 'getAbstractFileByPath').mockReturnValue(mockFolder);

      await plugin.unhighlightPastDatesInFolderWithExclusions(
        'test-folder',
        [],
        undefined,
        'both'
      );

      const finalContent = mockApp.vault.getFileContent('test.md');
      expect(finalContent).not.toContain('==');
      expect(finalContent).toContain('📅 2020-01-15');
      expect(finalContent).toContain('⏳ 2020-01-20');
    });
  });
});