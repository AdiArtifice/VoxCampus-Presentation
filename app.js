// VoxCampus Presentation JavaScript

class PresentationManager {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.slides = document.querySelectorAll('.slide');
        this.navItems = document.querySelectorAll('.nav-item');
        
        this.init();
    }

    init() {
        this.updateProgress();
        this.setupEventListeners();
        this.setupInteractiveElements();
        this.setupKeyboardNavigation();
        this.setupHoverTooltips();
        this.updateNavigationControls();
        this.updateNavigation();
        this.setupScrollDetection();
    }

    setupEventListeners() {
        // Navigation buttons
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
            });
        }

        // Navigation menu items - Fixed the event listener setup
        this.navItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const slideIndex = parseInt(item.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
            });
        });
    }

    setupInteractiveElements() {
        this.setupEmpathyMap();
        this.setupExpandableSections();
        this.setupHoverCards();
        this.setupPersonaInteractions();
    }

    setupEmpathyMap() {
        const empathySections = document.querySelectorAll('.empathy-section');
        
        empathySections.forEach(section => {
            section.addEventListener('click', () => {
                const details = section.querySelector('.empathy-details');
                if (details) {
                    details.classList.toggle('hidden');
                    
                    // Add visual indication when expanded
                    if (!details.classList.contains('hidden')) {
                        section.style.borderColor = 'var(--color-primary)';
                        section.style.backgroundColor = 'var(--color-bg-1)';
                    } else {
                        section.style.borderColor = 'var(--color-card-border)';
                        section.style.backgroundColor = 'var(--color-surface)';
                    }
                }
            });
        });
    }

    setupExpandableSections() {
        const expandableSections = document.querySelectorAll('.expandable-section');
        
        expandableSections.forEach(section => {
            const header = section.querySelector('h3');
            const content = section.querySelector('.section-content');
            
            if (header && content) {
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    content.classList.toggle('hidden');
                    section.classList.toggle('expanded');
                });
            }
        });
    }

    setupHoverCards() {
        const hoverCards = document.querySelectorAll('.hover-card');
        
        hoverCards.forEach(card => {
            const detail = card.dataset.detail;
            if (detail) {
                // Create and add tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = detail;
                card.style.position = 'relative';
                card.appendChild(tooltip);
                
                // Add hover event listeners
                card.addEventListener('mouseenter', () => {
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                });
                
                card.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                    tooltip.style.visibility = 'hidden';
                });
            }
        });
    }

    setupPersonaInteractions() {
        const attributeSections = document.querySelectorAll('.attribute-section');
        
        attributeSections.forEach(section => {
            const header = section.querySelector('.attribute-header');
            
            if (header) {
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleAttributeSection(section);
                });

                // Add hover effects
                section.addEventListener('mouseenter', () => {
                    if (!section.classList.contains('expanded')) {
                        section.style.transform = 'translateY(-2px)';
                    }
                });

                section.addEventListener('mouseleave', () => {
                    if (!section.classList.contains('expanded')) {
                        section.style.transform = 'translateY(0)';
                    }
                });
            }
        });
    }

    toggleAttributeSection(section) {
        const isExpanded = section.classList.contains('expanded');
        const content = section.querySelector('.attribute-content');
        const indicator = section.querySelector('.toggle-indicator');
        
        if (isExpanded) {
            // Collapse
            section.classList.remove('expanded');
            indicator.textContent = '+';
            content.style.maxHeight = '0';
        } else {
            // Expand
            section.classList.add('expanded');
            indicator.textContent = '−';
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }

    setupHoverTooltips() {
        // Add interactive hover effects for statistics
        const statCards = document.querySelectorAll('.stat-card[data-detail]');
        
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = 'var(--shadow-lg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'var(--shadow-sm)';
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
            }
        });
    }

    setupScrollDetection() {
        // Check if slides have scrollable content and add indicators
        this.slides.forEach((slide, index) => {
            const checkScrollable = () => {
                if (slide.scrollHeight > slide.clientHeight) {
                    slide.classList.add('has-scroll');
                } else {
                    slide.classList.remove('has-scroll');
                }
            };
            
            // Check on load and resize
            checkScrollable();
            window.addEventListener('resize', checkScrollable);
            
            // Hide scroll indicator when user scrolls to bottom
            slide.addEventListener('scroll', () => {
                const isScrolledToBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 10;
                if (isScrolledToBottom) {
                    slide.classList.remove('has-scroll');
                } else if (slide.scrollHeight > slide.clientHeight) {
                    slide.classList.add('has-scroll');
                }
            });
        });
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            // Remove active class from current slide
            this.slides[this.currentSlide].classList.remove('active');
            this.slides[this.currentSlide].classList.add('prev');
            
            // Update current slide
            this.currentSlide = slideIndex;
            
            // Add active class to new slide
            setTimeout(() => {
                this.slides.forEach(slide => slide.classList.remove('prev'));
                this.slides[this.currentSlide].classList.add('active');
                
                // Trigger slide-specific animations
                this.triggerSlideAnimations(slideIndex);
                
                // Reset scroll position and update scroll indicators
                this.slides[this.currentSlide].scrollTop = 0;
                this.updateScrollIndicators();
            }, 50);
            
            this.updateProgress();
            this.updateNavigationControls();
            this.updateNavigation();
        }
    }

    updateProgress() {
        const currentSlideElement = document.querySelector('.current-slide');
        const totalSlidesElement = document.querySelector('.total-slides');
        
        if (currentSlideElement && totalSlidesElement) {
            currentSlideElement.textContent = this.currentSlide + 1;
            totalSlidesElement.textContent = this.totalSlides;
        }
    }

    updateNavigationControls() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn && nextBtn) {
            prevBtn.disabled = this.currentSlide === 0;
            nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
            
            // Update button text for last slide
            if (this.currentSlide === this.totalSlides - 1) {
                nextBtn.textContent = 'Restart ↻';
                nextBtn.disabled = false;
                nextBtn.onclick = (e) => {
                    e.preventDefault();
                    this.goToSlide(0);
                };
            } else {
                nextBtn.textContent = 'Next ›';
                nextBtn.onclick = (e) => {
                    e.preventDefault();
                    this.nextSlide();
                };
            }
        }
    }

    updateNavigation() {
        // Update active state in navigation menu
        this.navItems.forEach((item, index) => {
            if (index === this.currentSlide) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    updateScrollIndicators() {
        // Update scroll indicators for the current slide
        const currentSlideElement = this.slides[this.currentSlide];
        if (currentSlideElement.scrollHeight > currentSlideElement.clientHeight) {
            currentSlideElement.classList.add('has-scroll');
        } else {
            currentSlideElement.classList.remove('has-scroll');
        }
    }

    triggerSlideAnimations(slideIndex) {
        const slide = this.slides[slideIndex];
        
        switch(slideIndex) {
            case 2: // Research Insights slide
                this.animateInsights();
                break;
            case 3: // Empathy Map slide
                this.animateEmpathyMap();
                break;
            case 4: // Persona slide
                this.animatePersona();
                break;
            case 5: // Solution slide
                this.animateSolution();
                break;
        }
    }

    animateInsights() {
        const insightCards = document.querySelectorAll('.insight-card');
        insightCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateEmpathyMap() {
        const empathySections = document.querySelectorAll('.empathy-section');
        empathySections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.4s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'scale(1)';
            }, index * 150);
        });
    }

    animatePersona() {
        const personaCard = document.querySelector('.persona-card');
        if (personaCard) {
            personaCard.style.opacity = '0';
            personaCard.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                personaCard.style.transition = 'all 0.6s ease-out';
                personaCard.style.opacity = '1';
                personaCard.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    animateSolution() {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Additional interactive features
class InteractiveFeatures {
    constructor() {
        this.setupDataVisualizationInteraction();
        this.setupAccessibilityFeatures();
    }

    setupDataVisualizationInteraction() {
        // Add hover effects to chart images
        const chartImages = document.querySelectorAll('.chart-image');
        
        chartImages.forEach(chart => {
            chart.addEventListener('mouseenter', () => {
                chart.style.transform = 'scale(1.05)';
                chart.style.transition = 'transform 0.3s ease';
            });
            
            chart.addEventListener('mouseleave', () => {
                chart.style.transform = 'scale(1)';
            });
        });
    }

    setupAccessibilityFeatures() {
        // Add focus indicators for keyboard navigation
        const focusableElements = document.querySelectorAll('button, .nav-item, .empathy-section, .expandable-section h3');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = 'var(--focus-outline)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });

        // Add screen reader announcements for slide changes
        const slideContainer = document.querySelector('.slides-container');
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        slideContainer.appendChild(announcement);
        
        // Update announcement when slide changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const slide = mutation.target;
                    if (slide.classList.contains('active')) {
                        const slideTitle = slide.querySelector('h1');
                        if (slideTitle) {
                            announcement.textContent = `Now viewing: ${slideTitle.textContent}`;
                        }
                    }
                }
            });
        });
        
        document.querySelectorAll('.slide').forEach(slide => {
            observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
        });
    }
}

