'use strict';

/**
 * Project-Branch Mapping Manager
 *
 * CRUD operations for .aiox/project-branches.json config.
 * Maps project names to git branch names for multi-project isolation.
 *
 * @module project-branches
 * @see Story AIOX-SBM-3.2
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/** Config file version */
const CONFIG_VERSION = '1.0';

/** Branch name validation: git-compatible, no spaces, no control chars */
const BRANCH_NAME_REGEX = /^[a-zA-Z0-9_./-]+$/;

/** Max branch name length */
const MAX_BRANCH_LENGTH = 255;

/** Default convention for new branches */
const DEFAULT_BRANCH_PREFIX = 'feat/';

/**
 * Resolve path to the project-branches config file.
 * @param {string} [projectRoot] - Project root directory
 * @returns {string} Absolute path to project-branches.json
 */
function getConfigPath(projectRoot) {
  const root = projectRoot || process.cwd();
  return path.join(root, '.aiox', 'project-branches.json');
}

/**
 * Validate a git branch name.
 * @param {string} branchName - Branch name to validate
 * @returns {{ valid: boolean, reason?: string }} Validation result
 */
function validateBranchName(branchName) {
  if (!branchName || typeof branchName !== 'string') {
    return { valid: false, reason: 'Branch name must be a non-empty string' };
  }

  if (branchName.length > MAX_BRANCH_LENGTH) {
    return { valid: false, reason: `Branch name exceeds ${MAX_BRANCH_LENGTH} characters` };
  }

  if (!BRANCH_NAME_REGEX.test(branchName)) {
    return { valid: false, reason: 'Branch name contains invalid characters. Use alphanumeric, dots, underscores, hyphens, and slashes only' };
  }

  if (branchName.startsWith('/') || branchName.endsWith('/')) {
    return { valid: false, reason: 'Branch name cannot start or end with a slash' };
  }

  if (branchName.includes('..')) {
    return { valid: false, reason: 'Branch name cannot contain double dots (..)' };
  }

  if (branchName.endsWith('.lock')) {
    return { valid: false, reason: 'Branch name cannot end with .lock' };
  }

  return { valid: true };
}

/**
 * Validate a project name.
 * @param {string} projectName - Project name to validate
 * @returns {{ valid: boolean, reason?: string }} Validation result
 */
function validateProjectName(projectName) {
  if (!projectName || typeof projectName !== 'string') {
    return { valid: false, reason: 'Project name must be a non-empty string' };
  }

  if (projectName.length > 100) {
    return { valid: false, reason: 'Project name exceeds 100 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
    return { valid: false, reason: 'Project name must contain only alphanumeric, hyphens, and underscores' };
  }

  return { valid: true };
}

/**
 * Load the project-branches config. Returns default if file doesn't exist or is corrupt.
 * @param {string} [projectRoot] - Project root directory
 * @returns {object} Config object with version and projects map
 */
function loadConfig(projectRoot) {
  const filePath = getConfigPath(projectRoot);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(raw);

    // Validate structure
    if (!config || typeof config !== 'object' || !config.projects) {
      return createDefaultConfig();
    }

    return {
      version: config.version || CONFIG_VERSION,
      projects: config.projects || {},
    };
  } catch (_) {
    return createDefaultConfig();
  }
}

/**
 * Create a default empty config.
 * @returns {object} Default config
 */
function createDefaultConfig() {
  return {
    version: CONFIG_VERSION,
    projects: {},
  };
}

/**
 * Save the project-branches config to disk.
 * @param {object} config - Config to save
 * @param {string} [projectRoot] - Project root directory
 */
