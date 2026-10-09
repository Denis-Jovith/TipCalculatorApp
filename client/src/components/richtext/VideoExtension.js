import { Node, mergeAttributes } from '@tiptap/core';

// A minimal <video> node so the rich-text editor can embed uploaded video files
// (not just YouTube links) directly in body content, same as images.
export const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      align: { default: 'center' }
    };
  },

  parseHTML() {
    return [{ tag: 'video[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { align, ...rest } = HTMLAttributes;
    return [
      'video',
      mergeAttributes(rest, {
        class: `align-${align || 'center'}`,
        controls: 'true',
        style: 'max-width:100%;border-radius:0.75rem;'
      })
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: options })
    };
  }
});
