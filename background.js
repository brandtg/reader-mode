chrome.commands.onCommand.addListener(function (command) {
  // Forward commands to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { command: command },
      function (response) {}
    );
  });
});
