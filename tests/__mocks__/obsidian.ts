// Mock implementation of Obsidian API for testing
export class Plugin {
  app: any;
  settings: any;

  constructor() {
    this.app = new MockApp();
    this.settings = {};
  }

  async loadData() {
    return {};
  }

  async saveData(data: any) {
    this.settings = data;
  }

  addCommand(command: any) {
    // Mock implementation
  }

  addRibbonIcon(icon: string, title: string, callback: Function) {
    return { addClass: () => {} };
  }

  addSettingTab(tab: any) {
    // Mock implementation
  }

  registerDomEvent(element: any, event: string, callback: Function) {
    // Mock implementation
  }

  registerInterval(interval: any) {
    // Mock implementation
  }
}

export class Modal {
  app: any;
  contentEl: any;

  constructor(app: any) {
    this.app = app;
    this.contentEl = new MockElement();
  }

  open() {}
  close() {}
  onOpen() {}
  onClose() {}
}

export class Setting {
  constructor(containerEl: any) {}
  setName(name: string) { return this; }
  setDesc(desc: string) { return this; }
  addText(callback: Function) { return this; }
  addButton(callback: Function) { return this; }
  addDropdown(callback: Function) { return this; }
  addToggle(callback: Function) { return this; }
}

export class PluginSettingTab {
  app: any;
  plugin: any;

  constructor(app: any, plugin: any) {
    this.app = app;
    this.plugin = plugin;
  }

  display() {}
}

export class TFile {
  path: string;
  extension: string;
  name: string;

  constructor(path: string) {
    this.path = path;
    this.extension = path.split('.').pop() || '';
    this.name = path.split('/').pop() || '';
  }
}

export class TFolder {
  path: string;
  name: string;
  children: (TFile | TFolder)[];

  constructor(path: string, children: (TFile | TFolder)[] = []) {
    this.path = path;
    this.name = path.split('/').pop() || '';
    this.children = children;
  }
}

export class MockApp {
  vault: MockVault;
  workspace: MockWorkspace;

  constructor() {
    this.vault = new MockVault();
    this.workspace = new MockWorkspace();
  }
}

export class MockVault {
  private files: Map<string, string> = new Map();

  async read(file: TFile): Promise<string> {
    return this.files.get(file.path) || '';
  }

  async modify(file: TFile, content: string): Promise<void> {
    this.files.set(file.path, content);
  }

  getAbstractFileByPath(path: string): TFile | TFolder | null {
    // Mock implementation - return appropriate file/folder
    if (path.endsWith('.md')) {
      return new TFile(path);
    }
    return new TFolder(path);
  }

  // Helper method for testing
  setFileContent(path: string, content: string) {
    this.files.set(path, content);
  }

  getFileContent(path: string): string {
    return this.files.get(path) || '';
  }
}

export class MockWorkspace {
  getActiveFile(): TFile | null {
    return new TFile('test.md');
  }
}

export class MockElement {
  textContent: string = '';

  createEl(tag: string, options?: any) {
    return new MockElement();
  }

  setText(text: string) {
    this.textContent = text;
  }

  empty() {
    this.textContent = '';
  }

  addClass(className: string) {}

  querySelectorAll(selector: string) {
    return [];
  }
}

export class Notice {
  constructor(message: string, timeout?: number) {}
}

export interface TAbstractFile {
  path: string;
  name: string;
}