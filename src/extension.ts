import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// ─── E++ Keyword Definitions ────────────────────────────────────────────────

const EPP_KEYWORDS: { label: string; kind: vscode.CompletionItemKind; detail: string; cppEquiv: string; doc?: string }[] = [
  // Types
  { label: 'nerb',      kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'int',       doc: 'Integer type (32-bit signed)' },
  { label: 'flerb',     kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'float',     doc: 'Single-precision floating point' },
  { label: 'derb',      kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'double',    doc: 'Double-precision floating point' },
  { label: 'cherb',     kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'char',      doc: 'Character type (8-bit)' },
  { label: 'blerb',     kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'bool',      doc: 'Boolean type' },
  { label: 'verbd',     kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'void',      doc: 'No type / void' },
  { label: 'lerbon',    kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'long',      doc: 'Long integer type' },
  { label: 'sherb',     kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'short',     doc: 'Short integer type' },
  { label: 'sterbing',  kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'string/static', doc: 'String type OR static modifier (context-dependent)' },
  { label: 'auerb',     kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'auto',      doc: 'Auto type deduction' },
  { label: 'unserb',    kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'unsigned',  doc: 'Unsigned modifier' },
  { label: 'signerb',   kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'signed',    doc: 'Signed modifier' },
  { label: 'typerbn',   kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'typename',  doc: 'Template type parameter' },
  { label: 'typerb',    kind: vscode.CompletionItemKind.Keyword,  detail: 'type',    cppEquiv: 'typedef',   doc: 'Type alias declaration' },

  // Control flow
  { label: 'iferb',       kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'if',        doc: 'Conditional branch' },
  { label: 'elserb',      kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'else',      doc: 'Else branch' },
  { label: 'elserbiferb', kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'else if',   doc: 'Else-if branch' },
  { label: 'swerb',       kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'switch',    doc: 'Switch statement' },
  { label: 'caserb',      kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'case',      doc: 'Switch case label' },
  { label: 'deferb',      kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'default',   doc: 'Switch default case' },
  { label: 'brerb',       kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'break',     doc: 'Break out of loop or switch' },
  { label: 'conterb',     kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'continue',  doc: 'Continue to next iteration' },
  { label: 'returnerb',   kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'return',    doc: 'Return from function' },
  { label: 'goerb',       kind: vscode.CompletionItemKind.Keyword, detail: 'control', cppEquiv: 'goto',      doc: 'Jump to label (use sparingly!)' },

  // Loops
  { label: 'ferb',   kind: vscode.CompletionItemKind.Keyword, detail: 'loop', cppEquiv: 'for',   doc: 'For loop' },
  { label: 'wherb',  kind: vscode.CompletionItemKind.Keyword, detail: 'loop', cppEquiv: 'while', doc: 'While loop' },
  { label: 'doerb',  kind: vscode.CompletionItemKind.Keyword, detail: 'loop', cppEquiv: 'do',    doc: 'Do-while loop' },

  // OOP
  { label: 'clerb',    kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'class',     doc: 'Class definition' },
  { label: 'sterb',    kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'struct',    doc: 'Struct definition' },
  { label: 'enerb',    kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'enum',      doc: 'Enum definition' },
  { label: 'unerb',    kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'union',     doc: 'Union definition' },
  { label: 'namerberb',kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'namespace', doc: 'Namespace declaration' },
  { label: 'temperb',  kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'template',  doc: 'Template declaration' },
  { label: 'verbtual', kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'virtual',   doc: 'Virtual method' },
  { label: 'overberb', kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'override',  doc: 'Override virtual method' },
  { label: 'finerb',   kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'final',     doc: 'Prevent further inheritance' },
  { label: 'plerb',    kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'public',    doc: 'Public access specifier' },
  { label: 'priverb',  kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'private',   doc: 'Private access specifier' },
  { label: 'proterb',  kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'protected', doc: 'Protected access specifier' },
  { label: 'frerb',    kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'friend',    doc: 'Friend class/function' },
  { label: 'therb',    kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'this',      doc: 'Pointer to current instance' },
  { label: 'nerbd',    kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'new',       doc: 'Allocate dynamic memory' },
  { label: 'delerb',   kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'delete',    doc: 'Free dynamic memory' },
  { label: 'operberb', kind: vscode.CompletionItemKind.Keyword, detail: 'oop', cppEquiv: 'operator',  doc: 'Operator overload' },

  // Storage
  { label: 'consterb',  kind: vscode.CompletionItemKind.Keyword, detail: 'modifier', cppEquiv: 'const',    doc: 'Constant value' },
  { label: 'exterberb', kind: vscode.CompletionItemKind.Keyword, detail: 'modifier', cppEquiv: 'extern',   doc: 'External linkage' },
  { label: 'inlerb',    kind: vscode.CompletionItemKind.Keyword, detail: 'modifier', cppEquiv: 'inline',   doc: 'Inline function hint' },
  { label: 'volerb',    kind: vscode.CompletionItemKind.Keyword, detail: 'modifier', cppEquiv: 'volatile', doc: 'Volatile memory access' },
  { label: 'sizerb',    kind: vscode.CompletionItemKind.Keyword, detail: 'modifier', cppEquiv: 'sizeof',   doc: 'Size of type or value' },

  // Exceptions
  { label: 'tryerb',   kind: vscode.CompletionItemKind.Keyword, detail: 'exception', cppEquiv: 'try',   doc: 'Begin try block' },
  { label: 'catcherb', kind: vscode.CompletionItemKind.Keyword, detail: 'exception', cppEquiv: 'catch', doc: 'Catch exception' },
  { label: 'thowerb',  kind: vscode.CompletionItemKind.Keyword, detail: 'exception', cppEquiv: 'throw', doc: 'Throw exception' },

  // Constants
  { label: 'truerb',  kind: vscode.CompletionItemKind.Value, detail: 'constant', cppEquiv: 'true',    doc: 'Boolean true' },
  { label: 'falserb', kind: vscode.CompletionItemKind.Value, detail: 'constant', cppEquiv: 'false',   doc: 'Boolean false' },
  { label: 'nullerb', kind: vscode.CompletionItemKind.Value, detail: 'constant', cppEquiv: 'nullptr', doc: 'Null pointer constant' },

  // I/O
  { label: 'cerbt',   kind: vscode.CompletionItemKind.Function, detail: 'io', cppEquiv: 'cout',   doc: 'Standard output stream' },
  { label: 'cinnerb', kind: vscode.CompletionItemKind.Function, detail: 'io', cppEquiv: 'cin',    doc: 'Standard input stream' },
  { label: 'endlerb', kind: vscode.CompletionItemKind.Variable, detail: 'io', cppEquiv: 'endl',   doc: 'End line and flush' },

  // Using / namespace
  { label: 'userbing', kind: vscode.CompletionItemKind.Keyword, detail: 'using',  cppEquiv: 'using',     doc: 'Using declaration or directive' },
  { label: 'sterbd',   kind: vscode.CompletionItemKind.Module,  detail: 'stdlib', cppEquiv: 'std',       doc: 'Standard library namespace' },

  // Preprocessor
  { label: '#inclerb',    kind: vscode.CompletionItemKind.Keyword, detail: 'preprocessor', cppEquiv: '#include', doc: 'Include header file' },
  { label: '#deferberb',  kind: vscode.CompletionItemKind.Keyword, detail: 'preprocessor', cppEquiv: '#define',  doc: 'Define macro' },
  { label: '#praerb',     kind: vscode.CompletionItemKind.Keyword, detail: 'preprocessor', cppEquiv: '#pragma',  doc: 'Compiler pragma' },
  { label: '#ifnerb',     kind: vscode.CompletionItemKind.Keyword, detail: 'preprocessor', cppEquiv: '#ifndef',  doc: 'If not defined guard' },
  { label: '#ifderb',     kind: vscode.CompletionItemKind.Keyword, detail: 'preprocessor', cppEquiv: '#ifdef',   doc: 'If defined' },
  { label: '#endifberb',  kind: vscode.CompletionItemKind.Keyword, detail: 'preprocessor', cppEquiv: '#endif',   doc: 'End preprocessor block' },
  { label: '#unerberb',   kind: vscode.CompletionItemKind.Keyword, detail: 'preprocessor', cppEquiv: '#undef',   doc: 'Undefine macro' },
];

