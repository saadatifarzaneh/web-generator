function getBackgroundImageUrl() {
    // Assuming the background image is set with CSS as 'background-image' on the body
    const bodyStyle = window.getComputedStyle(document.body);
    const imageUrl = bodyStyle.backgroundImage.slice(4, -1).replace(/"/g, "");
    return imageUrl;
}

function loadImageAndDetermineColor(url, callback) {
    const imgElement = new Image();

    // Set CORS access if the image is served with CORS headers
    imgElement.crossOrigin = 'Anonymous';
    if (imageUrl == "") {
        const bgColor = window.getComputedStyle(document.body, null).backgroundColor;
        var rgbParts = bgColor.match(/\d+/g);
        var r = parseInt(rgbParts[0]);
        var g = parseInt(rgbParts[1]);
        var b = parseInt(rgbParts[2]);
        const foregroundColor = getContrastingForegroundColor({ r, g, b });
        callback(foregroundColor);
    }
    imgElement.onload = function () {
        const averageColor = getAverageImageColor(imgElement);
        const foregroundColor = getContrastingForegroundColor(averageColor);
        callback(foregroundColor); // Use a callback to use the color
    };

    imgElement.src = url;
}

const imageUrl = getBackgroundImageUrl();

loadImageAndDetermineColor(imageUrl, (foregroundColor) => {
    // Apply the foregroundColor to the text or elements as needed
    console.log('Foreground color should be:', foregroundColor);
    document.body.style.color = foregroundColor;
});


function getAverageImageColor(imgElement) {
    // Create a canvas element to draw the image on it
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set the canvas size to the same as the image
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
  
    // Draw the image onto the canvas
    context.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
  
    // Get the image data for the whole image
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    // Variables to keep the sum of all colors
    let r = 0, g = 0, b = 0;
  
    // Loop over each pixel and add the color to the total sum
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }
  
    // Calculate the average color
    const pixelCount = imgElement.width * imgElement.height;
    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);
  
    return { r, g, b };
}
  
function getContrastingForegroundColor(rgb) {
    const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    return luminance < 128 ? '#ffffff' : '#000000';
}
