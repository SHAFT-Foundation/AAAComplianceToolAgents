const { parse } = require('node-html-parser');
const path = require('path');
const fs = require('fs');
const pino = require('pino');
const { OpenAI } = require('openai');

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

// Initialize OpenAI client if API key is available
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Generate alt text for an image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateAltText = async (req, res) => {
  try {
    logger.info('Generating alt text for image');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Get image file path
    const imagePath = req.file.path;
    logger.info(`Image uploaded: ${imagePath}`);
    
    // Generate alt text
    let altText;
    
    if (openai) {
      // Use OpenAI to generate alt text
      try {
        logger.info('Using OpenAI to generate alt text');
        
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Generate a concise, descriptive alt text for this image that would be suitable for screen readers. Focus on the main subject and important details. Keep it under 125 characters." },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/${req.file.mimetype.split('/')[1]};base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        });
        
        altText = response.choices[0].message.content.trim();
        logger.info(`Generated alt text: ${altText}`);
      } catch (error) {
        logger.error('Error using OpenAI:', error);
        // Fall back to mock alt text
        altText = generateMockAltText(req.file.originalname);
      }
    } else {
      // Use mock alt text generator
      logger.info('Using mock alt text generator (OpenAI API key not configured)');
      altText = generateMockAltText(req.file.originalname);
    }
    
    return res.status(200).json({
      success: true,
      image: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        url: `/uploads/images/${req.file.filename}`,
      },
      altText,
    });
  } catch (error) {
    logger.error('Error generating alt text:', error);
    return res.status(500).json({ error: 'Failed to generate alt text' });
  }
};

/**
 * Analyze HTML content for images without alt text
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.analyzeImages = async (req, res) => {
  try {
    logger.info('Analyzing HTML for images without alt text');
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Parse HTML
    const root = parse(html);
    const images = root.querySelectorAll('img');
    
    logger.info(`Found ${images.length} images in HTML`);
    
    // Analyze each image
    const results = [];
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt');
      const hasAlt = alt !== null;
      const isEmpty = hasAlt && alt.trim() === '';
      
      // Determine if this is likely a decorative image
      const isLikelyDecorative = isDecorativeImage(img);
      
      // Generate suggested alt text if needed
      let suggestedAlt = null;
      
      if (!hasAlt || (alt && alt.trim().length < 5 && !isLikelyDecorative)) {
        // For non-decorative images with missing or very short alt text, suggest alt text
        suggestedAlt = generateMockAltText(path.basename(src));
      } else if (isLikelyDecorative && !isEmpty) {
        // For decorative images, suggest empty alt text
        suggestedAlt = '';
      }
      
      results.push({
        imageId: i + 1,
        src,
        currentAlt: hasAlt ? alt : '',
        hasAlt,
        isEmpty,
        isLikelyDecorative,
        suggestedAlt,
        needsAttention: !hasAlt || (isLikelyDecorative && !isEmpty) || (!isLikelyDecorative && isEmpty),
      });
    }
    
    // Filter to only images needing attention
    const issuesFound = results.filter(img => img.needsAttention);
    
    logger.info(`Found ${issuesFound.length} images needing alt text improvements`);
    
    return res.status(200).json({
      totalImages: images.length,
      issuesFound: issuesFound.length,
      images: issuesFound,
    });
  } catch (error) {
    logger.error('Error analyzing images:', error);
    return res.status(500).json({ error: 'Failed to analyze images' });
  }
};

/**
 * Check if alt text is appropriate for an image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkAltText = async (req, res) => {
  try {
    logger.info('Checking alt text quality');
    const { altText, imageContext } = req.body;

    if (!altText) {
      return res.status(400).json({ error: 'Alt text is required' });
    }

    // Analyze alt text quality
    const analysis = analyzeAltTextQuality(altText, imageContext);
    
    return res.status(200).json({
      altText,
      analysis,
    });
  } catch (error) {
    logger.error('Error checking alt text:', error);
    return res.status(500).json({ error: 'Failed to check alt text' });
  }
};

/**
 * Generate mock alt text for an image
 * @param {string} filename - Image filename
 * @returns {string} Generated alt text
 */