// ─── Diagnostic Rules ───────────────────────────────────────────────────────

// C++ keywords that must NOT appear in E++ source
const BANNED_CPP_KEYWORDS = [
  'int', 'float', 'double', 'char', 'bool', 'void', 'long', 'short', 'auto',
  'unsigned', 'signed', 'if', 'else', 'switch', 'case', 'default', 'break',
  'continue', 'return', 'goto', 'for', 'while', 'do', 'class', 'struct',
  'enum', 'union', 'namespace', 'template', 'typename', 'virtual', 'override',
  'final', 'public', 'private', 'protected', 'friend', 'this', 'new', 'delete',
  'operator', 'const', 'static', 'extern', 'inline', 'volatile', 'sizeof',
  'typedef', 'try', 'catch', 'throw', 'true', 'false', 'nullptr',
  '#include', '#define', '#pragma', '#ifndef', '#ifdef', '#endif', '#undef',
  'cout', 'cin', 'endl', 'using', 'std'
];

// Map banned C++ keywords → their E++ replacements
const CPP_TO_EPP: Record<string, string> = {
  'int': 'nerb', 'float': 'flerb', 'double': 'derb', 'char': 'cherb',
  'bool': 'blerb', 'void': 'verbd', 'long': 'lerbon', 'short': 'sherb',
  'auto': 'auerb', 'unsigned': 'unserb', 'signed': 'signerb',
  'if': 'iferb', 'else': 'elserb', 'switch': 'swerb', 'case': 'caserb',
  'default': 'deferb', 'break': 'brerb', 'continue': 'conterb',
  'return': 'returnerb', 'goto': 'goerb', 'for': 'ferb', 'while': 'wherb',
  'do': 'doerb', 'class': 'clerb', 'struct': 'sterb', 'enum': 'enerb',
  'union': 'unerb', 'namespace': 'namerberb', 'template': 'temperb',
  'typename': 'typerbn', 'virtual': 'verbtual', 'override': 'overberb',
  'final': 'finerb', 'public': 'plerb', 'private': 'priverb',
  'protected': 'proterb', 'friend': 'frerb', 'this': 'therb',
  'new': 'nerbd', 'delete': 'delerb', 'operator': 'operberb',
  'const': 'consterb', 'static': 'sterbing', 'extern': 'exterberb',
  'inline': 'inlerb', 'volatile': 'volerb', 'sizeof': 'sizerb',
  'typedef': 'typerb', 'try': 'tryerb', 'catch': 'catcherb',
  'throw': 'thowerb', 'true': 'truerb', 'false': 'falserb',
  'nullptr': 'nullerb', '#include': '#inclerb', '#define': '#deferberb',
  '#pragma': '#praerb', '#ifndef': '#ifnerb', '#ifdef': '#ifderb',
  '#endif': '#endifberb', '#undef': '#unerberb', 'cout': 'cerbt',
  'cin': 'cinnerb', 'endl': 'endlerb', 'using': 'userbing', 'std': 'sterbd',
};

