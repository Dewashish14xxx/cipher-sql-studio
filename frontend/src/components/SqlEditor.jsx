import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';

function SqlEditor({ value, onChange, onExecute, isLoading }) {
    const { theme } = useTheme();

    const handleKeyDown = (e) => {
        // Ctrl+Enter or Cmd+Enter to run query
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            onExecute();
        }
    };

    return (
        <div className="editor-section__monaco" onKeyDown={handleKeyDown}>
            <Editor
                height="100%"
                language="sql"
                value={value}
                onChange={onChange}
                theme={theme === 'dark' ? "vs-dark" : "vs-light"}
                options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    automaticLayout: true,
                    tabSize: 2,
                    padding: { top: 12 },
                    contextmenu: false,
                    suggest: {
                        showKeywords: true,
                    },
                }}
            />
        </div>
    );
}

export default SqlEditor;
