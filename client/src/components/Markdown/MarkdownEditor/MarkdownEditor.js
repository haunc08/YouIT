import React, { useMemo, } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import hljs from "highlight.js"

/**
 * @param {{style: React.CSSProperties, text: string, setText, placeholder: string}} param0 
 */
function MarkdownEditor({ text, setText, style, placeholder }) {
  /**
   * @type {EasyMDE.Options}
   */
  const mdeOptions = useMemo(() => {
    return {
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
        hljs,
      },
      parsingConfig: {
        allowAtxHeaderWithoutSpace: true,
        strikethrough: true,
      },
      previewImagesInEditor: true,
      placeholder: placeholder,
      spellChecker: false,
      // uploadImage: true,
      toolbar: [
        'heading', 'bold', 'italic', 'strikethrough', 'code', '|',
        'link', 'image', 'quote', 'unordered-list', 'ordered-list', 'table', 'horizontal-rule', '|',
        'side-by-side', 'preview', 'fullscreen', '|',
        'redo', 'undo', 'guide',
      ],
    };
  }, [])

  return (
    <div>
      <SimpleMDE
        value={text}
        onChange={setText}
        options={mdeOptions}
        style={style}
      />
    </div>
  );
}

export default MarkdownEditor;
