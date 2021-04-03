const renderReaderMode = () => {
  var hasH1 = false;
  var content = [document]
    .flatMap((elt) =>
      Array.from(
        elt.querySelectorAll(
          "h1, h2, h3, h4, h5, h6, p, img, table, pre, ul, ol"
        )
      )
    )
    .filter((elt) => !isHidden(elt) && !isNavbar(elt) && !isChum(elt))
    .map((elt) => {
      hasH1 ||= elt.tagName === "H1";
      const copy = elt.cloneNode(true);
      [...copy.attributes].forEach((attr) => {
        if (attr.name !== "src") {
          copy.removeAttribute(attr.name);
        }
      });
      return copy;
    })
    .map((elt) => elt.outerHTML)
    .join(" ");
  if (!hasH1) {
    content = `<h1>${document.title}</h1>` + content;
  }
  createNewTabWithContent(content + STYLE + SHORTCUTS);
}

const createNewTabWithContent = (content) => {
  const reader = window.open();
  reader.document.open();
  reader.document.write(
    `
    <head>
      <title>${document.title}</title>
    </head>
    <body>
      <iframe
          style='border: 0'
          width='100%'
          height='100%'
          onload='this.focus();'
          src='data:text/html;charset=UTF-8;base64,${Base64.encode(content)}'>
      </iframe>
    </body>
    `
  );
  reader.document.close();
}

const Base64 = {
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

const SHORTCUTS = `
<script>
  window.onkeydown = function (e) {
      var code = e.keyCode ? e.keyCode : e.which;
      if (code === 74) {
        // j
        window.scrollBy({
          top: window.innerHeight,
          left: 0,
          behavior: "smooth",
        });
      } else if (code === 75) {
        // k
        window.scrollBy({
          top: -window.innerHeight,
          left: 0,
          behavior: "smooth",
        });
      }
  };
</script>
`;

const STYLE = `
  <style>
    body {
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      padding: 1em;
      font-size: 16pt;
      font-family: Georgia, serif;
    }
    p {
      line-height: 1.4;
    }
    img {
      max-width: 600px;
      height: auto;
    }
    pre {
      font-size: 10pt;
    }
    a {
      color: #5E81AC;
      text-decoration: none;
    }
    li {
      margin-bottom: 1em;
      margin-top: 1em;
    }
  </style>
`;

const isHidden = (el) => {
  return el.offsetParent === null;
}

const classNameMatches = (elt, text) => {
  return (
    elt.classList &&
    Array.from(elt.classList).filter(
      (className) => className && className.toLowerCase().includes(text)
    ).length > 0
  );
}

const checkParents = (elt, predicate) => {
  var current = elt;
  while (current !== null) {
    if (predicate(current)) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}

const isNavbar = (elt) => {
  return checkParents(elt, (x) => {
    return classNameMatches(x, "nav");
  });
}

const isFooter = (elt) => {
  return checkParents(elt, (x) => {
    return elt.tagName === "FOOTER";
  });
}

const isChum = (elt) => {
  return checkParents(elt, (x) => {
    return (
      ["outbrain", "related"]
        .map(
          (term) =>
            (elt.id && elt.id.toLowerCase().includes(term)) ||
            classNameMatches(x, term)
        )
        .filter((x) => x).length > 0
    );
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "reader-mode") {
    renderReaderMode();
  } else {
    console.warn(`Unknown command: ${request.command}`);
  }
});
