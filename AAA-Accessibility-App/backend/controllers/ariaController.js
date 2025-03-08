const { parse } = require('node-html-parser');
const pino = require('pino');

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

/**
 * Validate HTML for ARIA and semantic correctness
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.validateAria = async (req, res) => {
  try {
    logger.info('Validating HTML for ARIA and semantic correctness');
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Parse HTML
    const root = parse(html);
    
    // Validate ARIA attributes
    const ariaIssues = validateAriaAttributes(root);
    
    // Validate semantic structure
    const semanticIssues = validateSemanticStructure(root);
    
    // Validate status messages
    const statusMessageIssues = validateStatusMessages(root);
    
    // Combine all issues
    const allIssues = [...ariaIssues, ...semanticIssues, ...statusMessageIssues];
    
    logger.info(`Found ${allIssues.length} ARIA and semantic issues`);
    
    return res.status(200).json({
      totalIssues: allIssues.length,
      ariaIssues: ariaIssues.length,
      semanticIssues: semanticIssues.length,
      statusMessageIssues: statusMessageIssues.length,
      issues: allIssues,
    });
  } catch (error) {
    logger.error('Error validating ARIA:', error);
    return res.status(500).json({ error: 'Failed to validate ARIA' });
  }
};

/**
 * Suggest fixes for ARIA and semantic issues
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.suggestAriaFixes = async (req, res) => {
  try {
    logger.info('Suggesting fixes for ARIA and semantic issues');
    const { html, issueId } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Parse HTML
    const root = parse(html);
    
    // Find issues
    const ariaIssues = validateAriaAttributes(root);
    const semanticIssues = validateSemanticStructure(root);
    const statusMessageIssues = validateStatusMessages(root);
    
    // Combine all issues
    const allIssues = [...ariaIssues, ...semanticIssues, ...statusMessageIssues];
    
    // If issueId is provided, find that specific issue
    let targetIssue;
    if (issueId) {
      targetIssue = allIssues.find(issue => issue.id === issueId);
      
      if (!targetIssue) {
        return res.status(404).json({ error: `Issue with ID ${issueId} not found` });
      }
    }
    
    // Generate fixes
    const fixes = issueId 
      ? [generateFix(targetIssue, html)] 
      : allIssues.map(issue => generateFix(issue, html));
    
    logger.info(`Generated ${fixes.length} fixes for ARIA and semantic issues`);
    
    return res.status(200).json({
      fixes,
    });
  } catch (error) {
    logger.error('Error suggesting ARIA fixes:', error);
    return res.status(500).json({ error: 'Failed to suggest ARIA fixes' });
  }
};

/**
 * Check for proper status message implementation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkStatusMessages = async (req, res) => {
  try {
    logger.info('Checking for proper status message implementation');
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Parse HTML
    const root = parse(html);
    
    // Validate status messages
    const statusMessageIssues = validateStatusMessages(root);
    
    logger.info(`Found ${statusMessageIssues.length} status message issues`);
    
    return res.status(200).json({
      totalIssues: statusMessageIssues.length,
      issues: statusMessageIssues,
    });
  } catch (error) {
    logger.error('Error checking status messages:', error);
    return res.status(500).json({ error: 'Failed to check status messages' });
  }
};

/**
 * Analyze semantic structure of HTML
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.analyzeSemanticStructure = async (req, res) => {
  try {
    logger.info('Analyzing semantic structure of HTML');
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Parse HTML
    const root = parse(html);
    
    // Validate semantic structure
    const semanticIssues = validateSemanticStructure(root);
    
    // Analyze heading structure
    const headingStructure = analyzeHeadingStructure(root);
    
    // Analyze landmark regions
    const landmarkRegions = analyzeLandmarkRegions(root);
    
    logger.info(`Found ${semanticIssues.length} semantic structure issues`);
    
    return res.status(200).json({
      totalIssues: semanticIssues.length,
      issues: semanticIssues,
      headingStructure,
      landmarkRegions,
    });
  } catch (error) {
    logger.error('Error analyzing semantic structure:', error);
    return res.status(500).json({ error: 'Failed to analyze semantic structure' });
  }
};

/**
 * Validate ARIA attributes in HTML
 * @param {Object} root - Parsed HTML root
 * @returns {Array} List of ARIA issues
 */
