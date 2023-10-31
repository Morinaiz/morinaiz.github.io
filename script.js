

document.addEventListener("DOMContentLoaded", function() {
    const gallery = document.getElementById("gallery");
    let columns = [];
    let columnHeights = [];
    let currentColumnsCount;
    let currentFolderIndex = 1;

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
            return 2;
        } else if (window.innerWidth < 1200) {
            return 3;
        }
        return 5;
    }

    function findShortestColumn() {
        return columnHeights.indexOf(Math.min(...columnHeights));
    }

    function appendImageToShortestColumn(img, imagePath) {
        let columnIndex = findShortestColumn();
        console.log(`Appending image: ${img.src} to column ${columnIndex}`);

        img.addEventListener('click', () => {
            const projectPath = imagePath.replace('cover.png', 'project.html');
            openOverlay(imagePath.replace('cover.png', 'project.html'));
        });

        columns[columnIndex].appendChild(img);
        columnHeights[columnIndex] += img.height;
    }

    function loadNextFolderImage(folderNumber) {
        let imagePath = `pages/${folderNumber}/cover.png`;
        let img = new Image();
    
        img.onload = () => {
            appendImageToShortestColumn(img, imagePath);
            loadNextFolderImage(folderNumber + 1);
        };
    
        img.onerror = () => {
            console.log(`No more folders found after: pages/${folderNumber - 1}/`);
            // Optionally, you can perform some cleanup or state updates here
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

function openOverlay(projectPath) {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.innerHTML = `
        <div class="overlay-content">
            <iframe src="${projectPath}" frameborder="0"></iframe>
            <button class="close-btn" onclick="closeOverlay()"></button>
        </div>
    `;

    // Initially hidden
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";

    // Close overlay if clicked outside of .overlay-content
    overlay.addEventListener('click', function(e) {
        if (e.target.id === "overlay") {
            closeOverlay();
        }
    });

    document.body.appendChild(overlay);

    // Delay to enable CSS transition
    setTimeout(() => {
        overlay.style.opacity = "1";
        overlay.style.visibility = "visible";
    }, 10); // short delay
}

function closeOverlay() {
    const overlay = document.getElementById("overlay");
    if (overlay) {
        // Start the hiding transition
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";

        // Wait for the transition to finish before removing
        setTimeout(() => {
            overlay.remove();
        }, 300); // should match the transition duration
    }
}
