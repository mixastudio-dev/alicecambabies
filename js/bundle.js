const header = document.querySelector('header');

if (header) {
  const toggleScrolledClass = () => {
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', toggleScrolledClass);
  toggleScrolledClass();
}

document.addEventListener('DOMContentLoaded', function() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const currentPath = window.location.pathname;
      const linkPath = this.pathname;

      if (linkPath !== '' && linkPath !== currentPath) {
        const url = linkPath + targetId;
        window.location.href = url;
      } else {
        const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
        const windowHeight = window.innerHeight;
        const elementHeight = targetElement.offsetHeight;

        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (windowHeight / 2) + (elementHeight / 2);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        history.pushState(null, null, targetId);
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var modalButtons = document.querySelectorAll('.open-modal-dialog'),
      overlay = document.querySelector('body'),
      closeButtons = document.querySelectorAll('.modal-dialog .modal-close');

  var currentOpenModal = null;

  async function openModal(modalBtn) {
    return new Promise(resolve => {
      var modalId = modalBtn.getAttribute('data-src'),
          modalElem = document.querySelector('.modal-dialog.' + modalId);

      if (currentOpenModal && currentOpenModal !== modalElem) {
        closeModalDirectly(currentOpenModal);
      }

      overlay.classList.add('modal-open');
      modalElem.style.display = 'flex';

      setTimeout(function() {
        modalElem.classList.add('modal-opening');
        currentOpenModal = modalElem;
        resolve();
      }, 0);
    });
  }

  async function closeModal(closeBtn) {
    return new Promise(resolve => {
      var modal = closeBtn.closest('.modal-dialog');
      modal.classList.remove('modal-opening');
      modal.classList.add('modal-closing');

      setTimeout(function() {
        modal.classList.remove('modal-closing');
        modal.style.display = 'none';
        overlay.classList.remove('modal-open');
        if (currentOpenModal === modal) {
          currentOpenModal = null;
        }
        resolve();
      }, 500);
    });
  }

  function closeModalDirectly(modalElem) {
    modalElem.classList.remove('modal-opening');
    modalElem.style.display = 'none';

    if (currentOpenModal === modalElem) {
      currentOpenModal = null;
    }

    var anyModalOpen = document.querySelector('.modal-dialog[style*="display: flex"]');
    if (!anyModalOpen) {
      overlay.classList.remove('modal-open');
    }
  }

  modalButtons.forEach(function(modalBtn) {
    modalBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await openModal(modalBtn);
    });
  });

  closeButtons.forEach(function(closeBtn) {
    closeBtn.addEventListener('click', async function(e) {
      await closeModal(closeBtn);
    });
  });

  document.querySelectorAll('.modal-dialog').forEach(function(modal) {
    modal.addEventListener('click', async function(e) {
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody && !modalBody.contains(e.target)) {
        await closeModal(modal);
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const headerNav = document.querySelector('.header-nav');

  function isMobileView() {
    return window.innerWidth <= 1024;
  }

  function toggleMenu() {
    if (isMobileView()) {
      const isOpen = headerNav.classList.contains('show');

      if (isOpen) {
        headerNav.classList.remove('show');
        mobileMenuButton.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        headerNav.classList.add('show');
        mobileMenuButton.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }
  }

  mobileMenuButton.addEventListener('click', toggleMenu);

  const menuLinks = document.querySelectorAll('.main-menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (isMobileView()) {
        headerNav.classList.remove('show');
        mobileMenuButton.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) {
      headerNav.classList.remove('show');
      mobileMenuButton.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

function animateNumber(element, start, end, duration = 1500) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);

    const easeProgress = 1 - Math.pow(1 - progress, 3);
    let currentValue = Math.floor(start + (end - start) * easeProgress);

    currentValue = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      let endValue = end.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      element.textContent = endValue;
    }
  }

  requestAnimationFrame(update);
}

function animateProgressBar(bar, targetPercent, duration = 1500) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);

    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentPercent = 0 + (targetPercent - 0) * easeProgress;

    bar.style.width = currentPercent + '%';

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      bar.style.width = targetPercent + '%';
    }
  }

  requestAnimationFrame(update);
}

let animated = false;

function animateAllCards() {
  const cards = document.querySelectorAll('.stat-card');

  let maxTarget = 0;
  cards.forEach(card => {
    const targetValue = parseInt(card.getAttribute('data-target'), 10);
    if (!isNaN(targetValue) && targetValue > maxTarget) {
      maxTarget = targetValue;
    }
  });

  cards.forEach(card => {
    const targetValue = parseInt(card.getAttribute('data-target'), 10);
    if (isNaN(targetValue)) return;

    const valueElement = card.querySelector('.card-value');
    if (valueElement) {
      const existingSpan = valueElement.querySelector('.animated-number');
      if (existingSpan) return;

      const numberSpan = document.createElement('span');
      numberSpan.className = 'animated-number';
      numberSpan.textContent = '200';
      numberSpan.style.whiteSpace = 'nowrap';

      const oldText = valueElement.childNodes[1];
      if (oldText && oldText.nodeType === 3) {
        valueElement.removeChild(oldText);
      }
      valueElement.appendChild(numberSpan);

      animateNumber(numberSpan, 200, targetValue, 1500);
    }

    const progressFill = card.querySelector('.progressbar-fill');
    if (progressFill && maxTarget > 200) {
      const targetPercent = (targetValue - 200) / (maxTarget - 200) * 100;
      const clampedPercent = Math.min(100, Math.max(0, targetPercent));
      animateProgressBar(progressFill, clampedPercent, 1500);
    }
  });
}

