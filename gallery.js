document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.getElementById("gallery");
    let columns = [];
    let columnHeights = [];
    let currentColumnsCount;
    let currentFolderIndex = 2;

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

    function appendImageToShortestColumn(img, imagePath) {
        let columnIndex = findShortestColumn();
        const projectPath = imagePath.replace('cover.png', 'project.html');
        img.addEventListener('click', () => {
            openOverlay(projectPath);
        });
        columns[columnIndex].appendChild(img);
        columnHeights[columnIndex] += img.height;
    }

    function loadNextFolderImage(folderNumber) {
        let imagePath = `pages/${folderNumber}/cover.png`;
        let img = new Image();
        img.alt = "Cover Project " + folderNumber;
        img.onload = () => {
            appendImageToShortestColumn(img, imagePath);
            if (folderNumber > 1) loadNextFolderImage(folderNumber - 1);
        };
        img.onerror = () => {
            console.log(`Can't find folder number /${folderNumber - 1}/`);
        };
        img.src = imagePath;
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
