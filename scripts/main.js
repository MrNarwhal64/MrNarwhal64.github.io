/* =============================================
   SAMUEL MORAVEC PORTFOLIO – main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== NAV SCROLL ===== */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== MOBILE MENU ===== */
  const navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('menu-open');
  });
  // Close on link click
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('menu-open'));
  });

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll(
    '.project-card, .about__skill, .about__text, .about__visual, .contact-form, .section-header, .filter-tabs'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children in grid
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * (entry.target.dataset.revealDelay || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    el.dataset.revealDelay = i % 4;
    revealObserver.observe(el);
  });

  /* ===== VIDEO PLAY ON HOVER / CLICK ===== */
  document.querySelectorAll('.project-card').forEach(card => {
    const video = card.querySelector('.project-card__video');
    const playBtn = card.querySelector('.project-card__play');
    if (!video) return;

    let playing = false;

    card.addEventListener('mouseenter', () => {
      if (!playing) video.play().catch(() => { });
    });
    card.addEventListener('mouseleave', () => {
      if (!playing) { video.pause(); video.currentTime = 0; }
    });

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (playing) {
          video.pause();
          playing = false;
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        } else {
          video.play().catch(() => { });
          playing = true;
          video.controls = true;
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        }
      });
    }
  });

  /* ===== FEATURED VIDEO ===== */
  const featuredVideo = document.getElementById('featuredVideo');
  const featuredPlay = document.getElementById('featuredPlay');

  if (featuredVideo && featuredPlay) {
    let fPlaying = false;

    // Auto-play on hover
    const featCard = document.querySelector('.project-featured');
    featCard.addEventListener('mouseenter', () => {
      if (!fPlaying) featuredVideo.play().catch(() => { });
    });
    featCard.addEventListener('mouseleave', () => {
      if (!fPlaying) { featuredVideo.pause(); featuredVideo.currentTime = 0; }
    });

    featuredPlay.addEventListener('click', (e) => {
      e.stopPropagation();
      if (fPlaying) {
        featuredVideo.pause();
        fPlaying = false;
        featuredPlay.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Přehrát film</span>';
        featuredVideo.controls = false;
      } else {
        featuredVideo.play().catch(() => { });
        fPlaying = true;
        featuredVideo.controls = true;
        featuredPlay.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pauza</span>';
      }
    });
  }

  /* ===== GALLERY SLIDER ===== */
  const slider = document.getElementById('gallerySlider');
  const dotsContainer = document.getElementById('galleryDots');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  if (slider) {
    const slides = slider.querySelectorAll('.gallery-slide');
    let current = 0;
    let autoTimer;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Záběr ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.gallery-dot');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 3500);
    }
    function stopAuto() { clearInterval(autoTimer); }

    prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    startAuto();
  }

  /* ===== PROJECT FILTER ===== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      projectCards.forEach(card => {
        const cats = card.dataset.category || '';
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
          // Re-trigger reveal
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ===== CONTACT FORM ===== */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        formNote.textContent = 'Prosím vyplňte všechna pole.';
        formNote.style.color = '#ff6b6b';
        return;
      }

      // Simulate send
      submitBtn.disabled = true;
      submitBtn.textContent = 'Odesílám...';

      setTimeout(() => {
        formNote.textContent = 'Zpráva odeslána! Ozvu se co nejdříve.';
        formNote.style.color = 'var(--accent)';
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Odeslat zprávu';
      }, 1200);
    });
  }

  /* ===== SKILLS MARQUEE DUPLICATE ===== */
  const skillsInner = document.querySelector('.skills__inner');
  if (skillsInner) {
    const clone = skillsInner.cloneNode(true);
    skillsInner.parentElement.appendChild(clone);
  }

});
