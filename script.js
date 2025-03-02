const imageInput = document.getElementById('image-input');
const previewImage = document.getElementById('preview-image');
const fileNameDisplay = document.getElementById('file-name');
const compressionLevelInput = document.getElementById('compression-level');
const compressionValueDisplay = document.getElementById('compression-value');
const maxWidthInput = document.getElementById('max-width');
const maxHeightInput = document.getElementById('max-height');
const compressButton = document.getElementById('compress-button');
const originalSizeDisplay = document.getElementById('original-size');
const compressedSizeDisplay = document.getElementById('compressed-size');
const compressedImageElement = document.getElementById('compressed-image');
const downloadLink = document.getElementById('download-link');
const resultsSection = document.getElementById('results');

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        fileNameDisplay.textContent = `File: ${file.name}, Size: ${formatBytes(file.size)}`;
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = 'block';
    } else {
        fileNameDisplay.textContent = '';
        previewImage.src = '#';
        previewImage.style.display = 'none';
    }
});

compressionLevelInput.addEventListener('input', () => {
    const compressionLevel = parseFloat(compressionLevelInput.value);
    compressionValueDisplay.textContent = `Compression: ${Math.round(compressionLevel * 100)}%`;
});

compressButton.addEventListener('click', async () => {
    const file = imageInput.files[0];
    if (!file) {
        alert('Please select an image first.');
        return;
    }

    const maxWidth = maxWidthInput.value ? parseInt(maxWidthInput.value) : undefined;
    const maxHeight = maxHeightInput.value ? parseInt(maxHeightInput.value) : undefined;
    const compressionLevel = parseFloat(compressionLevelInput.value);

    const options = {
        maxSizeMB: 2, // Max size in MB, adjust as needed
        maxWidthOrHeight: maxWidth || maxHeight || undefined, // Use either maxWidth or maxHeight
        useWebWorker: true,
        fileType: 'image/*',
        quality: compressionLevel,
    };

    try {
        originalSizeDisplay.textContent = formatBytes(file.size);
        const compressedFile = await imageCompression(file, options);
        compressedSizeDisplay.textContent = formatBytes(compressedFile.size);

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
            const base64data = reader.result;
            compressedImageElement.src = base64data;
            downloadLink.href = base64data;
            downloadLink.download = `compressed_${file.name}`;
            resultsSection.style.display = 'block';
        };

    } catch (error) {
        console.error('Compression error:', error);
        alert('Error compressing image.  See console for details.');
    }
});

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}