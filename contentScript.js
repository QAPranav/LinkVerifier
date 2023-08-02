function isPhoneLink(href) {
  return href.startsWith('tel:');
}

function isEmailLink(href) {
  return href.startsWith('mailto:');
}

async function verifyLinkStatus(href) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'checkLinkStatus', href }, response => {
      resolve(response.status);
    });
  });
}

async function verifyLinks() {
  const links = document.querySelectorAll('a');
  const results = [];

  for (const link of links) {
    const href = link.href.trim();
    if (!isPhoneLink(href) && !isEmailLink(href)) {
      let status = await verifyLinkStatus(href);
      if (typeof status !== 'undefined') {
        results.push({ href, status });
      } else {
        console.error('Error occurred during link verification for:', href);
      }
    }
  }

  return results;
}


// Add a listener to respond to messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'verifyLinks') {
    verifyLinks().then(linkResults => {
      sendResponse(linkResults);
    });
    // To indicate that we will send the response asynchronously
    return true;
  }
});



// // Check if the given href starts with 'tel:', indicating it is a phone link
// function isPhoneLink(href) {
//   return href.startsWith('tel:');
// }

// // Check if the given href starts with 'mailto:', indicating it is an email link
// function isEmailLink(href) {
//   return href.startsWith('mailto:');
// }

// // Verify the link status by sending a message to the background script
// async function verifyLinkStatus(href) {
//   // Return a Promise that will resolve with the link status
//   return new Promise(resolve => {
//     // Send a message to the background script with the action 'checkLinkStatus' and the link's href
//     chrome.runtime.sendMessage({ action: 'checkLinkStatus', href }, response => {
//       // Resolve the Promise with the link status received in the response
//       resolve(response.status);
//     });
//   });
// }

// // Verify all links on the webpage and return an array of link verification results
// async function verifyLinks() {
//   // Get all anchor elements on the webpage
//   const links = document.querySelectorAll('a');
//   // Initialize an array to store the link verification results
//   const results = [];

//   // Loop through each link
//   for (const link of links) {
//     // Get the link's href and remove any extra spaces
//     const href = link.href.trim();
//     // Check if the link is not a phone link and not an email link
//     if (!isPhoneLink(href) && !isEmailLink(href)) {
//       // Verify the link status and wait for the result
//       let status = await verifyLinkStatus(href);
//       // If the status is not undefined, add the link and its status to the results array
//       if (typeof status !== 'undefined') {
//         results.push({ href, status });
//       } else {
//         // If there was an error during verification, log an error message
//         console.error('Error occurred during link verification for:', href);
//       }
//     }
//   }

//   // Return the array containing link verification results
//   return results;
// }

// // Add a listener to respond to messages from the popup script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   // If the received message's action is 'verifyLinks'
//   if (request.action === 'verifyLinks') {
//     // Call the verifyLinks function to start link verification
//     verifyLinks().then(linkResults => {
//       // Send the link verification results back to the popup script
//       sendResponse(linkResults);
//     });
//     // To indicate that we will send the response asynchronously
//     return true;
//   }
// });

