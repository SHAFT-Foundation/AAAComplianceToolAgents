const { expect } = require('chai');
const sinon = require('sinon');
const altTextController = require('../controllers/altTextController');

describe('Alt Text Controller Tests', () => {
  describe('generateMockAltText function', () => {
    it('should generate alt text based on filename', () => {
      // Test with different filenames
      const filenames = [
        'product-image.jpg',
        'team_photo.png',
        'DataChart.webp',
        'random123.gif'
      ];
      
      filenames.forEach(filename => {
        const altText = altTextController.generateMockAltText(filename);
        
        // Verify alt text is generated
        expect(altText).to.be.a('string');
        expect(altText.length).to.be.greaterThan(10);
        
        // For filenames with meaningful words, the alt text should contain some of those words
        if (filename.includes('product')) {
          expect(altText.toLowerCase()).to.include('product');
        }
        if (filename.includes('team')) {
          expect(altText.toLowerCase()).to.include('team');
        }
        if (filename.includes('chart')) {
          expect(altText.toLowerCase()).to.include('chart');
        }
        
        console.log(`Filename: ${filename}, Alt text: ${altText}`);
      });
    });
  });
  
  describe('isDecorativeImage function', () => {
    it('should identify decorative images correctly', () => {
      // Test cases for decorative images
      const decorativeElements = [
        { tagName: 'img', attributes: { class: 'decoration', src: 'image.jpg' } },
        { tagName: 'img', attributes: { width: '20', height: '20', src: 'icon.png' } },
        { tagName: 'img', attributes: { role: 'presentation', src: 'divider.png' } },
        { tagName: 'img', attributes: { 'aria-hidden': 'true', src: 'background.jpg' } },
        { tagName: 'img', attributes: { src: 'separator.png' } }
      ];
      
      decorativeElements.forEach(element => {
        // Create a mock element
        const mockElement = {
          tagName: element.tagName,
          hasAttribute: attr => element.attributes[attr] !== undefined,
          getAttribute: attr => element.attributes[attr],
          classNames: element.attributes.class || ''
        };
        
        // Check if identified as decorative
        const isDecorative = altTextController.isDecorativeImage(mockElement);
        expect(isDecorative).to.be.true;
      });
    });
    
    it('should identify non-decorative images correctly', () => {
      // Test cases for non-decorative images
      const contentElements = [
        { tagName: 'img', attributes: { src: 'product.jpg', alt: 'Product image' } },
        { tagName: 'img', attributes: { width: '300', height: '200', src: 'team.jpg' } },
        { tagName: 'img', attributes: { class: 'content-image', src: 'chart.png' } }
      ];
      
      contentElements.forEach(element => {
        // Create a mock element
        const mockElement = {
          tagName: element.tagName,
          hasAttribute: attr => element.attributes[attr] !== undefined,
          getAttribute: attr => element.attributes[attr],
          classNames: element.attributes.class || ''
        };
        
        // Check if identified as non-decorative
        const isDecorative = altTextController.isDecorativeImage(mockElement);
        expect(isDecorative).to.be.false;
      });
    });
  });
  
  describe('analyzeAltTextQuality function', () => {
    it('should analyze alt text quality correctly', () => {
      // Test cases for alt text quality
      const testCases = [
        { 
          altText: '', 
          expected: { quality: 'poor', issues: ['Alt text is empty'] } 
        },
        { 
          altText: 'img', 
          expected: { quality: 'poor', issues: ['Alt text is too short'] } 
        },
        { 
          altText: 'image of a product', 
          expected: { quality: 'fair', issues: ['Alt text contains redundant phrases like "image of" or "picture of"'] } 
        },
        { 
          altText: 'A detailed chart showing quarterly sales data with an upward trend in Q4', 
          expected: { quality: 'excellent', issues: [] } 
        },
        { 
          altText: 'logo.jpg', 
          expected: { quality: 'fair', issues: ['Alt text contains file extensions'] } 
        }
      ];
      
      testCases.forEach(test => {
        const analysis = altTextController.analyzeAltTextQuality(test.altText);
        
        // Check quality rating
        expect(analysis.quality).to.equal(test.expected.quality);
        
        // Check issues
        test.expected.issues.forEach(issue => {
          expect(analysis.issues).to.include(issue);
        });
        
        // Check suggestions
        if (test.expected.issues.length > 0) {
          expect(analysis.suggestions.length).to.be.greaterThan(0);
        }
        
        console.log(`Alt text: "${test.altText}", Quality: ${analysis.quality}, Issues: ${analysis.issues.length}`);
      });
    });
  });
}); 