/**
 * ARCHITECT AHMED MOHAMED MAHMOUD SHAABAN — PORTFOLIO INTERACTIVE SCRIPT (PURE VANILLA JS)
 * 1. Configuration Flags (Easy toggle for Testimonials section)
 * 2. Smart Hero Video & Poster Controller (Desktop-only playback, disabled on mobile/slow connections)
 * 3. Navbar Scroll State, Active Section Scroll-Spy, Mobile Menu Drawer & Smooth Scroll
 * 4. Interactive Career Timeline Stage Filtering
 * 5. Executed Projects Category Filtering + Collapsible Full Directory Accordion
 * 6. Project Specs Bar Empty-Field Auto-Hide Fallback
 * 7. Interactive Multi-Image Project Gallery & Dossier Modal (12 Real Case Studies)
 */

(() => {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURATION FLAGS
  // ==========================================================================
  /**
   * Set SHOW_TESTIMONIALS to `false` (or set data-section-enabled="false" on #testimonials in index.html)
   * if you want to temporarily hide the "What Colleagues Say" section until real reviews are added.
   */
  const SHOW_TESTIMONIALS = true;

  const testimonialsSection = document.getElementById('testimonials');
  const testimonialNavLinks = document.querySelectorAll('[data-nav-section="testimonials"]');

  if (testimonialsSection) {
    const htmlEnabled = testimonialsSection.getAttribute('data-section-enabled') !== 'false';
    const isEnabled = SHOW_TESTIMONIALS && htmlEnabled;
    testimonialsSection.setAttribute('data-section-enabled', isEnabled ? 'true' : 'false');
    testimonialNavLinks.forEach((link) => {
      const parentLi = link.closest('li');
      if (parentLi) {
        parentLi.style.display = isEnabled ? '' : 'none';
      } else {
        link.style.display = isEnabled ? '' : 'none';
      }
    });
  }

  // ==========================================================================
  // 2. BOOMERANG HERO VIDEO CAPTURE & 30FPS PING-PONG PLAYBACK
  //    Plays automatically and responsively on BOTH Mobile and Desktop screens.
  // ==========================================================================
  const video = document.getElementById('boomerang-video');
  const canvas = document.getElementById('boomerang-canvas');

  if (video && canvas) {
    let isCapturing = false;
    let rafId = null;
    let rvfcId = null;
    let lastCapturedTime = -1;
    const capturedFrames = [];

    function captureFrame() {
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        return;
      }

      const currentTime = video.currentTime;
      if (currentTime === lastCapturedTime) {
        return;
      }
      lastCapturedTime = currentTime;

      const maxWidth = window.innerWidth < 768 ? 640 : 960;
      const width = Math.min(video.videoWidth, maxWidth);
      const height = Math.round((video.videoHeight / video.videoWidth) * width);

      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;

      const ctx = offscreen.getContext('2d');
      if (ctx) {
        try {
          ctx.drawImage(video, 0, 0, width, height);
          capturedFrames.push(offscreen);
        } catch {
          // Ignore transient draw error
        }
      }
    }

    function scheduleCapture() {
      if (!isCapturing) return;

      if (typeof video.requestVideoFrameCallback === 'function') {
        rvfcId = video.requestVideoFrameCallback(() => {
          captureFrame();
          scheduleCapture();
        });
      } else {
        rafId = requestAnimationFrame(() => {
          captureFrame();
          scheduleCapture();
        });
      }
    }

    function stopCapture() {
      isCapturing = false;
      if (rvfcId !== null && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(rvfcId);
        rvfcId = null;
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function startBoomerangCanvasPlayback(frames) {
      if (!frames || frames.length === 0) return;

      canvas.width = frames[0].width;
      canvas.height = frames[0].height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      video.style.display = 'none';
      canvas.style.display = 'block';

      let frameIndex = 0;
      let direction = 1;
      let lastTime = performance.now();
      const interval = 1000 / 30;

      ctx.drawImage(frames[frameIndex], 0, 0, canvas.width, canvas.height);

      function animate(now) {
        if (now - lastTime >= interval) {
          lastTime = now - ((now - lastTime) % interval);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(frames[frameIndex], 0, 0, canvas.width, canvas.height);

          if (frames.length > 1) {
            frameIndex += direction;
            if (frameIndex >= frames.length - 1) {
              frameIndex = frames.length - 1;
              direction = -1;
            } else if (frameIndex <= 0) {
              frameIndex = 0;
              direction = 1;
            }
          }
        }
        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }

    function handleLoaded() {
      if (isCapturing || capturedFrames.length > 0) return;
      isCapturing = true;
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      scheduleCapture();
      video.play().catch(() => {});
    }

    function handleEnded() {
      captureFrame();
      stopCapture();

      if (capturedFrames.length > 1) {
        startBoomerangCanvasPlayback(capturedFrames);
      } else {
        // Fallback: loop the native <video> element if canvas frames were not captured
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }

    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('canplay', handleLoaded);
    video.addEventListener('ended', handleEnded);

    if (video.readyState >= 2) {
      handleLoaded();
    }
  }

  // ==========================================================================
  // 3. NAVBAR SCROLL STATE, MOBILE MENU DRAWER, ACTIVE SECTION SCROLL-SPY & SMOOTH SCROLL
  // ==========================================================================
  const navbar = document.querySelector('.navbar');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  function closeMobileMenu() {
    if (!mobileMenuToggle || !mobileNavDrawer) return;
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
    if (navbar) navbar.classList.remove('menu-open');
    mobileNavDrawer.classList.remove('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileNavDrawer.setAttribute('hidden', '');
  }

  function toggleMobileMenu() {
    if (!mobileMenuToggle || !mobileNavDrawer) return;
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileMenuToggle.setAttribute('aria-label', 'Close navigation menu');
      if (navbar) navbar.classList.add('menu-open');
      mobileNavDrawer.removeAttribute('hidden');
      mobileNavDrawer.classList.add('is-open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    document.addEventListener('click', (e) => {
      if (
        mobileNavDrawer.classList.contains('is-open') &&
        !mobileNavDrawer.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeMobileMenu();
      }
    });
  }

  // Active Section Scroll-Spy (highlights current section in top navbar & mobile drawer)
  const trackedSectionIds = ['about', 'experience', 'projects', 'testimonials', 'skills', 'contact'];
  const allNavLinks = Array.from(document.querySelectorAll('[data-nav-section]'));

  function updateActiveNavSection() {
    const scrollPos = window.scrollY + 180;
    let currentSectionId = '';

    trackedSectionIds.forEach((id) => {
      const sectionEl = document.getElementById(id);
      if (!sectionEl) return;
      if (sectionEl.getAttribute('data-section-enabled') === 'false') return;
      const top = sectionEl.offsetTop;
      const height = sectionEl.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = id;
      }
    });

    // If scrolled near the very bottom of the page, highlight Contact
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
      currentSectionId = 'contact';
    }

    allNavLinks.forEach((link) => {
      const targetSection = link.getAttribute('data-nav-section');
      const isActive = targetSection === currentSectionId;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener(
    'scroll',
    () => {
      if (navbar) {
        navbar.classList.toggle('is-scrolled', window.scrollY > 40);
      }
      updateActiveNavSection();
    },
    { passive: true }
  );
  updateActiveNavSection();

  // Smooth scroll handler for anchor links (closes mobile drawer automatically)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMobileMenu();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', targetId);
        }
      }
    });
  });

  // Scroll Reveal Observer
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // ==========================================================================
  // 4. INTERACTIVE CAREER TIMELINE STAGE FILTER
  // ==========================================================================
  const tlNavPills = Array.from(document.querySelectorAll('.tl-nav-pill'));
  const tlItems = Array.from(document.querySelectorAll('.timeline-item'));

  tlNavPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const target = pill.dataset.tlTarget || 'all';
      tlNavPills.forEach((p) => p.classList.toggle('active', p === pill));
      tlItems.forEach((item) => {
        const show = target === 'all' || item.dataset.tlId === target;
        item.classList.toggle('is-hidden', !show);
      });
    });
  });

  // ==========================================================================
  // 5. EXECUTED PROJECTS FILTERING + COLLAPSIBLE FULL DIRECTORY ACCORDION
  // ==========================================================================
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const indexRows = Array.from(document.querySelectorAll('[data-index-cat]'));
  const jumpFilterLinks = Array.from(document.querySelectorAll('[data-jump-filter]'));
  const directoryToggleBtn = document.getElementById('directory-toggle-btn');
  const directoryToggleLabel = document.getElementById('directory-toggle-label');
  const directoryCollapsible = document.getElementById('directory-collapsible');

  function setDirectoryAccordionOpen(isOpen) {
    if (!directoryToggleBtn || !directoryCollapsible) return;
    directoryToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      directoryCollapsible.removeAttribute('hidden');
      if (directoryToggleLabel) {
        directoryToggleLabel.textContent = 'Hide Full Projects Directory';
      }
    } else {
      directoryCollapsible.setAttribute('hidden', '');
      if (directoryToggleLabel) {
        directoryToggleLabel.textContent = 'Show Full Projects Directory';
      }
    }
  }

  if (directoryToggleBtn && directoryCollapsible) {
    directoryToggleBtn.addEventListener('click', () => {
      const isCurrentlyOpen = directoryToggleBtn.getAttribute('aria-expanded') === 'true';
      setDirectoryAccordionOpen(!isCurrentlyOpen);
    });
  }

  function applyProjectFilter(category) {
    filterButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });

    projectCards.forEach((card) => {
      const cardCats = (card.dataset.category || '').split(' ');
      const show = category === 'all' || cardCats.includes(category);
      card.classList.toggle('is-hidden', !show);
    });

    indexRows.forEach((row) => {
      const rowCats = (row.dataset.indexCat || '').split(' ');
      const show = category === 'all' || rowCats.includes(category);
      row.classList.toggle('is-hidden', !show);
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyProjectFilter(btn.dataset.filter || 'all');
    });
  });

  jumpFilterLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetFilter = link.dataset.jumpFilter || 'all';
      applyProjectFilter(targetFilter);
    });
  });

  // ==========================================================================
  // 6. PROJECT SPECS BAR EMPTY-FIELD AUTO-HIDE FALLBACK
  //    Automatically hides any .spec-item whose .spec-item-val is empty
  // ==========================================================================
  document.querySelectorAll('.project-specs-bar .spec-item').forEach((specItem) => {
    const valEl = specItem.querySelector('.spec-item-val');
    if (!valEl || !valEl.textContent.trim()) {
      specItem.classList.add('is-empty');
    } else {
      specItem.classList.remove('is-empty');
    }
  });

  // ==========================================================================
  // 7. PROJECT DOSSIER & MULTI-IMAGE GALLERY MODAL (12 REAL CASE STUDIES)
  // ==========================================================================
  const PROJECT_DATA = {
    '01': {
      code: 'EXECUTED PROJECT // 01 · CONCEPT STORE & VILLA',
      title: 'Villa Baboushka Concept Store',
      location: 'Capital Business Park, Sheikh Zayed',
      role: 'Senior Site Engineer',
      area: '280 m² Retail Space',
      scope: 'Interior Architecture, Custom Joinery & Retail Fit-Out',
      materials: 'Polished Terrazzo, Fluted Oak Wood, Brushed Brass, Curved Microcement',
      desc: 'Fashion boutique combining clean spatial zoning, custom display fixtures, ambient lighting, and sculptural display islands.',
      images: [
        {
          url: 'img/v.JPG',
          caption: '01 / Villa Baboushka Concept Store — Double-Height Boutique & Sculptural Mesh Chandeliers',
        },
        {
          url: 'img/v3.JPG',
          caption: '02 / Floral & Marble Gallery Corridor with Chevron Brass & Stone Flooring',
        },
        {
          url: 'img/43d5ca07-f790-4713-bf47-7bd6726dec0d.JPG',
          caption: '03 / Couture Evening Salon, Brass Arch Displays & Velvet Lounge',
        },
        {
          url: 'img/77c40870-c335-492e-8617-f048ccb490c3.JPG',
          caption: '04 / Custom Magenta Display Frame & Teal Velvet Drapery Zone',
        },
      ],
    },
    '02': {
      code: 'EXECUTED PROJECT // 02 · EDARA SODIC (2020–PRESENT)',
      title: 'EDARA SODIC — East Cairo Finishing Zones',
      location: 'Villette, Eastown, SODIC East & EDNC — East Cairo',
      role: 'Zone Manager',
      area: '4 Master-Planned Zones',
      scope: 'Interior Finishing Supervision, Shop Drawing Coordination & Contract/Invoice Revision',
      materials: 'Roman Travertine, Slatted Walnut Ceilings, Custom Kitchen Joinery, Natural Stone',
      desc: 'Supervising residential and commercial interior finishing, shop drawing alignment, and contract/invoice review across four East Cairo zones.',
      images: [
        {
          url: 'img/3387b959-0b21-4588-a94b-c9833fe4ce9c.JPG',
          caption: '01 / Sunken Courtyard Lounge, Travertine Cladding & Slatted Ceiling',
        },
        {
          url: 'img/5b1d9cbb-8dc2-436f-b323-8af7a62a44a7.JPG',
          caption: '02 / Indoor-Outdoor Villa Reception & Walnut Architectural Portals',
        },
        {
          url: 'img/968f18e7-88f3-4ef7-baa4-3852065bf6ea.JPG',
          caption: '03 / Flush Walnut Millwork & Full-Height Glazing Overlooking Stone Courtyard',
        },
        {
          url: 'img/6234a5cf-69c7-45c4-9f11-2ac076425630.JPG',
          caption: '04 / Residential Kitchen Joinery & Integrated Appliances',
        },
      ],
    },
    '03': {
      code: 'EXECUTED PROJECT // 03 · RETAIL BOUTIQUE (IMPACT FINISHING)',
      title: 'Okhtein Flagship Boutique — Arkan Mall',
      location: 'Arkan Mall, Sheikh Zayed City',
      role: 'Senior Site Engineer',
      area: '', // PLACEHOLDER: Add project area here (e.g., '180 m²')
      scope: 'Site Execution Management, Custom Shop Drawings & Client Invoicing',
      materials: 'Polished Brass Mirror Columns, Faceted Ceilings, Raw Carved Stone, Backlit Marble',
      desc: 'Retail boutique featuring geometric faceted ceilings, polished brass mirror columns, suspended display fixtures, and carved stone seating.',
      images: [
        {
          url: 'img/51563824-00a7-4253-845c-55c6b4771936.JPG',
          caption: '01 / Okhtein Arkan Mall — Brass Mirror Columns & Oval Pivot Mirror',
        },
        {
          url: 'img/8070b388-22fc-4f9b-97d3-da718c500e0f.JPG',
          caption: '02 / Faceted Geometric Ceiling & Suspended Hand Displays',
        },
        {
          url: 'img/b6c711f1-2d63-4528-b1e4-6bd33bfe01b5.JPG',
          caption: '03 / Polished Brass Display Counter & Illuminated Niche Shelving',
        },
        {
          url: 'img/1e926142-634b-46d6-ae53-eaed4afe0240.JPG',
          caption: '04 / Carved Stone Bench & Backlit Marble Alcoves',
        },
      ],
    },
    '04': {
      code: 'EXECUTED PROJECT // 04 · RESTAURANT FIT-OUT (IMPACT FINISHING)',
      title: 'NUWA Asian Food Restaurant',
      location: 'Capital Business Park, Sheikh Zayed',
      role: 'Senior Site Engineer',
      area: '', // PLACEHOLDER: Add project area here
      scope: 'Full Site Execution Management, Shop Drawings & MEP Kitchen Coordination',
      materials: 'Book-Matched Marble, Acoustic Oak Ceilings, Custom Mural Art, Carved Stone Pillars',
      desc: 'Restaurant fit-out executed with book-matched marble sushi counters, custom wall murals, backlit circular mirrors, and carved stone columns.',
      images: [
        {
          url: 'img/2d73aabc-c8b1-46ca-8396-7d4305d3047c.JPG',
          caption: '01 / NUWA Main Dining Hall, Custom Mural & Backlit Circular Mirrors',
        },
        {
          url: 'img/49c21e64-12cd-4495-aa2b-369cce6533d7.JPG',
          caption: '02 / Book-Matched Marble Sushi Bar & Illuminated Overhead Canopy',
        },
        {
          url: 'img/cad696b9-6ce5-44da-bf2d-8818975ab7ba.JPG',
          caption: '03 / Carved Stone Columns & Circular Timber Lattice Feature Wall',
        },
        {
          url: 'img/d70af615-af47-4e8d-bafa-56b0ade97320.JPG',
          caption: '04 / Fluted Timber Base & Marble Counter Detailing',
        },
      ],
    },
    '05': {
      code: 'EXECUTED PROJECT // 05 · RETAIL FIT-OUT (IMPACT FINISHING)',
      title: 'Rax Concept Store & Original Marines',
      location: 'Capital Business Park (Sheikh Zayed) & City Centre Almaza',
      role: 'Senior Site Engineer',
      area: '', // PLACEHOLDER: Add project area here
      scope: 'Retail Execution, Custom Metalwork, Terrazzo Flooring & Shop Drawings',
      materials: 'Rose-Gold Expanded Metal Mesh, Custom Terrazzo, Arched MDF Joinery, Track Lighting',
      desc: 'Retail fit-out featuring a rose-gold expanded metal mesh pavilion, custom terrazzo flooring with mosaic stone inlays, and arched wall cabinetry.',
      images: [
        {
          url: 'img/v2.JPG',
          caption: '01 / Rax Concept Store — Rose-Gold Expanded Mesh Pavilion & Display Plinths',
        },
        {
          url: 'img/v4.JPG',
          caption: '02 / Illuminated Arched Display Niches & Modular Retail Islands',
        },
        {
          url: 'img/5f6315e4-d8a6-452f-9b4c-e579e6c71e91.JPG',
          caption: '03 / Dark Terrazzo Feature Wall, Custom Shelving & Mosaic Floor Inlay',
        },
        {
          url: 'img/50bab583-3399-4b45-9ce8-91780179b0e0.JPG',
          caption: '04 / Architectural Track Lighting & Custom Joinery Execution',
        },
      ],
    },
    '06': {
      code: 'EXECUTED PROJECT // 06 · F&B FIT-OUT (IMPACT FINISHING)',
      title: 'MINCE Burger — Capital Business Park',
      location: 'Capital Business Park, Sheikh Zayed',
      role: 'Senior Site Engineer',
      area: '', // PLACEHOLDER: Add project area here
      scope: 'Site Execution Management, Perforated Steel & Ceiling Grids, Shop Drawings',
      materials: 'Perforated Steel Fascia, Yellow Acoustic Mesh Ceiling, Walnut Slats, Marble Tile Grid',
      desc: 'Industrial-style restaurant featuring a perforated steel fascia, yellow expanded-metal ceiling grids, slatted walnut walls, and custom graphics.',
      images: [
        {
          url: 'img/98ebad92-b248-4b46-abaf-af2c2b14821c.JPG',
          caption: '01 / MINCE Perforated Steel Fascia & Slatted Walnut Feature Wall',
        },
        {
          url: 'img/76b2975b-1bb3-47a0-b1eb-45c3b1496715.JPG',
          caption: '02 / Yellow Perforated Metal Ceiling Grid & Subway Map Graphic Wall',
        },
        {
          url: 'img/ad48f428-5f4f-4fd4-88fa-2744b29ed66f.JPG',
          caption: '03 / On-Site Flooring Execution & Suspended Linear Luminaires',
        },
        {
          url: 'img/bcb15886-5db6-40e3-8b55-c83754e7e3af.JPG',
          caption: '04 / Nighttime Site Supervision & Lighting Calibration',
        },
      ],
    },
    '07': {
      code: 'EXECUTED PROJECT // 07 · INTERNATIONAL RETAIL & PAVILIONS',
      title: 'Armani Exchange (Mall of Egypt & Almaza) & Commercial Pavilions',
      location: 'Mall of Egypt, City Centre Almaza & Cairo International Exhibition',
      role: 'Senior Site Engineer',
      area: '', // PLACEHOLDER: Add project area here
      scope: 'Retail Fit-Out, Structural Steel Pavilions, Shop Drawings & Invoicing',
      materials: 'Structural Blackened Steel, Backlit Acrylic & LED Signage, Custom Display Systems',
      desc: 'Retail stores for Armani Exchange at Mall of Egypt and City Centre Almaza alongside double-height steel exhibition pavilions.',
      images: [
        {
          url: 'img/a14b960b-8bcd-44b1-a2dc-016d12cf1249.JPG',
          caption: '01 / Double-Height Architectural Steel Pavilion & Integrated LED Fascia',
        },
        {
          url: 'img/1e649e89-fd9a-4191-9bf1-112d8d5127d3.JPG',
          caption: '02 / Cantilevered Display Volumes & Backlit Product Showcase Alcoves',
        },
        {
          url: 'img/51d790b5-fcf4-4206-b5eb-ebb9892e731b.JPG',
          caption: '03 / Vertical Illuminated Display Towers & Custom Metalwork',
        },
        {
          url: 'img/64befcc2-31a1-402c-816f-7ca4ea3b76cf.JPG',
          caption: '04 / Brand Merchandising & Exhibition Stand Handover',
        },
      ],
    },
    '08': {
      code: 'EXECUTED PROJECT // 08 · HOSPITALITY COLLECTION (IMPACT FINISHING)',
      title: "Ted's Restaurant, 7 Seeds Cafe & Orchid Café",
      location: 'Mall of Egypt (6th of October), Capital Business Park & Karma 4 (Sheikh Zayed)',
      role: 'Senior Site Engineer',
      area: '', // PLACEHOLDER: Add project area here
      scope: 'Site Execution Management, Custom Millwork, MEP & Client Invoicing',
      materials: 'Botanical Timber Columns, Tufted Velvet Banquettes, Brick Ovens, Brass Chandeliers',
      desc: "Hospitality execution for Ted's Restaurant (Mall of Egypt), 7 Seeds Cafe (Capital Business Park), and Orchid Café (Karma 4, Sheikh Zayed).",
      images: [
        {
          url: 'img/b0cf99fa-1b91-4478-b5b4-c169307c188e.JPG',
          caption: "01 / Ted's Restaurant by Mori Co. (Mall of Egypt) — Steel & Glass Facade",
        },
        {
          url: 'img/a4e04587-ff80-4f78-a5c3-955ff97767da.JPG',
          caption: '02 / 7 Seeds Cafe (Capital Business Park) — Velvet Seating & Suspended Planters',
        },
        {
          url: 'img/c5d4cb1e-c9b6-4a50-af5f-4d1b4f5ec163.JPG',
          caption: '03 / Orchid Café (Karma 4, Zayed City) — Custom Botanical Timber Columns',
        },
        {
          url: 'img/63f37956-0a71-430d-b6ac-32ab0f0feaa1.JPG',
          caption: '04 / Wave Ceiling Ribs, Brick Pizza Oven & Patterned Tile Inlays',
        },
      ],
    },
    '09': {
      code: 'EXECUTED PROJECT // 09 · F&B ROLLOUT (IMPACT FINISHING)',
      title: "Casper & Gambini's, Mori Sushi & Garnell Sushi",
      location: 'Open Air Mall (Madinaty), North Coast & Capital Business Park (Sheikh Zayed)',
      role: 'Senior Site Engineer',
      area: '', // PLACEHOLDER: Add project area here
      scope: 'Site Execution Management, Shop Drawings, Bar & Kitchen Fit-Out, Client Invoicing',
      materials: 'Fluted Oak Bar Counters, Blackened Steel Overhead Grids, Microcement, Warm LED Grazing',
      desc: "Multi-branch restaurant execution across Madinaty, North Coast, and Sheikh Zayed with fluted oak counters, steel bar grids, and open kitchens.",
      images: [
        {
          url: 'img/5cb2342b-3352-4652-b69c-3c02e0bf3184.JPG',
          caption: '01 / Main Hospitality Bar Counter, Fluted Wood Front & Suspended Bulb Grid',
        },
        {
          url: 'img/5ae3a896-9566-4b71-9dfa-10a99e400b00.JPG',
          caption: '02 / Industrial Steel Bar Framing & Warm Under-Counter Grazing Illumination',
        },
        {
          url: 'img/52a16a8f-8519-4b42-8c29-d7b70f6c8019.JPG',
          caption: '03 / Open Sushi & Show Kitchen Counter with Timber Slatted Hood',
        },
        {
          url: 'img/7a60bf9a-e5e4-4d7f-88b7-07196f6ed58b.JPG',
          caption: '04 / Microcement Columns & Vertical Oak Louver Lounge',
        },
      ],
    },
    '10': {
      code: 'EXECUTED PROJECT // 10 · CORPORATE & DIPLOMATIC',
      title: 'Anghami Office Egypt & UNDP Headquarters',
      location: 'New Cairo & World Trade Center (Cairo)',
      role: 'Senior Site Engineer',
      area: '', // PLACEHOLDER: Add project area here
      scope: 'Interior Finishing, Acoustic Partitions, Shop Drawings & MEP',
      materials: 'Frameless Double-Glazed Partitions, Walnut Shelving Dividers, Custom Murals, Marble',
      desc: 'Corporate offices for Anghami Egypt in New Cairo and diplomatic offices for the UNDP at the World Trade Center in Cairo.',
      images: [
        {
          url: 'img/f176b889-fc76-4cc1-a523-458cc54ec10e.JPG',
          caption: '01 / Anghami Office Egypt — Hand-Drawn Cairo Architectural Mural & Mesh Ceiling',
        },
        {
          url: 'img/3e1a6efb-d482-4621-8e24-08186c2d5739.JPG',
          caption: '02 / Glass Boardroom & Custom Walnut Display Dividers',
        },
        {
          url: 'img/265bfcc4-e92e-4479-b568-ab44f7c3b379.JPG',
          caption: '03 / Architectural Shelving Partition & Tinted Glass Meeting Suite',
        },
        {
          url: 'img/2b2ef5f2-9ec4-4aa4-8efb-111884405595.JPG',
          caption: '04 / Office Suite with Geometric Tinted Glass Screen & Walnut Doors',
        },
      ],
    },
    '11': {
      code: 'EXECUTED PROJECT // 11 · BANKING, COMMERCIAL & CLINICAL',
      title: 'Arab Bank, National Bank of Egypt & Al Ahly Sales Office',
      location: 'Mall of Egypt, 6th of October, El Mohandeseen & Sheikh Zayed',
      role: 'Site Engineer',
      area: '', // PLACEHOLDER: Add project area here
      scope: 'Site Engineering, Security & MEP Systems, Marble & Glass Partitions',
      materials: 'Polished Marble Corridors, Vertical Walnut Fins, Frameless Glass, Corian Counters',
      desc: 'Commercial and banking fit-outs for Arab Bank (Mall of Egypt), National Bank of Egypt (6th of October), Al Ahly Sales Office, and Opera City Mall.',
      images: [
        {
          url: 'img/5d6790d6-beba-4478-992e-6cfa6052e06d.JPG',
          caption: '01 / Commercial Corridor, Honed Stone Flooring & Vertical Walnut Fins',
        },
        {
          url: 'img/5ffbf4dc-76af-47d7-97fd-0267c0795ec5.JPG',
          caption: '02 / Washroom with Arched Fluted Mirrors & Vein-Cut Marble',
        },
        {
          url: 'img/01e60248-505b-4a05-a7c0-6751936a49ab.JPG',
          caption: '03 / Custom Curved Reception Counter & Minimalist Linear Track Lighting',
        },
        {
          url: 'img/b28c0d4e-f4b2-4c94-b301-7fec873f5124.JPG',
          caption: '04 / Clinical & Commercial Suite with Circular Barrisol Ceiling',
        },
      ],
    },
    '12': {
      code: 'EXECUTED PROJECT // 12 · PRIVATE RESIDENTIAL VILLA',
      title: 'Three-Stories Villa — Upville Compound',
      location: 'Upville Compound, Sheikh Zayed City',
      role: 'Senior Site Engineer',
      area: 'Three-Story Villa',
      scope: 'Interior Finishing, Spiral Staircase, Marble Flooring & Custom Woodwork',
      materials: 'Wrought Iron & Marble Spiral Staircase, Crema Marfil Marble, Fluted Oak Cladding',
      desc: 'Interior finishing of a three-story villa in Upville Compound featuring an elliptical spiral staircase under a natural skylight and marble salons.',
      images: [
        {
          url: 'img/0022578b-54ed-4393-b1c1-df706acd5b31.JPG',
          caption: '01 / Three-Stories Villa — Elliptical Spiral Staircase & Overhead Skylight',
        },
        {
          url: 'img/11914c41-62dc-4c12-81df-91ee4f93145d.JPG',
          caption: '02 / Formal Reception Salon, Marble Border Inlays & Brass Crystal Chandelier',
        },
        {
          url: 'img/941114f3-5dcf-4de5-b56d-210b29b0fe4d.JPG',
          caption: '03 / Custom Fluted Oak Wall Cladding & Flush Double Doors',
        },
        {
          url: 'img/7df513ea-1452-48af-a7fd-83ff3ae6d0ce.JPG',
          caption: '04 / Sunlit Living Room with Book-Matched Walnut Feature Wall',
        },
      ],
    },
  };

  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCode = document.getElementById('modal-code');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalLocation = document.getElementById('modal-location');
  const modalRole = document.getElementById('modal-role');
  const modalRoleRow = document.getElementById('modal-role-row');
  const modalArea = document.getElementById('modal-area');
  const modalAreaRow = document.getElementById('modal-area-row');
  const modalScope = document.getElementById('modal-scope');
  const modalMaterials = document.getElementById('modal-materials');
  const modalImg = document.getElementById('modal-img');
  const galleryCounter = document.getElementById('gallery-counter');
  const galleryCaptionText = document.getElementById('gallery-caption-text');
  const galleryThumbs = document.getElementById('gallery-thumbs');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');

  let activeProjectImages = [];
  let activeImageIndex = 0;

  function renderGallerySlide(index) {
    if (!activeProjectImages.length) return;
    const total = activeProjectImages.length;
    activeImageIndex = ((index % total) + total) % total;
    const current = activeProjectImages[activeImageIndex];

    if (modalImg) {
      modalImg.src = current.url;
      modalImg.alt = current.caption;
    }
    if (galleryCounter) {
      galleryCounter.textContent = `${activeImageIndex + 1} / ${total}`;
    }
    if (galleryCaptionText) {
      galleryCaptionText.textContent = current.caption;
    }
    if (galleryThumbs) {
      Array.from(galleryThumbs.children).forEach((thumbBtn, idx) => {
        thumbBtn.classList.toggle('is-active', idx === activeImageIndex);
      });
    }
  }

  function openProjectModal(id) {
    const data = PROJECT_DATA[id];
    if (!data || !modal) return;

    activeProjectImages = data.images || [];
    activeImageIndex = 0;

    if (modalCode) modalCode.textContent = data.code;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalLocation) modalLocation.textContent = data.location;

    if (modalRole) modalRole.textContent = data.role || '';
    if (modalRoleRow) {
      modalRoleRow.style.display = data.role ? '' : 'none';
    }

    if (modalArea) modalArea.textContent = data.area || '';
    if (modalAreaRow) {
      modalAreaRow.style.display = data.area ? '' : 'none';
    }

    if (modalScope) modalScope.textContent = data.scope;
    if (modalMaterials) modalMaterials.textContent = data.materials;

    // Build clickable thumbnail buttons
    if (galleryThumbs) {
      galleryThumbs.innerHTML = '';
      activeProjectImages.forEach((imgObj, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `gallery-thumb-btn${idx === 0 ? ' is-active' : ''}`;
        btn.setAttribute('aria-label', `View photo ${idx + 1}: ${imgObj.caption}`);
        const img = document.createElement('img');
        img.src = imgObj.url;
        img.alt = imgObj.caption;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = 160;
        img.height = 105;
        btn.appendChild(img);
        btn.addEventListener('click', () => renderGallerySlide(idx));
        galleryThumbs.appendChild(btn);
      });
    }

    renderGallerySlide(0);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => renderGallerySlide(activeImageIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => renderGallerySlide(activeImageIndex + 1));
  }

  document.querySelectorAll('[data-open-modal]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      openProjectModal(el.dataset.openModal);
    });
    if (el.classList.contains('project-card')) {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProjectModal(el.dataset.openModal);
        }
      });
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
      closeMobileMenu();
      return;
    }
    if (!modal || !modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeProjectModal();
    if (e.key === 'ArrowLeft') renderGallerySlide(activeImageIndex - 1);
    if (e.key === 'ArrowRight') renderGallerySlide(activeImageIndex + 1);
  });
})();