function validateAriaAttributes(root) {
  logger.info('Validating ARIA attributes');
  
  const issues = [];
  
  // Check for elements with role="button" but no keyboard event handlers
  const buttonRoleElements = root.querySelectorAll('[role="button"]');
  
  buttonRoleElements.forEach((element, index) => {
    const hasKeyboardHandler = element.hasAttribute('onkeydown') || 
                              element.hasAttribute('onkeyup') || 
                              element.hasAttribute('onkeypress');
    
    if (!hasKeyboardHandler) {
      issues.push({
        id: `aria-button-${index + 1}`,
        element: element.tagName.toLowerCase(),
        issue: 'Element with role="button" has no keyboard event handler',
        code: element.outerHTML,
        suggestion: element.outerHTML.replace('<div', '<div tabindex="0" onkeydown="if(event.key === \'Enter\') this.click();"'),
        severity: 'error',
        wcagCriteria: '4.1.2 Name, Role, Value (A)',
      });
    }
  });
  
  // Check for elements with ARIA attributes but no role
  const ariaElements = root.querySelectorAll('[aria-*]');
  
  ariaElements.forEach((element, index) => {
    if (!element.hasAttribute('role') && !isImplicitRole(element)) {
      issues.push({
        id: `aria-role-${index + 1}`,
        element: element.tagName.toLowerCase(),
        issue: 'Element with ARIA attributes but no explicit role',
        code: element.outerHTML,
        suggestion: suggestRoleForElement(element),
        severity: 'warning',
        wcagCriteria: '4.1.2 Name, Role, Value (A)',
      });
    }
  });
  
  // Check for interactive elements without accessible names
  const interactiveElements = root.querySelectorAll('button, a, input, select, textarea');
  
  interactiveElements.forEach((element, index) => {
    const hasAccessibleName = element.hasAttribute('aria-label') || 
                             element.hasAttribute('aria-labelledby') || 
                             (element.tagName === 'INPUT' && element.hasAttribute('title')) ||
                             (element.tagName === 'INPUT' && element.hasAttribute('alt') && element.getAttribute('type') === 'image') ||
                             element.textContent.trim() !== '';
    
    if (!hasAccessibleName) {
      issues.push({
        id: `aria-name-${index + 1}`,
        element: element.tagName.toLowerCase(),
        issue: 'Interactive element without accessible name',
        code: element.outerHTML,
        suggestion: suggestAccessibleName(element),
        severity: 'error',
        wcagCriteria: '4.1.2 Name, Role, Value (A)',
      });
    }
  });
  
  return issues;
}

/**
 * Validate semantic structure of HTML
 * @param {Object} root - Parsed HTML root
 * @returns {Array} List of semantic structure issues
 */
