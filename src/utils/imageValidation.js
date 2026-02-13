/**
 * Validates a document file for size, type, dimensions, and blurriness.
 * @param {File} file - The file to validate.
 * @returns {Promise<{isValid: boolean, error: string|null}>}
 */
export const validateDocument = async (file) => {
    // 1. Check File Size (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
        return { isValid: false, error: "File exceeds 5MB limit. Please upload a smaller file." };
    }

    // 2. Check File Type
    if (!file.type.startsWith('image/')) {
        // Allow PDF but skip image checks for now (or implement PDF.js if needed, but keeping simple)
        if (file.type === 'application/pdf') {
            return { isValid: true, error: null };
        }
        return { isValid: false, error: "Invalid file type. Please upload an image (JPG, PNG) or PDF." };
    }

    // 3. Image Quality Checks (Dimensions & Blur)
    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            // A. Check Dimensions (Min 800x600 or similar approx)
            const MIN_WIDTH = 600;
            const MIN_HEIGHT = 400; // Relaxed slightly for mobile photos
            if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
                resolve({ isValid: false, error: `Image is too small (${img.width}x${img.height}). Please upload a clearer, higher resolution photo.` });
                return;
            }

            // B. Check Blur (Laplacian Variance)
            const isBlurry = detectBlur(img);
            if (isBlurry) {
                resolve({ isValid: false, error: "Image appears blurry. Please ensure the text is clear and readable." });
                return;
            }

            resolve({ isValid: true, error: null });
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({ isValid: false, error: "Failed to load image. File may be corrupted." });
        };

        img.src = objectUrl;
    });
};

/**
 * Detects if an image is blurry using Laplacian Variance.
 * @param {HTMLImageElement} img 
 * @returns {boolean} true if blurry
 */
const detectBlur = (img) => {
    const canvas = document.createElement('canvas');
    // Resize for performance (analyze a smaller version)
    const ctx = canvas.getContext('2d');
    const width = 500;
    const scale = width / img.width;
    const height = img.height * scale;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const grayData = new Uint8ClampedArray(width * height);

    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
        // R*0.299 + G*0.587 + B*0.114
        grayData[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    // Calculate Laplacian Variance
    // Kernel: [0, -1, 0, -1, 4, -1, 0, -1, 0]
    let mean = 0;
    const laplacian = new Float32Array(grayData.length);
    let laplacianCount = 0;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const i = y * width + x;

            // Convolve
            const val =
                grayData[i] * 4 -
                grayData[i - 1] -
                grayData[i + 1] -
                grayData[i - width] -
                grayData[i + width];

            laplacian[i] = val;
            mean += val;
            laplacianCount++;
        }
    }

    mean /= laplacianCount;

    let variance = 0;
    for (let i = 0; i < laplacian.length; i++) {
        // Only consider pixels inside the border loop
        if (laplacian[i] !== 0) {
            variance += Math.pow(laplacian[i] - mean, 2);
        }
    }
    variance /= laplacianCount;

    // console.log("Laplacian Variance Score:", variance);

    // Threshold: Experientially, < 100-200 is blurry for docs. 
    // Let's set a conservative threshold to avoid false positives.
    // Sharp text usually has high variance (>300).
    const BLUR_THRESHOLD = 50; // Very conservative start. 
    // If it's a document, text edges should create high variance. 
    // A completely blurry image might define edges poorly.

    return variance < BLUR_THRESHOLD;
};
