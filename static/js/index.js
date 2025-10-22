window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Check network connection quality
function getNetworkQuality() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            return 'slow';
        } else if (connection.effectiveType === '3g') {
            return 'medium';
        }
    }
    return 'fast';
}

// Lazy load videos when they come into view
function setupVideoLazyLoading() {
    const networkQuality = getNetworkQuality();
    const isSlowConnection = networkQuality === 'slow';
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const loadingElement = document.getElementById(video.id + '-loading');
                
                if (video.dataset.src && !video.src) {
                    // Show network-specific loading message
                    if (isSlowConnection && loadingElement) {
                        loadingElement.innerHTML = '<div class="loading-spinner"></div><p>Loading video (slow connection detected)...</p>';
                    }
                    
                    // Load video source
                    video.src = video.dataset.src;
                    video.load();
                    
                    // Hide loading indicator when video is ready
                    video.addEventListener('loadeddata', function() {
                        if (loadingElement) {
                            loadingElement.style.display = 'none';
                        }
                        video.style.display = 'block';
                    });
                    
                    // Handle loading errors
                    video.addEventListener('error', function() {
                        if (loadingElement) {
                            loadingElement.innerHTML = '<p style="color: #ef4444;">Failed to load video. Please check your connection.</p>';
                        }
                    });
                    
                    // Add timeout for slow connections
                    if (isSlowConnection) {
                        setTimeout(() => {
                            if (video.readyState < 2 && loadingElement) {
                                loadingElement.innerHTML = '<p style="color: #f59e0b;">Loading is taking longer than expected...</p>';
                            }
                        }, 5000);
                    }
                }
                
                // Stop observing once loaded
                videoObserver.unobserve(video);
            }
        });
    }, {
        threshold: 0.3, // Load when 30% visible (more conservative)
        rootMargin: '50px' // Start loading 50px before entering viewport
    });
    
    // Observe both videos
    const baselineVideo = document.getElementById('baseline-video');
    const cnavVideo = document.getElementById('cnav-video');
    
    if (baselineVideo) videoObserver.observe(baselineVideo);
    if (cnavVideo) videoObserver.observe(cnavVideo);
}

// Synchronized video comparison playback
function setupVideoComparison() {
    const baselineVideo = document.getElementById('baseline-video');
    const cnavVideo = document.getElementById('cnav-video');
    
    if (!baselineVideo || !cnavVideo) return;
    
    // Wait for videos to be loaded before setting up sync
    const setupSync = () => {
        // Sync play/pause
        baselineVideo.addEventListener('play', function() {
            if (cnavVideo.readyState >= 2) cnavVideo.play();
        });
        
        baselineVideo.addEventListener('pause', function() {
            cnavVideo.pause();
        });
        
        cnavVideo.addEventListener('play', function() {
            if (baselineVideo.readyState >= 2) baselineVideo.play();
        });
        
        cnavVideo.addEventListener('pause', function() {
            baselineVideo.pause();
        });
        
        // Sync seeking
        baselineVideo.addEventListener('seeked', function() {
            if (Math.abs(cnavVideo.currentTime - baselineVideo.currentTime) > 0.1) {
                cnavVideo.currentTime = baselineVideo.currentTime;
            }
        });
        
        cnavVideo.addEventListener('seeked', function() {
            if (Math.abs(baselineVideo.currentTime - cnavVideo.currentTime) > 0.1) {
                baselineVideo.currentTime = cnavVideo.currentTime;
            }
        });
        
        console.log('Video comparison sync enabled');
    };
    
    // Setup sync when both videos are ready
    let baselineReady = false;
    let cnavReady = false;
    
    baselineVideo.addEventListener('loadeddata', function() {
        baselineReady = true;
        if (cnavReady) setupSync();
    });
    
    cnavVideo.addEventListener('loadeddata', function() {
        cnavReady = true;
        if (baselineReady) setupSync();
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    console.log('Document ready, initializing carousel...');
    
    // Log network information for debugging
    if ('connection' in navigator) {
        const connection = navigator.connection;
        console.log('Network info:', {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt
        });
    }

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    console.log('Found carousel elements:', $('.carousel').length);
    var carousels = bulmaCarousel.attach('.carousel', options);
    console.log('Carousel initialized:', carousels);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
    
    // Setup lazy loading for comparison videos
    setupVideoLazyLoading();
    
    // Setup video comparison sync
    setupVideoComparison();

})
