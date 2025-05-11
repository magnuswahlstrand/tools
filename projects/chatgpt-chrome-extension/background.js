// Listen for commands
console.log('Background script loaded and listening for commands.');
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  if (command === 'save-conversation') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (
        tabs[0].url.includes('chat.openai.com') ||
        tabs[0].url.includes('chatgpt.com')
      ) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'saveConversation' });
      }
    });
  }
}); 