// Global functions for HTML onclick handlers
function nextSlide() {
    if (window.presentationManager) {
        window.presentationManager.nextSlide();
    }
}

function prevSlide() {
    if (window.presentationManager) {
        window.presentationManager.prevSlide();
    }
}

function goToSlide(slideIndex) {
    if (window.presentationManager) {
        window.presentationManager.goToSlide(slideIndex);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        window.presentationManager = new PresentationManager();
        window.interactiveFeatures = new InteractiveFeatures();
        
        // Add smooth loading animation
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
        
        // Add welcome message
        console.log('🎯 VoxCampus Presentation Loaded');
        console.log('📊 Use arrow keys or click navigation to explore');
        console.log('🔍 Hover over statistics and click empathy map sections for details');
    }, 100);
});

// Add window resize handler for responsive adjustments
window.addEventListener('resize', () => {
    // Recalculate slide positions if needed
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
        activeSlide.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Add print styles handler
window.addEventListener('beforeprint', () => {
    // Show all slides for printing
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.position = 'relative';
        slide.style.opacity = '1';
        slide.style.transform = 'none';
        slide.style.pageBreakAfter = 'always';
    });
});

window.addEventListener('afterprint', () => {
    // Restore normal slide behavior
    window.location.reload();
});

// Persona View Toggle Function
function togglePersonaView() {
    const imageView = document.getElementById('personaImageView');
    const detailedView = document.getElementById('personaDetailedView');
    
    if (imageView.style.display === 'none') {
        // Show image view, hide detailed view
        imageView.style.display = 'block';
        detailedView.style.display = 'none';
    } else {
        // Show detailed view, hide image view
        imageView.style.display = 'none';
        detailedView.style.display = 'block';
    }
}