// ─── Diagnostics Provider ───────────────────────────────────────────────────

const diagnosticCollection = vscode.languages.createDiagnosticCollection('epp');

function runDiagnostics(document: vscode.TextDocument): void {
  if (document.languageId !== 'epp') { return; }

  const diagnostics: vscode.Diagnostic[] = [];
  const text = document.getText();
  const lines = text.split('\n');

  lines.forEach((line, lineIndex) => {
    // Skip pure comment lines
    const stripped = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');

    // Skip string contents for keyword scanning
    const noStrings = stripped.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");

    BANNED_CPP_KEYWORDS.forEach(kw => {
      // Match whole word (or preprocessor directive)
      const pattern = kw.startsWith('#')
        ? new RegExp(`${kw.replace('#', '\\#')}\\b`, 'g')
        : new RegExp(`\\b${kw}\\b`, 'g');

      let match: RegExpExecArray | null;
      while ((match = pattern.exec(noStrings)) !== null) {
        const start = new vscode.Position(lineIndex, match.index);
        const end = new vscode.Position(lineIndex, match.index + kw.length);
        const range = new vscode.Range(start, end);

        const suggestion = CPP_TO_EPP[kw];
        const message = suggestion
          ? `E++: '${kw}' is plain C++. Use '${suggestion}' instead.`
          : `E++: '${kw}' is a C++ keyword and is not valid in E++.`;

        const diag = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
        diag.code = `cpp-keyword-${kw}`;
        diag.source = 'E++';
        diagnostics.push(diag);
      }
    });

    // Warn about missing 'erb' in identifiers that look like keywords
    // (soft heuristic: warn if a word ending in common C++ type suffix lacks erb)
    // This is optional / style-level — using Warning severity
    const erbPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    let erbMatch: RegExpExecArray | null;
    while ((erbMatch = erbPattern.exec(noStrings)) !== null) {
      const word = erbMatch[1];
      // Warn if it looks like a C++ type but isn't in our known-good list
      if (word.length > 2 && !word.includes('erb') && !word.includes('Erb') &&
          /^[a-z]/.test(word) && word.length > 4 &&
          !EPP_KEYWORDS.find(k => k.label === word) &&
          !['main', 'argc', 'argv', 'size_t', 'vector', 'map', 'memory', 'runtime_error',
            'exception', 'what', 'make_unique', 'make_shared', 'move', 'forward',
            'begin', 'end', 'push_back', 'emplace_back', 'insert', 'erase', 'find',
            'length', 'size', 'empty', 'clear', 'data', 'get', 'set', 'reset',
            'value', 'first', 'second', 'endl', 'cout', 'cin'].includes(word)) {
        // Only warn for identifiers that appear to be "keyword-like" (all lowercase, no underscores)
        if (/^[a-z]+$/.test(word) && BANNED_CPP_KEYWORDS.includes(word)) {
          // Already caught above
        }
      }
    }
  });

  diagnosticCollection.set(document.uri, diagnostics);
}

