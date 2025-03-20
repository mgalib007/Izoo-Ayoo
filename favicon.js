document.addEventListener('DOMContentLoaded', () => {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, 32, 32);
    
    // Draw character (simplified)
    ctx.fillStyle = '#001F3F'; // Navy
    ctx.fillRect(10, 15, 8, 10); // Body
    
    ctx.fillStyle = '#FFC0CB'; // Pink
    ctx.beginPath();
    ctx.arc(14, 10, 5, 0, Math.PI * 2); // Head
    ctx.fill();
    
    ctx.fillStyle = '#0074D9'; // Blue
    ctx.fillRect(10, 25, 3, 6); // Left leg
    ctx.fillRect(15, 25, 3, 6); // Right leg
    
    ctx.fillStyle = '#FF4136'; // Red
    ctx.fillRect(9, 31, 5, 1); // Left shoe
    ctx.fillRect(14, 31, 5, 1); // Right shoe
    
    // Draw cactus
    ctx.fillStyle = '#2ECC40'; // Green
    ctx.fillRect(22, 20, 4, 12); // Cactus body
    ctx.fillRect(26, 23, 3, 3); // Cactus arm
    
    // Convert to data URL
    const faviconUrl = canvas.toDataURL('image/png');
    
    // Create favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    link.type = 'image/png';
    
    // Add to document head
    document.head.appendChild(link);
    
    console.log('Favicon added to the page');
}); 