function generateMockAltText(filename) {
  logger.info(`Generating mock alt text for ${filename}`);
  
  // Extract potential subject from filename
  const nameWithoutExtension = path.basename(filename, path.extname(filename));
  const words = nameWithoutExtension
    .replace(/[_-]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .filter(word => word.length > 1);
  
  // If we have usable words from the filename, use them
  if (words.length > 0) {
    const subject = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    
    // Generate different types of alt text based on the subject
    const altTextTemplates = [
      `${subject} displayed prominently against a clean background`,
      `Close-up view of ${subject} showing details and features`,
      `${subject} in use, demonstrating its functionality`,
      `Illustration of ${subject} with labeled components`,
      `${subject} shown from multiple angles`,
    ];
    
    return altTextTemplates[Math.floor(Math.random() * altTextTemplates.length)];
  }
  
  // Fallback generic alt texts
  const genericAltTexts = [
    'Product image showing details and features',
    'Informational diagram explaining the concept',
    'Person demonstrating how to use the product',
    'Screenshot of the application interface',
    'Illustration of the process described in the text',
  ];
  
  return genericAltTexts[Math.floor(Math.random() * genericAltTexts.length)];
}

/**
 * Determine if an image is likely decorative
 * @param {Object} imgElement - HTML image element
 * @returns {boolean} True if the image is likely decorative
 */
function isDecorativeImage(imgElement) {
  // Check for common decorative image indicators
  
  // Check size - very small images are often decorative
  const width = parseInt(imgElement.getAttribute('width') || '0');
  const height = parseInt(imgElement.getAttribute('height') || '0');
  if ((width > 0 && width < 50) || (height > 0 && height < 50)) {
    return true;
  }
  
  // Check class names for indicators
  const className = imgElement.getAttribute('class') || '';
  if (
    className.includes('decoration') ||
    className.includes('icon') ||
    className.includes('separator') ||
    className.includes('divider') ||
    className.includes('bullet') ||
    className.includes('bg') ||
    className.includes('background')
  ) {
    return true;
  }
  
  // Check for role="presentation" or role="none"
  const role = imgElement.getAttribute('role') || '';
  if (role === 'presentation' || role === 'none') {
    return true;
  }
  
  // Check for aria-hidden="true"
  const ariaHidden = imgElement.getAttribute('aria-hidden') || '';
  if (ariaHidden === 'true') {
    return true;
  }
  
  // Check src for common decorative image patterns
  const src = imgElement.getAttribute('src') || '';
  if (
    src.includes('separator') ||
    src.includes('divider') ||
    src.includes('spacer') ||
    src.includes('blank') ||
    src.includes('icon') ||
    src.includes('bullet')
  ) {
    return true;
  }
  
  return false;
}

/**
 * Analyze alt text quality
 * @param {string} altText - Alt text to analyze
 * @param {string} imageContext - Context in which the image appears
 * @returns {Object} Analysis results
 */
function analyzeAltTextQuality(altText, imageContext) {
  logger.info(`Analyzing alt text quality: "${altText}"`);
  
  const issues = [];
  let score = 100;
  
  // Check for empty alt text
  if (!altText || altText.trim() === '') {
    issues.push('Alt text is empty');
    score -= 50;
  } else {
    // Check length
    if (altText.length < 5) {
      issues.push('Alt text is too short');
      score -= 30;
    } else if (altText.length > 125) {
      issues.push('Alt text is too long (should be under 125 characters)');
      score -= 20;
    }
    
    // Check for redundant phrases
    if (
      altText.toLowerCase().includes('image of') ||
      altText.toLowerCase().includes('picture of') ||
      altText.toLowerCase().includes('photo of')
    ) {
      issues.push('Alt text contains redundant phrases like "image of" or "picture of"');
      score -= 50;
    }
    
    // Check for file extension mentions
    if (
      altText.toLowerCase().includes('.jpg') ||
      altText.toLowerCase().includes('.png') ||
      altText.toLowerCase().includes('.gif') ||
      altText.toLowerCase().includes('.webp')
    ) {
      issues.push('Alt text contains file extensions');
      score -= 40;
    }
    
    // Check for context relevance if context is provided
    if (imageContext && imageContext.trim() !== '') {
      const contextWords = imageContext.toLowerCase().split(/\s+/);
      const altWords = altText.toLowerCase().split(/\s+/);
      
      let matchCount = 0;
      for (const word of altWords) {
        if (word.length > 3 && contextWords.includes(word)) {
          matchCount++;
        }
      }
      
      if (matchCount === 0 && altWords.length > 3) {
        issues.push('Alt text may not be relevant to the surrounding content');
        score -= 15;
      }
    }
  }
  
  // Determine quality level
  let quality;
  if (!altText || altText.trim() === '' || altText.trim().length < 5) {
    quality = 'poor';
  } else if (score >= 90) {
    quality = 'excellent';
  } else if (score >= 70) {
    quality = 'good';
  } else if (score >= 50) {
    quality = 'fair';
  } else {
    quality = 'poor';
  }
  
  return {
    score,
    quality,
    issues,
    suggestions: issues.length > 0 ? generateSuggestions(issues, altText) : [],
  };
}

/**
 * Generate suggestions for improving alt text
 * @param {Array} issues - List of identified issues
 * @param {string} altText - Current alt text
 * @returns {Array} List of suggestions
 */
function generateSuggestions(issues, altText) {
  const suggestions = [];
  
  for (const issue of issues) {
    if (issue.includes('empty')) {
      suggestions.push('Add descriptive alt text that conveys the purpose and content of the image');
    } else if (issue.includes('too short')) {
      suggestions.push('Expand the alt text to better describe the image content');
    } else if (issue.includes('too long')) {
      suggestions.push('Shorten the alt text to be more concise while keeping essential information');
    } else if (issue.includes('redundant phrases')) {
      suggestions.push('Remove phrases like "image of" or "picture of" as screen readers already announce the element as an image');
      
      // Suggest improved alt text
      if (altText) {
        const improved = altText
          .replace(/image of /i, '')
          .replace(/picture of /i, '')
          .replace(/photo of /i, '');
        suggestions.push(`Consider: "${improved}"`);
      }
    } else if (issue.includes('file extensions')) {
      suggestions.push('Remove file extensions from the alt text');
      
      // Suggest improved alt text
      if (altText) {
        const improved = altText
          .replace(/\.jpg/i, '')
          .replace(/\.png/i, '')
          .replace(/\.gif/i, '')
          .replace(/\.webp/i, '');
        suggestions.push(`Consider: "${improved}"`);
      }
    } else if (issue.includes('not be relevant')) {
      suggestions.push('Make sure the alt text relates to the context in which the image appears');
    }
  }
  
  return suggestions;
}

// Export helper functions for testing
module.exports.generateMockAltText = generateMockAltText;
module.exports.isDecorativeImage = isDecorativeImage;
module.exports.analyzeAltTextQuality = analyzeAltTextQuality; 