// ─── Completion Provider ─────────────────────────────────────────────────────

class EppCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    for (const kw of EPP_KEYWORDS) {
      const item = new vscode.CompletionItem(kw.label, kw.kind);
      item.detail = `E++ ${kw.detail} → C++: ${kw.cppEquiv}`;
      item.documentation = new vscode.MarkdownString(
        `**E++ Keyword**: \`${kw.label}\`\n\n` +
        `C++ equivalent: \`${kw.cppEquiv}\`\n\n` +
        (kw.doc ? kw.doc : '')
      );
      item.insertText = kw.label;
      items.push(item);
    }

    // Add document-local identifiers
    const text = document.getText();
    const wordPattern = /\b([a-zA-Z_][a-zA-Z0-9_]{2,})\b/g;
    const seen = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = wordPattern.exec(text)) !== null) {
      const word = m[1];
      if (!seen.has(word) && !EPP_KEYWORDS.find(k => k.label === word)) {
        seen.add(word);
        const localItem = new vscode.CompletionItem(word, vscode.CompletionItemKind.Variable);
        localItem.detail = 'local identifier';
        items.push(localItem);
      }
    }

    return items;
  }
}

// ─── Hover Provider ──────────────────────────────────────────────────────────

class EppHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Hover | undefined {
    const range = document.getWordRangeAtPosition(position);
    if (!range) { return undefined; }

    const word = document.getText(range);
    const kw = EPP_KEYWORDS.find(k => k.label === word);
    if (!kw) { return undefined; }

    const md = new vscode.MarkdownString();
    md.appendMarkdown(`### E++ Keyword: \`${kw.label}\`\n\n`);
    md.appendMarkdown(`**C++ equivalent:** \`${kw.cppEquiv}\`\n\n`);
    md.appendMarkdown(`**Category:** ${kw.detail}\n\n`);
    if (kw.doc) { md.appendMarkdown(`${kw.doc}`); }

    return new vscode.Hover(md, range);
  }
}

// ─── Code Action Provider (Quick Fix) ────────────────────────────────────────

class EppCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    for (const diag of context.diagnostics) {
      if (typeof diag.code === 'string' && diag.code.startsWith('cpp-keyword-')) {
        const cppKw = diag.code.replace('cpp-keyword-', '');
        const eppKw = CPP_TO_EPP[cppKw];
        if (eppKw) {
          const fix = new vscode.CodeAction(
            `Replace '${cppKw}' with '${eppKw}'`,
            vscode.CodeActionKind.QuickFix
          );
          fix.edit = new vscode.WorkspaceEdit();
          fix.edit.replace(document.uri, diag.range, eppKw);
          fix.diagnostics = [diag];
          fix.isPreferred = true;
          actions.push(fix);
        }
      }
    }

    return actions;
  }
}

// ─── Compiler Integration ────────────────────────────────────────────────────

let outputChannel: vscode.OutputChannel;

function getCompilerPath(): string {
  const config = vscode.workspace.getConfiguration('epp');
  return config.get<string>('compilerPath') ?? 'erppc';
}

function isFallbackEnabled(): boolean {
  const config = vscode.workspace.getConfiguration('epp');
  return config.get<boolean>('fallbackToCpp') ?? true;
}

