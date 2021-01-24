var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function (e) {
    var t = "";
    var n, r, i, s, o, u, a;
    var f = 0;
    e = Base64._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2;
      o = ((n & 3) << 4) | (r >> 4);
      u = ((r & 15) << 2) | (i >> 6);
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64;
      } else if (isNaN(i)) {
        a = 64;
      }
      t =
        t +
        this._keyStr.charAt(s) +
        this._keyStr.charAt(o) +
        this._keyStr.charAt(u) +
        this._keyStr.charAt(a);
    }
    return t;
  },
  decode: function (e) {
    var t = "";
    var n, r, i;
    var s, o, u, a;
    var f = 0;
    e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++));
      o = this._keyStr.indexOf(e.charAt(f++));
      u = this._keyStr.indexOf(e.charAt(f++));
      a = this._keyStr.indexOf(e.charAt(f++));
      n = (s << 2) | (o >> 4);
      r = ((o & 15) << 4) | (u >> 2);
      i = ((u & 3) << 6) | a;
      t = t + String.fromCharCode(n);
      if (u != 64) {
        t = t + String.fromCharCode(r);
      }
      if (a != 64) {
        t = t + String.fromCharCode(i);
      }
    }
    t = Base64._utf8_decode(t);
    return t;
  },
  _utf8_encode: function (e) {
    e = e.replace(/\r\n/g, "\n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode((r >> 6) | 192);
        t += String.fromCharCode((r & 63) | 128);
      } else {
        t += String.fromCharCode((r >> 12) | 224);
        t += String.fromCharCode(((r >> 6) & 63) | 128);
        t += String.fromCharCode((r & 63) | 128);
      }
    }
    return t;
  },
  _utf8_decode: function (e) {
    var t = "";
    var n = 0;
    var r = (c1 = c2 = 0);
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++;
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
        n += 2;
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode(
          ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        n += 3;
      }
    }
    return t;
  },
};

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
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        padding: 1em;
        font-size: 14pt;
        font-family: Helvetica, sans-serif;
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

function renderReaderModeNewTab() {
  const content =
    Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, img, table")
    )
      .filter((elt) => !isHidden(elt))
      .map((elt) => elt.outerHTML)
      .join(" ") +
    `
    <style>
      body {
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        padding: 1em;
        font-size: 14pt;
        font-family: Arial, sans-serif;
        color: #2E3440; 
      }
      p {
        line-height: 1.6;
      }
      a {
        color: #5E81AC;
      }
      a:visited {
        color: #B48EAD;
      }
      img {
        max-width: 600px;
      }
    </style>
  `;

  const reader = window.open();
  reader.document.open();
  reader.document.write(
    `
    <iframe
        style='border: 0'
        width='100%'
        height='100%'
        src='data:text/html;charset=UTF-8;base64,${Base64.encode(content)}'>
    </iframe>
    `
  );
  reader.document.close();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "reader-mode") {
    //renderReaderMode();
    renderReaderModeNewTab();
  } else {
    console.warn(`Unknown command: ${request.command}`);
  }
});
