document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("gallery");
    let columns = [];
    let columnHeights = [];
    let currentColumnsCount;
    let currentFolderIndex = 5;

    function setupColumns(numColumns) {
        currentColumnsCount = numColumns;
        columns = [];
        columnHeights = new Array(numColumns).fill(0);
        gallery.innerHTML = '';
        for (let i = 0; i < numColumns; i++) {
            let column = document.createElement("div");
            column.className = "column";
            gallery.appendChild(column);
            columns.push(column);
        }
    }

    function calculateColumns() {
        if (window.innerWidth < 800) {
            return 1;
        } else if (window.innerWidth < 1200) {
            return 2;
        }
        return 3;
    }

    function findShortestColumn() {
        return columnHeights.indexOf(Math.min(...columnHeights));
    }

    function appendImageToShortestColumn(img, imageContainer, imagePath) {
        let columnIndex = findShortestColumn();
        const projectPath = imagePath.replace('lowResCover.webp', 'project.html');
        img.addEventListener('click', () => {
            openOverlay(projectPath);
        });
    
        if (imageContainer.parentNode) {
            imageContainer.replaceChild(img, imageContainer.firstChild);
        } else {
            imageContainer.appendChild(img);
            columns[columnIndex].appendChild(imageContainer);
        }
    
        setTimeout(() => {
            columnHeights[columnIndex] = calculateColumnHeight(columns[columnIndex]);
        }, 0);
    }
    
    function calculateColumnHeight(column) {
        let height = 0;
        Array.from(column.children).forEach(child => {
             height += child.offsetHeight;
        });
        return height;
    }
    
    function loadHighResImage(imagePath, folderNumber, imageContainer) {
        let highResImage = new XMLHttpRequest();
        highResImage.open('GET', imagePath, true);
        highResImage.responseType = 'blob';
        highResImage.alt = `Cover Project ${folderNumber}`;

        highResImage.onload = function () {
            if (this.status === 200) {
                let blob = this.response;
                let img = document.createElement('img');
                img.alt = `Cover Project ${folderNumber}`; 
                img.onload = () => {
                    window.URL.revokeObjectURL(img.src);
                    appendImageToShortestColumn(img, imageContainer, imagePath);
                };
                img.src = window.URL.createObjectURL(blob);
            }
        };
    
        highResImage.onerror = function () {
            console.log(`Error loading high-res image /${folderNumber}/`);
        };
    
        highResImage.send();
    }

    function loadNextFolderImage(folderNumber) {
        if (folderNumber < 1) {
            return;
        }
    
        let lowResImagePath = `pages/${folderNumber}/coverLowRes.webp`;
        let highResImagePath = `pages/${folderNumber}/cover.webp`;
    
        let imageContainer = document.createElement("div");
        imageContainer.className = 'image-container';
    
        let lowResImg = new Image();
    
        lowResImg.alt = `Cover Project Low Res ${folderNumber}`;
        lowResImg.onload = () => {
            lowResImg.style.display = "block";
            appendImageToShortestColumn(lowResImg, imageContainer, lowResImagePath);
            loadHighResImage(highResImagePath, folderNumber, imageContainer);
            loadNextFolderImage(folderNumber - 1);
        };
        lowResImg.onerror = () => {
            console.log(`Can't load low-res image /${folderNumber}/`);
        };
        lowResImg.src = lowResImagePath;
    }
    
    function setupAndLoadImages() {
        setupColumns(calculateColumns());
        loadNextFolderImage(currentFolderIndex);
    }

    setupAndLoadImages();
    window.addEventListener('resize', () => {
        let newColumns = calculateColumns();
        if (newColumns !== currentColumnsCount) {
            setupAndLoadImages();
        }
    });
});

let overlayOpen = false;
let currentProjectPath = null;

function openOverlay(projectPath) {
    if (overlayOpen) {
        return;
    }

    let modifiedProjectPath = projectPath + "?overlay";
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('upwork')) {
        modifiedProjectPath += "&upwork";
    }

    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.innerHTML = `
        <div class="overlay-content">
            <iframe src="${modifiedProjectPath}" frameborder="0"></iframe>
            <button class="close-btn" onclick="closeOverlay()"></button>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";

    overlay.addEventListener('click', function(e) {
        if (e.target.id === "overlay") {
            closeOverlay();
        }
    });

    setTimeout(() => {
        overlay.style.opacity = "1";
        overlay.style.visibility = "visible";
    }, 10);

    overlayOpen = true;
    currentProjectPath = projectPath;
}

function closeOverlay() {
    if (!overlayOpen) {
        return;
    }
    
    const overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
        setTimeout(() => {
            overlay.remove();
            resetOverlayState();
        }, 300);
    } else {
        resetOverlayState();
    }
}

function resetOverlayState() {
    overlayOpen = false;
    currentProjectPath = null;
}
