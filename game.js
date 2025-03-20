document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const obstacle = document.getElementById('obstacle');
    const scoreDisplay = document.getElementById('score');
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');
    const gameContainer = document.getElementById('game-container');
    
    // Set character image directly
    const characterImage = localStorage.getItem('characterImage') || 'output-onlinepngtools.png';
    character.style.backgroundImage = `url('${characterImage}')`;
    
    // Load sound effects
    const bgMusic = new Audio('bgm.wav');
    const jumpSound = new Audio('jump.mp3');
    const crashSound = new Audio('crash.wav');
    
    // Set background music to loop
    bgMusic.loop = true;
    bgMusic.volume = 0.5; // Set to half volume
    
    // Preload sounds
    bgMusic.load();
    jumpSound.load();
    crashSound.load();
    
    // Online game components
    let socket = null;
    let playerId = null;
    let otherPlayers = {};
    let isOnline = false;
    
    // Create status indicator for online connectivity
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'online-status';
    statusIndicator.textContent = 'Offline Mode';
    statusIndicator.style.position = 'absolute';
    statusIndicator.style.top = '20px';
    statusIndicator.style.left = '50%';
    statusIndicator.style.transform = 'translateX(-50%)';
    statusIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    statusIndicator.style.color = '#333';
    statusIndicator.style.padding = '8px 15px';
    statusIndicator.style.borderRadius = '20px';
    statusIndicator.style.fontSize = '14px';
    statusIndicator.style.zIndex = '20';
    gameContainer.appendChild(statusIndicator);
    
    // Create connect button
    const connectButton = document.createElement('button');
    connectButton.id = 'connect-button';
    connectButton.textContent = 'Play Online';
    connectButton.style.position = 'absolute';
    connectButton.style.top = '60px';
    connectButton.style.left = '50%';
    connectButton.style.transform = 'translateX(-50%)';
    connectButton.style.zIndex = '20';
    connectButton.style.padding = '8px 15px';
    connectButton.style.fontSize = '14px';
    gameContainer.appendChild(connectButton);
    
    // Add sound control button
    const soundButton = document.createElement('button');
    soundButton.id = 'sound-button';
    soundButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>';
    soundButton.style.position = 'absolute';
    soundButton.style.top = '100px';
    soundButton.style.left = '50%';
    soundButton.style.transform = 'translateX(-50%)';
    soundButton.style.zIndex = '20';
    soundButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    soundButton.style.color = '#333';
    soundButton.style.border = 'none';
    soundButton.style.borderRadius = '30px';
    soundButton.style.width = 'auto';
    soundButton.style.height = 'auto';
    soundButton.style.padding = '8px 15px';
    soundButton.style.display = 'flex';
    soundButton.style.justifyContent = 'center';
    soundButton.style.alignItems = 'center';
    soundButton.style.cursor = 'pointer';
    soundButton.style.transition = 'all 0.3s';
    soundButton.style.fontSize = '14px';
    soundButton.innerHTML = 'Sound: On ' + soundButton.innerHTML;
    gameContainer.appendChild(soundButton);
    
    // Sound state
    let soundEnabled = true;
    
    // Toggle sound
    soundButton.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        
        if (soundEnabled) {
            if (!isGameOver && !isPaused) {
                bgMusic.play().catch(e => console.log("BGM play failed:", e));
            }
            soundButton.innerHTML = 'Sound: On <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>';
        } else {
            bgMusic.pause();
            soundButton.innerHTML = 'Sound: Off <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/><path d="M10.717 3.55A.5.5 0 0 1 11 4v8a.5.5 0 0 1-.812.39L7.825 10.5H5.5A.5.5 0 0 1 5 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>';
        }
    });
    
    // List of cactus images
    const cactusImages = [
        'output-onlinepngtools (1).png',
        'output-onlinepngtools (2).png',
        'output-onlinepngtools (3).png'
    ];
    
    // Preload images for better performance
    const preloadImages = () => {
        cactusImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        const charImg = new Image();
        charImg.src = characterImage;
    };
    preloadImages();
    
    let isJumping = false;
    let isGameOver = false;
    let score = 0;
    let gameSpeed = 4; // Lower initial game speed
    let obstacleTimeout;
    let gameLevel = 1;
    let obstacleDelay = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let gameLoopId = null;
    let scoreIntervalId = null;
    let isPaused = false;
    
    // Get container width dynamically to handle different screen sizes
    const getContainerWidth = () => {
        return gameContainer.getBoundingClientRect().width;
    };
    
    // Constants for gameplay
    const INITIAL_GAME_SPEED = 4; // Lower starting speed
    const MAX_GAME_SPEED = 10; // Lower max speed
    const ACCELERATION = 0.0005; // More gradual acceleration
    
    // Function to play sound
    function playSound(sound) {
        if (soundEnabled) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log(`Sound play failed: ${e}`));
        }
    }
    
    // Function to jump
    function jump() {
        if (!isJumping && !isGameOver && !isPaused) {
            isJumping = true;
            character.classList.add('jump');
            
            // Play jump sound
            playSound(jumpSound);
            
            // Send jump event to server if online
            if (isOnline) {
                sendPlayerData({
                    type: 'player_update',
                    id: playerId,
                    isJumping: true,
                    position: {
                        x: character.offsetLeft,
                        y: character.offsetTop
                    }
                });
            }
            
            setTimeout(() => {
                character.classList.remove('jump');
                isJumping = false;
                
                // Send jump complete event to server if online
                if (isOnline) {
                    sendPlayerData({
                        type: 'player_update',
                        id: playerId,
                        isJumping: false,
                        position: {
                            x: character.offsetLeft,
                            y: character.offsetTop
                        }
                    });
                }
            }, 1200); // Updated to match the new animation duration
        }
    }
    
    // Event listeners
    document.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.key === 'ArrowUp') && !isGameOver) {
            jump();
            e.preventDefault(); // Prevent page scrolling
        }
    });
    
    // Click event for mobile users
    document.addEventListener('click', (e) => {
        // Don't jump if clicking on buttons
        if (!isGameOver && e.target.tagName !== 'BUTTON') {
            jump();
        }
    });
    
    // Listen for custom jump event from controller.js
    gameContainer.addEventListener('jump', () => {
        jump();
    });
    
    // Handle visibility change (browser tab switching)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause the game and music when tab is not visible
            isPaused = true;
            if (soundEnabled) bgMusic.pause();
        } else {
            // Resume after a short delay to let everything settle
            setTimeout(() => {
                isPaused = false;
                if (soundEnabled && !isGameOver) bgMusic.play().catch(e => console.log("BGM play failed:", e));
            }, 300);
        }
    });
    
    // Check for collision
    function checkCollision() {
        const characterRect = character.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        
        // Calculate actual image boundaries - adjust the hitbox to be more forgiving
        // Reducing the hitbox to only detect actual visual content
        const characterHitbox = {
            left: characterRect.left + characterRect.width * 0.3,
            right: characterRect.right - characterRect.width * 0.3,
            top: characterRect.top + characterRect.height * 0.2,
            bottom: characterRect.bottom - characterRect.height * 0.1
        };
        
        const obstacleHitbox = {
            left: obstacleRect.left + obstacleRect.width * 0.2,
            right: obstacleRect.right - obstacleRect.width * 0.2,
            top: obstacleRect.top + obstacleRect.height * 0.1,
            bottom: obstacleRect.bottom - obstacleRect.height * 0.05
        };
        
        // Debug visualization if needed
        if (window.DEBUG_COLLISION) {
            visualizeHitbox(characterHitbox, 'character-hitbox');
            visualizeHitbox(obstacleHitbox, 'obstacle-hitbox');
        }
        
        // Check if hitboxes intersect
        return !(
            characterHitbox.right < obstacleHitbox.left || 
            characterHitbox.left > obstacleHitbox.right || 
            characterHitbox.bottom < obstacleHitbox.top || 
            characterHitbox.top > obstacleHitbox.bottom
        );
    }
    
    // Helper function to visualize hitboxes (for debugging)
    function visualizeHitbox(hitbox, id) {
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement('div');
            el.id = id;
            el.style.position = 'absolute';
            el.style.border = '2px solid red';
            el.style.zIndex = '999';
            el.style.pointerEvents = 'none';
            document.body.appendChild(el);
        }
        
        el.style.left = hitbox.left + 'px';
        el.style.top = hitbox.top + 'px';
        el.style.width = (hitbox.right - hitbox.left) + 'px';
        el.style.height = (hitbox.bottom - hitbox.top) + 'px';
    }
    
    // Function to update score
    function updateScore() {
        if (!isGameOver && !isPaused) {
            score++;
            scoreDisplay.innerText = score;
            
            // Update game speed based on score
            gameSpeed = Math.min(INITIAL_GAME_SPEED + (score * ACCELERATION), MAX_GAME_SPEED);
            
            // Update game level based on speed
            gameLevel = Math.floor((gameSpeed - INITIAL_GAME_SPEED) / 1.5) + 1;
        }
    }
    
    // Function to generate random obstacle distance based on game level
    function getRandomObstacleDelay() {
        // Smaller and more varied gaps
        const baseMinGap = 600;  // Smaller minimum gap
        const baseMaxGap = 1800; // Larger maximum gap for variety
        
        // As level increases, gaps become slightly smaller but more varied
        const levelFactor = gameLevel * 50;
        const minGap = Math.max(400, baseMinGap - levelFactor);
        const maxGap = Math.max(800, baseMaxGap - levelFactor);
        
        // Sometimes create very small gaps for challenge (10% chance)
        if (Math.random() < 0.1) {
            return Math.floor(Math.random() * 300) + 300; // 300-600ms
        }
        
        // Sometimes create medium gaps (40% chance)
        if (Math.random() < 0.4) {
            return Math.floor(Math.random() * 300) + minGap; // minGap to minGap+300ms
        }
        
        // Otherwise create random gap in the full range
        return Math.floor(Math.random() * (maxGap - minGap)) + minGap;
    }
    
    // Function to generate obstacles with random designs
    function generateObstacle() {
        if (isGameOver || isPaused) return;
        
        // Reset obstacle position
        obstacle.style.right = '-200px'; // Increased for larger obstacle
        
        // Choose a random cactus image
        const randomCactusImage = cactusImages[Math.floor(Math.random() * cactusImages.length)];
        obstacle.style.backgroundImage = `url('${randomCactusImage}')`;
        
        // Randomize obstacle size occasionally
        const scale = 0.9 + Math.random() * 0.2; // 0.9 to 1.1 - smaller range to keep obstacles consistently large
        const width = 110 * scale;  // Base width increased to 110
        const height = 180 * scale; // Base height increased to 180
        obstacle.style.width = `${width}px`;
        obstacle.style.height = `${height}px`;
        
        // Calculate animation duration based on game speed and container width
        const containerWidth = getContainerWidth();
        const duration = containerWidth / (100 * gameSpeed);
        
        // Apply animation
        obstacle.style.animation = 'none'; // Reset animation
        setTimeout(() => {
            // Force reflow to make sure animation restart works consistently
            obstacle.offsetHeight;
            obstacle.style.animation = `obstacle-move ${duration}s linear`;
            
            // Send obstacle data to server if online
            if (isOnline) {
                sendPlayerData({
                    type: 'obstacle_sync',
                    sourceId: playerId,
                    obstacleImage: randomCactusImage,
                    position: '-200px',
                    width: width,
                    height: height,
                    duration: duration
                });
            }
        }, 10);
        
        // When animation ends, generate a new obstacle after a random delay
        const animationEndHandler = () => {
            if (isGameOver || isPaused) return;
            
            obstacle.style.animation = 'none';
            
            // Get random delay based on game level
            obstacleDelay = getRandomObstacleDelay();
            
            // Schedule next obstacle
            obstacleTimeout = setTimeout(() => {
                if (!isGameOver && !isPaused) {
                    generateObstacle();
                }
            }, obstacleDelay);
        };
        
        // Remove old event listener and add new one
        obstacle.removeEventListener('animationend', animationEndHandler);
        obstacle.addEventListener('animationend', animationEndHandler, { once: true });
    }
    
    // Game loop
    function gameLoop() {
        if (isGameOver || isPaused) {
            if (gameLoopId) {
                cancelAnimationFrame(gameLoopId);
                gameLoopId = null;
            }
            return;
        }
        
        if (checkCollision()) {
            endGame();
            return;
        }
        
        // Send position updates for online mode
        if (isOnline && playerId && Math.random() < 0.05) { // Throttle updates to reduce network traffic
            sendPlayerData({
                type: 'player_update',
                id: playerId,
                characterImage: characterImage,
                isJumping: isJumping,
                position: {
                    x: character.offsetLeft,
                    y: character.offsetBottom || 60
                }
            });
        }
        
        gameLoopId = requestAnimationFrame(gameLoop);
    }
    
    // Start the game
    function startGame() {
        // Reset game state
        isGameOver = false;
        isPaused = false;
        score = 0;
        gameSpeed = INITIAL_GAME_SPEED;
        gameLevel = 1;
        scoreDisplay.innerText = score;
        gameOverElement.classList.add('hidden');
        
        // Start background music
        if (soundEnabled) {
            bgMusic.currentTime = 0;
            bgMusic.play().catch(e => console.log("BGM play failed:", e));
        }
        
        // Clear any existing timeouts
        if (obstacleTimeout) {
            clearTimeout(obstacleTimeout);
        }
        
        // Clear any existing intervals
        if (scoreIntervalId) {
            clearInterval(scoreIntervalId);
        }
        
        // Cancel any existing animation frames
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
        }
        
        // Generate first obstacle
        generateObstacle();
        
        // Start score counter
        scoreIntervalId = setInterval(() => {
            if (!isGameOver && !isPaused) {
                updateScore();
            }
        }, 250); // Update 4 times per second
        
        // Start game loop
        gameLoopId = requestAnimationFrame(gameLoop);
        
        // Notify server if online
        if (isOnline) {
            sendPlayerData({
                type: 'game_start',
                id: playerId
            });
        }
    }
    
    // End the game
    function endGame() {
        isGameOver = true;
        obstacle.style.animation = 'none';
        gameOverElement.classList.remove('hidden');
        
        // Play crash sound
        playSound(crashSound);
        
        // Pause background music
        if (soundEnabled) {
            bgMusic.pause();
        }
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('high-score').textContent = highScore;
        }
        
        // Clear any existing timeouts and intervals
        if (obstacleTimeout) {
            clearTimeout(obstacleTimeout);
        }
        
        if (scoreIntervalId) {
            clearInterval(scoreIntervalId);
        }
        
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }
        
        // Notify server if online
        if (isOnline) {
            sendPlayerData({
                type: 'game_over',
                id: playerId,
                score: score
            });
        }
    }
    
    // Restart button click handlers for both mouse and touch events
    restartButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default behavior
        e.stopPropagation(); // Stop event propagation
        startGame();
    });
    
    // Add specific touch event for mobile devices
    restartButton.addEventListener('touchend', (e) => {
        e.preventDefault(); // Prevent default behavior
        e.stopPropagation(); // Stop event propagation
        startGame();
    }, { passive: false });
    
    // Handle window resize to adjust the game
    window.addEventListener('resize', () => {
        if (!isGameOver && !isPaused) {
            // Restart obstacle with new container width
            obstacle.style.animation = 'none';
            setTimeout(() => {
                generateObstacle();
            }, 50);
        }
    });
    
    // Setup for mobile device interaction
    document.addEventListener('touchstart', () => {
        // Most mobile browsers require user interaction before playing audio
        if (soundEnabled && !bgMusic.paused) return;
        
        if (soundEnabled) {
            bgMusic.play().catch(e => {
                console.log("Initial BGM play failed on mobile, waiting for more interaction:", e);
            });
        }
    }, { once: true });
    
    // Connect to the game server
    function connectToServer() {
        try {
            // In a real implementation, replace with your actual WebSocket server address
            const serverUrl = 'wss://yourgameserver.com/runner';
            socket = new WebSocket(serverUrl);
            
            socket.onopen = () => {
                isOnline = true;
                statusIndicator.textContent = 'Connected: Waiting for players...';
                statusIndicator.style.backgroundColor = 'rgba(46, 204, 113, 0.8)';
                connectButton.textContent = 'Disconnect';
                
                // Send initial player data
                sendPlayerData({
                    type: 'join',
                    characterImage: characterImage,
                    position: {
                        x: character.offsetLeft,
                        y: character.offsetTop
                    }
                });
            };
            
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                switch(data.type) {
                    case 'player_id':
                        playerId = data.id;
                        statusIndicator.textContent = `Connected (ID: ${playerId.substring(0, 4)}...)`;
                        break;
                        
                    case 'player_list':
                        updatePlayerList(data.players);
                        break;
                        
                    case 'player_update':
                        updateOtherPlayer(data);
                        break;
                        
                    case 'player_leave':
                        removePlayer(data.id);
                        break;
                        
                    case 'obstacle_sync':
                        syncObstacle(data);
                        break;
                }
            };
            
            socket.onclose = () => {
                isOnline = false;
                statusIndicator.textContent = 'Disconnected - Offline Mode';
                statusIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                connectButton.textContent = 'Play Online';
                cleanupOnlinePlayers();
            };
            
            socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
                isOnline = false;
                statusIndicator.textContent = 'Connection Error - Offline Mode';
                statusIndicator.style.backgroundColor = 'rgba(231, 76, 60, 0.8)';
                connectButton.textContent = 'Retry Connection';
            };
            
        } catch (error) {
            console.error('Failed to connect:', error);
            isOnline = false;
            statusIndicator.textContent = 'Connection Failed - Offline Mode';
            statusIndicator.style.backgroundColor = 'rgba(231, 76, 60, 0.8)';
        }
    }
    
    // Toggle connection
    connectButton.addEventListener('click', () => {
        if (isOnline) {
            // Disconnect
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        } else {
            // Connect
            connectToServer();
        }
    });
    
    // Send player data to server
    function sendPlayerData(data) {
        if (isOnline && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
        }
    }
    
    // Update other players
    function updateOtherPlayer(data) {
        if (data.id === playerId) return; // Skip self
        
        // Create or update other player element
        let otherPlayer = otherPlayers[data.id];
        
        if (!otherPlayer) {
            // Create new player element
            otherPlayer = document.createElement('div');
            otherPlayer.className = 'other-player';
            otherPlayer.id = `player-${data.id}`;
            otherPlayer.style.position = 'absolute';
            otherPlayer.style.width = '150px';
            otherPlayer.style.height = '150px';
            otherPlayer.style.backgroundSize = 'contain';
            otherPlayer.style.backgroundRepeat = 'no-repeat';
            otherPlayer.style.backgroundPosition = 'center';
            otherPlayer.style.zIndex = '9';
            otherPlayer.style.opacity = '0.7'; // Slightly transparent to differentiate
            
            // Add player name
            const nameTag = document.createElement('div');
            nameTag.className = 'player-name';
            nameTag.textContent = `Player ${data.id.substring(0, 4)}`;
            nameTag.style.position = 'absolute';
            nameTag.style.bottom = '-20px';
            nameTag.style.left = '50%';
            nameTag.style.transform = 'translateX(-50%)';
            nameTag.style.whiteSpace = 'nowrap';
            nameTag.style.color = '#333';
            nameTag.style.fontSize = '12px';
            nameTag.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            nameTag.style.padding = '2px 5px';
            nameTag.style.borderRadius = '10px';
            otherPlayer.appendChild(nameTag);
            
            gameContainer.appendChild(otherPlayer);
            otherPlayers[data.id] = otherPlayer;
        }
        
        // Update player position
        otherPlayer.style.backgroundImage = `url('${data.characterImage || characterImage}')`;
        
        // Animate player movement smoothly
        otherPlayer.style.transition = 'all 0.2s ease-out';
        otherPlayer.style.left = `${data.position.x}px`;
        otherPlayer.style.bottom = `${data.position.y}px`;
        
        // Apply jump animation if player is jumping
        if (data.isJumping) {
            otherPlayer.classList.add('jump');
        } else {
            otherPlayer.classList.remove('jump');
        }
    }
    
    // Remove a player when they disconnect
    function removePlayer(id) {
        if (otherPlayers[id]) {
            gameContainer.removeChild(otherPlayers[id]);
            delete otherPlayers[id];
        }
    }
    
    // Update the list of all connected players
    function updatePlayerList(players) {
        // Remove players that are no longer connected
        Object.keys(otherPlayers).forEach(id => {
            if (!players.find(p => p.id === id) && id !== playerId) {
                removePlayer(id);
            }
        });
        
        // Add or update connected players
        players.forEach(player => {
            if (player.id !== playerId) {
                updateOtherPlayer(player);
            }
        });
    }
    
    // Clean up all online players when disconnecting
    function cleanupOnlinePlayers() {
        Object.keys(otherPlayers).forEach(id => {
            removePlayer(id);
        });
        otherPlayers = {};
    }
    
    // Sync obstacle with server data
    function syncObstacle(data) {
        if (isOnline && !isGameOver) {
            // Only sync if we didn't generate this obstacle ourselves
            if (data.sourceId !== playerId) {
                obstacle.style.animation = 'none';
                obstacle.style.right = data.position;
                obstacle.style.backgroundImage = `url('${data.obstacleImage}')`;
                obstacle.style.width = `${data.width}px`;
                obstacle.style.height = `${data.height}px`;
                
                // Restart animation with the synced duration
                setTimeout(() => {
                    obstacle.style.animation = `obstacle-move ${data.duration}s linear`;
                }, 10);
            }
        }
    }
    
    // Start the game initially
    startGame();
}); 