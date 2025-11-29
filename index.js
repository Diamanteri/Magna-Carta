// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Quill writing animation
    const quillLines = document.querySelectorAll('.quill-line');
    quillLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.8}s`;
    });
    
    // Initialize draggable coins
    initializeDraggableCoins();
    
    // Add touch event listeners for mobile
    initializeTouchEvents();
});

// Pillar interactions
function togglePillar(pillar) {
    // Close all other pillars
    document.querySelectorAll('.pillar').forEach(p => {
        if (p !== pillar) p.classList.remove('active');
    });
    
    // Toggle current pillar
    pillar.classList.toggle('active');
}

function unlockPillar(event) {
    event.stopPropagation();
    const lock = event.target;
    lock.classList.add('unlocked');
    
    // Show the person being brought before a judge (simplified)
    setTimeout(() => {
        lock.style.backgroundImage = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'50\' cy=\'50\' r=\'40\' fill=\'%23c9a96e\'/><path d=\'M30,70 L70,70 M50,30 L50,70 M40,40 L60,40\' stroke=\'%233a2615\' stroke-width=\'5\'/></svg>")';
        lock.style.backgroundSize = 'contain';
        lock.style.backgroundRepeat = 'no-repeat';
        lock.style.backgroundPosition = 'center';
    }, 300);
}

// Drag and drop for coins
let draggedCoin = null;
let touchOffset = { x: 0, y: 0 };

function initializeDraggableCoins() {
    const coins = document.querySelectorAll('.coin');
    const scalesContainer = document.querySelector('.scales-container');
    
    coins.forEach(coin => {
        // Mouse events
        coin.addEventListener('mousedown', dragStart);
        
        // Touch events
        coin.addEventListener('touchstart', handleTouchStart, { passive: false });
        coin.addEventListener('touchmove', handleTouchMove, { passive: false });
        coin.addEventListener('touchend', handleTouchEnd);
    });
    
    // Allow dropping coins
    document.addEventListener('dragover', function(event) {
        event.preventDefault();
    });
    
    document.addEventListener('drop', function(event) {
        event.preventDefault();
        if (draggedCoin) {
            const scalesContainer = document.querySelector('.scales-container');
            const rect = scalesContainer.getBoundingClientRect();
            
            // Position the coin at drop location
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                draggedCoin.style.left = (x - 12) + 'px';
                draggedCoin.style.top = (y - 12) + 'px';
            }
            
            draggedCoin = null;
        }
    });
}

function dragStart(event) {
    draggedCoin = event.target;
    event.dataTransfer.setData('text/plain', '');
    
    // Add visual feedback
    draggedCoin.style.opacity = '0.7';
}

// Touch event handlers for coins
function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const coin = event.target;
    
    draggedCoin = coin;
    const rect = coin.getBoundingClientRect();
    
    touchOffset.x = touch.clientX - rect.left;
    touchOffset.y = touch.clientY - rect.top;
    
    coin.style.opacity = '0.7';
    coin.style.zIndex = '10';
}

function handleTouchMove(event) {
    if (!draggedCoin) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const scalesContainer = document.querySelector('.scales-container');
    const containerRect = scalesContainer.getBoundingClientRect();
    
    // Calculate new position
    let newX = touch.clientX - containerRect.left - touchOffset.x;
    let newY = touch.clientY - containerRect.top - touchOffset.y;
    
    // Constrain to container bounds
    newX = Math.max(0, Math.min(newX, containerRect.width - 24));
    newY = Math.max(0, Math.min(newY, containerRect.height - 24));
    
    draggedCoin.style.left = newX + 'px';
    draggedCoin.style.top = newY + 'px';
}

function handleTouchEnd(event) {
    if (draggedCoin) {
        draggedCoin.style.opacity = '1';
        draggedCoin.style.zIndex = '';
        draggedCoin = null;
    }
}

// Change text on hover/tap for Rule of Law
function changeText(element) {
    if (element.textContent === "The King is The Law") {
        element.textContent = "The Law is King";
        element.style.color = var(--burgundy);
    } else {
        element.textContent = "The King is The Law";
        element.style.color = '';
    }
}

// Show tooltip for tax buttons
function showTooltip(button) {
    const tooltip = button.parentElement.parentElement.querySelector('.tooltip');
    tooltip.style.display = 'block';
    setTimeout(() => {
        tooltip.style.display = 'none';
    }, 2000);
}

// Timeline item toggle
function toggleTimelineItem(item) {
    // Close all other timeline items
    document.querySelectorAll('.timeline-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
    });
    
    // Toggle current item
    item.classList.toggle('active');
}

// Add user seal
function addUserSeal(seal) {
    seal.innerHTML = '<div class="seal-text">Your Seal</div>';
    seal.style.background = 'radial-gradient(circle at 30% 30%, #f4e9d8, #722f37)';
    seal.style.cursor = 'default';
    
    // Remove event listener to prevent multiple seals
    seal.onclick = null;
    
    // Create a confirmation message
    const message = document.createElement('p');
    message.textContent = 'Thank you for pledging your support for justice and liberty!';
    message.style.marginTop = '15px';
    message.style.fontStyle = 'italic';
    message.style.color = 'var(--burgundy)';
    
    seal.parentElement.appendChild(message);
}

// Initialize touch-specific events
function initializeTouchEvents() {
    // Add touch feedback for interactive elements
    const touchElements = document.querySelectorAll('.pillar, .timeline-item, .historical-seal');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transition = 'none';
            this.style.opacity = '0.8';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transition = '';
            this.style.opacity = '1';
        });
    });
}

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Close mobile menu on resize to larger screens
    if (window.innerWidth >= 1024) {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Performance optimization: Lazy load non-critical elements
if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('loaded');
                lazyObserver.unobserve(element);
            }
        });
    });
    
    // Observe elements that can be lazy loaded
    document.querySelectorAll('.tree-symbol, .historical-seal').forEach(element => {
        lazyObserver.observe(element);
    });
}