import "./styles/style.css";

const page = document.body.dataset.page;

gsap.registerPlugin(SplitText, ScrollTrigger);


/* Reveal Content on Scroll */
function initContentRevealScroll(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = gsap.context(() => {

    document.querySelectorAll('[data-reveal-group]').forEach(groupEl => {
      // Config from attributes or defaults (group-level)
      const groupStaggerSec = (parseFloat(groupEl.getAttribute('data-stagger')) || 100) / 1000; // ms → sec
      const groupDistance = groupEl.getAttribute('data-distance') || '2em';
      const triggerStart = groupEl.getAttribute('data-start') || 'top 80%';

      const animDuration = 0.8;
      const animEase = "power4.inOut";

      // Reduced motion: show immediately
      if (prefersReduced) {
        gsap.set(groupEl, { clearProps: 'all', y: 0, autoAlpha: 1 });
        return;
      }

      // If no direct children, animate the group element itself
      const directChildren = Array.from(groupEl.children).filter(el => el.nodeType === 1);
      if (!directChildren.length) {
        gsap.set(groupEl, { y: groupDistance, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: groupEl,
          start: triggerStart,
          once: true,
          onEnter: () => gsap.to(groupEl, { 
            y: 0, 
            autoAlpha: 1, 
            duration: animDuration, 
            ease: animEase,
            onComplete: () => gsap.set(groupEl, { clearProps: 'all' })
          })
        });
        return;
      }

      // Build animation slots: item or nested (deep layers allowed)
      const slots = [];
      directChildren.forEach(child => {
        const nestedGroup = child.matches('[data-reveal-group-nested]')
          ? child
          : child.querySelector(':scope [data-reveal-group-nested]');

        if (nestedGroup) {
          const includeParent = child.getAttribute('data-ignore') === 'false' || nestedGroup.getAttribute('data-ignore') === 'false';
          slots.push({ type: 'nested', parentEl: child, nestedEl: nestedGroup, includeParent });
        } else {
          slots.push({ type: 'item', el: child });
        }
      });

      // Initial hidden state
      slots.forEach(slot => {
        if (slot.type === 'item') {
          // If the element itself is a nested group, force group distance (prevents it from using its own data-distance)
          const isNestedSelf = slot.el.matches('[data-reveal-group-nested]');
          const d = isNestedSelf ? groupDistance : (slot.el.getAttribute('data-distance') || groupDistance);
          gsap.set(slot.el, { y: d, autoAlpha: 0 });
        } else {
          // Parent follows the group's distance when included, regardless of nested's data-distance
          if (slot.includeParent) gsap.set(slot.parentEl, { y: groupDistance, autoAlpha: 0 });
          // Children use nested group's own distance (fallback to group distance)
          const nestedD = slot.nestedEl.getAttribute('data-distance') || groupDistance;
          Array.from(slot.nestedEl.children).forEach(target => gsap.set(target, { y: nestedD, autoAlpha: 0 }));
        }
      });

      // Extra safety: if a nested parent is included, re-assert its distance to the group's value
      slots.forEach(slot => {
        if (slot.type === 'nested' && slot.includeParent) {
          gsap.set(slot.parentEl, { y: groupDistance }); 
        }
      });

      // Reveal sequence
      ScrollTrigger.create({
        trigger: groupEl,
        start: triggerStart,
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          slots.forEach((slot, slotIndex) => {
            const slotTime = slotIndex * groupStaggerSec;

            if (slot.type === 'item') {
              tl.to(slot.el, { 
                y: 0, 
                autoAlpha: 1, 
                duration: animDuration, 
                ease: animEase,
                onComplete: () => gsap.set(slot.el, { clearProps: 'all' })
              }, slotTime);
            } else {
              // Optionally include the parent at the same slot time (parent uses group distance)
              if (slot.includeParent) {
                tl.to(slot.parentEl, {
                  y: 0,
                  autoAlpha: 1,
                  duration: animDuration,
                  ease: animEase,
                  onComplete: () => gsap.set(slot.parentEl, { clearProps: 'all' })
                }, slotTime);
              }
              // Nested children use nested stagger (ms → sec); fallback to group stagger
              const nestedMs = parseFloat(slot.nestedEl.getAttribute('data-stagger'));
              const nestedStaggerSec = isNaN(nestedMs) ? groupStaggerSec : nestedMs / 1000;
              Array.from(slot.nestedEl.children).forEach((nestedChild, nestedIndex) => {
                tl.to(nestedChild, { 
                  y: 0, 
                  autoAlpha: 1, 
                  duration: animDuration, 
                  ease: animEase,
                  onComplete: () => gsap.set(nestedChild, { clearProps: 'all' })
                }, slotTime + nestedIndex * nestedStaggerSec);
              });
            }
          });
        }
      });
    });

  });

  return () => ctx.revert();
}