function resolveCompiler(): Promise<string> {
  return new Promise((resolve, reject) => {
    const configured = getCompilerPath();

    // Check if configured compiler exists
    cp.exec(`which ${configured} 2>/dev/null || where ${configured} 2>nul`, (err, stdout) => {
      if (!err && stdout.trim()) {
        resolve(configured);
        return;
      }

      if (isFallbackEnabled()) {
        // Fall back to g++ for testing purposes
        cp.exec('which g++ 2>/dev/null || where g++ 2>nul', (err2, stdout2) => {
          if (!err2 && stdout2.trim()) {
            vscode.window.showWarningMessage(
              `E++ compiler '${configured}' not found. Falling back to g++ for compilation.`
            );
            resolve('g++');
          } else {
            reject(new Error(`Neither '${configured}' nor 'g++' was found. Please install a compiler or set epp.compilerPath.`));
          }
        });
      } else {
        reject(new Error(`E++ compiler not found at '${configured}'. Set the correct path in epp.compilerPath.`));
      }
    });
  });
}

async function compileFile(document: vscode.TextDocument, andRun = false): Promise<void> {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('E++ Compiler');
  }
  outputChannel.show(true);

  if (document.isDirty) {
    await document.save();
  }

  const filePath = document.uri.fsPath;
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const outName = process.platform === 'win32' ? `${baseName}.exe` : baseName;
  const outPath = path.join(dir, outName);

  const config = vscode.workspace.getConfiguration('epp');
  const extraArgs: string[] = config.get<string[]>('compilerArgs') ?? [];

  let compiler: string;
  try {
    compiler = await resolveCompiler();
  } catch (err: any) {
    outputChannel.appendLine(`[E++] ERROR: ${err.message}`);
    vscode.window.showErrorMessage(err.message);
    return;
  }

  const args = [filePath, '-o', outPath, ...extraArgs];
  const cmd = `${compiler} ${args.join(' ')}`;

  outputChannel.appendLine('─'.repeat(60));
  outputChannel.appendLine(`[E++] Compiling: ${path.basename(filePath)}`);
  outputChannel.appendLine(`[E++] Command:   ${cmd}`);
  outputChannel.appendLine('─'.repeat(60));

  const startTime = Date.now();

  cp.exec(cmd, { cwd: dir }, (err, stdout, stderr) => {
    const elapsed = Date.now() - startTime;

    if (stdout) { outputChannel.appendLine(stdout); }

    if (err) {
      outputChannel.appendLine(`[E++] COMPILE FAILED (${elapsed}ms)`);
      outputChannel.appendLine(stderr);
      vscode.window.showErrorMessage(`E++ compilation failed. See Output panel for details.`);

      // Parse compiler errors and push them as diagnostics
      parseCompilerErrors(stderr, document);
      return;
    }

    outputChannel.appendLine(`[E++] Compilation succeeded in ${elapsed}ms → ${outPath}`);
    if (stderr) { outputChannel.appendLine(`[warnings]\n${stderr}`); }

    vscode.window.showInformationMessage(
      `E++ compiled successfully${andRun ? ' — running...' : ''}`,
      andRun ? undefined : 'Open Output'
    ).then(choice => {
      if (choice === 'Open Output') { outputChannel.show(); }
    });

    if (andRun) {
      runBinary(outPath, dir);
    }
  });
}

function parseCompilerErrors(stderr: string, document: vscode.TextDocument): void {
  const diagnostics: vscode.Diagnostic[] = [];
  const lines = stderr.split('\n');

  // Typical g++/clang error format: file:line:col: error: message
  const errorPattern = /^.*?:(\d+):(\d+):\s+(error|warning|note):\s+(.*)$/;

  lines.forEach(line => {
    const m = line.match(errorPattern);
    if (m) {
      const lineNum = Math.max(0, parseInt(m[1], 10) - 1);
      const colNum = Math.max(0, parseInt(m[2], 10) - 1);
      const severity = m[3] === 'error'
        ? vscode.DiagnosticSeverity.Error
        : m[3] === 'warning'
          ? vscode.DiagnosticSeverity.Warning
          : vscode.DiagnosticSeverity.Information;
      const message = m[4];

      const pos = new vscode.Position(lineNum, colNum);
      const range = new vscode.Range(pos, new vscode.Position(lineNum, colNum + 1));
      const diag = new vscode.Diagnostic(range, `[compiler] ${message}`, severity);
      diag.source = 'E++ Compiler';
      diagnostics.push(diag);
    }
  });

  if (diagnostics.length > 0) {
    // Merge with existing diagnostics
    const existing = diagnosticCollection.get(document.uri) ?? [];
    diagnosticCollection.set(document.uri, [...existing, ...diagnostics]);
  }
}

