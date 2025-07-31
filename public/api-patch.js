// API Patch to fix Popular Dishes and Recipes functionality
(function() {
  // Store the original fetch function
  const originalFetch = window.fetch;
  
  // Override fetch to intercept API calls
  window.fetch = function(...args) {
    let [url, options] = args;
    
    // Convert relative URLs to absolute
    if (typeof url === 'string' && url.startsWith('/api/')) {
      const baseUrl = window.location.origin;
      url = baseUrl + url;
    }
    
    // Log API calls for debugging
    console.log('API Call:', url);
    
    // Fix the popular dishes endpoint
    if (url.includes('/api/dishes?limit=8')) {
      // Change to the working endpoint
      url = url.replace('/api/dishes?limit=8', '/dishes/popular?limit=8');
    }
    
    // Call the original fetch with potentially modified URL
    return originalFetch.call(this, url, options)
      .then(response => {
        // Log response status
        console.log('API Response:', url, response.status);
        return response;
      })
      .catch(error => {
        console.error('API Error:', url, error);
        throw error;
      });
  };
  
  // Also ensure the API calls use the correct base URL
  if (window.API_URL === 'http://localhost:8787') {
    window.API_URL = window.location.origin;
  }
})();

// Fix for React component rendering issues
document.addEventListener('DOMContentLoaded', function() {
  // Force a re-render after a short delay to ensure data is loaded
  setTimeout(() => {
    const event = new Event('apiPatched');
    window.dispatchEvent(event);
  }, 100);
});