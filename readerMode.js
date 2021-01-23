function isHidden(el) {
  return el.offsetParent === null;
}

function renderReaderMode() {
  const content = Array.from(
    document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, img, table")
  ).filter((elt) => !isHidden(elt));
  document.head.innerHTML = `
    <style>
      body {
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
        padding: 1em;
        font-size: 16pt;
        font-family: Garamond, serif;
        color: #2E3440; 
        background-color: #ECEFF4;
      }
      a {
        color: #5E81AC;
      }
      a:visited {
        color: #B48EAD;
      }
    </style>
  `;
  document.body.innerHTML = "";
  content.forEach((elt) => document.body.appendChild(elt));
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "reader-mode") {
    renderReaderMode();
  } else {
    console.warn(`Unknown command: ${request.command}`);
  }
});
