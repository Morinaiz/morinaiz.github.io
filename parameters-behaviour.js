document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const homeButton = document.getElementById('home-button');
    const blogLink = document.getElementById('blogLink');
    const portfolioLink = document.getElementById('portfolioLink');
    const upworkParam = "upwork";

    if (urlParams.has('overlay') && homeButton) {
        homeButton.style.display = 'none';
    }

    function appendUpworkParam(link) {
        if (link && urlParams.has(upworkParam)) {
            const currentHref = link.getAttribute('href');
            // If the href doesn't already contain the parameter, append it manually
            if (!currentHref.includes(upworkParam)) {
                const separator = currentHref.includes('?') ? '&' : '?';
                link.setAttribute('href', `${currentHref}${separator}${upworkParam}`);
            }
        }
    }

    appendUpworkParam(homeButton);
    appendUpworkParam(blogLink);
    appendUpworkParam(portfolioLink);

    if (!urlParams.has(upworkParam)) {
        document.querySelectorAll('.social-icon').forEach(element => {
            element.style.display = 'inline-flex';
        });
    }

    const shareButton = document.getElementById('shareButton');
    if (shareButton) {
        shareButton.addEventListener('click', sharePage);
        shareButton.addEventListener('auxclick', function(event) {
            if (event.button === 1) {
                event.preventDefault();
                openModifiedLink();
            }
        });
    }

    // Process all same-origin links: append ?upwork (or &upwork) if needed.
    if (urlParams.has(upworkParam)) {
        document.querySelectorAll("a").forEach(link => {
            const url = new URL(link.href, window.location.origin);
            // Use a regex to check if "upwork" is already present in the query string
            if (url.origin === window.location.origin && !/(?:\?|&)upwork(?:&|$)/.test(url.search)) {
                if (url.search) {
                    url.search = url.search + '&' + upworkParam;
                } else {
                    url.search = '?' + upworkParam;
                }
                link.href = url.toString();
            }
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
        }).catch(console.error);
    } else {
        copyTextToClipboard(decodeURIComponent(encodedUrl));
    }
}

function openModifiedLink() {
    let url = new URL(window.location.href);
    url.searchParams.delete('overlay');
    const upworkParam = "upwork";
    // Use URLSearchParams to remove overlay but not upwork,
    // then check if the original search string contained "upwork" manually.
    let params = new URLSearchParams(url.search);
    if (/(?:\?|&)upwork(?:&|$)/.test(url.search)) {
        let searchString = params.toString();
        if (searchString) {
            url.search = '?' + searchString + '&' + upworkParam;
        } else {
            url.search = '?' + upworkParam;
        }
        window.open(url.toString(), '_blank');
    } else {
        window.open(url.toString(), '_blank');
    }
}

function removeOverlayParamFromURL(url) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    params.delete('overlay');
    return urlObj.origin + urlObj.pathname + (params.toString() ? '?' + params.toString() : '') + urlObj.hash;
}

function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text)
    .then(() => showMessage("Copied to clipboard!"))
    .catch(() => showMessage("Failed to copy!"));
}

let currentMessageDiv = null;

function showMessage(message) {
    if (currentMessageDiv) currentMessageDiv.remove();

    currentMessageDiv = document.createElement('div');
    currentMessageDiv.className = 'message';
    currentMessageDiv.textContent = message;
    document.body.appendChild(currentMessageDiv);

    setTimeout(() => {
        currentMessageDiv.remove();
        currentMessageDiv = null;
    }, 2000);
}

function isMobileDevice() {
    return /Mobi/i.test(navigator.userAgent);
}
