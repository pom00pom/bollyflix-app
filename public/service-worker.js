// यह एक बेसिक सर्विस वर्कर है जो ऐप को कैश करता है
self.addEventListener('install', event => {
  console.log('Service worker installing...');
  // आप यहाँ फाइलों को प्री-कैश कर सकते हैं
});

self.addEventListener('fetch', event => {
  console.log('Fetching:', event.request.url);
  // आप यहाँ नेटवर्क रिक्वेस्ट को हैंडल कर सकते हैं
});