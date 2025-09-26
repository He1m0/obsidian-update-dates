# GitHub Issue Creation Prompt Template

You are an expert software engineer tasked with creating a well-structured GitHub issue for the following task:

**Task**: $ARGUMENTS

## Instructions

Follow these steps to create a comprehensive GitHub issue. Adapt your approach based on the complexity of the task - simple tasks may require less research while complex features need thorough investigation.

### Step 1: Codebase Research
Analyze the existing codebase to understand the current implementation and architecture:

- Search for related files, functions, and modules that might be affected
- Identify existing patterns and conventions used in the project
- Check for any similar features or implementations already present
- Review relevant documentation (README, API docs, architecture docs)
- Note any dependencies or integrations that might be impacted

**Output**: Provide a brief summary of relevant findings from the codebase.

### Step 2: Best Practices Research
Research industry best practices for implementing this type of feature:

- Look for established patterns and architectural approaches
- Consider security, performance, and maintainability implications
- Research similar implementations in well-known projects
- Identify potential pitfalls and common mistakes to avoid
- Consider accessibility and user experience best practices

**Output**: Summarize key best practices that should guide the implementation.

### Step 3: Implementation Plan
Based on your research, create a detailed implementation plan:

<plan>
## Implementation Plan for: [Task Name]

### Overview
[Brief description of the proposed solution]

### User Story
- **As a** [type of user]
- **I want** [what the user wants to achieve]
- **So that** [why the user wants this feature]

### Technical Approach
- **Architecture**: [Describe the architectural approach]
- **Key Components**: [List main components to be created/modified]
- **Dependencies**: [List any new dependencies or integrations]

### Implementation Steps
1. [First step with specific details]
2. [Second step with specific details]
3. [Continue with all necessary steps]

### Code Changes
- **Files to modify**: [List existing files that need changes]
- **New files to create**: [List new files with their purposes]
- **API changes**: [Document any API modifications]

### Testing Strategy
- **Unit tests**: [Describe unit test approach]
- **Integration tests**: [Describe integration test needs]
- **Manual testing**: [List manual test scenarios]

### Estimated Effort
- **Complexity**: [Low/Medium/High]
- **Time estimate**: [Provide realistic time estimate]
- **Risk factors**: [List potential blockers or risks]

### Success Criteria
- [ ] [Specific measurable criterion]
- [ ] [Another criterion]
- [ ] [Continue with all criteria]
</plan>

**Please review this implementation plan. Reply with "APPROVED" to proceed with creating the GitHub issue, or provide feedback for adjustments.**

### Step 4: GitHub Issue Creation
Once the plan is approved, create a GitHub issue with the following structure:

```markdown
## Title: [Clear, action-oriented title]

### Description
[Comprehensive description of what needs to be done and why]

### Context
[Background information and findings from codebase research]

### Proposed Solution
[Summary of the implementation approach from the approved plan]

### Implementation Details
[Detailed technical specifications from the plan]

### Acceptance Criteria
- [ ] [Specific, testable criterion]
- [ ] [Another criterion]
- [ ] [All criteria from the plan]

### Technical Considerations
- [Important technical details]
- [Performance considerations]
- [Security considerations]

### Testing Requirements
[Testing approach from the plan]

### Estimated Effort
**Complexity**: [Low/Medium/High]
**Time Estimate**: [From the plan]

### References
- [Link to relevant documentation]
- [Link to similar implementations]
- [Any other helpful resources]

### Labels
Suggested labels: [feature/bug/enhancement], [priority level], [component area]
```

## Usage Notes

1. **Complexity Adaptation**: 
   - For simple tasks (e.g., fixing a typo), you may skip extensive research
   - For complex features, ensure thorough investigation of all aspects
   - Always match the depth of analysis to the task's importance

2. **Clarity and Specificity**:
   - Be specific about file paths and function names
   - Include code snippets where helpful
   - Avoid ambiguous language

3. **Actionability**:
   - Ensure every step in the plan is actionable
   - Provide enough detail for any developer to implement
   - Include clear success criteria

4. **Collaboration**:
   - Write for an audience that may not have full context
   - Anticipate questions and address them proactively
   - Make it easy for others to provide feedback

Remember: The goal is to create issues that are self-contained, well-researched, and immediately actionable by any team member. ultrathink