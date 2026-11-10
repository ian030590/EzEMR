(() => {
  const blocked = function () { throw new DOMException('', 'SecurityError'); };
  const lock = (object, key, value) => Object.defineProperty(object, key, { value, writable: false, configurable: false });
  lock(window, 'fetch', () => Promise.reject(new DOMException('', 'SecurityError')));
  for (const key of ['WebSocket', 'EventSource', 'Worker', 'SharedWorker', 'RTCPeerConnection', 'webkitRTCPeerConnection', 'WebTransport']) {
    if (key in window) lock(window, key, blocked);
  }
  lock(XMLHttpRequest.prototype, 'open', blocked);
  if ('sendBeacon' in navigator) lock(navigator, 'sendBeacon', blocked);
  if (navigator.serviceWorker) lock(navigator.serviceWorker, 'register', () => Promise.reject(new DOMException('', 'SecurityError')));
})();
