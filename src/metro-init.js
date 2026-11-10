(() => {
  const original = Dom.parseHTML;
  const singleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
  Dom.parseHTML = function (value) {
    if (typeof value !== 'string') return original.call(this, value);
    const source = value.trim();
    if (!source || singleTag.test(source) || Dom.isSelector(source)) return original.call(this, value);
    // Keep Metro's inert parsing and script behavior without its CSP-blocked base element.
    const doc = document.implementation.createHTMLDocument('');
    doc.body.innerHTML = source;
    return Array.from(doc.body.childNodes, node => node.cloneNode(true));
  };
})();
