/**
 * Dynamic Header Highlighting Script
 * This script automatically highlights the current page in the navigation header
 */

function highlightCurrentPage() {
    // Get current page from URL path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || currentPath.split('/').slice(-2, -1)[0];

    // Remove any existing active classes
    document.querySelectorAll('.header-right li, .navbar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Map page names to their corresponding links
    const pageMap = {
        'about-us': 'about-us',
        'leadership': 'leadership',
        'partnership': 'partnership',
        'pricing': 'pricing',
        'legal': 'legal',
        'trust': 'trust',
        'contact-us': 'contact-us',
        'cancellation': 'cancellation'
    };

    // Find and highlight the current page
    const targetPage = pageMap[currentPage];
    if (targetPage) {
        // Highlight desktop navigation
        const desktopLinks = document.querySelectorAll('.header-right a');
        desktopLinks.forEach(link => {
            if (link.getAttribute('href') === targetPage) {
                link.parentElement.classList.add('active');
            }
        });

        // Highlight mobile navigation
        const mobileLinks = document.querySelectorAll('.navbar-nav .nav-link');
        mobileLinks.forEach(link => {
            if (link.getAttribute('href') === targetPage ||
                (targetPage === 'about-us' && link.textContent.trim() === 'About Us')) {
                link.parentElement.classList.add('active');
            }
        });
    }
}

// Auto-run when DOM is loaded
document.addEventListener('DOMContentLoaded', highlightCurrentPage);

// Also run when the page is fully loaded (for dynamically loaded content)
window.addEventListener('load', highlightCurrentPage);
