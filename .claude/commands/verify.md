# GitHub Issue Implementation Verification & Testing

  You are an expert software engineer tasked with thoroughly verifying the implementation of a GitHub issue. Your goal is to ensure
   the feature is fully implemented, properly tested, and production-ready.

  ## Issue to Verify: #{ISSUE_NUMBER}
  If no number is provided, use the current issue context.

  ### Step 1: Requirements Analysis
  1. **Read the Original Issue**:
     - Carefully review the GitHub issue description, acceptance criteria, and all comments
     - Extract ALL requirements, both explicit and implicit
     - Note any technical constraints or edge cases mentioned

  2. **Implementation Assessment**:
     - Locate all code changes related to this issue
     - Verify each acceptance criterion has been addressed
     - Check if any requirements were missed or partially implemented
     - Identify any deviations from the original requirements

  3. **Create Requirements Checklist**:
     ```markdown
     ## Requirements Verification for Issue #{ISSUE_NUMBER}

     ### Acceptance Criteria:
     - [ ] Requirement 1: [Description] - Status: [✅ Complete / ⚠️ Partial / ❌ Missing]
     - [ ] Requirement 2: [Description] - Status: [✅ Complete / ⚠️ Partial / ❌ Missing]

     ### Technical Requirements:
     - [ ] Performance requirements met
     - [ ] Security considerations addressed
     - [ ] Accessibility requirements fulfilled
     - [ ] Browser compatibility ensured

     ### TBD Compliance (for new features):
     - [ ] New features protected by feature flags
     - [ ] Feature flags accessible at `/admin/feature-flags`
     - [ ] Feature flags follow naming convention: `[AREA]_[FEATURE]_[DESCRIPTION]`
     - [ ] Features deployed in disabled state by default
     - [ ] Toggle functionality working correctly

     ### Code Quality:
     - [ ] Follows project coding standards
     - [ ] Proper error handling implemented
     - [ ] Documentation updated

  Step 2: Test Coverage Analysis

  1. Find All Tests:
    - Locate unit tests, integration tests, and E2E tests related to this feature
    - Check if tests cover all code paths and edge cases
    - Verify test quality (no mocks of tested functionality, meaningful assertions)
  2. Test Execution:
    - Run all tests related to this feature
    - Verify they pass without any shortcuts or mocks of core functionality
    - Check for test flakiness or intermittent failures
  3. Test Coverage Report:
  ## Test Coverage Analysis for Issue #{ISSUE_NUMBER}

  ### Test Files Found:
  - `path/to/test1.test.ts` - [Unit/Integration/E2E] - Status: [✅ Pass / ❌ Fail]
  - `path/to/test2.test.ts` - [Unit/Integration/E2E] - Status: [✅ Pass / ❌ Fail]

  ### Coverage Assessment:
  - [ ] All acceptance criteria covered by tests
  - [ ] Edge cases tested
  - [ ] Error scenarios tested
  - [ ] Performance/load testing (if applicable)

  ### Test Quality:
  - [ ] No inappropriate mocking
  - [ ] Meaningful assertions
  - [ ] Tests fail when code is broken
  - [ ] Tests are maintainable and readable

  Step 3: End-to-End Testing with Puppeteer (use user admin pw admin as credentials - we have dev frontend container running on gsj.localhost)

  1. Manual E2E Testing:
    - Use Puppeteer MCP to test the complete user workflow
    - Test in desktop resolution (1200x800 minimum)
    - Navigate through all user interactions mentioned in the issue
    - Document each step with screenshots
  2. Authentication & Setup:
    - If authentication is required, use credentials: username=admin, password=admin
    - Set up any necessary test data or environment state
  3. Feature Flag Verification (for new features):
    - **CRITICAL**: Navigate to `/admin/feature-flags` and verify new feature flags exist
    - **Test Feature Toggle**: Verify features can be enabled/disabled through admin interface
    - **Test Feature Behavior**: Test both enabled and disabled states of new features
    - **Verify Default State**: Confirm new features are disabled by default
    - **Test Real-time Updates**: Verify toggling takes effect immediately
    - Take screenshots of feature flag interface and toggle functionality
  4. Comprehensive User Flow Testing:
    - Test happy path scenarios
    - Test error scenarios and edge cases
    - Test browser back/forward navigation
    - Test page refresh behavior
    - Test responsive behavior (if applicable)
  5. Problem Documentation:
    - Document every issue encountered (UI glitches, errors, unexpected behavior)
    - Take screenshots of problems
    - Note performance issues or slow loading
    - Record any console errors or warnings

  Step 4: Final Verification Report

  Create a comprehensive report in this format:

  # Implementation Verification Report: Issue #{ISSUE_NUMBER}

  ## Executive Summary
  - **Overall Status**: [✅ Complete / ⚠️ Needs Work / ❌ Major Issues]
  - **Implementation Quality**: [Excellent / Good / Needs Improvement / Poor]
  - **Test Coverage**: [Complete / Adequate / Insufficient / Missing]
  - **Production Readiness**: [✅ Ready / ⚠️ Minor Issues / ❌ Not Ready]

  ## Requirements Verification
  ### ✅ Fully Implemented
  - [List all completely implemented requirements]

  ### ⚠️ Partially Implemented
  - [List partially implemented requirements with gaps]

  ### ❌ Missing Implementation
  - [List any missing requirements]

  ## Test Analysis
  ### Test Coverage Summary
  - **Unit Tests**: X tests, Y% coverage
  - **Integration Tests**: X tests covering Y scenarios
  - **E2E Tests**: X tests covering Y user flows

  ### Test Execution Results
  - **All Tests Pass**: [Yes/No]
  - **Test Quality**: [Assessment of test quality]
  - **Critical Gaps**: [Any missing test coverage]

  ## E2E Testing Results
  ### Feature Flag Testing (for new features)
  1. **Feature Flag Visibility**: [Pass/Fail - flags appear in `/admin/feature-flags`]
  2. **Toggle Functionality**: [Pass/Fail - can enable/disable features]
  3. **Default State**: [Pass/Fail - features disabled by default]
  4. **Real-time Updates**: [Pass/Fail - changes take effect immediately]
  5. **Feature Behavior**: [Pass/Fail - both enabled/disabled states work correctly]

  ### User Flow Testing
  1. **Primary User Flow**: [Pass/Fail with details]
  2. **Edge Case Testing**: [Pass/Fail with details]
  3. **Error Handling**: [Pass/Fail with details]

  ### Issues Discovered
  #### Critical Issues (❌)
  - [Issue 1]: [Description, steps to reproduce, screenshot]
  - [Issue 2]: [Description, steps to reproduce, screenshot]

  #### Minor Issues (⚠️)
  - [Issue 1]: [Description, steps to reproduce, screenshot]

  #### UI/UX Issues (🎨)
  - [Issue 1]: [Description, screenshot]

  ### Performance Assessment
  - **Page Load Time**: [X seconds]
  - **Interaction Response Time**: [X milliseconds]
  - **Memory Usage**: [Assessment]

  ## Recommendations
  ### Must Fix Before Production
  1. [Critical issue 1 with fix recommendation]
  2. [Critical issue 2 with fix recommendation]

  ### TBD Compliance Issues
  1. [Feature flag issues requiring immediate attention]
  2. [Toggle functionality problems]
  3. [Default state configuration issues]

  ### Should Fix
  1. [Important issue 1 with fix recommendation]
  2. [Important issue 2 with fix recommendation]

  ### Nice to Have
  1. [Enhancement suggestion 1]
  2. [Enhancement suggestion 2]

  ## Conclusion
  [Overall assessment of whether the issue is ready for production deployment]

  Important Guidelines:

  1. Be Thorough: Don't skip any requirements, even if they seem obvious
  2. Test Realistically: Use actual user scenarios, not artificial test cases
  3. Document Everything: Every issue, no matter how small, should be documented
  4. No Shortcuts: If tests are failing or missing, report it honestly
  5. Consider All Users: Test accessibility, different browsers, and edge cases
  6. Performance Matters: Note any performance issues or slow operations

  Execute this verification process step by step, providing detailed analysis at each stage. The goal is to ensure the
  implementation is truly production-ready and meets all user expectations.

  This template provides a comprehensive framework for verifying GitHub issue implementations with:
  - Complete requirements analysis
  - Thorough test coverage assessment
  - Real-world E2E testing with Puppeteer
  - Detailed problem documentation
  - Production readiness assessment
  - Actionable recommendations

  The agent following this template will provide a thorough, professional verification report that ensures no stone is left
  unturned in validating the implementation quality. ultrathink