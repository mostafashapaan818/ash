/**
 * AHMED SHAABAN — EDITORIAL PROJECT SHOWCASE SCRIPT (PURE VANILLA JS)
 * 1. Minimalist Header Scroll State & Mobile Menu Toggle
 * 2. Smooth Anchor Scrolling
 * 3. Category Filtering (Filter Bar + 3-Column Pillars + Executed Index)
 * 4. Expandable 22-Commission Editorial Index
 * 5. Project Detail Modal & Multi-Photo Gallery (12 Real Case Studies)
 */

(() => {
  'use strict';

  // ==========================================================================
  // 1. HEADER SCROLL STATE & MOBILE MENU DRAWER
  // ==========================================================================
  const siteHeader = document.getElementById('site-header');
  const mobileNavBtn = document.getElementById('mobile-nav-btn');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');

  function setMobileMenu(isOpen) {
    if (!mobileNavBtn || !mobileNavPanel) return;
    mobileNavBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      mobileNavPanel.removeAttribute('hidden');
    } else {
      mobileNavPanel.setAttribute('hidden', '');
    }
  }

  if (mobileNavBtn && mobileNavPanel) {
    mobileNavBtn.addEventListener('click', () => {
      const isOpen = mobileNavBtn.getAttribute('aria-expanded') === 'true';
      setMobileMenu(!isOpen);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        setMobileMenu(false);
      }
    });
  }

  window.addEventListener(
    'scroll',
    () => {
      if (siteHeader) {
        siteHeader.classList.toggle('is-scrolled', window.scrollY > 36);
      }
    },
    { passive: true }
  );

  // ==========================================================================
  // 2. SMOOTH ANCHOR SCROLLING
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        setMobileMenu(false);
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================================================
  // 3. CATEGORY FILTERING (CARDS, PILLARS & EXPANDABLE INDEX)
  // ==========================================================================
  const filterButtons = Array.from(document.querySelectorAll('.filter-link'));
  const projectCards = Array.from(document.querySelectorAll('.ed-project-card'));
  const indexRows = Array.from(document.querySelectorAll('[data-index-cat]'));
  const pillarCards = Array.from(document.querySelectorAll('[data-jump-filter]'));
  const projectsSection = document.getElementById('projects');

  function applyCategoryFilter(filterSpec) {
    const requested = (filterSpec || 'all').trim().split(/\s+/);

    filterButtons.forEach((btn) => {
      const btnCat = btn.dataset.filter || 'all';
      const isMatch = requested.length === 1 && requested[0] === btnCat;
      btn.classList.toggle('is-active', isMatch);
    });

    projectCards.forEach((card) => {
      const cardCats = (card.dataset.category || '').split(/\s+/);
      const show =
        requested.includes('all') || requested.some((cat) => cardCats.includes(cat));
      card.classList.toggle('is-hidden', !show);
    });

    indexRows.forEach((row) => {
      const rowCats = (row.dataset.indexCat || '').split(/\s+/);
      const show =
        requested.includes('all') || requested.some((cat) => rowCats.includes(cat));
      row.classList.toggle('is-hidden', !show);
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyCategoryFilter(btn.dataset.filter || 'all');
    });
  });

  pillarCards.forEach((pillar) => {
    pillar.addEventListener('click', () => {
      const targetFilter = pillar.dataset.jumpFilter || 'all';
      applyCategoryFilter(targetFilter);
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================================================
  // 4. EXPANDABLE 22-COMMISSION EDITORIAL INDEX
  // ==========================================================================
  const indexToggleBtn = document.getElementById('index-toggle-btn');
  const indexToggleLabel = document.getElementById('index-toggle-label');
  const indexPanel = document.getElementById('editorial-index-panel');

  if (indexToggleBtn && indexPanel) {
    indexToggleBtn.addEventListener('click', () => {
      const isOpen = indexToggleBtn.getAttribute('aria-expanded') === 'true';
      const nextState = !isOpen;
      indexToggleBtn.setAttribute('aria-expanded', nextState ? 'true' : 'false');
      const arrowEl = indexToggleBtn.querySelector('.cta-arrow');
      if (nextState) {
        indexPanel.removeAttribute('hidden');
        if (indexToggleLabel) indexToggleLabel.textContent = 'HIDE FULL EXECUTED INDEX';
        if (arrowEl) arrowEl.textContent = '−';
      } else {
        indexPanel.setAttribute('hidden', '');
        if (indexToggleLabel) indexToggleLabel.textContent = 'VIEW FULL EXECUTED INDEX';
        if (arrowEl) arrowEl.textContent = '+';
      }
    });
  }

  // ==========================================================================
  // 5. PROJECT DETAIL MODAL & MULTI-PHOTO GALLERY (12 REAL CASE STUDIES)
  // ==========================================================================
  const PROJECT_DATA = {
    '01': {
      code: 'EXECUTED PROJECT // 01',
      category: 'COMMERCIAL & RETAIL',
      title: 'Villa Baboushka Concept Store',
      location: 'Capital Business Park, Sheikh Zayed',
      area: '280 m² Retail Space',
      scope: 'Interior Architecture, Custom Joinery & Turnkey Retail Fit-Out',
      materials: 'Polished Terrazzo, Fluted Oak Wood, Brushed Brass, Curved Microcement',
      highlights:
        'Double-height retail zoning, sculptural wire-mesh chandeliers, chevron brass & stone gallery corridor, and custom display islands.',
      desc: 'Luxury fashion boutique combining minimalist spatial zoning with bespoke display fixtures, soft ambient lighting, and sculptural display islands.',
      images: [
        {
          url: 'img/v.JPG',
          caption: '01 / Double-Height Boutique & Sculptural Mesh Chandeliers',
        },
        {
          url: 'img/v3.JPG',
          caption: '02 / Marble Gallery Corridor with Chevron Brass & Stone Flooring',
        },
        {
          url: 'img/43d5ca07-f790-4713-bf47-7bd6726dec0d.JPG',
          caption: '03 / Couture Evening Salon, Brass Arch Displays & Velvet Lounge',
        },
        {
          url: 'img/77c40870-c335-492e-8617-f048ccb490c3.JPG',
          caption: '04 / Custom Magenta Display Frame & Velvet Drapery Zone',
        },
      ],
    },
    '02': {
      code: 'EXECUTED PROJECT // 02',
      category: 'RESIDENTIAL & COMMERCIAL ZONES',
      title: 'EDARA SODIC — East Cairo Finishing Zones',
      location: 'Villette, Eastown, SODIC East & EDNC — East Cairo',
      area: '4 Master-Planned Zones',
      scope: 'Interior Finishing Supervision, Shop Drawing Alignment & Turnkey Handover',
      materials: 'Roman Travertine, Slatted Walnut Ceilings, Custom Kitchen Joinery, Natural Stone',
      highlights:
        'Sunken courtyard stone cladding, indoor-outdoor architectural portals, flush walnut millwork, and full residential unit finishing across East Cairo.',
      desc: 'Large-scale residential and commercial interior finishing execution across four master-planned East Cairo developments.',
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
          caption: '03 / Flush Walnut Millwork & Full-Height Glazing Overlooking Courtyard',
        },
        {
          url: 'img/6234a5cf-69c7-45c4-9f11-2ac076425630.JPG',
          caption: '04 / Custom Residential Kitchen Joinery & Integrated Appliances',
        },
      ],
    },
    '03': {
      code: 'EXECUTED PROJECT // 03',
      category: 'LUXURY RETAIL',
      title: 'Okhtein Flagship Boutique — Arkan Mall',
      location: 'Arkan Mall, Sheikh Zayed City',
      area: 'Flagship Luxury Retail',
      scope: 'Site Execution, Custom Shop Drawings & Architectural Metalwork',
      materials: 'Polished Brass Mirror Columns, Faceted Ceilings, Raw Carved Stone, Backlit Marble',
      highlights:
        'Geometric faceted gypsum ceiling, polished gold mirror monoliths, suspended sculptural hand displays, and carved monolithic stone seating.',
      desc: 'Flagship luxury accessories boutique executed with geometric faceted ceilings, polished brass columns, and backlit marble alcoves.',
      images: [
        {
          url: 'img/51563824-00a7-4253-845c-55c6b4771936.JPG',
          caption: '01 / Brass Mirror Columns & Sculptural Oval Pivot Mirror',
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
          caption: '04 / Carved Monolithic Stone Bench & Backlit Marble Alcoves',
        },
      ],
    },
    '04': {
      code: 'EXECUTED PROJECT // 04',
      category: 'F&B / FINE DINING',
      title: 'NUWA Asian Food Restaurant',
      location: 'Capital Business Park, Sheikh Zayed',
      area: 'Turnkey Fine-Dining Venue',
      scope: 'Full Site Execution, Shop Drawings & MEP Kitchen Coordination',
      materials: 'Book-Matched Marble, Acoustic Oak Ceilings, Custom Mural Art, Carved Stone Pillars',
      highlights:
        'Book-matched marble sushi bar with illuminated canopy, hand-painted landscape murals, backlit circular mirrors, and carved architectural columns.',
      desc: 'Fine-dining Asian restaurant combining book-matched marble counters, custom mural art, timber latticework, and carved stone columns.',
      images: [
        {
          url: 'img/2d73aabc-c8b1-46ca-8396-7d4305d3047c.JPG',
          caption: '01 / Main Dining Hall, Custom Mural & Backlit Circular Mirrors',
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
      code: 'EXECUTED PROJECT // 05',
      category: 'COMMERCIAL & RETAIL',
      title: 'Rax Concept Store & Original Marines',
      location: 'Capital Business Park (Sheikh Zayed) & City Centre Almaza',
      area: 'Multi-Brand Retail Fit-Out',
      scope: 'Turnkey Retail Execution, Custom Metalwork & Terrazzo Flooring',
      materials: 'Rose-Gold Expanded Metal Mesh, Custom Terrazzo, Arched MDF Joinery, Track Lighting',
      highlights:
        'Rose-gold expanded metal mesh centerpiece pavilion, custom terrazzo wall & mosaic floor inlays, and illuminated arched display niches.',
      desc: 'Multi-brand retail commissions featuring custom expanded-metal pavilions, terrazzo inlays, and arched perimeter display cabinetry.',
      images: [
        {
          url: 'img/v2.JPG',
          caption: '01 / Rax Concept Store — Rose-Gold Expanded Mesh Pavilion & Plinths',
        },
        {
          url: 'img/v4.JPG',
          caption: '02 / Illuminated Arched Display Niches & Modular Retail Islands',
        },
        {
          url: 'img/5f6315e4-d8a6-452f-9b4c-e579e6c71e91.JPG',
          caption: '03 / Dark Terrazzo Feature Wall, Custom Shelving & Mosaic Inlay',
        },
        {
          url: 'img/50bab583-3399-4b45-9ce8-91780179b0e0.JPG',
          caption: '04 / Architectural Track Lighting & Custom Joinery Execution',
        },
      ],
    },
    '06': {
      code: 'EXECUTED PROJECT // 06',
      category: 'F&B / HOSPITALITY',
      title: 'MINCE Burger — Capital Business Park',
      location: 'Capital Business Park, Sheikh Zayed',
      area: 'Turnkey Restaurant Fit-Out',
      scope: 'Site Execution, Perforated Steel & Ceiling Grids, Lighting Calibration',
      materials: 'Perforated Steel Fascia, Yellow Acoustic Mesh Ceiling, Walnut Slats, Marble Tile Grid',
      highlights:
        'Cantilevered perforated steel fascia, yellow expanded-metal ceiling grid, slatted walnut walls with 3D typography, and graphic wall murals.',
      desc: 'Industrial-modern restaurant execution featuring perforated steel facades, acoustic mesh ceiling grids, and slatted walnut feature walls.',
      images: [
        {
          url: 'img/98ebad92-b248-4b46-abaf-af2c2b14821c.JPG',
          caption: '01 / Perforated Steel Fascia & Slatted Walnut Feature Wall',
        },
        {
          url: 'img/76b2975b-1bb3-47a0-b1eb-45c3b1496715.JPG',
          caption: '02 / Yellow Perforated Metal Ceiling Grid & Graphic Wall',
        },
        {
          url: 'img/ad48f428-5f4f-4fd4-88fa-2744b29ed66f.JPG',
          caption: '03 / Flooring Execution & Suspended Linear Luminaires',
        },
        {
          url: 'img/bcb15886-5db6-40e3-8b55-c83754e7e3af.JPG',
          caption: '04 / Nighttime Site Supervision & Lighting Calibration',
        },
      ],
    },
    '07': {
      code: 'EXECUTED PROJECT // 07',
      category: 'INTERNATIONAL RETAIL & PAVILIONS',
      title: 'Armani Exchange & Commercial Pavilions',
      location: 'Mall of Egypt, City Centre Almaza & Cairo Exhibition Grounds',
      area: 'Flagship Retail & Double-Height Pavilions',
      scope: 'Turnkey Retail Fit-Out, Structural Steel Pavilions & Brand Display Systems',
      materials: 'Structural Blackened Steel, Backlit Acrylic & LED Signage, Custom Display Systems',
      highlights:
        'Two Armani Exchange retail branches alongside double-height structural steel exhibition pavilions with integrated LED fascias.',
      desc: 'International fashion retail boutiques at Mall of Egypt and City Centre Almaza paired with double-height steel exhibition pavilions.',
      images: [
        {
          url: 'img/a14b960b-8bcd-44b1-a2dc-016d12cf1249.JPG',
          caption: '01 / Double-Height Architectural Steel Pavilion & Integrated LED Fascia',
        },
        {
          url: 'img/1e649e89-fd9a-4191-9bf1-112d8d5127d3.JPG',
          caption: '02 / Cantilevered Display Volumes & Backlit Showcase Alcoves',
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
      code: 'EXECUTED PROJECT // 08',
      category: 'F&B / HOSPITALITY COLLECTION',
      title: "Ted's Restaurant, 7 Seeds Cafe & Orchid Café",
      location: 'Mall of Egypt, Capital Business Park & Karma 4 (Sheikh Zayed)',
      area: '3 Signature Hospitality Venues',
      scope: 'Site Execution, Custom Millwork, Botanical Columns & MEP Coordination',
      materials: 'Botanical Timber Columns, Tufted Velvet Banquettes, Brick Ovens, Brass Chandeliers',
      highlights:
        'Sculptural wave ceiling ribs, brick pizza oven masonry, steel & glass facades, and integrated vertical greenery across three venues.',
      desc: "Turnkey execution of three hospitality destinations blending warm timber ribs, artisan masonry, and custom velvet seating.",
      images: [
        {
          url: 'img/b0cf99fa-1b91-4478-b5b4-c169307c188e.JPG',
          caption: "01 / Ted's Restaurant by Mori Co. (Mall of Egypt) — Steel & Glass Facade",
        },
        {
          url: 'img/a4e04587-ff80-4f78-a5c3-955ff97767da.JPG',
          caption: '02 / 7 Seeds Cafe (Capital Business Park) — Velvet Seating & Planters',
        },
        {
          url: 'img/c5d4cb1e-c9b6-4a50-af5f-4d1b4f5ec163.JPG',
          caption: '03 / Orchid Café (Karma 4, Zayed City) — Botanical Timber Columns',
        },
        {
          url: 'img/63f37956-0a71-430d-b6ac-32ab0f0feaa1.JPG',
          caption: '04 / Wave Ceiling Ribs, Brick Pizza Oven & Patterned Tile Inlays',
        },
      ],
    },
    '09': {
      code: 'EXECUTED PROJECT // 09',
      category: 'F&B / MULTI-BRANCH ROLLOUT',
      title: "Casper & Gambini's, Mori Sushi & Garnell Sushi",
      location: 'Open Air Mall (Madinaty), North Coast & Capital Business Park',
      area: 'Multi-Branch Hospitality Execution',
      scope: 'Site Execution, Shop Drawings, Bar & Show Kitchen Fit-Out',
      materials: 'Fluted Oak Bar Counters, Blackened Steel Overhead Grids, Microcement, LED Grazing',
      highlights:
        'Fluted wood bar counters with suspended steel bulb grids, open sushi show kitchens with slatted hoods, and microcement monolith columns.',
      desc: "Multi-branch hospitality rollout across Madinaty, the North Coast, and Sheikh Zayed with custom bars and open show kitchens.",
      images: [
        {
          url: 'img/5cb2342b-3352-4652-b69c-3c02e0bf3184.JPG',
          caption: '01 / Main Hospitality Bar Counter, Fluted Wood Front & Bulb Grid',
        },
        {
          url: 'img/5ae3a896-9566-4b71-9dfa-10a99e400b00.JPG',
          caption: '02 / Industrial Steel Bar Framing & Warm Under-Counter Illumination',
        },
        {
          url: 'img/52a16a8f-8519-4b42-8c29-d7b70f6c8019.JPG',
          caption: '03 / Open Sushi & Show Kitchen Counter with Timber Slatted Hood',
        },
        {
          url: 'img/7a60bf9a-e5e4-4d7f-88b7-07196f6ed58b.JPG',
          caption: '04 / Microcement Monolith Columns & Vertical Oak Louver Lounge',
        },
      ],
    },
    '10': {
      code: 'EXECUTED PROJECT // 10',
      category: 'CORPORATE & DIPLOMATIC',
      title: 'Anghami Office Egypt & UNDP Headquarters',
      location: 'New Cairo & World Trade Center (Cairo)',
      area: 'Corporate HQ & Diplomatic Offices',
      scope: 'Interior Finishing, Acoustic Glass Partitions, Shop Drawings & MEP',
      materials: 'Frameless Double-Glazed Partitions, Walnut Shelving Dividers, Custom Murals, Marble',
      highlights:
        'Hand-drawn Cairo architectural wall mural, mesh ceilings, frameless acoustic glass boardrooms, and custom walnut shelving dividers.',
      desc: 'Creative corporate headquarters for Anghami Egypt in New Cairo and diplomatic offices for UNDP at Cairo World Trade Center.',
      images: [
        {
          url: 'img/f176b889-fc76-4cc1-a523-458cc54ec10e.JPG',
          caption: '01 / Anghami Office Egypt — Cairo Architectural Mural & Mesh Ceiling',
        },
        {
          url: 'img/3e1a6efb-d482-4621-8e24-08186c2d5739.JPG',
          caption: '02 / Executive Glass Boardroom & Custom Walnut Display Dividers',
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
      code: 'EXECUTED PROJECT // 11',
      category: 'BANKING & COMMERCIAL',
      title: 'Arab Bank, National Bank of Egypt & Al Ahly Sales Office',
      location: 'Mall of Egypt, 6th of October, El Mohandeseen & Sheikh Zayed',
      area: 'Banking Branches, Sales HQs & Opera City Mall',
      scope: 'Site Engineering, Security & MEP Systems, Marble & Glass Partitions',
      materials: 'Polished Marble Corridors, Vertical Walnut Fins, Frameless Glass, Corian Counters',
      highlights:
        'Honed stone banking corridors with vertical walnut fins, arched fluted-mirror washrooms, curved Corian reception desks, and Barrisol ceilings.',
      desc: 'Institutional banking and commercial fit-outs across Arab Bank, National Bank of Egypt, Al Ahly Sales Office, and Opera City Mall.',
      images: [
        {
          url: 'img/5d6790d6-beba-4478-992e-6cfa6052e06d.JPG',
          caption: '01 / Commercial Corridor, Honed Stone Flooring & Vertical Walnut Fins',
        },
        {
          url: 'img/5ffbf4dc-76af-47d7-97fd-0267c0795ec5.JPG',
          caption: '02 / Executive Washroom with Arched Fluted Mirrors & Vein-Cut Marble',
        },
        {
          url: 'img/01e60248-505b-4a05-a7c0-6751936a49ab.JPG',
          caption: '03 / Custom Curved Reception Counter & Minimalist Track Lighting',
        },
        {
          url: 'img/b28c0d4e-f4b2-4c94-b301-7fec873f5124.JPG',
          caption: '04 / Clinical & Commercial Suite with Circular Barrisol Ceiling',
        },
      ],
    },
    '12': {
      code: 'EXECUTED PROJECT // 12',
      category: 'PRIVATE RESIDENTIAL',
      title: 'Three-Stories Villa — Upville Compound',
      location: 'Upville Compound, Sheikh Zayed City',
      area: 'Three-Story Private Villa',
      scope: 'Turnkey Villa Finishing, Spiral Staircase, Marble Flooring & Woodwork',
      materials: 'Wrought Iron & Marble Spiral Staircase, Crema Marfil Marble, Fluted Oak Cladding',
      highlights:
        'Elliptical spiral staircase rising toward a natural skylight, Crema Marfil marble reception salons, fluted oak wall cladding, and book-matched walnut.',
      desc: 'Complete interior finishing of a three-story private villa anchored by an elliptical spiral staircase under a natural skylight.',
      images: [
        {
          url: 'img/0022578b-54ed-4393-b1c1-df706acd5b31.JPG',
          caption: '01 / Elliptical Spiral Staircase & Overhead Natural Skylight',
        },
        {
          url: 'img/11914c41-62dc-4c12-81df-91ee4f93145d.JPG',
          caption: '02 / Formal Reception Salon, Marble Border Inlays & Chandelier',
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
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalLocation = document.getElementById('modal-location');
  const modalArea = document.getElementById('modal-area');
  const modalAreaRow = document.getElementById('modal-area-row');
  const modalScope = document.getElementById('modal-scope');
  const modalMaterials = document.getElementById('modal-materials');
  const modalHighlights = document.getElementById('modal-highlights');
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
    if (modalCategory) modalCategory.textContent = data.category;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalLocation) modalLocation.textContent = data.location;
    if (modalArea) modalArea.textContent = data.area || '';
    if (modalAreaRow) modalAreaRow.style.display = data.area ? '' : 'none';
    if (modalScope) modalScope.textContent = data.scope;
    if (modalMaterials) modalMaterials.textContent = data.materials;
    if (modalHighlights) modalHighlights.textContent = data.highlights;

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

    if (el.classList.contains('ed-project-card')) {
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
    if (!modal || !modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeProjectModal();
    if (e.key === 'ArrowLeft') renderGallerySlide(activeImageIndex - 1);
    if (e.key === 'ArrowRight') renderGallerySlide(activeImageIndex + 1);
  });
})();
