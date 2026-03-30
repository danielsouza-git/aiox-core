'use strict';

/**
 * *project CLI Command Handler
 *
 * Handles project-branch management commands:
 *   *project list     - Show all project-branch mappings
 *   *project set {name} {branch} - Set/update a mapping
 *   *project current  - Show active project, expected branch, actual branch, status
 *   *project remove {name} - Remove a mapping
 *
 * @module project-command
 * @see Story AIOX-SBM-3.2
 */

const path = require('path');

/**
 * Resolve the project-branches module. Uses a factory function for testability.
 * @param {string} [projectRoot] - Project root directory
 * @returns {object} project-branches module
 */
function getProjectBranches(projectRoot) {
  const root = projectRoot || process.cwd();
  return require(path.join(root, '.aiox', 'lib', 'handoff', 'project-branches.js'));
}

/**
 * Format project-branch mappings as a table string.
 * @param {object} mappings - { projectName: branchName }
 * @returns {string} Formatted table
 */
function formatTable(mappings) {
  const entries = Object.entries(mappings);
  if (entries.length === 0) {
    return 'No project-branch mappings configured.\nUse *project set {name} {branch} to add one.';
  }

  const lines = [];
  lines.push('| Project | Branch |');
  lines.push('|---------|--------|');
  for (const [project, branch] of entries) {
    lines.push(`| ${project} | ${branch} |`);
  }
  return lines.join('\n');
}

/**
 * Handle *project list command.
 * @param {string} [projectRoot] - Project root directory
 * @returns {string} Output text
 */
function handleList(projectRoot) {
  const pb = getProjectBranches(projectRoot);
  const mappings = pb.listMappings(projectRoot);
  return `**Project-Branch Mappings**\n\n${formatTable(mappings)}`;
}

/**
 * Handle *project set {name} {branch} command.
 * @param {string} projectName - Project name
 * @param {string} branchName - Branch name
 * @param {string} [projectRoot] - Project root directory
 * @returns {string} Output text
 */
function handleSet(projectName, branchName, projectRoot) {
  if (!projectName || !branchName) {
    return 'Usage: *project set {project-name} {branch-name}';
  }

  const pb = getProjectBranches(projectRoot);
  const result = pb.setMapping(projectName, branchName, projectRoot);

  if (!result.success) {
    return `Failed to set mapping: ${result.error}`;
  }

  return `Mapping set: ${projectName} -> ${branchName}`;
}

/**
 * Handle *project current command.
 * @param {string} [projectRoot] - Project root directory
 * @returns {string} Output text
 */
function handleCurrent(projectRoot) {
  const pb = getProjectBranches(projectRoot);
  const currentBranch = pb.getCurrentBranch(projectRoot);

  if (!currentBranch) {
    return 'Unable to determine current git branch.';
  }

  // Detect project from branch
  const project = pb.detectProjectFromBranch(projectRoot);

  if (!project) {
    return `**Current Branch:** ${currentBranch}\n**Active Project:** (none detected)\n\nNo project is mapped to this branch. Use *project set {name} ${currentBranch} to map it.`;
  }

  const check = pb.checkBranchMismatch(project, projectRoot);
  const status = check.match ? 'OK' : 'MISMATCH';
  const statusIcon = check.match ? '[OK]' : '[MISMATCH]';

  let output = `**Active Project:** ${project}\n`;
  output += `**Expected Branch:** ${check.expectedBranch}\n`;
  output += `**Current Branch:** ${currentBranch}\n`;
  output += `**Status:** ${statusIcon}`;

  if (!check.match && check.warning) {
    output += `\n\n${check.warning}`;
  }

  return output;
}

/**
 * Handle *project remove {name} command.
 * @param {string} projectName - Project name
 * @param {string} [projectRoot] - Project root directory
 * @returns {string} Output text
 */
function handleRemove(projectName, projectRoot) {
  if (!projectName) {
    return 'Usage: *project remove {project-name}';
  }

  const pb = getProjectBranches(projectRoot);
  const result = pb.removeMapping(projectName, projectRoot);

  if (!result.existed) {
    return `No mapping found for project '${projectName}'.`;
  }

  return `Mapping removed: ${projectName}`;
}

/**
 * Main command dispatcher for *project commands.
 *
 * @param {string} subcommand - The subcommand (list, set, current, remove)
 * @param {string[]} args - Additional arguments
 * @param {string} [projectRoot] - Project root directory
 * @returns {string} Output text
 */
function handleProjectCommand(subcommand, args, projectRoot) {
  const cmd = (subcommand || '').toLowerCase().trim();

  switch (cmd) {
    case 'list':
      return handleList(projectRoot);
    case 'set':
      return handleSet(args[0], args[1], projectRoot);
    case 'current':
      return handleCurrent(projectRoot);
    case 'remove':
      return handleRemove(args[0], projectRoot);
    default:
      return [
        '**Usage:** *project {subcommand}',
        '',
        '| Subcommand | Description |',
        '|------------|-------------|',
        '| list | Show all project-branch mappings |',
        '| set {name} {branch} | Create/update a mapping |',
        '| current | Show active project + branch status |',
        '| remove {name} | Remove a mapping |',
      ].join('\n');
  }
}

module.exports = {
  handleProjectCommand,
  handleList,
  handleSet,
  handleCurrent,
  handleRemove,
  formatTable,
  getProjectBranches,
};
