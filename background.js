chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkLinkStatus') {
    const href = request.href;
    fetch(href, { method: 'HEAD' })
      .then(response => {
        const status = response.status;
        sendResponse({ status });
      })
      .catch(error => {
        console.error('Error occurred during link status check:', error);
        sendResponse({ status: 'Error' });
      });
    // To indicate that we will send the response asynchronously
    return true;
  }
});

/*
// Add a listener to respond to messages from the content script or popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // When a message is received, check if the message's action is 'checkLinkStatus'
  if (request.action === 'checkLinkStatus') {
    // Extract the 'href' property from the received message
    const href = request.href;
    // Make a HEAD request to the 'href' URL using the fetch API
    fetch(href, { method: 'HEAD' })
      // When the fetch request is resolved, handle the response
      .then(response => {
        // Extract the status code from the response
        const status = response.status;
        // Send the link status back as a response to the content script or popup script
        sendResponse({ status });
      })
      // If there is an error during the fetch request, catch it
      .catch(error => {
        // Log an error message to the console indicating the link status check failed
        console.error('Error occurred during link status check:', error);
        // Send an error response back to the content script or popup script
        sendResponse({ status: 'Error' });
      });
    // To indicate that we will send the response asynchronously
    // This is important because we are handling asynchronous operations (e.g., fetch) in the listener
    return true;
  }
});

*/