function validateSemanticStructure(root) {
  logger.info('Validating semantic structure');
  
  const issues = [];
  
  // Check for sections without headings
  const sections = root.querySelectorAll('section');
  
  sections.forEach((section, index) => {
    const hasHeading = section.querySelector('h1, h2, h3, h4, h5, h6');
    
    if (!hasHeading) {
      issues.push({
        id: `semantic-section-${index + 1}`,
        element: 'section',
        issue: 'Section without heading',
        code: section.outerHTML.substring(0, 100) + (section.outerHTML.length > 100 ? '...' : ''),
        suggestion: suggestSectionHeading(section),
        severity: 'warning',
        wcagCriteria: '1.3.1 Info and Relationships (A)',
      });
    }
  });
  
  // Check for lists created with divs instead of ul/ol and li
  const potentialLists = findPotentialLists(root);
  
  potentialLists.forEach((list, index) => {
    issues.push({
      id: `semantic-list-${index + 1}`,
      element: list.element,
      issue: 'List-like structure not using proper list elements',
      code: list.code,
      suggestion: list.suggestion,
      severity: 'warning',
      wcagCriteria: '1.3.1 Info and Relationships (A)',
    });
  });
  
  // Check for skipped heading levels
  const headingIssues = checkHeadingOrder(root);
  
  headingIssues.forEach((issue, index) => {
    issues.push({
      id: `semantic-heading-${index + 1}`,
      element: issue.element,
      issue: issue.issue,
      code: issue.code,
      suggestion: issue.suggestion,
      severity: 'warning',
      wcagCriteria: '1.3.1 Info and Relationships (A)',
    });
  });
  
  return issues;
}

/**
 * Validate status messages in HTML
 * @param {Object} root - Parsed HTML root
 * @returns {Array} List of status message issues
 */
function validateStatusMessages(root) {
  logger.info('Validating status messages');
  
  const issues = [];
  
  // Check for potential status message elements
  const potentialStatusElements = [
    ...root.querySelectorAll('.status'),
    ...root.querySelectorAll('.message'),
    ...root.querySelectorAll('.alert'),
    ...root.querySelectorAll('.notification'),
    ...root.querySelectorAll('.toast'),
  ];
  
  potentialStatusElements.forEach((element, index) => {
    const hasAriaLive = element.hasAttribute('aria-live');
    const hasRole = element.hasAttribute('role') && 
                   (element.getAttribute('role') === 'status' || 
                    element.getAttribute('role') === 'alert' || 
                    element.getAttribute('role') === 'log');
    
    if (!hasAriaLive && !hasRole) {
      issues.push({
        id: `status-message-${index + 1}`,
        element: element.tagName.toLowerCase(),
        issue: 'Potential status message without aria-live or appropriate role',
        code: element.outerHTML,
        suggestion: suggestStatusMessageFix(element),
        severity: 'warning',
        wcagCriteria: '4.1.3 Status Messages (AA)',
      });
    }
  });
  
  return issues;
}

/**
 * Check if element has an implicit ARIA role
 * @param {Object} element - HTML element
 * @returns {boolean} True if element has an implicit role
 */
function isImplicitRole(element) {
  const tag = element.tagName.toLowerCase();
  
  // Elements with implicit roles
  const implicitRoles = {
    'a': element.hasAttribute('href'),
    'article': true,
    'aside': true,
    'button': true,
    'footer': true,
    'form': true,
    'h1': true,
    'h2': true,
    'h3': true,
    'h4': true,
    'h5': true,
    'h6': true,
    'header': true,
    'img': true,
    'input': true,
    'li': true,
    'main': true,
    'nav': true,
    'ol': true,
    'section': true,
    'select': true,
    'table': true,
    'textarea': true,
    'ul': true,
  };
  
  return implicitRoles[tag] || false;
}

/**
 * Suggest role for element with ARIA attributes
 * @param {Object} element - HTML element
 * @returns {string} Suggested HTML with role
 */
function suggestRoleForElement(element) {
  const tag = element.tagName.toLowerCase();
  let role = 'group'; // Default role
  
  // Suggest appropriate role based on element and attributes
  if (element.hasAttribute('aria-expanded') || element.hasAttribute('aria-pressed')) {
    role = 'button';
  } else if (element.hasAttribute('aria-selected')) {
    role = 'option';
  } else if (element.hasAttribute('aria-checked')) {
    role = 'checkbox';
  } else if (element.hasAttribute('aria-describedby')) {
    role = 'group';
  }
  
  // Create suggestion
  const html = element.outerHTML;
  const openingTag = html.substring(0, html.indexOf('>'));
  const restOfHtml = html.substring(html.indexOf('>'));
  
  return `${openingTag} role="${role}"${restOfHtml}`;
}

