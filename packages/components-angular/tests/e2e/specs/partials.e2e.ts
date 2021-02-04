import {
  getComponentChunksLinks,
  getFontFaceStylesheet,
  getInitialStyles,
} from '@porsche-design-system/components-angular/partials';

describe('partials', () => {
  describe('getFontFaceStylesheet()', () => {
    it('should be a function', () => {
      expect(typeof getFontFaceStylesheet).toBe('function');
    });
  });

  describe('getInitialStyles()', () => {
    it('should be a function', () => {
      expect(typeof getInitialStyles).toBe('function');
    });
  });

  describe('getComponentChunksLinks()', () => {
    it('should be a function', () => {
      expect(typeof getComponentChunksLinks).toBe('function');
    });
  });
});