function saveConfig(config, projectRoot) {
  const filePath = getConfigPath(projectRoot);
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

/**
 * List all project-branch mappings.
 * @param {string} [projectRoot] - Project root directory
 * @returns {object} Projects map { projectName: branchName }
 */
function listMappings(projectRoot) {
  const config = loadConfig(projectRoot);
  return { ...config.projects };
}

/**
 * Get the branch for a specific project.
 * @param {string} projectName - Project name
 * @param {string} [projectRoot] - Project root directory
 * @returns {string|null} Branch name or null if not mapped
 */
function getBranch(projectName, projectRoot) {
  const config = loadConfig(projectRoot);
  return config.projects[projectName] || null;
}

/**
 * Set a project-branch mapping.
 * @param {string} projectName - Project name
 * @param {string} branchName - Branch name
 * @param {string} [projectRoot] - Project root directory
 * @returns {{ success: boolean, error?: string }} Result
 */
function setMapping(projectName, branchName, projectRoot) {
  const projectValidation = validateProjectName(projectName);
  if (!projectValidation.valid) {
    return { success: false, error: projectValidation.reason };
  }

  const branchValidation = validateBranchName(branchName);
  if (!branchValidation.valid) {
    return { success: false, error: branchValidation.reason };
  }

  const config = loadConfig(projectRoot);
  config.projects[projectName] = branchName;
  saveConfig(config, projectRoot);

  return { success: true };
}

/**
 * Remove a project-branch mapping.
 * @param {string} projectName - Project name
 * @param {string} [projectRoot] - Project root directory
 * @returns {{ success: boolean, existed: boolean }} Result
 */
function removeMapping(projectName, projectRoot) {
  const config = loadConfig(projectRoot);
  const existed = projectName in config.projects;

  if (existed) {
    delete config.projects[projectName];
    saveConfig(config, projectRoot);
  }

  return { success: true, existed };
}

/**
 * Get current git branch. Returns null on failure (detached HEAD, no git, etc.).
 * @param {string} [projectRoot] - Project root directory
 * @returns {string|null} Current branch name or null
 */
function getCurrentBranch(projectRoot) {
  try {
    const root = projectRoot || process.cwd();
    const result = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: root,
      timeout: 3000,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const branch = result.trim();
    return branch === 'HEAD' ? null : branch; // 'HEAD' means detached
  } catch (_) {
    return null;
  }
}

/**
 * Check if current branch matches the expected branch for a project.
 *
 * @param {string} projectName - Project name to check
 * @param {string} [projectRoot] - Project root directory
 * @returns {{ match: boolean, currentBranch: string|null, expectedBranch: string|null, warning?: string }}
 */
function checkBranchMismatch(projectName, projectRoot) {
  const expectedBranch = getBranch(projectName, projectRoot);
  const currentBranch = getCurrentBranch(projectRoot);

  if (!expectedBranch) {
    return {
      match: false,
      currentBranch,
      expectedBranch: null,
      warning: `No branch mapped for project '${projectName}'.`,
      noMapping: true,
    };
  }

  if (!currentBranch) {
    return {
      match: false,
      currentBranch: null,
      expectedBranch,
      warning: 'Unable to determine current git branch (detached HEAD or no git repository).',
    };
  }

  if (currentBranch !== expectedBranch) {
    return {
      match: false,
      currentBranch,
      expectedBranch,
      warning: `Warning: Active project is '${projectName}' but current branch is '${currentBranch}'. Expected branch: '${expectedBranch}'. Switch with: git checkout ${expectedBranch}`,
    };
  }

  return {
    match: true,
    currentBranch,
    expectedBranch,
  };
}

/**
 * Suggest a branch name for a project based on naming convention.
 * @param {string} projectName - Project name
 * @returns {string} Suggested branch name
 */
function suggestBranchName(projectName) {
  return `${DEFAULT_BRANCH_PREFIX}${projectName}`;
}

/**
 * Auto-detect project from current branch using known mappings.
 * @param {string} [projectRoot] - Project root directory
 * @returns {string|null} Detected project name or null
 */
function detectProjectFromBranch(projectRoot) {
  const currentBranch = getCurrentBranch(projectRoot);
  if (!currentBranch) return null;

  const mappings = listMappings(projectRoot);

  // Exact match on branch value
  for (const [project, branch] of Object.entries(mappings)) {
    if (branch === currentBranch) return project;
  }

  return null;
}

/**
 * Detect project from story prefix pattern.
 *
 * Known prefixes:
 *   BSS-*  -> brand-system-service
 *   PAUTA-* -> pauta-automation
 *   AIOX-SBM-* -> session-branch-manager
 *
 * @param {string} storyId - Story identifier (e.g., "PAUTA-6.5")
 * @returns {string|null} Detected project name or null
 */
function detectProjectFromStory(storyId) {
  if (!storyId || typeof storyId !== 'string') return null;

  const prefixMap = {
    'BSS-': 'brand-system-service',
    'PAUTA-': 'pauta-automation',
    'AIOX-SBM-': 'session-branch-manager',
  };

  for (const [prefix, project] of Object.entries(prefixMap)) {
    if (storyId.startsWith(prefix)) return project;
  }

  return null;
}

/**
 * Get auto-branch creation suggestion for a project with no mapping.
 *
 * @param {string} projectName - Project name
 * @returns {object} Suggestion object
 */
function getAutoCreationSuggestion(projectName) {
  const suggested = suggestBranchName(projectName);
  return {
    project: projectName,
    suggestedBranch: suggested,
    message: `No branch mapped for project '${projectName}'. Create '${suggested}' ? [Y/n]`,
  };
}

/**
 * Seed the config with initial project-branch mappings.
 * Only adds mappings that don't already exist.
 * @param {object} seedData - Map of { project: branch }
 * @param {string} [projectRoot] - Project root directory
 * @returns {number} Number of mappings added
 */
function seedConfig(seedData, projectRoot) {
  const config = loadConfig(projectRoot);
  let added = 0;

  for (const [project, branch] of Object.entries(seedData)) {
    if (!config.projects[project]) {
      config.projects[project] = branch;
      added++;
    }
  }

  if (added > 0) {
    saveConfig(config, projectRoot);
  }

  return added;
}

module.exports = {
  // Config CRUD
  loadConfig,
  saveConfig,
  getConfigPath,
  createDefaultConfig,

  // Mapping CRUD
  listMappings,
  getBranch,
  setMapping,
  removeMapping,
  seedConfig,

  // Validation
  validateBranchName,
  validateProjectName,

  // Branch detection
  getCurrentBranch,
  checkBranchMismatch,

  // Auto-creation
  suggestBranchName,
  getAutoCreationSuggestion,

  // Project detection
  detectProjectFromBranch,
  detectProjectFromStory,

  // Constants
  CONFIG_VERSION,
  BRANCH_NAME_REGEX,
  MAX_BRANCH_LENGTH,
  DEFAULT_BRANCH_PREFIX,
};
