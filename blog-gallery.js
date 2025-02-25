let overlayOpen = false;

document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("blog-gallery");
    let currentBlogPostIndex = 3;

    function setupColumn() {
        gallery.innerHTML = '';
        let column = document.createElement("div");
        column.className = "blog-column";
        gallery.appendChild(column);
        return column;
    }

    function appendPostToColumn(postContainer, postPath, column) {
        postContainer.addEventListener('click', () => {
            openOverlay(postPath);
        });
        column.appendChild(postContainer);
    }

    function loadNextBlogPost(postNumber, column) {
        if (postNumber < 1) {
            return;
        }

        let postPath = `blog/${postNumber}/post.html`;

        fetch(postPath)
            .then(response => response.text())
            .then(data => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(data, "text/html");
                let title = doc.querySelector('title').textContent;
                let date = doc.querySelector('.post-date').textContent;
                let excerpt = doc.querySelector('meta[name="description"]').getAttribute('content');
                let coverImage = `blog/${postNumber}/` + doc.querySelector('meta[property="og:image"]').getAttribute('content');

                let postContainer = document.createElement('div');
                postContainer.className = 'post-container';

                let imgElement = document.createElement('img');
                imgElement.src = coverImage;
                imgElement.alt = `Cover Image for ${title}`;
                postContainer.appendChild(imgElement);

                let titleElement = document.createElement('h2');
                titleElement.textContent = title;
                postContainer.appendChild(titleElement);

                let dateElement = document.createElement('p');
                dateElement.textContent = date;
                dateElement.className = 'post-date';
                postContainer.appendChild(dateElement);

                let excerptElement = document.createElement('p');
                excerptElement.textContent = excerpt;
                excerptElement.className = 'post-excerpt';
                postContainer.appendChild(excerptElement);

                appendPostToColumn(postContainer, postPath, column);

                loadNextBlogPost(postNumber - 1, column);
            })
            .catch(error => {
                console.log(`Error loading blog post ${postNumber}:`, error);
            });
    }

    function setupAndLoadPosts() {
        let column = setupColumn(); 
        loadNextBlogPost(currentBlogPostIndex, column);
    }

    setupAndLoadPosts();

    window.addEventListener('resize', () => {
        setupAndLoadPosts();
    });
});

// Overlay logic
function openOverlay(postPath) {
    if (overlayOpen) return;

    let modifiedPostPath = postPath + "?overlay";
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('upwork')) {
        modifiedPostPath += "&upwork";
    }

    let overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.innerHTML = `
        <div class="overlay-content">
            <iframe src="${modifiedPostPath}" frameborder="0"></iframe>
            <button class="close-btn" onclick="closeOverlay()"></button>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";

    overlay.addEventListener('click', function (e) {
        if (e.target.id === "overlay") {
            closeOverlay();
        }
    });

    setTimeout(() => {
        overlay.style.opacity = "1";
        overlay.style.visibility = "visible";
    }, 10);

    overlayOpen = true;
}

function closeOverlay() {
    if (!overlayOpen) return;

    const overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }

    overlayOpen = false;
}
