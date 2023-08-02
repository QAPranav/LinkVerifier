// Function to show the loading spinner
function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

// Function to hide the loading spinner
function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

// Function to verify links
function verifyLinks() {
  showLoading(); // Show loading spinner
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ['contentScript.js']
        },
        () => {
          chrome.tabs.sendMessage(tabId, { action: 'verifyLinks' }, response => {
            hideLoading(); // Hide loading spinner when response is received
            resolve(response);
          });
        }
      );
    });
  });
}

// Function to display the link verification results
function displayResults(linkResults) {
  const resultsDiv = document.getElementById('results');
  const resultsHeading = document.createElement('h2'); // Create the heading element
  resultsHeading.textContent = 'Link Verification Results'; // Set the heading text
  resultsDiv.innerHTML = ''; // Clear existing results

  if (Array.isArray(linkResults) && linkResults.length > 0) {
      resultsDiv.appendChild(resultsHeading); // Add the heading to the resultsDiv
      for (const result of linkResults) {
          const link = document.createElement('a');
          link.href = result.href;
          link.target = '_blank';
          link.textContent = `${result.href} - Status: ${result.status}`;
          resultsDiv.appendChild(link);

          // Add a CSS class for non-200 status
          if (result.status !== 200) {
              link.classList.add('error-link');
          }
      }
  } else {
      resultsDiv.textContent = 'No links found or unable to verify links.';
  }
}

// ... (rest of the code remains the same)

  
  // Function to handle the button click event
  function onVerifyButtonClick() {
    verifyLinks()
      .then(response => {
        if (chrome.runtime.lastError) {
          displayResults([]);
        } else {
          displayResults(response);
        }
      })
      .catch(error => {
        displayResults([]);
        console.error('Error occurred during link verification:', error);
      });
  }
  
  // Add event listener for the button click
  document.getElementById('verifyButton').addEventListener('click', onVerifyButtonClick);
  