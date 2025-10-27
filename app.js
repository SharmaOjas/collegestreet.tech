document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Smooth Scrolling for Navigation Links (only for internal anchors)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // For other hrefs (like team.html), allow default navigation
        });
    });

    // Header background opacity on scroll
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function updateHeaderOnScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.style.background = 'rgba(255, 255, 253, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--color-surface)';
            header.style.backdropFilter = 'none';
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', updateHeaderOnScroll);

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll('.hero__text, .hero__media, .about__text, .stats-grid, .service-item, .collaboration__content, .footer__content');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Floating Popups Management
    const popups = document.querySelectorAll('.floating-popup');
    let popupTimeouts = {};

    // Show floating popups automatically
    setTimeout(() => {
        showPopup('heroPopup', 1000);
        showPopup('servicePopup1', 2500);
        showPopup('servicePopup2', 4000);
    }, 2000);

    function showPopup(popupId, delay = 0) {
        setTimeout(() => {
            const popup = document.getElementById(popupId);
            if (popup) {
                popup.classList.add('show');
                
                // Auto-hide after 10 seconds if on desktop
                if (window.innerWidth > 768) {
                    popupTimeouts[popupId] = setTimeout(() => {
                        hidePopup(popupId);
                    }, 10000);
                }
            }
        }, delay);
    }

    function hidePopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.remove('show');
            if (popupTimeouts[popupId]) {
                clearTimeout(popupTimeouts[popupId]);
                delete popupTimeouts[popupId];
            }
        }
    }

    // Close popups when clicking the close button
    document.querySelectorAll('.popup-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const popup = this.closest('.floating-popup');
            if (popup) {
                hidePopup(popup.id);
            }
        });
    });

    // Show/hide popups based on scroll position (desktop only)
    let ticking = false;
    
    function updatePopupsOnScroll() {
        if (window.innerWidth <= 768) return; // Skip on mobile
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Hero popup logic
        const heroSection = document.getElementById('home');
        if (heroSection) {
            const heroRect = heroSection.getBoundingClientRect();
            
            if (heroRect.top < windowHeight && heroRect.bottom > 0) {
                if (!document.getElementById('heroPopup').classList.contains('show')) {
                    showPopup('heroPopup', 500);
                }
            } else {
                hidePopup('heroPopup');
            }
        }

        // Service popups logic
        const serviceSection = document.getElementById('services');
        if (serviceSection) {
            const serviceRect = serviceSection.getBoundingClientRect();
            
            if (serviceRect.top < windowHeight && serviceRect.bottom > 0) {
                if (!document.getElementById('servicePopup1').classList.contains('show')) {
                    showPopup('servicePopup1', 1000);
                }
                if (!document.getElementById('servicePopup2').classList.contains('show')) {
                    showPopup('servicePopup2', 2000);
                }
            } else {
                hidePopup('servicePopup1');
                hidePopup('servicePopup2');
            }
        }

        ticking = false;
    }

    function requestScrollTick() {
        if (!ticking) {
            requestAnimationFrame(updatePopupsOnScroll);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollTick);

    // Video Placeholder Interactions
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    videoPlaceholders.forEach(video => {
        video.addEventListener('click', function() {
            this.classList.add('loading');
            
            // Simulate video loading
            setTimeout(() => {
                this.classList.remove('loading');
                showVideoModal(this);
            }, 1500);
        });

        // Hover effect for play button
        video.addEventListener('mouseenter', function() {
            const playButton = this.querySelector('.play-button');
            if (playButton) {
                playButton.style.transform = 'scale(1.1)';
            }
        });

        video.addEventListener('mouseleave', function() {
            const playButton = this.querySelector('.play-button');
            if (playButton) {
                playButton.style.transform = 'scale(1)';
            }
        });
    });

    function showVideoModal(videoElement) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal__overlay">
                <div class="video-modal__content">
                    <button class="video-modal__close" aria-label="Close video modal">&times;</button>
                    <div class="video-modal__player">
                        <div class="mock-video-player">
                            <h3>Demo Video Player</h3>
                            <p>This would contain the actual video content for:</p>
                            <p><strong>${videoElement.querySelector('.placeholder-text').textContent}</strong></p>
                            <div class="mock-controls">
                                <button class="mock-play-btn">▶ Play</button>
                                <button class="mock-pause-btn">⏸ Pause</button>
                                <div class="mock-progress">
                                    <div class="mock-progress-bar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Show modal with animation
        setTimeout(() => modal.classList.add('show'), 10);

        // Close modal functionality
        const closeBtn = modal.querySelector('.video-modal__close');
        const overlay = modal.querySelector('.video-modal__overlay');

        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
                document.removeEventListener('keydown', handleEscape);
            }, 300);
        }

        // Close button event listener
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
            });
        }

        // Click overlay to close
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeModal();
                }
            });
        }

        // Escape key to close
        function handleEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }
        document.addEventListener('keydown', handleEscape);

        // Focus trap for accessibility
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (firstFocusable) {
            firstFocusable.focus();
        }

        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Popup Indicators Animation
    function animatePopupIndicators() {
        const popupGroups = document.querySelectorAll('.popup-indicators');
        
        popupGroups.forEach(group => {
            const indicators = group.querySelectorAll('.indicator');
            let currentIndex = 0;
            
            const interval = setInterval(() => {
                // Check if popup still exists and is visible
                const popup = group.closest('.floating-popup');
                if (!popup || !popup.classList.contains('show')) {
                    clearInterval(interval);
                    return;
                }
                
                indicators.forEach(indicator => indicator.classList.remove('active'));
                if (indicators[currentIndex]) {
                    indicators[currentIndex].classList.add('active');
                }
                currentIndex = (currentIndex + 1) % indicators.length;
            }, 2500);
        });
    }

    // Start indicator animations after popups are shown
    setTimeout(animatePopupIndicators, 4000);

    // Responsive Popup Management
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        popups.forEach(popup => {
            if (isMobile) {
                // On mobile, show popups as static elements
                popup.classList.remove('show');
                popup.style.position = 'relative';
                popup.style.opacity = '1';
                popup.style.transform = 'none';
                popup.style.pointerEvents = 'all';
            } else {
                // On desktop, restore popup behavior
                popup.style.position = 'absolute';
                popup.style.pointerEvents = 'none';
                if (!popup.classList.contains('show')) {
                    popup.style.opacity = '0';
                    popup.style.transform = 'translateY(20px)';
                } else {
                    popup.style.pointerEvents = 'all';
                }
            }
        });
        
        // Re-trigger popup display logic for desktop
        if (!isMobile) {
            setTimeout(() => {
                showPopup('heroPopup', 500);
                showPopup('servicePopup1', 1500);
                showPopup('servicePopup2', 2500);
            }, 1000);
        }
    }

    window.addEventListener('resize', handleResize);

    // Button Click Effects with Ripple
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });

    // Parallax Effect for Hero Section (subtle)
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero__content');
    
    function updateParallax() {
        if (!hero || !heroContent) return;
        
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.3;
        
        if (scrolled < hero.offsetHeight) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }

    // Initialize on page load
    handleResize();
    
    // Show initial popups after a brief delay
    setTimeout(() => {
        if (window.innerWidth > 768) {
            showPopup('heroPopup', 0);
        }
    }, 3000);

    // Performance optimized scroll handler
    let scrollTimeout;
    let rafId;
    
    function optimizedScrollHandler() {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        
        rafId = requestAnimationFrame(() => {
            updateHeaderOnScroll();
            updateParallax();
            requestScrollTick();
        });
    }

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

    // Accessibility improvements
    document.addEventListener('keydown', function(e) {
        // Close popups with Escape key
        if (e.key === 'Escape') {
            popups.forEach(popup => {
                if (popup.classList.contains('show')) {
                    hidePopup(popup.id);
                }
            });
        }
    });

    // Track user interactions for analytics
    function trackUserInteraction(action, element) {
        console.log('User interaction tracked:', action, element);
        // This would integrate with analytics services in production
    }

    // Add interaction tracking
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn')) {
            trackUserInteraction('button_click', e.target.textContent.trim());
        }
        if (e.target.matches('.nav__link')) {
            trackUserInteraction('nav_click', e.target.textContent.trim());
        }
        if (e.target.closest('.video-placeholder')) {
            trackUserInteraction('video_click', 'video_placeholder');
        }
        if (e.target.matches('.popup-close')) {
            trackUserInteraction('popup_close', 'floating_popup');
        }
    });

    // Error handling for missing elements
    function safeQuerySelector(selector, callback) {
        const element = document.querySelector(selector);
        if (element && callback) {
            callback(element);
        }
        return element;
    }

    // Initialize tooltips for better UX (if needed)
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                document.body.removeChild(tooltip);
            }
        });
    });

    // Announcement (top-right) behavior with debug/force-show support
    (function initSiteAnnouncement() {
        // Set to true to always show the announcement on every page load (ignore prior dismissals)
        const ALWAYS_SHOW_ANNOUNCEMENT = true; // <-- user requested: show popup after every reload

        const ANNOUNCE_KEY = 'site_announcement_dismissed_v1';
        const announceEl = document.getElementById('site-announcement');
        if (!announceEl) {
            console.log('initSiteAnnouncement: #site-announcement not found');
            return;
        }

        // If URL contains ?show_announce=1 we force showing (useful for testing)
        const params = new URLSearchParams(window.location.search || '');
        const forceShow = params.get('show_announce') === '1';

        try {
            if (!forceShow && !ALWAYS_SHOW_ANNOUNCEMENT && localStorage.getItem(ANNOUNCE_KEY)) {
                console.log('initSiteAnnouncement: previously dismissed — not showing');
                announceEl.style.display = 'none';
                return;
            }
        } catch (err) {
            // localStorage may be unavailable in some environments (private mode)
            console.log('initSiteAnnouncement: localStorage read failed', err);
        }

        // Show announcement after a short delay
        console.log('initSiteAnnouncement: scheduling show (forceShow=' + forceShow + ')');
        setTimeout(() => {
            announceEl.classList.add('show');
        }, 800);

        // Close/dismiss handler
        const closeBtn = announceEl.querySelector('.site-announcement__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                announceEl.classList.remove('show');
                try {
                    localStorage.setItem(ANNOUNCE_KEY, '1');
                } catch (err) {
                    console.log('initSiteAnnouncement: localStorage write failed', err);
                }
                setTimeout(() => {
                    announceEl.style.display = 'none';
                }, 300);
            });
        }

        // Keyboard: Escape to dismiss announcement
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && announceEl.classList.contains('show')) {
                announceEl.classList.remove('show');
                try {
                    localStorage.setItem(ANNOUNCE_KEY, '1');
                } catch (err) {
                    console.log('initSiteAnnouncement: localStorage write failed', err);
                }
                setTimeout(() => {
                    announceEl.style.display = 'none';
                }, 300);
            }
        });

        // Track CTA clicks
        const cta = announceEl.querySelector('.site-announcement__link');
        if (cta) {
            cta.addEventListener('click', function () {
                try {
                    trackUserInteraction('announcement_cta', 'hackathon_2nov');
                } catch (err) {
                    // no-op
                }
            });
        }
    })();

    console.log('CollegeStreet.tech application initialized successfully');
});
