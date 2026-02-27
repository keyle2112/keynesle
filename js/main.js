// ========================================
// Keynes Portfolio - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navToggle && navLinks && !e.target.closest('.navbar')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  // Active navigation link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-links a');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    }
  });

  // Smooth scroll for anchor links (if any)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Add scroll effect to navbar
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 100) {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // Image lazy loading fallback for older browsers
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src;
    });
  }

  // Handle broken images gracefully
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.backgroundColor = '#f3f4f6';
      this.alt = 'Image not available';
    });
  });
});

// Optional: Add animation on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.project-card, .course-category, .creative-item, .culture-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// Initialize animations after DOM is ready
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Project Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        // Filter projects
        projectCards.forEach(card => {
          if (filter === 'all') {
            card.classList.remove('hidden');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            if (card.getAttribute('data-category') === filter) {
              card.classList.remove('hidden');
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            } else {
              card.classList.add('hidden');
            }
          }
        });

        // Re-equalize after filter changes layout
        runEqualization();
      });
    });
  }
});

// ========================================
// Card Row Height Equalization
// ========================================
function equalizeCardRows(cardSelector, elementSelectors) {
  const cards = Array.from(document.querySelectorAll(cardSelector));
  if (cards.length < 2) return;

  // Reset min-heights so we get natural heights before measuring
  cards.forEach(card => {
    elementSelectors.forEach(sel => {
      const el = card.querySelector(sel);
      if (el) el.style.minHeight = '';
    });
  });

  // Group cards by row using their top position in the document
  const rows = new Map();
  cards.forEach(card => {
    const top = Math.round(card.getBoundingClientRect().top + window.scrollY);
    if (!rows.has(top)) rows.set(top, []);
    rows.get(top).push(card);
  });

  // Equalize each element type within each row
  rows.forEach(rowCards => {
    if (rowCards.length < 2) return;
    elementSelectors.forEach(sel => {
      const els = rowCards.map(c => c.querySelector(sel)).filter(Boolean);
      if (els.length < 2) return;
      const maxH = Math.max(...els.map(el => el.offsetHeight));
      els.forEach(el => { el.style.minHeight = maxH + 'px'; });
    });
  });
}

function runEqualization() {
  equalizeCardRows(
    '.projects-grid .project-card:not(.hidden)',
    ['.project-content h3', '.project-content > p']
  );
  equalizeCardRows(
    '.culture-grid .culture-card',
    ['.culture-role', '.culture-card h3', '.culture-card-content > p:not(.culture-role)']
  );
}

// Run after all images/fonts are loaded for accurate heights
window.addEventListener('load', runEqualization);

// Re-run on resize with debounce
let eqResizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(eqResizeTimer);
  eqResizeTimer = setTimeout(runEqualization, 150);
});
