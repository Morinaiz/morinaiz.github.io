

document.addEventListener("DOMContentLoaded", function() {
    const imageContainer = document.getElementById("image-container");
    let columns = [];
    let columnHeights = [];
    let currentColumnsCount;
    let currentImageIndex = 0; // Track the index of the current image being loaded
    let preloadedImages = [];  // Initialize empty array for preloaded images


    const imageLoadTimeout = 3000; // Adjust timeout as needed

    const imageFolderPath = "images/";
    const imageNames = [
        "image1.png", "image2.png", "image3.png", "image4.png",
        "image5.png", "image6.png", "image7.png", "image8.png",
        "image9.png", "image10.png", "image11.png", "image12.png"
    ];

    function setupColumns(numColumns) {
        currentColumnsCount = numColumns;
        columns = [];
        columnHeights = new Array(numColumns).fill(0);
        imageContainer.innerHTML = '';
        
        for (let i = 0; i < numColumns; i++) {
            let column = document.createElement("div");
            column.className = "column";
            imageContainer.appendChild(column);
            columns.push(column);
        }
    }

    function calculateColumns() {
        if (window.innerWidth < 800) {
            return 2;
        } else if (window.innerWidth < 1200) {
            return 4;
        }
        return 6;
    }

    function findShortestColumn() {
        return columnHeights.indexOf(Math.min(...columnHeights));
    }

    function appendImageToShortestColumn(img) {
        let columnIndex = findShortestColumn();
        console.log(`Appending image: ${img.src} to column ${columnIndex}`);
        columns[columnIndex].appendChild(img);
        columnHeights[columnIndex] += img.height; // Might not be accurate before image is displayed
    }
    
    function preloadImages(images, allLoadedCallback) {
        preloadedImages = new Array(images.length); // Set the array size based on the number of images
        let loadedCount = 0;

        images.forEach((imageName, index) => {
            let img = new Image();
            img.onload = () => {
                loadedCount++;
                preloadedImages[index] = img;  // Store successfully loaded image at its respective index
                if (loadedCount === images.length) {
                    allLoadedCallback();  // All images have been loaded
                }
            };
            img.onerror = img.onabort = () => {
                loadedCount++;
                preloadedImages[index] = null;  // Assign null for failed loads
                if (loadedCount === images.length) {
                    allLoadedCallback();  // Proceed even if some images failed
                }
            };
            img.src = imageFolderPath + imageName;
        });
    }

    function processPreloadedImages() {
        preloadedImages.forEach((img) => {
            if (img) {  // Check if the image is not null (i.e., it loaded successfully)
                appendImageToShortestColumn(img);
            }
        });
    }

    function loadNextImage() {
        if (currentImageIndex >= imageNames.length) {
            console.log("All images processed.");
            return; // Stop if all images are processed
        }

        let img = new Image();
        img.src = imageFolderPath + imageNames[currentImageIndex];
        img.loading = "lazy";
        console.log(`Starting load for: ${img.src}`);

        let hasTimedOut = false;
        const timer = setTimeout(() => {
            hasTimedOut = true;
            console.error(`Loading timed out for: ${img.src}`);
            currentImageIndex++;
            loadNextImage(); // Skip to next image
        }, imageLoadTimeout);

        img.onload = img.onerror = (e) => {
            clearTimeout(timer);
            if (!hasTimedOut) {
                if (img.complete && img.naturalHeight !== 0) {
                    appendImageToShortestColumn(img);
                } else {
                    console.error(`Error loading image: ${img.src}`, e);
                }
                currentImageIndex++;
                loadNextImage(); // Load next image
            }
        };

            // Bypass timeout if the image is already loaded from cache
        if (img.complete && img.naturalHeight !== 0) {
            clearTimeout(timer);
            appendImageToShortestColumn(img);
            currentImageIndex++;
            loadNextImage();
        }
    }

    function setupAndLoadImages() {
        setupColumns(calculateColumns());
        preloadImages(imageNames, () => {
            processPreloadedImages(); // Process images after all have been preloaded
        });
    }

    setupAndLoadImages();

    // Handle window resize
    window.addEventListener('resize', () => {
        let newColumns = calculateColumns();
        if (newColumns !== currentColumnsCount) {
            setupAndLoadImages(); // Re-setup and load images
        }
    });
});
