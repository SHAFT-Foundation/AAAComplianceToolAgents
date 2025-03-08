const wcagContrast = require('wcag-contrast');
const tinycolor = require('tinycolor2');
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
 * Analyze color contrast in HTML content
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.analyzeContrast = async (req, res) => {
  try {
    logger.info('Analyzing color contrast');
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Extract color pairs from HTML
    // This is a simplified implementation - a real one would parse the HTML and CSS
    const colorPairs = extractColorPairs(html);
    
    // Check contrast for each pair
    const issues = [];
    
    for (const pair of colorPairs) {
      const ratio = wcagContrast.ratio(pair.foreground, pair.background);
      const required = pair.isLargeText ? 4.5 : 7; // AAA requires 4.5:1 for large text, 7:1 for normal text
      
      if (ratio < required) {
        // If contrast is insufficient, suggest a better color
        const suggestion = suggestBetterColor(pair.foreground, pair.background, required);
        
        issues.push({
          element: pair.element,
          foreground: pair.foreground,
          background: pair.background,
          ratio: parseFloat(ratio.toFixed(2)),
          required,
          suggestion,
        });
      }
    }
    
    logger.info(`Found ${issues.length} contrast issues`);
    
    return res.status(200).json({
      issues,
      analyzed: colorPairs.length,
    });
  } catch (error) {
    logger.error('Error analyzing contrast:', error);
    return res.status(500).json({ error: 'Failed to analyze contrast' });
  }
};

/**
 * Suggest improved colors for better contrast
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.suggestColors = async (req, res) => {
  try {
    logger.info('Suggesting improved colors for contrast');
    const { foreground, background, required = 7 } = req.body;

    if (!foreground || !background) {
      return res.status(400).json({ error: 'Foreground and background colors are required' });
    }

    const suggestion = suggestBetterColor(foreground, background, required);
    const newRatio = wcagContrast.ratio(suggestion, background);
    
    return res.status(200).json({
      original: {
        foreground,
        background,
        ratio: parseFloat(wcagContrast.ratio(foreground, background).toFixed(2)),
      },
      improved: {
        foreground: suggestion,
        background,
        ratio: parseFloat(newRatio.toFixed(2)),
      },
      required,
      passes: newRatio >= required,
    });
  } catch (error) {
    logger.error('Error suggesting colors:', error);
    return res.status(500).json({ error: 'Failed to suggest colors' });
  }
};

/**
 * Check contrast ratio between two colors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkContrastRatio = async (req, res) => {
  try {
    logger.info('Checking contrast ratio');
    const { foreground, background } = req.body;

    if (!foreground || !background) {
      return res.status(400).json({ error: 'Foreground and background colors are required' });
    }

    const ratio = wcagContrast.ratio(foreground, background);
    
    return res.status(200).json({
      foreground,
      background,
      ratio: parseFloat(ratio.toFixed(2)),
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      passesAALarge: ratio >= 3,
      passesAAALarge: ratio >= 4.5,
    });
  } catch (error) {
    logger.error('Error checking contrast ratio:', error);
    return res.status(500).json({ error: 'Failed to check contrast ratio' });
  }
};

/**
 * Extract color pairs from HTML content
 * @param {string} html - HTML content
 * @returns {Array} Array of color pairs
 */
function extractColorPairs(html) {
  // This is a simplified implementation
  // A real implementation would parse the HTML and CSS to extract actual color pairs
  
  // Mock data for demonstration
  return [
    { element: 'header', foreground: '#336699', background: '#FFFFFF', isLargeText: false },
    { element: 'button', foreground: '#66CC66', background: '#FFFFFF', isLargeText: false },
    { element: 'heading', foreground: '#555555', background: '#F5F5F5', isLargeText: true },
    { element: 'paragraph', foreground: '#777777', background: '#FFFFFF', isLargeText: false },
    { element: 'link', foreground: '#3366CC', background: '#FFFFFF', isLargeText: false },
  ];
}

/**
 * Suggest a better color for improved contrast
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 * @param {number} required - Required contrast ratio
 * @returns {string} Suggested color
 */
function suggestBetterColor(foreground, background, required) {
  logger.info(`Suggesting better color for ${foreground} on ${background} (required: ${required})`);
  
  // Convert colors to tinycolor objects
  const fgColor = tinycolor(foreground);
  const bgColor = tinycolor(background);
  
  // Check if we should adjust foreground or background
  // Usually, we adjust the foreground color
  const adjustForeground = true;
  
  if (adjustForeground) {
    // Start with the original color
    let newColor = fgColor.clone();
    
    // Get the current contrast ratio
    let ratio = wcagContrast.ratio(newColor.toHexString(), bgColor.toHexString());
    
    // If the contrast is already sufficient, return the original color
    if (ratio >= required) {
      return foreground;
    }
    
    // Determine if we should darken or lighten the foreground
    const bgLightness = bgColor.getLuminance();
    const shouldDarken = bgLightness > 0.5;
    
    // Adjust the color until we reach the required contrast
    let adjustmentAmount = 0.05;
    let maxIterations = 20;
    let iterations = 0;
    
    while (ratio < required && iterations < maxIterations) {
      if (shouldDarken) {
        newColor = newColor.darken(adjustmentAmount * 100);
      } else {
        newColor = newColor.lighten(adjustmentAmount * 100);
      }
      
      ratio = wcagContrast.ratio(newColor.toHexString(), bgColor.toHexString());
      iterations++;
      
      // Increase adjustment amount if we're not making progress fast enough
      if (iterations > 10) {
        adjustmentAmount *= 1.5;
      }
    }
    
    // If we couldn't reach the required contrast, go with black or white
    if (ratio < required) {
      return shouldDarken ? '#000000' : '#FFFFFF';
    }
    
    return newColor.toHexString();
  } else {
    // Adjust background color (similar logic)
    // This would be implemented for cases where adjusting the background is preferred
    return foreground; // Placeholder
  }
} 