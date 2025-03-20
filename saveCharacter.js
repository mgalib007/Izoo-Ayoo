// This script converts the image data to a file and saves it
document.addEventListener('DOMContentLoaded', () => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set dimensions for character
    canvas.width = 80;
    canvas.height = 120;
    
    // Function to convert base64 to Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        return new Blob([ab], { type: mimeString });
    }
    
    // Load the image from the DOM
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image centered and scaled to fit
        const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
        );
        
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Convert to dataURL
        const dataURL = canvas.toDataURL('image/png');
        
        // Create a link to download the image
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataURItoBlob(dataURL));
        link.download = 'character.png';
        link.textContent = 'Download Character Image';
        link.style.display = 'block';
        link.style.margin = '20px auto';
        link.style.padding = '10px 20px';
        link.style.backgroundColor = '#4CAF50';
        link.style.color = 'white';
        link.style.borderRadius = '5px';
        link.style.textDecoration = 'none';
        link.style.textAlign = 'center';
        link.style.width = '250px';
        
        // Add the link to the document
        document.body.appendChild(canvas);
        document.body.appendChild(link);
        
        // Auto click to download
        link.click();
    };
    
    // Set the source to the image element
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    
    // Replace this with the actual image URL
    // This is just a placeholder 1x1 transparent pixel
}); 