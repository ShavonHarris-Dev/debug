'use client';

import { useRef, useCallback, useId } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { SupportedLanguage } from '@/types';

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: SupportedLanguage;
  readOnly?: boolean;
  height?: string | number;
  label: string;
  showLineNumbers?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  height = 400,
  label,
  showLineNumbers = true,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorId = useId();
  const containerId = `code-editor-${editorId}`;

  const handleEditorDidMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;

    // Improve accessibility
    const domNode = editor.getDomNode();
    if (domNode) {
      domNode.setAttribute('role', 'textbox');
      domNode.setAttribute('aria-multiline', 'true');
      domNode.setAttribute('aria-label', label);
    }

    // Focus management
    editor.onDidFocusEditorWidget(() => {
      const container = document.getElementById(containerId);
      if (container) {
        container.classList.add('ring-2', 'ring-blue-500');
      }
    });

    editor.onDidBlurEditorWidget(() => {
      const container = document.getElementById(containerId);
      if (container) {
        container.classList.remove('ring-2', 'ring-blue-500');
      }
    });
  }, [label, containerId]);

  const handleChange: OnChange = useCallback(
    (newValue) => {
      if (onChange && newValue !== undefined) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  // Map language to Monaco language ID
  const monacoLanguage = getMonacoLanguage(language);

  return (
    <div className="flex flex-col gap-2">
      <label id={`${containerId}-label`} className="sr-only">
        {label}
      </label>
      <div
        id={containerId}
        className="rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 transition-shadow"
        role="region"
        aria-labelledby={`${containerId}-label`}
      >
        <Editor
          height={height}
          language={monacoLanguage}
          value={value}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: showLineNumbers ? 'on' : 'off',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: readOnly ? 'none' : 'line',
            cursorStyle: readOnly ? 'underline' : 'line',
            domReadOnly: readOnly,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            accessibilitySupport: 'on',
            ariaLabel: label,
          }}
        />
      </div>
      {readOnly && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Read-only code view. Use keyboard to navigate: Ctrl+F to search.
        </p>
      )}
    </div>
  );
}

function getMonacoLanguage(language: SupportedLanguage): string {
  const languageMap: Record<SupportedLanguage, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    go: 'go',
    rust: 'rust',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'csharp',
    ruby: 'ruby',
    php: 'php',
    swift: 'swift',
    kotlin: 'kotlin',
    html: 'html',
    css: 'css',
    sql: 'sql',
    json: 'json',
    yaml: 'yaml',
    markdown: 'markdown',
    shell: 'shell',
  };
  return languageMap[language] || 'plaintext';
}