/**
 * Suggest accessible name for interactive element
 * @param {Object} element - HTML element
 * @returns {string} Suggested HTML with accessible name
 */
function suggestAccessibleName(element) {
  const tag = element.tagName.toLowerCase();
  let suggestion = element.outerHTML;
  
  if (tag === 'button' || tag === 'a') {
    // For buttons and links, add text content
    suggestion = suggestion.replace(`<${tag}`, `<${tag} aria-label="Purpose of this ${tag}"`);
  } else if (tag === 'input') {
    // For inputs, add label or aria-label
    const type = element.getAttribute('type') || 'text';
    const id = element.getAttribute('id') || `${type}-${Math.floor(Math.random() * 1000)}`;
    
    if (!element.hasAttribute('id')) {
      suggestion = suggestion.replace('<input', `<input id="${id}"`);
    }
    
    suggestion = `<label for="${id}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>\n${suggestion}`;
  }
  
  return suggestion;
}

/**
 * Suggest heading for section
 * @param {Object} section - Section element
 * @returns {string} Suggested HTML with heading
 */
function suggestSectionHeading(section) {
  const html = section.outerHTML;
  const openingTag = html.substring(0, html.indexOf('>') + 1);
  const restOfHtml = html.substring(html.indexOf('>') + 1);
  
  // Generate a unique ID for the heading
  const headingId = `section-heading-${Math.floor(Math.random() * 1000)}`;
  
  // Add aria-labelledby to the section
  const sectionWithLabel = openingTag.replace('<section', `<section aria-labelledby="${headingId}"`);
  
  // Add heading to the section
  return `${sectionWithLabel}\n  <h2 id="${headingId}">Section Heading</h2>\n  ${restOfHtml}`;
}

/**
 * Find potential lists that are not using proper list elements
 * @param {Object} root - Parsed HTML root
 * @returns {Array} List of potential list issues
 */
function findPotentialLists(root) {
  const potentialLists = [];
  
  // Look for div containers with multiple similar child divs
  const divContainers = root.querySelectorAll('div');
  
  divContainers.forEach((container) => {
    const children = container.querySelectorAll(':scope > div');
    
    // If container has multiple similar children, it might be a list
    if (children.length >= 3) {
      // Check if children have similar structure
      const firstChildClasses = children[0].classNames;
      let similarChildren = 0;
      
      for (const child of children) {
        if (child.classNames === firstChildClasses) {
          similarChildren++;
        }
      }
      
      // If most children are similar, suggest a list
      if (similarChildren >= children.length * 0.7) {
        const containerHtml = container.outerHTML;
        
        // Create suggestion
        let suggestion = '<ul class="' + container.classNames + '">\n';
        
        for (const child of children) {
          suggestion += `  <li class="${child.classNames}">${child.innerHTML}</li>\n`;
        }
        
        suggestion += '</ul>';
        
        potentialLists.push({
          element: 'div',
          code: containerHtml.substring(0, 100) + (containerHtml.length > 100 ? '...' : ''),
          suggestion,
        });
      }
    }
  });
  
  return potentialLists;
}

/**
 * Check for skipped heading levels
 * @param {Object} root - Parsed HTML root
 * @returns {Array} List of heading order issues
 */
function checkHeadingOrder(root) {
  const issues = [];
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  if (headings.length <= 1) {
    return issues;
  }
  
  let previousLevel = parseInt(headings[0].tagName.substring(1));
  
  for (let i = 1; i < headings.length; i++) {
    const currentHeading = headings[i];
    const currentLevel = parseInt(currentHeading.tagName.substring(1));
    
    // Check for skipped levels (e.g., h2 followed by h4)
    if (currentLevel > previousLevel + 1) {
      const suggestedTag = `h${previousLevel + 1}`;
      
      issues.push({
        element: currentHeading.tagName.toLowerCase(),
        issue: `Skipped heading level: ${currentHeading.tagName} after h${previousLevel}`,
        code: currentHeading.outerHTML,
        suggestion: currentHeading.outerHTML.replace(currentHeading.tagName, suggestedTag),
      });
    }
    
    previousLevel = currentLevel;
  }
  
  return issues;
}

