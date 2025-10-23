'use client';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import React from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write something...',
  className = '',
}) => {
  const handleTextChange = (e: EditorTextChangeEvent) => {
    onChange(e.htmlValue || '');
  };

  return (
    <div className={`texteditor-comp omit-style ${className}`}>
      <Editor
        value={value}
        onTextChange={handleTextChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextEditor;
