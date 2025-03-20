document.addEventListener('DOMContentLoaded', () => {
    // This script enhances the control experience for mobile users
    
    // Create touch event listeners for mobile devices
    const gameContainer = document.getElementById('game-container');
    
    // Detect if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Force layout recalculation when the game loads
    setTimeout(() => {
        window.scrollTo(0, 1); // Hide address bar on mobile if possible
        
        // Force redraw to ensure proper positioning
        gameContainer.style.display = 'none';
        gameContainer.offsetHeight; // Trigger reflow
        gameContainer.style.display = '';
    }, 100);
    
    if (isTouchDevice) {
        console.log('Touch device detected, enabling touch controls');
        
        // Create visual touch indicator
        const touchIndicator = document.createElement('div');
        touchIndicator.id = 'touch-indicator';
        touchIndicator.textContent = 'Tap anywhere to jump';
        touchIndicator.style.position = 'fixed';
        touchIndicator.style.bottom = '80px';
        touchIndicator.style.left = '50%';
        touchIndicator.style.transform = 'translateX(-50%)';
        touchIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        touchIndicator.style.padding = '10px 20px';
        touchIndicator.style.borderRadius = '10px';
        touchIndicator.style.fontSize = '16px';
        touchIndicator.style.color = '#333';
        touchIndicator.style.zIndex = '25';
        touchIndicator.style.transition = 'opacity 1s';
        
        document.body.appendChild(touchIndicator);
        
        // Hide indicator after 3 seconds
        setTimeout(() => {
            touchIndicator.style.opacity = '0';
        }, 3000);
        
        // Add specific touch events to improve responsiveness
        gameContainer.addEventListener('touchstart', (e) => {
            // Prevent default to avoid delay on some browsers
            e.preventDefault();
            
            // Trigger the jump through a custom event
            const jumpEvent = new Event('jump');
            gameContainer.dispatchEvent(jumpEvent);
        }, { passive: false });
        
        // Handle orientation changes to improve mobile gameplay
        window.addEventListener('orientationchange', () => {
            // Force redraw to ensure proper positioning after orientation change
            setTimeout(() => {
                // Force redraw
                document.body.style.display = 'none';
                document.body.offsetHeight; // Trigger reflow
                document.body.style.display = '';
                
                // Pause game and show message if in portrait mode on phones
                const isPortrait = window.innerHeight > window.innerWidth;
                
                if (isPortrait && window.innerWidth < 600) {
                    const message = document.createElement('div');
                    message.id = 'orientation-message';
                    message.textContent = 'Rotate device for better gameplay';
                    message.style.position = 'fixed';
                    message.style.top = '50%';
                    message.style.left = '50%';
                    message.style.transform = 'translate(-50%, -50%)';
                    message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    message.style.color = 'white';
                    message.style.padding = '15px';
                    message.style.borderRadius = '5px';
                    message.style.zIndex = '30';
                    message.style.fontSize = '16px';
                    message.style.textAlign = 'center';
                    message.style.width = '80%';
                    message.style.maxWidth = '300px';
                    
                    // Remove existing message if there is one
                    const existingMessage = document.getElementById('orientation-message');
                    if (existingMessage) {
                        existingMessage.remove();
                    }
                    
                    document.body.appendChild(message);
                    
                    // Remove message when orientation changes to landscape
                    setTimeout(() => {
                        message.remove();
                    }, 5000);
                }
            }, 300); // Small delay to let the orientation change complete
        });
        
        // Check if we need to show orientation message on initial load
        const isPortrait = window.innerHeight > window.innerWidth;
        if (isPortrait && window.innerWidth < 600) {
            const message = document.createElement('div');
            message.id = 'orientation-message';
            message.textContent = 'Rotate device for better gameplay';
            message.style.position = 'fixed';
            message.style.top = '50%';
            message.style.left = '50%';
            message.style.transform = 'translate(-50%, -50%)';
            message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            message.style.color = 'white';
            message.style.padding = '15px';
            message.style.borderRadius = '5px';
            message.style.zIndex = '30';
            message.style.fontSize = '16px';
            message.style.textAlign = 'center';
            message.style.width = '80%';
            message.style.maxWidth = '300px';
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 5000);
        }
    }
}); 