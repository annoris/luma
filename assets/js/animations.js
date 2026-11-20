/* Motion layer: progressive enhancement; the page remains usable without JS. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  reduced.addEventListener('change', () => {
    if (reduced.matches) reveals.forEach(element => element.classList.add('is-visible'));
  });
  if ('IntersectionObserver' in window && !reduced.matches) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    reveals.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${index % 4 * 75}ms`);
      observer.observe(element);
    });
  }

  // Build the cinematic layers only after JS is available.
  document.querySelectorAll('.hero-title .title-line').forEach((line, lineIndex) => {
    [...line.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => {
      const fragment = document.createDocumentFragment();
      [...node.textContent].forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'hero-letter';
        const glyph = document.createElement('span');
        glyph.className = 'hero-glyph';
        glyph.textContent = letter === ' ' ? '\u00a0' : letter;
        span.append(glyph);
        span.style.setProperty('--char-index', index);
        span.style.setProperty('--char-phase', `${index * -.14 - lineIndex * .8}s`);
        span.style.setProperty('--char-sign', index % 2 ? -1 : 1);
        span.style.setProperty('--letter-delay', `${((index * 7 + lineIndex * 3) % 13) * 40}ms`);
        span.setAttribute('aria-hidden', 'true');
        fragment.append(span);
      });
      node.replaceWith(fragment);
    });
  });
  // Split words without destroying emphasis or explicit line breaks. Each heading
  // keeps a single accessible name; the visual fragments are presentation only.
  const kineticHeadings = [...document.querySelectorAll('.intro h2, .section-heading h2, .moment-row h3, .contact h2, .ripped-label strong')];
  kineticHeadings.forEach(heading => {
    const readable = heading.cloneNode(true);
    readable.querySelectorAll('br').forEach(br => br.replaceWith(' '));
    heading.setAttribute('aria-label', readable.textContent.trim());
    heading.classList.add('kinetic-heading');
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).filter(Boolean).forEach(word => {
        if (/^\s+$/.test(word)) { fragment.append(document.createTextNode(word)); return; }
        const outer = document.createElement('span');
        outer.className = 'type-word';
        outer.setAttribute('aria-hidden', 'true');
        outer.style.setProperty('--word-delay', `${index * 85}ms`);
        outer.style.setProperty('--word-phase', `${index * -.32}s`);
        const inner = document.createElement('span');
        inner.className = 'type-ink';
        inner.textContent = word;
        outer.append(inner);
        fragment.append(outer);
        index++;
      });
      node.replaceWith(fragment);
    });
  });
  if ('IntersectionObserver' in window) {
    const typeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('is-type-visible', entry.isIntersecting);
    }), { threshold: .18 });
    kineticHeadings.forEach(heading => typeObserver.observe(heading));
  } else kineticHeadings.forEach(heading => heading.classList.add('is-type-visible'));
  const heroGlyphs = [...document.querySelectorAll('.hero-glyph')];
  const hero = document.querySelector('.hero');
  if (hero) {
    const bubbles = document.createElement('div');
    bubbles.className = 'hero-bubbles';
    bubbles.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 9; index++) {
      const bubble = document.createElement('i');
      bubble.style.setProperty('--bubble-left', `${7 + index * 10}%`);
      bubble.style.setProperty('--bubble-size', `${12 + index % 3 * 13}px`);
      bubble.style.setProperty('--bubble-delay', `${index * -.9}s`);
      bubble.style.setProperty('--bubble-duration', `${6 + index % 4}s`);
      bubbles.append(bubble);
    }
    hero.append(bubbles);
  }
  const story = document.querySelector('.moments');
  const storyRows = story ? [...story.querySelectorAll('.moment-row')] : [];
  if (story && storyRows.length) {
    const viewport = document.createElement('div');
    viewport.className = 'story-viewport';
    const heading = document.createElement('div');
    heading.className = 'story-heading';
    [...story.children].filter(element => !element.classList.contains('moment-row')).forEach(element => heading.append(element));
    viewport.append(heading);
    storyRows.forEach((row, index) => {
      row.style.setProperty('--panel-index', index);
      viewport.append(row);
    });
    story.append(viewport);
    story.classList.add('has-story');
  }
  const desktopStory = window.matchMedia('(min-width: 801px)');
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const cans = [...document.querySelectorAll('.hero-can')];
  let pointerX = 0, pointerY = 0, pointerClientX = -1000, pointerClientY = -1000, scheduled = false;
  const paint = () => {
    scheduled = false;
    if (reduced.matches) return;
    const heroProgress = hero ? Math.max(0, Math.min(1, scrollY / hero.offsetHeight)) : 0;
    heroGlyphs.forEach((glyph, index) => {
      const rect = glyph.getBoundingClientRect();
      const dx = pointerClientX - rect.left - rect.width / 2;
      const dy = pointerClientY - rect.top - rect.height / 2;
      const distance = Math.hypot(dx, dy);
      const radius = Math.max(100, rect.height * .8);
      const linear = Math.max(0, 1 - distance / radius);
      const influence = linear * linear * (3 - 2 * linear);
      glyph.style.setProperty('--magnet-x', `${dx * influence * .06}px`);
      glyph.style.setProperty('--magnet-y', `${-rect.height * .09 * influence}px`);
      glyph.style.setProperty('--magnet-rotate', `${-11 * influence * dx / radius}deg`);
      glyph.style.setProperty('--magnet-scale', 1 + influence * .09);
      const localIndex = Number(glyph.parentElement.style.getPropertyValue('--char-index'));
      const secondLine = glyph.closest('.second');
      glyph.parentElement.style.setProperty('--scroll-letter-x', `${(localIndex - 3.5) * heroProgress * (secondLine ? -6 : 14)}px`);
      glyph.parentElement.style.setProperty('--scroll-letter-y', `${heroProgress * (index % 2 ? 65 : -45)}px`);
      glyph.parentElement.style.setProperty('--scroll-letter-rotate', `${heroProgress * (index % 2 ? -12 : 12)}deg`);
    });
    kineticHeadings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const travel = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
      heading.style.setProperty('--type-scroll', `${Math.max(-1, Math.min(1, travel)) * 22}px`);
    });
    parallax.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > innerHeight + 200) return;
      const speed = Number(element.dataset.parallax) || 0.08;
      const displacement = (innerHeight / 2 - rect.top - rect.height / 2) * speed;
      element.style.setProperty('--parallax-y', `${displacement.toFixed(2)}px`);
    });
    if (story && desktopStory.matches) {
      const rect = story.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
      const timeline = progress * (storyRows.length - 1);
      story.style.setProperty('--story-progress', progress);
      storyRows.forEach((row, index) => {
        const distance = index - timeline;
        row.style.setProperty('--panel-offset', `${distance * 105}%`);
        row.style.setProperty('--panel-opacity', Math.max(0, 1 - Math.abs(distance) * 1.45));
        row.style.setProperty('--panel-rotate', `${distance * 12}deg`);
      });
    }
    document.querySelector('.hero')?.style.setProperty('--hero-scroll', `${Math.min(scrollY * .13, 110)}px`);
    cans.forEach(can => {
      can.style.setProperty('--pointer-x', `${pointerX * 8}deg`);
      can.style.setProperty('--pointer-y', `${pointerY * -5}deg`);
      can.style.setProperty('--scroll-turn', `${Math.min(scrollY * .018, 35)}deg`);
    });
  };
  const queue = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });
  addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    pointerX = event.clientX / innerWidth * 2 - 1;
    pointerY = event.clientY / innerHeight * 2 - 1;
    queue();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    pointerClientX = -1000; pointerClientY = -1000; queue();
  });
  let touchReset;
  addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    pointerClientX = event.clientX; pointerClientY = event.clientY; queue();
    clearTimeout(touchReset);
    touchReset = setTimeout(() => { pointerClientX = -1000; pointerClientY = -1000; queue(); }, 350);
  }, { passive: true });
  queue();

  const menuToggle = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const setMenu = open => {
    if (!menu || !menuToggle) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    const main = document.querySelector('main');
    const sound = document.querySelector('#sound-toggle');
    if (main) main.inert = open;
    if (sound) sound.inert = open;
    if (open) menu.querySelector('a')?.focus();
  };
  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    setMenu(false);
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }));
  addEventListener('keydown', event => {
    if (!menu || menu.hidden) return;
    if (event.key === 'Escape') {
      setMenu(false);
      menuToggle?.focus();
    }
    if (event.key === 'Tab') {
      const stops = [menuToggle, ...menu.querySelectorAll('a')].filter(Boolean);
      const current = stops.indexOf(document.activeElement);
      if (event.shiftKey && current <= 0) {
        event.preventDefault();
        stops.at(-1)?.focus();
      } else if (!event.shiftKey && (current === stops.length - 1 || current === -1)) {
        event.preventDefault();
        stops[0]?.focus();
      }
    }
  });

  const flavors = {
    citrus: { name: 'LIME<br>& LEMON', description: 'Bright citrus, a botanical twist, and a little sunshine for whatever the day brings.' },
    berry: { name: 'WILD<br>BERRIES', description: 'Wild berries, hibiscus, and light bubbles. A delicious little plot twist for your day.' },
    mint: { name: 'MINT<br>& CUCUMBER', description: 'Lime, cucumber, and fresh mint. Take a breath, crack open a LUMA, and begin again.' }
  };
  const showcase = document.querySelector('#product-showcase');
  const buttons = [...document.querySelectorAll('.flavor-button')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.flavor;
    const flavor = flavors[key];
    if (!flavor || !showcase || showcase.dataset.flavor === key) return;
    showcase.dataset.flavor = key;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const name = document.querySelector('#flavor-name');
    const description = document.querySelector('#flavor-description');
    if (name) name.innerHTML = flavor.name;
    if (description) description.textContent = flavor.description;
    if (!reduced.matches) showcase.animate([
      { opacity: .7, transform: 'translateY(12px) rotate(-1deg)' },
      { opacity: 1, transform: 'translateY(0) rotate(0)' }
    ], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
  }));
})();