document.addEventListener("DOMContentLoaded", () =>{
  initContentRevealScroll();
})

/* Menu Open  */
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const dropdownTrigger = document.querySelector(".dropdown-nav-link");
  const navServicesList = document.querySelector(".nav-services-list-wrap");
  const dropdownIcon = document.querySelector(".dropdown-nav-icon");
  const navItems = document.querySelectorAll(".nav-services-item");
  const darkBg = document.querySelector(".dark-bg");

  gsap.set(navServicesList, { height: "auto" });
  const servicesHeight = gsap.getProperty(navServicesList, "height");
  gsap.set(navServicesList, { height: 0 });

  gsap.set(navItems, { opacity: 0, y: 15 });

  const timeline = gsap.timeline({
    paused: true,
    reversed: true,
    onStart: () => darkBg.classList.add("active"),
    onReverseComplete: () => darkBg.classList.remove("active"),
  });

  timeline
    .to(navbar, {
      height: `+=${servicesHeight}`,
      duration: 0.4,
      ease: "power2.inOut",
    })
    .to(
      navServicesList,
      {
        height: servicesHeight,
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut",
      },
      "<"
    )
    .to(
      dropdownIcon,
      {
        rotate: 0,
        duration: 0.3,
        ease: "power2.inOut",
      },
      "<"
    )
    .to(
      navItems,
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.08,
        ease: "power2.out",
      },
      "+=0.025"
    );

  dropdownTrigger.addEventListener("mouseenter", () => timeline.play());
  navbar.addEventListener("mouseleave", () => timeline.reverse());
});

/* Hide menu after footer */
function fadeNavbarOnFooter() {
  gsap.to(".navbar", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top bottom",
      end: "top top+=100",
      scrub: true,
      onEnter: () => {
        // Animate hide, then set display to none after
        gsap.to(".navbar", {
          opacity: 0,
          yPercent: 50,
          duration: 0.3,
          onComplete: () => {
            gsap.set(".navbar", { display: "none" });
          }
        });
      },
      onLeaveBack: () => {
        // Set display to flex before showing
        gsap.set(".navbar", { display: "flex" });
        gsap.to(".navbar", {
          opacity: 1,
          yPercent: 0,
          duration: 0.3
        });
      }
    }
  });
}

fadeNavbarOnFooter();


if (page === "services") {
/* Services opacity on scroll */
gsap.set(".process-item", { opacity: 0.3 });

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".process-container",
    start: "top center",
    end: "bottom center",
    //end: "+=300%", // enough space for 3 items
    //pin: true,
    scrub: true
  }
});

gsap.utils.toArray(".process-item").forEach((item) => {
  tl.to(item, { opacity: 1, duration: 1 })
    .to(item, { opacity: 0.3, duration: 1 }, "+=0.5");
});
}

if (page === "about") {

const items = gsap.utils.toArray(".certificate-item");

// initial stacked state
items.forEach((item, i) => {
  gsap.set(item, {
    scale: 1 - i * 0.05,      
    y: 0,                     // all stacked in same place
    zIndex: items.length - i,
    transformOrigin: "center top"
  });
});

// animate on scroll
gsap.to(items.slice(1), { // skip the first card so it stays fixed
  scale: 1,
  y: (i) => (i + 1) * 110,  // move each card further down as it reveals
  stagger: -0.06,
  ease: "power1.out",
  scrollTrigger: {
    trigger: ".certificate-list-wrapper",
    start: "top center",
    end: "bottom center",
    scrub: 1,
  }
});

}

if (page === "legal") {
/* Legal Pages Anchor Menu */
  document.addEventListener("DOMContentLoaded", function () {
    const richText = document.querySelector(".legal-text");
    const anchorMenu = document.querySelector(".legal-sticky-nav");

    if (!richText || !anchorMenu) return;

    // Clear any existing menu items (in case of rerender)
    anchorMenu.innerHTML = "";

    const headings = richText.querySelectorAll("h2");
    const usedIds = new Set(); // To ensure uniqueness

    headings.forEach((heading, index) => {
      // Generate a slug from the heading text
      let slug = heading.textContent
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')        // Remove punctuation
        .replace(/\s+/g, '-')            // Replace spaces with hyphens
        .replace(/-+/g, '-');            // Remove duplicate hyphens

      // Ensure ID is unique by appending a number if needed
      let uniqueSlug = slug;
      let counter = 1;
      while (usedIds.has(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter++}`;
      }
      usedIds.add(uniqueSlug);

      heading.id = uniqueSlug;

      // Create link element
      const link = document.createElement("a");
      link.href = `#${uniqueSlug}`;
      link.textContent = heading.textContent;
      link.classList.add("anchor-link"); // Optional styling class

      anchorMenu.appendChild(link);
    });
  });
}