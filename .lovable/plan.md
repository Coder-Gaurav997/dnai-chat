
## Plan: Voice Input, Keyboard Shortcuts, and Export Chat

### 1. Voice Input Button (ChatInput.tsx)
- Add a microphone button to the LEFT of the send button
- Use the browser's built-in **Web Speech API** (`webkitSpeechRecognition`) -- no dependencies needed
- Button toggles between Mic icon (idle) and MicOff icon (listening) with a red pulse animation when active
- Transcribed text appends to the input field

### 2. Keyboard Shortcuts (Index.tsx)
Add a global `useEffect` with `keydown` listener for these 5 shortcuts:
- **Ctrl+N** -- New chat
- **Ctrl+/** -- Focus the input textarea
- **Ctrl+E** -- Open export dialog
- **Ctrl+,** -- Open sidebar
- **Escape** -- Close sidebar / any open dialog

A small keyboard icon in the header (or sidebar footer) could show a shortcuts reference, but to keep it simple, we'll skip that UI and just wire the listeners.

### 3. Export Chat (Sidebar + Dialog)
- Add an **"Export Chat"** button in the Sidebar below "New Chat" with a `Download` icon
- Clicking it: closes the sidebar, opens a **Dialog** (using existing `dialog.tsx` UI component) centered on screen
- Dialog contains:
  - **Auto-generated title** (2-4 words from the first user message, generated simply by taking the first few words)
  - **File name input** (no extension, pre-filled with a sanitized version of the title)
  - **Two buttons**: "Download .txt" and "Download .pdf"
- Format for both:
  ```
  **Chat Title Here**

  User: message text
  DarkNeuronAI: response text

  User: ...
  DarkNeuronAI: ...
  ```
- For **.txt**: create a Blob with `text/plain` and trigger download
- For **.pdf**: generate a simple PDF using basic canvas/text approach or just use a Blob with formatted text (to avoid adding a dependency, we'll use a minimal approach with `jspdf`-free method -- actually, to keep credits low, we'll just do `.txt` natively and for `.pdf` we'll construct a simple printable HTML and use `window.print()` or a simple blob). To keep it truly simple with no new dependencies, both will download as plain text files with appropriate extensions. The .pdf will be a text file with .pdf extension -- OR better, we can use the browser's built-in print-to-PDF by opening a new window. 

**Simplest approach for PDF**: Create a hidden iframe/new window with formatted HTML content and trigger `window.print()` which lets the user save as PDF natively. This avoids any new dependency.

### Files to modify:
1. **`src/components/ChatInput.tsx`** -- Add voice input button with Web Speech API
2. **`src/components/Sidebar.tsx`** -- Add "Export Chat" button, accept new props
3. **`src/pages/Index.tsx`** -- Add keyboard shortcuts, export dialog state, pass messages to sidebar, render export dialog
4. **`src/components/ExportDialog.tsx`** (NEW) -- Export dialog component with filename input + download buttons

### Technical Details

**Voice Input** uses `window.SpeechRecognition || window.webkitSpeechRecognition`. We'll add a TypeScript declaration for `webkitSpeechRecognition` inline.

**Auto-title generation**: Take the first user message, split by spaces, take first 3-4 words, capitalize first letter.

**Export formats**:
- `.txt`: Plain text blob download
- `.pdf`: Open a styled HTML page in new window with `window.print()` for native PDF save

**Keyboard shortcuts**: Single `useEffect` in Index.tsx with cleanup.
