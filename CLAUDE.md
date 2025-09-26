# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian plugin called "Update Dates" that helps manage and update dates in task lists within Obsidian. It's particularly useful for maintaining task lists with the Tasks community plugin.

## Development Commands

### Build and Development
- `npm run dev` - Run development build with file watching (uses esbuild)
- `npm run build` - Build for production (runs TypeScript type checking then esbuild)
- `npm run version` - Bump version and update manifest.json and versions.json

### Testing
- `npm test` - Run the comprehensive test suite using Jest
- `npm run test:watch` - Run tests in watch mode for development
- `npm run test:coverage` - Run tests with coverage reporting

### Type Checking
- `tsc -noEmit -skipLibCheck` - Run TypeScript type checking (part of build process)

## Architecture

### Core Files
- `main.ts` - Main plugin class (`UpdateDatesPlugin`) with core functionality
- `ActionSelectionModal.ts` - Modal UI for selecting and configuring actions
- `manifest.json` - Obsidian plugin manifest
- `package.json` - Node.js package configuration

### Key Components

#### UpdateDatesPlugin Class (main.ts)
- Main plugin entry point extending Obsidian's `Plugin` class
- Contains all date processing logic for highlighting, unhighlighting, and updating dates
- Manages settings and provides command palette commands
- Creates ribbon icon that opens the action selection modal

#### Core Methods
- `highlightPastDates()` - Highlights past dates in current file
- `highlightPastDatesInFolderWithExclusions()` - Advanced highlighting with filtering support
- `unhighlightDates()` - Removes highlighting from dates
- `updatePastDatesToToday()` - Updates past dates to today or specified date
- `updatePastDatesInFolderWithExclusions()` - Advanced updating with filtering support

#### ActionSelectionModal Class
- Provides comprehensive UI for selecting actions and configuring filters
- Supports folder selection, date type selection, task status filtering
- Includes priority-based filtering (⏬🔽🔼⏫🔺) and attribute filtering (🔁📅⏳🛫)
- Uses plugin default settings as initial values

#### Settings System
- `UpdateDatesSettings` interface defines all configurable options
- Includes default folder, excluded folders, date types, task status filters
- Supports priority and attribute filtering defaults
- Settings tab integrated into Obsidian's settings UI

### Date Processing Logic
- Uses regex patterns to match YYYY-MM-DD formatted dates
- Supports different date types: due dates (📅), scheduled dates (⏳), or both
- Task status filtering: unfinished `[ ]`, completed `[x]`, or all tasks
- Priority filtering with validation to prevent mutually exclusive combinations
- Attribute filtering for recurring (🔁), due (📅), scheduled (⏳), and start (🛫) date tasks
- Enhanced "both date types" mode processes all dates in each task line
- Date comparison logic supports updating today's dates to future dates

### Recent Improvements
- **Priority Filtering**: Changed from OR logic to AND logic for multiple priority selections, with validation to prevent impossible combinations (e.g., normal + emoji priorities)
- **Both Date Types Processing**: Enhanced to process all dates in each task line, not just the first one found
- **Date Comparison Logic**: Updated to allow updating today's dates to future dates using <= comparison instead of strict <
- **Comprehensive Testing**: Added full test suite with Jest framework covering all functionality and edge cases

## Development Notes

### File Structure
The plugin follows Obsidian's standard plugin structure with TypeScript source files compiled to main.js via esbuild.

### Testing Infrastructure
- **Automated Testing**: Comprehensive Jest test suite with TypeScript support
- **Test Coverage**: Tests for priority filtering, date type processing, date comparison logic, and integration scenarios
- **Performance Testing**: Validation of functionality with large files and complex filtering
- **Mock Framework**: Complete Obsidian API mocking for isolated unit testing
- **Custom Matchers**: Specialized assertions for date-related testing (`toContainDate`, `toHaveHighlightedDate`)

### Test Categories
1. **Priority Filtering Tests**: Validation of AND logic, mutually exclusive combinations, single priority selection
2. **Both Date Types Tests**: Multiple date processing, emoji preservation, performance with large files
3. **Date Comparison Tests**: Today-to-future updates, mixed temporal scenarios, backward compatibility
4. **Integration Tests**: Combined functionality, complex scenarios, regression prevention

### Manual Testing
When adding new features, also test manually with:
1. Various task formats and date combinations
2. Different folder structures and exclusion patterns
3. Priority and attribute filtering combinations

### Dependencies
- **Runtime**: Uses Obsidian API exclusively (no external runtime dependencies)
- **Development**: TypeScript, esbuild, ESLint, Jest (testing), ts-jest (TypeScript testing support)
- **Testing**: Jest framework with comprehensive mocking and custom matchers for date operations