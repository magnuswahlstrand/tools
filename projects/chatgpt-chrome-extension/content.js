// Listen for messages from background script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'saveConversation') {
    alert('Hotkey received by content script.');
    const conversation = extractConversation();
    const defaultName = sanitizeFilename(document.title) || `chatgpt-conversation-${new Date().toISOString().replace(/[:.]/g, '-')}`;
    let filename = '';
    // Try to use the File System Access API if available
    if (window.showSaveFilePicker) {
      try {
        const opts = {
          suggestedName: `${defaultName}.txt`,
          types: [
            {
              description: 'Text Files',
              accept: { 'text/plain': ['.txt'] },
            },
          ],
        };
        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(conversation);
        await writable.close();
        alert('ChatGPT conversation saved to disk.');
        return;
      } catch (e) {
        // If user cancels or error, fallback to prompt
      }
    }
    // Fallback: prompt for filename
    filename = prompt('Enter a name for the chat file:', `${defaultName}.txt`);
    if (!filename) return;
    saveToFile(conversation, filename);
    alert('ChatGPT conversation saved to disk.');
  }
});

function extractConversation() {
  const messages = document.querySelectorAll('.markdown');
  let conversation = '';
  
  messages.forEach((message, index) => {
    const role = index % 2 === 0 ? 'User' : 'Assistant';
    conversation += `${role}: ${message.textContent}\n\n`;
  });
  
  return conversation;
}

function getConversationName() {
  // Try common selectors for conversation name
  // 1. Sidebar selected conversation
  let el = document.querySelector('nav [aria-current="page"]');
  if (el && el.textContent) return sanitizeFilename(el.textContent);
  // 2. Header/title
  el = document.querySelector('h1, h2');
  if (el && el.textContent) return sanitizeFilename(el.textContent);
  // 3. Fallback: null
  return null;
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9\- _\.]/gi, '_').substring(0, 64);
}

function saveToFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
} 