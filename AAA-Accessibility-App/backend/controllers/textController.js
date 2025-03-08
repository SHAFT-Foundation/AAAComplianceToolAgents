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
 * Simplify complex text for better readability
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.simplifyText = async (req, res) => {
  try {
    logger.info('Simplifying text for better readability');
    const { text, targetReadingLevel = 'grade6' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Simplify text
    let simplifiedText;
    let readingLevel;
    
    if (openai) {
      // Use OpenAI to simplify text
      try {
        logger.info('Using OpenAI to simplify text');
        
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an expert in simplifying text to make it more accessible. 
              Simplify the provided text to approximately a ${targetReadingLevel} reading level. 
              Maintain all the important information but use simpler words, shorter sentences, and clearer structure. 
              Do not add any explanatory text or commentary - just return the simplified version.`
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });
        
        simplifiedText = response.choices[0].message.content.trim();
        readingLevel = await analyzeTextReadingLevel(simplifiedText);
        logger.info(`Generated simplified text at reading level: ${readingLevel}`);
      } catch (error) {
        logger.error('Error using OpenAI:', error);
        // Fall back to mock simplification
        const result = mockSimplifyText(text);
        simplifiedText = result.simplifiedText;
        readingLevel = result.readingLevel;
      }
    } else {
      // Use mock text simplifier
      logger.info('Using mock text simplifier (OpenAI API key not configured)');
      const result = mockSimplifyText(text);
      simplifiedText = result.simplifiedText;
      readingLevel = result.readingLevel;
    }
    
    return res.status(200).json({
      original: {
        text,
        readingLevel: await analyzeTextReadingLevel(text),
      },
      simplified: {
        text: simplifiedText,
        readingLevel,
      },
      targetReadingLevel,
    });
  } catch (error) {
    logger.error('Error simplifying text:', error);
    return res.status(500).json({ error: 'Failed to simplify text' });
  }
};

/**
 * Analyze text readability level
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.analyzeReadability = async (req, res) => {
  try {
    logger.info('Analyzing text readability');
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Analyze readability
    const readingLevel = await analyzeTextReadingLevel(text);
    const fleschKincaidScore = calculateFleschKincaidScore(text);
    const averageSentenceLength = calculateAverageSentenceLength(text);
    const averageWordLength = calculateAverageWordLength(text);
    
    // Determine if the text meets WCAG 2.1 AAA requirements (3.1.5 Reading Level)
    // AAA requires content to be understandable by people with lower secondary education level
    const meetsWcagAAA = fleschKincaidScore >= 60; // Approximately grade 8-9 level
    
    return res.status(200).json({
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      readingLevel,
      fleschKincaidScore,
      averageSentenceLength,
      averageWordLength,
      meetsWcagAAA,
      recommendations: !meetsWcagAAA ? generateReadabilityRecommendations(text) : [],
    });
  } catch (error) {
    logger.error('Error analyzing readability:', error);
    return res.status(500).json({ error: 'Failed to analyze readability' });
  }
};

/**
 * Identify unusual words and provide definitions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.identifyUnusualWords = async (req, res) => {
  try {
    logger.info('Identifying unusual words');
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Identify unusual words
    const unusualWords = findUnusualWords(text);
    
    return res.status(200).json({
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      unusualWords,
    });
  } catch (error) {
    logger.error('Error identifying unusual words:', error);
    return res.status(500).json({ error: 'Failed to identify unusual words' });
  }
};

/**
 * Identify abbreviations and provide expansions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.identifyAbbreviations = async (req, res) => {
  try {
    logger.info('Identifying abbreviations');
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Identify abbreviations
    const abbreviations = findAbbreviations(text);
    
    return res.status(200).json({
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      abbreviations,
    });
  } catch (error) {
    logger.error('Error identifying abbreviations:', error);
    return res.status(500).json({ error: 'Failed to identify abbreviations' });
  }
};

/**
 * Provide pronunciation guidance for words
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.providePronunciation = async (req, res) => {
  try {
    logger.info('Providing pronunciation guidance');
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Find words that need pronunciation guidance
    const pronunciationGuidance = findPronunciationIssues(text);
    
    return res.status(200).json({
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      pronunciationGuidance,
    });
  } catch (error) {
    logger.error('Error providing pronunciation guidance:', error);
    return res.status(500).json({ error: 'Failed to provide pronunciation guidance' });
  }
};

/**
 * Mock function to simplify text
 * @param {string} text - Original text
 * @returns {Object} Simplified text and reading level
 */
function mockSimplifyText(text) {
  logger.info('Using mock text simplification');
  
  // This is a very simplified implementation
  // A real implementation would use NLP techniques or AI to simplify text
  
  // Replace complex words with simpler alternatives
  const simplifications = {
    'utilize': 'use',
    'implementation': 'use',
    'functionality': 'features',
    'subsequently': 'later',
    'demonstrate': 'show',
    'sufficient': 'enough',
    'additional': 'more',
    'approximately': 'about',
    'requirements': 'needs',
    'modification': 'change',
    'assistance': 'help',
    'initiate': 'start',
    'terminate': 'end',
    'comprehend': 'understand',
    'endeavor': 'try',
  };
  
  let simplifiedText = text;
  
  // Replace complex words
  Object.keys(simplifications).forEach(complex => {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    simplifiedText = simplifiedText.replace(regex, simplifications[complex]);
  });
  
  // Break long sentences
  simplifiedText = breakLongSentences(simplifiedText);
  
  return {
    simplifiedText,
    readingLevel: 'grade6', // Mock reading level
  };
}

/**
 * Break long sentences into shorter ones
 * @param {string} text - Text to process
 * @returns {string} Text with shorter sentences
 */
function breakLongSentences(text) {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // Process each sentence
  const processedSentences = sentences.map(sentence => {
    // If sentence is short enough, return as is
    if (sentence.split(' ').length <= 15) {
      return sentence;
    }
    
    // Try to break at conjunctions
    const conjunctions = [', and ', ', but ', ', or ', ', so ', ', yet ', ', for ', ', nor '];
    
    for (const conjunction of conjunctions) {
      if (sentence.includes(conjunction)) {
        return sentence.replace(conjunction, '. ');
      }
    }
    
    // If no conjunctions found, return as is
    return sentence;
  });
  
  return processedSentences.join(' ');
}

/**
 * Analyze text reading level
 * @param {string} text - Text to analyze
 * @returns {string} Reading level
 */
async function analyzeTextReadingLevel(text) {
  // Calculate Flesch-Kincaid score
  const score = calculateFleschKincaidScore(text);
  
  // Map score to reading level
  if (score >= 90) return 'grade5';
  if (score >= 80) return 'grade6';
  if (score >= 70) return 'grade7';
  if (score >= 60) return 'grade8-9';
  if (score >= 50) return 'grade10-12';
  if (score >= 30) return 'college';
  return 'graduate';
}

/**
 * Calculate Flesch-Kincaid readability score
 * @param {string} text - Text to analyze
 * @returns {number} Flesch-Kincaid score (0-100)
 */
function calculateFleschKincaidScore(text) {
  // Count sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const sentenceCount = sentences.length;
  
  // Count words
  const words = text.match(/\b\w+\b/g) || [];
  const wordCount = words.length;
  
  // Count syllables
  let syllableCount = 0;
  words.forEach(word => {
    syllableCount += countSyllables(word);
  });
  
  // Calculate Flesch-Kincaid Reading Ease score
  // Formula: 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  if (sentenceCount === 0 || wordCount === 0) return 0;
  
  const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
  
  // Clamp score to 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Count syllables in a word
 * @param {string} word - Word to count syllables for
 * @returns {number} Number of syllables
 */
function countSyllables(word) {
  word = word.toLowerCase();
  
  // Remove non-alphabetic characters
  word = word.replace(/[^a-z]/g, '');
  
  // Special cases
  if (word.length <= 3) return 1;
  
  // Remove ending 'e', except for 'le'
  word = word.replace(/(?:[^l]e|ed|es)$/, '');
  
  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  return vowelGroups ? vowelGroups.length : 1;
}

/**
 * Calculate average sentence length
 * @param {string} text - Text to analyze
 * @returns {number} Average sentence length in words
 */
function calculateAverageSentenceLength(text) {
  // Count sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const sentenceCount = sentences.length;
  
  // Count words
  const words = text.match(/\b\w+\b/g) || [];
  const wordCount = words.length;
  
  return sentenceCount > 0 ? wordCount / sentenceCount : wordCount;
}

/**
 * Calculate average word length
 * @param {string} text - Text to analyze
 * @returns {number} Average word length in characters
 */
function calculateAverageWordLength(text) {
  // Count words
  const words = text.match(/\b\w+\b/g) || [];
  const wordCount = words.length;
  
  // Count characters
  const charCount = words.reduce((total, word) => total + word.length, 0);
  
  return wordCount > 0 ? charCount / wordCount : 0;
}

/**
 * Generate recommendations for improving readability
 * @param {string} text - Text to analyze
 * @returns {Array} List of recommendations
 */
function generateReadabilityRecommendations(text) {
  const recommendations = [];
  
  // Check sentence length
  const avgSentenceLength = calculateAverageSentenceLength(text);
  if (avgSentenceLength > 15) {
    recommendations.push('Use shorter sentences (aim for 15 words or fewer per sentence)');
  }
  
  // Check word length
  const avgWordLength = calculateAverageWordLength(text);
  if (avgWordLength > 5) {
    recommendations.push('Use shorter, simpler words where possible');
  }
  
  // Check for passive voice
  if (/\b(is|are|was|were|be|been|being)\s+\w+ed\b/i.test(text)) {
    recommendations.push('Reduce use of passive voice; use active voice instead');
  }
  
  // Check for complex words
  const complexWords = [
    'utilize', 'implementation', 'functionality', 'subsequently', 'demonstrate',
    'sufficient', 'additional', 'approximately', 'requirements', 'modification',
    'assistance', 'initiate', 'terminate', 'comprehend', 'endeavor',
  ];
  
  const foundComplexWords = complexWords.filter(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(text);
  });
  
  if (foundComplexWords.length > 0) {
    recommendations.push(`Replace complex words like: ${foundComplexWords.join(', ')}`);
  }
  
  // Add general recommendations
  recommendations.push('Use bullet points for lists');
  recommendations.push('Add headings and subheadings to break up text');
  
  return recommendations;
}

/**
 * Find unusual words in text
 * @param {string} text - Text to analyze
 * @returns {Array} List of unusual words with definitions
 */
function findUnusualWords(text) {
  // This is a simplified implementation
  // A real implementation would use a dictionary or NLP to identify unusual words
  
  // Common unusual words with definitions
  const unusualWordsDict = {
    'paradigm': 'A typical example or pattern of something; a model',
    'ubiquitous': 'Present, appearing, or found everywhere',
    'mitigate': 'Make less severe, serious, or painful',
    'caveat': 'A warning or proviso of specific stipulations, conditions, or limitations',
    'cognizant': 'Having knowledge or awareness',
    'esoteric': 'Intended for or likely to be understood by only a small number of people with specialized knowledge',
    'juxtaposition': 'The fact of two things being seen or placed close together with contrasting effect',
    'paradigm': 'A typical example or pattern of something; a model',
    'panacea': 'A solution or remedy for all difficulties or diseases',
    'pragmatic': 'Dealing with things sensibly and realistically',
    'quintessential': 'Representing the most perfect or typical example of a quality or class',
    'rhetoric': 'The art of effective or persuasive speaking or writing',
    'superfluous': 'Unnecessary, especially through being more than enough',
    'sycophant': 'A person who acts obsequiously toward someone important in order to gain advantage',
    'verbose': 'Using or containing more words than are necessary',
  };
  
  // Extract words from text
  const words = text.match(/\b[a-zA-Z]{5,}\b/g) || [];
  const uniqueWords = [...new Set(words.map(word => word.toLowerCase()))];
  
  // Find unusual words
  const foundUnusualWords = [];
  
  for (const word of uniqueWords) {
    if (unusualWordsDict[word]) {
      // Find the word in context
      const regex = new RegExp(`[^.!?]*\\b${word}\\b[^.!?]*[.!?]`, 'i');
      const context = text.match(regex);
      
      foundUnusualWords.push({
        word,
        definition: unusualWordsDict[word],
        context: context ? context[0].trim() : null,
      });
    }
  }
  
  return foundUnusualWords;
}

/**
 * Find abbreviations in text
 * @param {string} text - Text to analyze
 * @returns {Array} List of abbreviations with expansions
 */
function findAbbreviations(text) {
  // This is a simplified implementation
  // A real implementation would use more sophisticated pattern matching
  
  // Common abbreviations with expansions
  const abbreviationsDict = {
    'WCAG': 'Web Content Accessibility Guidelines',
    'HTML': 'Hypertext Markup Language',
    'CSS': 'Cascading Style Sheets',
    'JS': 'JavaScript',
    'API': 'Application Programming Interface',
    'UI': 'User Interface',
    'UX': 'User Experience',
    'a11y': 'Accessibility',
    'i18n': 'Internationalization',
    'l10n': 'Localization',
    'CMS': 'Content Management System',
    'SEO': 'Search Engine Optimization',
    'W3C': 'World Wide Web Consortium',
    'WAI': 'Web Accessibility Initiative',
    'ARIA': 'Accessible Rich Internet Applications',
    'ADA': 'Americans with Disabilities Act',
    'JAWS': 'Job Access With Speech',
    'NVDA': 'NonVisual Desktop Access',
  };
  
  // Find abbreviations in text
  const foundAbbreviations = [];
  
  for (const abbr in abbreviationsDict) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'g');
    if (regex.test(text)) {
      // Find the abbreviation in context
      const contextRegex = new RegExp(`[^.!?]*\\b${abbr}\\b[^.!?]*[.!?]`, 'i');
      const context = text.match(contextRegex);
      
      foundAbbreviations.push({
        abbreviation: abbr,
        expansion: abbreviationsDict[abbr],
        context: context ? context[0].trim() : null,
      });
    }
  }
  
  // Look for potential abbreviations (uppercase words)
  const potentialAbbrs = text.match(/\b[A-Z]{2,}\b/g) || [];
  const uniquePotentialAbbrs = [...new Set(potentialAbbrs)];
  
  for (const abbr of uniquePotentialAbbrs) {
    if (!abbreviationsDict[abbr]) {
      // Find the abbreviation in context
      const contextRegex = new RegExp(`[^.!?]*\\b${abbr}\\b[^.!?]*[.!?]`, 'i');
      const context = text.match(contextRegex);
      
      foundAbbreviations.push({
        abbreviation: abbr,
        expansion: null, // Unknown expansion
        context: context ? context[0].trim() : null,
        needsExpansion: true,
      });
    }
  }
  
  return foundAbbreviations;
}

/**
 * Find words that need pronunciation guidance
 * @param {string} text - Text to analyze
 * @returns {Array} List of words with pronunciation guidance
 */
function findPronunciationIssues(text) {
  // This is a simplified implementation
  // A real implementation would use a pronunciation dictionary or API
  
  // Words with ambiguous pronunciation
  const pronunciationDict = {
    'read': {
      word: 'read',
      pronunciations: [
        { pronunciation: 'reed', context: 'present tense', example: 'I read [reed] books every day.' },
        { pronunciation: 'red', context: 'past tense', example: 'I read [red] that book last week.' },
      ],
    },
    'lead': {
      word: 'lead',
      pronunciations: [
        { pronunciation: 'leed', context: 'verb (to guide)', example: 'She will lead [leed] the team to victory.' },
        { pronunciation: 'led', context: 'noun (metal)', example: 'The pipe is made of lead [led].' },
      ],
    },
    'wind': {
      word: 'wind',
      pronunciations: [
        { pronunciation: 'wind', context: 'moving air', example: 'The wind [wind] is blowing strongly today.' },
        { pronunciation: 'wynd', context: 'to turn', example: 'Wind [wynd] the clock before going to bed.' },
      ],
    },
    'tear': {
      word: 'tear',
      pronunciations: [
        { pronunciation: 'teer', context: 'liquid from eye', example: 'A tear [teer] rolled down her cheek.' },
        { pronunciation: 'tair', context: 'to rip', example: 'Be careful not to tear [tair] the paper.' },
      ],
    },
    'bow': {
      word: 'bow',
      pronunciations: [
        { pronunciation: 'bau', context: 'to bend forward', example: 'The performers bow [bau] to the audience.' },
        { pronunciation: 'boh', context: 'weapon for arrows', example: 'He used a bow [boh] and arrow for hunting.' },
      ],
    },
    'live': {
      word: 'live',
      pronunciations: [
        { pronunciation: 'liv', context: 'to be alive', example: 'They live [liv] in a small town.' },
        { pronunciation: 'lyve', context: 'happening now', example: 'The concert is live [lyve] tonight.' },
      ],
    },
    'content': {
      word: 'content',
      pronunciations: [
        { pronunciation: 'KON-tent', context: 'noun (material)', example: 'The content [KON-tent] of the book was interesting.' },
        { pronunciation: 'kun-TENT', context: 'adjective (satisfied)', example: 'She felt content [kun-TENT] with her decision.' },
      ],
    },
  };
  
  // Find words that need pronunciation guidance
  const foundPronunciationIssues = [];
  
  for (const word in pronunciationDict) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(text)) {
      // Find the word in context
      const contextRegex = new RegExp(`[^.!?]*\\b${word}\\b[^.!?]*[.!?]`, 'gi');
      const contexts = text.match(contextRegex) || [];
      
      foundPronunciationIssues.push({
        ...pronunciationDict[word],
        contexts: contexts.map(ctx => ctx.trim()),
      });
    }
  }
  
  return foundPronunciationIssues;
} 