# ⚡ E++ Language Support for VS Code
 
> **E++** is a variant of C++ where every keyword contains `erb`. Write familiar C++ logic in a whole new dialect — with full IDE support built right in.
 
---
 
## Features
 
### 🎨 Syntax Highlighting
E++ keywords, types, control flow, preprocessor directives, strings, numbers, and operators all get their own distinct colors, just like C++.
 
### 🧠 IntelliSense / Autocomplete
Start typing any E++ keyword and get instant suggestions with:
- The E++ keyword label
- Its C++ equivalent
- A plain-English description
### 📋 Snippets
Type a short prefix and expand full code templates instantly. Examples:
 
| Prefix | Expands To |
|---|---|
| `helloerb` | Full Hello World program |
| `clerb` | Class definition |
| `clerbfull` | Class with constructor, destructor, getter, setter |
| `ferb` | For loop |
| `ferbrange` | Range-based for loop |
| `wherb` | While loop |
| `iferb` | If statement |
| `ifelseerb` | If-else block |
| `tryerb` | Try-catch block |
| `temperb` | Template class |
| `headerberb` | Header guard |
| `lamberb` | Lambda expression |
 
### 🔴 Error Squiggles & Diagnostics
Plain C++ keywords trigger red squiggles with a helpful message. For example, writing `int` instead of `nerb` gives:
 
```
E++: 'int' is plain C++. Use 'nerb' instead.
```
 
Diagnostics update live as you type.
 
### 🔧 Quick Fix
Click the lightbulb (or press `Ctrl+.`) on any flagged C++ keyword to automatically replace it with the correct E++ equivalent in one click.
 
### ⚙️ Compiler Integration
Compile and run `.epp` files directly from VS Code:
 
- **Ctrl+Shift+E** — Compile & Run current file
- Right-click in editor → **E++: Compile** or **E++: Compile & Run**
- Click the ▶ button in the editor title bar
Compiler output appears in the **E++ Compiler** output panel. Compiler errors are parsed and shown as squiggles in the editor too.
 
### 📖 Keyword Reference
Open the full keyword reference table at any time:
 
`Ctrl+Shift+P` → **E++: Show Keyword Reference**
 
This opens a side panel listing every E++ keyword alongside its C++ equivalent and description.
 
---
 
## E++ Keyword Reference
 
Every C++ keyword has an `erb`-containing equivalent in E++.
 
### Types
 
| E++ | C++ | Description |
|---|---|---|
| `nerb` | `int` | Integer (32-bit signed) |
| `flerb` | `float` | Single-precision float |
| `derb` | `double` | Double-precision float |
| `cherb` | `char` | Character type |
| `blerb` | `bool` | Boolean type |
| `verbd` | `void` | No type |
| `lerbon` | `long` | Long integer |
| `sherb` | `short` | Short integer |
| `sterbing` | `string` / `static` | String type or static modifier |
| `auerb` | `auto` | Auto type deduction |
| `unserb` | `unsigned` | Unsigned modifier |
| `signerb` | `signed` | Signed modifier |
 
### Control Flow
 
| E++ | C++ | Description |
|---|---|---|
| `iferb` | `if` | Conditional branch |
| `elserb` | `else` | Else branch |
| `elserbiferb` | `else if` | Else-if branch |
| `swerb` | `switch` | Switch statement |
| `caserb` | `case` | Switch case label |
| `deferb` | `default` | Default case |
| `brerb` | `break` | Break from loop or switch |
| `conterb` | `continue` | Continue to next iteration |
| `returnerb` | `return` | Return from function |
| `goerb` | `goto` | Jump to label |
 
### Loops
 
| E++ | C++ | Description |
|---|---|---|
| `ferb` | `for` | For loop |
| `wherb` | `while` | While loop |
| `doerb` | `do` | Do-while loop |
 
### Classes & OOP
 
| E++ | C++ | Description |
|---|---|---|
| `clerb` | `class` | Class definition |
| `sterb` | `struct` | Struct definition |
| `enerb` | `enum` | Enum definition |
| `unerb` | `union` | Union definition |
| `namerberb` | `namespace` | Namespace declaration |
| `temperb` | `template` | Template declaration |
| `typerbn` | `typename` | Template type parameter |
| `verbtual` | `virtual` | Virtual method |
| `overberb` | `override` | Override virtual method |
| `finerb` | `final` | Prevent further inheritance |
| `plerb` | `public` | Public access |
| `priverb` | `private` | Private access |
| `proterb` | `protected` | Protected access |
| `frerb` | `friend` | Friend declaration |
| `therb` | `this` | Current instance pointer |
| `nerbd` | `new` | Allocate heap memory |
| `delerb` | `delete` | Free heap memory |
| `operberb` | `operator` | Operator overload |
 
### Storage Modifiers
 
