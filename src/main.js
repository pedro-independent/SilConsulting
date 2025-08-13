import "./styles/style.css";

gsap.registerPlugin(SplitText, ScrollTrigger);

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
      onEnter: () =>
        gsap.to(".navbar", { opacity: 0, yPercent: 50, duration: 0.3 }),
      onLeaveBack: () =>
        gsap.to(".navbar", { opacity: 1, yPercent: 0, duration: 0.3 }),
    },
  });
}

fadeNavbarOnFooter();

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



