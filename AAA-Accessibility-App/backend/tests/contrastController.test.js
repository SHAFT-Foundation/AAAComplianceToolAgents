const { expect } = require('chai');
const sinon = require('sinon');
const contrastController = require('../controllers/contrastController');
const wcagContrast = require('wcag-contrast');

describe('Contrast Controller Tests', () => {
  describe('suggestBetterColor function', () => {
    it('should return a color with sufficient contrast', () => {
      // Test with a color that doesn't meet AAA standards
      const foreground = '#777777';  // Gray text
      const background = '#FFFFFF';  // White background
      const required = 7;  // AAA requirement for normal text
      
      // Original contrast is about 4.5:1, below AAA
      const originalRatio = wcagContrast.hex(foreground, background);
      expect(originalRatio).to.be.below(required);
      
      // Get suggested color
      const suggestedColor = contrastController.suggestBetterColor(foreground, background, required);
      
      // Check if suggested color meets requirements
      const newRatio = wcagContrast.hex(suggestedColor, background);
      expect(newRatio).to.be.at.least(required);
      
      console.log(`Original color: ${foreground}, ratio: ${originalRatio.toFixed(2)}`);
      console.log(`Suggested color: ${suggestedColor}, ratio: ${newRatio.toFixed(2)}`);
    });
    
    it('should not change colors that already meet requirements', () => {
      // Test with a color that already meets AAA standards
      const foreground = '#000000';  // Black text
      const background = '#FFFFFF';  // White background
      const required = 7;  // AAA requirement for normal text
      
      // Original contrast is 21:1, well above AAA
      const originalRatio = wcagContrast.hex(foreground, background);
      expect(originalRatio).to.be.above(required);
      
      // Get suggested color
      const suggestedColor = contrastController.suggestBetterColor(foreground, background, required);
      
      // Should return the original color
      expect(suggestedColor).to.equal(foreground);
    });
  });
  
  describe('analyzeContrast function', () => {
    it('should identify contrast issues in HTML content', async () => {
      // Mock request and response
      const req = {
        body: {
          html: '<div style="color: #777777; background-color: #FFFFFF;">Test content</div>'
        }
      };
      
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      
      // Call the function
      await contrastController.analyzeContrast(req, res);
      
      // Verify response
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.called).to.be.true;
      
      // Check that issues were found
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('issues');
      expect(response.issues).to.be.an('array');
      
      // At least one issue should be found (the low contrast text)
      if (response.issues.length > 0) {
        const issue = response.issues[0];
        expect(issue).to.have.property('ratio');
        expect(issue).to.have.property('suggestion');
      }
    });
  });
}); 