function runBinary(binaryPath: string, cwd: string): void {
  outputChannel.appendLine('\n[E++] Running...\n' + '─'.repeat(60));

  const proc = cp.spawn(binaryPath, [], { cwd, shell: true });

  proc.stdout.on('data', (data: Buffer) => {
    outputChannel.append(data.toString());
  });
  proc.stderr.on('data', (data: Buffer) => {
    outputChannel.append(data.toString());
  });
  proc.on('close', (code: number) => {
    outputChannel.appendLine(`\n${'─'.repeat(60)}`);
    outputChannel.appendLine(`[E++] Process exited with code ${code}`);
  });
}

// ─── Keyword Reference Webview ───────────────────────────────────────────────

function showKeywordReference(context: vscode.ExtensionContext): void {
  const panel = vscode.window.createWebviewPanel(
    'eppKeywords',
    'E++ Keyword Reference',
    vscode.ViewColumn.Beside,
    { enableScripts: false }
  );

  const grouped: Record<string, typeof EPP_KEYWORDS> = {};
  EPP_KEYWORDS.forEach(k => {
    if (!grouped[k.detail]) { grouped[k.detail] = []; }
    grouped[k.detail].push(k);
  });

  const tableRows = Object.entries(grouped).map(([category, kws]) => {
    const rows = kws.map(k =>
      `<tr>
        <td><code>${k.label}</code></td>
        <td><code>${k.cppEquiv}</code></td>
        <td>${k.doc ?? ''}</td>
      </tr>`
    ).join('');
    return `
      <tr class="category-header"><td colspan="3"><strong>${category.toUpperCase()}</strong></td></tr>
      ${rows}`;
  }).join('');

  panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>E++ Keyword Reference</title>
<style>
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 20px; }
  h1 { color: var(--vscode-textLink-foreground); }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { background: var(--vscode-editor-lineHighlightBackground); padding: 8px 12px; text-align: left; }
  td { padding: 6px 12px; border-bottom: 1px solid var(--vscode-editorWidget-border); }
  tr.category-header td { background: var(--vscode-sideBar-background); font-weight: bold; padding-top: 14px; color: var(--vscode-textPreformat-foreground); }
  code { font-family: var(--vscode-editor-font-family); background: var(--vscode-textCodeBlock-background); padding: 1px 5px; border-radius: 3px; }
</style>
</head>
<body>
<h1>⚡ E++ Keyword Reference</h1>
<p>Every E++ keyword contains <strong>erb</strong>. This table maps E++ syntax to its C++ equivalent.</p>
<table>
  <thead><tr><th>E++ Keyword</th><th>C++ Equivalent</th><th>Description</th></tr></thead>
  <tbody>${tableRows}</tbody>
</table>
</body>
</html>`;
}

// ─── Extension Entry Points ──────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
  console.log('E++ Language Support activated');

  // Register language features
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'epp', scheme: 'file' },
      new EppCompletionProvider(),
      '.', '#', '<', '"', "'"
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: 'epp', scheme: 'file' },
      new EppHoverProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { language: 'epp', scheme: 'file' },
      new EppCodeActionProvider(),
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
    )
  );

  // Run diagnostics when opening or saving
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => runDiagnostics(doc)),
    vscode.workspace.onDidSaveTextDocument(doc => runDiagnostics(doc)),
    vscode.workspace.onDidChangeTextDocument(e => {
      // Debounce: only on change for active editor
      if (e.document === vscode.window.activeTextEditor?.document) {
        runDiagnostics(e.document);
      }
    })
  );

  // Run diagnostics on all open E++ docs
  vscode.workspace.textDocuments.forEach(doc => runDiagnostics(doc));

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('epp.compile', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== 'epp') {
        vscode.window.showErrorMessage('Open an E++ file to compile.');
        return;
      }
      compileFile(editor.document, false);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('epp.compileAndRun', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== 'epp') {
        vscode.window.showErrorMessage('Open an E++ file to compile and run.');
        return;
      }
      compileFile(editor.document, true);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('epp.showKeywordReference', () => {
      showKeywordReference(context);
    })
  );

  context.subscriptions.push(diagnosticCollection);
}

export function deactivate(): void {
  diagnosticCollection.dispose();
}
