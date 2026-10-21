// Preload native Node 18+ Web standard globals into Jest before module evaluation
if (typeof globalThis.Request !== 'undefined') {
  global.Request = globalThis.Request;
  global.Response = globalThis.Response;
  global.Headers = globalThis.Headers;
  global.fetch = globalThis.fetch;
}
