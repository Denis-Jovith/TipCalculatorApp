import Image from '@tiptap/extension-image';

// Adds an `align` attribute (left/center/right) rendered as a CSS class so uploaded
// images can be positioned relative to surrounding text, like Gmail/Word image wrapping.
export const ImageWithAlign = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        renderHTML: (attrs) => ({ class: `align-${attrs.align || 'center'}` }),
        parseHTML: (element) => {
          const match = element.className.match(/align-(left|center|right)/);
          return match ? match[1] : 'center';
        }
      }
    };
  }
});