/**
 * Suggest fix for status message
 * @param {Object} element - Status message element
 * @returns {string} Suggested HTML with aria-live or role
 */
function suggestStatusMessageFix(element) {
  const html = element.outerHTML;
  
  // Determine appropriate role based on class names
  let role = 'status';
  let ariaLive = 'polite';
  
  if (element.classNames.includes('alert') || element.classNames.includes('error')) {
    role = 'alert';
    ariaLive = 'assertive';
  } else if (element.classNames.includes('log')) {
    role = 'log';
  }
  
  // Create suggestion
  return html.replace(`<${element.tagName.toLowerCase()}`, `<${element.tagName.toLowerCase()} role="${role}" aria-live="${ariaLive}"`);
}

/**
 * Analyze heading structure of HTML
 * @param {Object} root - Parsed HTML root
 * @returns {Object} Heading structure analysis
 */
function analyzeHeadingStructure(root) {
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingLevels = {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
  };
  
  // Count headings by level
  headings.forEach((heading) => {
    const level = heading.tagName.toLowerCase();
    headingLevels[level]++;
  });
  
  // Check if document has a single h1
  const hasProperH1 = headingLevels.h1 === 1;
  
  // Check for skipped heading levels
  let hasSkippedLevels = false;
  let previousLevelFound = false;
  
  for (let i = 1; i <= 6; i++) {
    const currentLevel = `h${i}`;
    
    if (headingLevels[currentLevel] > 0) {
      previousLevelFound = true;
    } else if (previousLevelFound) {
      // Check if any higher levels exist after this gap
      let higherLevelsExist = false;
      
      for (let j = i + 1; j <= 6; j++) {
        if (headingLevels[`h${j}`] > 0) {
          higherLevelsExist = true;
          break;
        }
      }
      
      if (higherLevelsExist) {
        hasSkippedLevels = true;
      }
    }
  }
  
  return {
    totalHeadings: headings.length,
    headingLevels,
    hasProperH1,
    hasSkippedLevels,
  };
}

/**
 * Analyze landmark regions of HTML
 * @param {Object} root - Parsed HTML root
 * @returns {Object} Landmark regions analysis
 */
function analyzeLandmarkRegions(root) {
  const landmarks = {
    header: root.querySelectorAll('header').length,
    nav: root.querySelectorAll('nav').length,
    main: root.querySelectorAll('main').length,
    aside: root.querySelectorAll('aside').length,
    footer: root.querySelectorAll('footer').length,
    search: root.querySelectorAll('[role="search"]').length,
    form: root.querySelectorAll('form').length,
    contentinfo: root.querySelectorAll('[role="contentinfo"]').length,
  };
  
  // Check if document has proper landmark structure
  const hasHeader = landmarks.header > 0;
  const hasNav = landmarks.nav > 0;
  const hasMain = landmarks.main > 0;
  const hasFooter = landmarks.footer > 0;
  
  const hasProperStructure = hasHeader && hasNav && hasMain && hasFooter;
  
  return {
    landmarks,
    hasProperStructure,
  };
}

/**
 * Generate fix for an issue
 * @param {Object} issue - Issue to fix
 * @param {string} html - Original HTML
 * @returns {Object} Fix details
 */
function generateFix(issue, html) {
  return {
    id: issue.id,
    element: issue.element,
    issue: issue.issue,
    originalCode: issue.code,
    suggestedCode: issue.suggestion,
    severity: issue.severity,
    wcagCriteria: issue.wcagCriteria,
  };
} 