function checkAndAnimate() {
  if (animated) return;

  const cardsContainer = document.querySelector('.stat-block-cards');
  if (!cardsContainer) return;

  const rect = cardsContainer.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight - 200 && rect.bottom > 0;

  if (isVisible) {
    animated = true;
    animateAllCards();
    window.removeEventListener('scroll', checkAndAnimate);
    window.removeEventListener('resize', checkAndAnimate);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    checkAndAnimate();
    window.addEventListener('scroll', checkAndAnimate);
    window.addEventListener('resize', checkAndAnimate);
  });
} else {
  checkAndAnimate();
  window.addEventListener('scroll', checkAndAnimate);
  window.addEventListener('resize', checkAndAnimate);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const block = entry.target;
      const delay = parseInt(block.getAttribute('data-delay') || 0);
      const animationType = block.getAttribute('data-animation') || 'fade-up';

      setTimeout(() => {
        block.classList.add('animated', animationType);
        block.setAttribute('data-animated', 'true');
      }, delay);

      observer.unobserve(block);
    }
  });
}, { threshold: 0.1, rootMargin: '50px' });

document.querySelectorAll('.animate-block:not([data-animated])').forEach(block => {
  observer.observe(block);
});

document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  if (accordionItems.length) {
    const firstItem = accordionItems[0];
    const firstContent = firstItem.querySelector('.accordion-item-content');
    firstItem.classList.add('active');
    firstContent.style.height = firstContent.scrollHeight + 'px';

    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-item-header');
      const content = item.querySelector('.accordion-item-content');

      trigger.addEventListener('click', function() {
        const parent = this.parentNode;

        if (parent.classList.contains('active')) {
          parent.classList.remove('active');
          content.style.height = '0';
        } else {
          accordionItems.forEach(child => {
            child.classList.remove('active');
            child.querySelector('.accordion-item-content').style.height = '0';
          });
          parent.classList.add('active');
          content.style.height = content.scrollHeight + 'px';
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const tabsBlocks = document.querySelectorAll('.form-tabs');

  tabsBlocks.forEach(block => {
    const tabButtons = block.querySelectorAll('.form-tab-button');
    const tabPanels = block.querySelectorAll('.form-tab-panel');
    const panelsContainer = block.querySelector('.form-tab-panels');

    if (panelsContainer) {
      panelsContainer.style.position = 'relative';
      panelsContainer.style.transition = 'height 0.3s ease';
    }

    tabPanels.forEach(panel => {
      panel.style.position = 'absolute';
      panel.style.top = '0';
      panel.style.left = '0';
      panel.style.width = '100%';
      panel.style.opacity = '0';
      panel.style.visibility = 'hidden';
      panel.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
      panel.style.pointerEvents = 'none';
    });

    function updateContainerHeight(panel) {
      if (!panelsContainer) return;

      const originalDisplay = panel.style.display;
      const originalVisibility = panel.style.visibility;
      const originalOpacity = panel.style.opacity;
      const originalPosition = panel.style.position;

      panel.style.position = 'relative';
      panel.style.visibility = 'visible';
      panel.style.opacity = '1';
      panel.style.display = 'block';

      const height = panel.offsetHeight;

      panel.style.position = originalPosition;
      panel.style.visibility = originalVisibility;
      panel.style.opacity = originalOpacity;
      panel.style.display = originalDisplay;

      panelsContainer.style.height = height + 'px';
    }

    function switchTab(index) {
      tabButtons.forEach(btn => btn.classList.remove('active'));

      const activeBtn = tabButtons[index];
      if (activeBtn) activeBtn.classList.add('active');

      tabPanels.forEach(panel => {
        panel.style.visibility = 'hidden';
        panel.style.opacity = '0';
        panel.style.pointerEvents = 'none';
      });

      const activePanel = tabPanels[index];
      if (activePanel) {
        updateContainerHeight(activePanel);

        activePanel.style.visibility = 'visible';
        activePanel.style.opacity = '1';
        activePanel.style.pointerEvents = 'auto';
      }
    }

    tabButtons.forEach((button, index) => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        switchTab(index);
      });
    });

    if (tabPanels.length > 0) {
      setTimeout(() => {
        switchTab(0);
      }, 100);
    }
  });

  window.addEventListener('resize', function() {
    tabsBlocks.forEach(block => {
      const tabPanels = block.querySelectorAll('.form-tab-panel');
      const panelsContainer = block.querySelector('.form-tab-panels');

      const activePanel = Array.from(tabPanels).find(panel =>
          panel.style.visibility === 'visible'
      );

      if (activePanel && panelsContainer) {
        const originalDisplay = activePanel.style.display;
        const originalVisibility = activePanel.style.visibility;
        const originalOpacity = activePanel.style.opacity;
        const originalPosition = activePanel.style.position;

        activePanel.style.position = 'relative';
        activePanel.style.visibility = 'visible';
        activePanel.style.opacity = '1';
        activePanel.style.display = 'block';

        panelsContainer.style.height = activePanel.offsetHeight + 'px';

        activePanel.style.position = originalPosition;
        activePanel.style.visibility = originalVisibility;
        activePanel.style.opacity = originalOpacity;
        activePanel.style.display = originalDisplay;
      }
    });
  });
});

var swiper1 = new Swiper(".testimonials-slider", {
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: ".testimonials-section .swiper-button-next",
    prevEl: ".testimonials-section .swiper-button-prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    756: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1025: {
      slidesPerView: 3,
      spaceBetween: 20,
    }
  }
});
