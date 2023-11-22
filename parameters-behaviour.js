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
            homeButton.setAttribute('href', `${currentHref}${separator}${upworkParam}`);
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

document.getElementById('shareButton').addEventListener('auxclick', function(event) {
    if (event.button === 1) {
        event.preventDefault();

        let url = new URL(window.location.href);
        url.searchParams.delete('overlay');

        if (url.searchParams.has('upwork')) {
            url.searchParams.delete('upwork');
            let newUrl = url.href.split('?')[0];
            let params = Array.from(url.searchParams.entries()).map(entry => entry[0] + (entry[1] ? '=' + entry[1] : '')).join('&');
            if (params) {
                newUrl += '?' + params + '&upwork';
            } else {
                newUrl += '?upwork';
            }
            window.open(newUrl, '_blank');
        } else {
            window.open(url.toString(), '_blank');
        }
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
let removeTimeout = null;

function showMessage(message) {
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

    currentMessageDiv.style.visibility = 'visible';
    currentMessageDiv.style.opacity = '1';

    hideTimeout = setTimeout(() => {
        currentMessageDiv.style.opacity = '0';

        removeTimeout = setTimeout(() => {
            if (currentMessageDiv) {
                currentMessageDiv.remove();
                currentMessageDiv = null;
            }
        }, 300);
    }, 2000);
}

function isMobileDevice() {
    return /Mobi/i.test(navigator.userAgent);
}