| E++ | C++ | Description |
|---|---|---|
| `consterb` | `const` | Constant value |
| `sterbing` | `static` | Static storage |
| `exterberb` | `extern` | External linkage |
| `inlerb` | `inline` | Inline hint |
| `volerb` | `volatile` | Volatile access |
| `sizerb` | `sizeof` | Size of type or value |
| `typerb` | `typedef` | Type alias |
 
### Exceptions
 
| E++ | C++ | Description |
|---|---|---|
| `tryerb` | `try` | Begin try block |
| `catcherb` | `catch` | Catch exception |
| `thowerb` | `throw` | Throw exception |
 
### Constants & I/O
 
| E++ | C++ | Description |
|---|---|---|
| `truerb` | `true` | Boolean true |
| `falserb` | `false` | Boolean false |
| `nullerb` | `nullptr` | Null pointer |
| `cerbt` | `cout` | Standard output |
| `cinnerb` | `cin` | Standard input |
| `endlerb` | `endl` | End line & flush |
 
### Preprocessor
 
| E++ | C++ | Description |
|---|---|---|
| `#inclerb` | `#include` | Include header |
| `#deferberb` | `#define` | Define macro |
| `#praerb` | `#pragma` | Compiler pragma |
| `#ifnerb` | `#ifndef` | If not defined |
| `#ifderb` | `#ifdef` | If defined |
| `#endifberb` | `#endif` | End preprocessor block |
| `#unerberb` | `#undef` | Undefine macro |
 
---
 
## Example: Hello World in E++
 
```epp
#inclerb <sterbd/cerbt>
#inclerb <sterbd/sterbing>
 
userbing namerberb sterbd;
 
nerb main() {
    cerbt << "Hello, World!" << endlerb;
    returnerb 0;
}
```
 
## Example: Class with Template
 
```epp
#inclerb <sterbd/cerbt>
 
temperb <typerbn T>
clerb Container {
plerb:
    Container(T value) : m_value(value) {}
 
    T get() consterb { returnerb m_value; }
    verbd set(T v) { m_value = v; }
 
priverb:
    T m_value;
};
 
nerb main() {
    Container<nerb> box(42);
    cerbt << box.get() << endlerb;
    returnerb 0;
}
```
 
## Example: Exception Handling
 
```epp
#inclerb <sterbd/cerbt>
#inclerb <sterbd/stdexcept>
 
verbd riskyOperation(nerb x) {
    iferb (x < 0) {
        thowerb sterbd::invalid_argument("Negative values not allowed");
    }
    cerbt << "Value: " << x << endlerb;
}
 
nerb main() {
    tryerb {
        riskyOperation(-5);
    } catcherb (consterb sterbd::exception& e) {
        cerbt << "Caught: " << e.what() << endlerb;
    }
    returnerb 0;
}
```
 
---
 
## Requirements
 
- **VS Code** 1.85.0 or later
- **Node.js** (for building from source)
- **A C++ compiler** for the compile feature — either:
  - A custom `erppc` compiler on your PATH, **or**
  - `g++` (GCC) as an automatic fallback
---
 
## Extension Settings
 
Configure E++ in your VS Code `settings.json`:
 
| Setting | Default | Description |
|---|---|---|
| `epp.compilerPath` | `"erppc"` | Path to the E++ compiler executable |
| `epp.compilerArgs` | `["-o", "${fileBasenameNoExtension}"]` | Extra compiler arguments |
| `epp.showDiagnosticsOnSave` | `true` | Run diagnostics when file is saved |
| `epp.fallbackToCpp` | `true` | Fall back to `g++` if `erppc` is not found |
 
### Example `settings.json`
 
```json
{
  "epp.compilerPath": "/usr/local/bin/erppc",
  "epp.compilerArgs": ["-std=c++20", "-Wall", "-o", "${fileBasenameNoExtension}"],
  "epp.fallbackToCpp": true
}
```
 
---
 
## Keyboard Shortcuts
 
| Shortcut | Action |
|---|---|
| `Ctrl+Shift+E` / `Cmd+Shift+E` | Compile & Run current E++ file |
| `Ctrl+.` | Quick Fix — replace C++ keyword with E++ equivalent |
| `Ctrl+Space` | Trigger autocomplete |
 
---
 
## File Extensions
 
E++ source files use `.epp` or `.erb` extensions. VS Code will automatically detect and activate the extension when you open one of these files.
 
---
 
## Known Issues
 
- The `sterbing` keyword serves double duty as both `string` and `static` — context determines which is intended. This mirrors the original C++ design where type and modifier roles overlap.
- The compiler integration requires a C++ compiler on your system PATH. If neither `erppc` nor `g++` is found, compilation will fail with a clear error message.
---
 
## Building from Source
 
```bash
git clone https://github.com/your-repo/epp-language
cd epp-language
npm install
npm run compile
npx vsce package
code --install-extension epp-language-1.0.0.vsix
```
 
---
 
## License
 
MIT — see [LICENSE](LICENSE) for details.
