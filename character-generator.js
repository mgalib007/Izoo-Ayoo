document.addEventListener('DOMContentLoaded', () => {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    
    // Draw character body (blue shirt)
    ctx.fillStyle = '#001F3F';
    ctx.fillRect(30, 50, 40, 50);
    
    // Draw head
    ctx.fillStyle = '#FFC0CB';
    ctx.beginPath();
    ctx.arc(50, 30, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw legs (blue shorts)
    ctx.fillStyle = '#0074D9';
    ctx.fillRect(30, 100, 15, 30);
    ctx.fillRect(55, 100, 15, 30);
    
    // Draw arms
    ctx.fillStyle = '#001F3F';
    ctx.fillRect(15, 60, 15, 30);
    ctx.fillRect(70, 60, 15, 30);
    
    // Draw shoes (red)
    ctx.fillStyle = '#FF4136';
    ctx.fillRect(25, 130, 20, 10);
    ctx.fillRect(55, 130, 20, 10);
    
    // Draw face features
    ctx.fillStyle = 'black';
    // Eyes
    ctx.beginPath();
    ctx.arc(43, 25, 3, 0, Math.PI * 2);
    ctx.arc(57, 25, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    ctx.beginPath();
    ctx.arc(50, 38, 5, 0, Math.PI);
    ctx.stroke();
    
    // Convert to base64 data URL
    const dataURL = canvas.toDataURL('image/png');
    
    // Create a link to download the image
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'character.png';
    link.textContent = 'Download Character Image';
    link.style.display = 'block';
    link.style.marginTop = '20px';
    
    // Add canvas and link to document
    document.body.appendChild(canvas);
    document.body.appendChild(link);
    
    // Also display the data URL in console for easy copying
    console.log(dataURL);
}); 