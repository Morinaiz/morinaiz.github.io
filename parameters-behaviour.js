document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const homeButton = document.getElementById('home-button');
    if (urlParams.has('overlay')) {
        if (homeButton) homeButton.style.display = 'none';
    }
    if (homeButton && urlParams.has('upwork')) {
        const currentHref = homeButton.getAttribute('href');
        const upworkParam = 'upwork';
        if (!currentHref.includes(upworkParam)) {
            const separator = currentHref.includes('?') ? '&' : '?';
            homeButton.setAttribute('href', `${currentHref}${separator}${upworkParam}`); // Add an empty value
        }
    }
    if (urlParams.has('upwork')) {
        document.querySelectorAll('.social-icon').forEach(element => {
            element.style.display = 'none';
        });
    }
    const shareButton = document.getElementById('shareButton');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            sharePage();
        });
    }
});

function sharePage() {
    const urlWithoutOverlayParam = removeOverlayParamFromURL(window.location.href);
    const encodedUrl = encodeURIComponent(urlWithoutOverlayParam);
    if (navigator.share && isMobileDevice()) {
        navigator.share({
            title: document.title,
            url: decodeURIComponent(encodedUrl)
        }).then(() => {
            console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
        copyTextToClipboard(decodeURIComponent(encodedUrl));
    }
}

function removeOverlayParamFromURL(url) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    params.delete('overlay');

    // Manually construct the query string without equal signs for parameters without values
    let queryString = '';
    for (const [key, value] of params.entries()) {
        queryString += `${queryString ? '&' : ''}${encodeURIComponent(key)}${value ? '=' + encodeURIComponent(value) : ''}`;
    }

    return `${urlObj.origin}${urlObj.pathname}${queryString ? '?' + queryString : ''}${urlObj.hash}`;
}


function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text)
    .then(() => {
        console.log('Text successfully copied to clipboard');
        showMessage("Copied to clipboard!");
    })
    .catch(err => {
        console.error('Failed to copy text to clipboard', err);
        showMessage("Failed to copy!");
    });
}
let currentMessageDiv = null;
let hideTimeout = null;
let removeTimeout = null;  // New timeout to handle removal

function showMessage(message) {
    // Clear previous timeouts to avoid conflicts
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }

    if (removeTimeout) {
        clearTimeout(removeTimeout);
        removeTimeout = null;
    }

    if (!currentMessageDiv) {
        currentMessageDiv = document.createElement('div');
        currentMessageDiv.className = 'message';
        currentMessageDiv.style.opacity = '0';
        currentMessageDiv.style.visibility = 'hidden';
        document.body.appendChild(currentMessageDiv);
    }

    currentMessageDiv.textContent = message;

    // Ensure the element is visible and restart the opacity transition
    currentMessageDiv.style.visibility = 'visible';
    currentMessageDiv.style.opacity = '1';

    // Setup to hide the message after some time
    hideTimeout = setTimeout(() => {
        currentMessageDiv.style.opacity = '0';

        // Setup to remove the element after the transition duration
        removeTimeout = setTimeout(() => {
            if (currentMessageDiv) {
                currentMessageDiv.remove();
                currentMessageDiv = null;
            }
        }, 300); // This should match the duration of the opacity transition in CSS
    }, 2000); // Time visible on screen
}



function isMobileDevice() {
    return /Mobi/i.test(navigator.userAgent);
}