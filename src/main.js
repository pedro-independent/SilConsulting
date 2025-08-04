import "./styles/style.css";

gsap.registerPlugin(SplitText, ScrollTrigger);

/* Menu Open  */
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const dropdownTrigger = document.querySelector(".dropdown-nav-link");
  const navServicesList = document.querySelector(".nav-services-list-wrap");
  const dropdownIcon = document.querySelector(".dropdown-nav-icon");
  const navItems = document.querySelectorAll(".nav-services-item");

  gsap.set(navServicesList, { height: "auto" });
  const servicesHeight = gsap.getProperty(navServicesList, "height");
  gsap.set(navServicesList, { height: 0 });

  gsap.set(navItems, { opacity: 0, y: 15 });

  const timeline = gsap.timeline({ paused: true, reversed: true });

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

/* Split Text */
// const splitConfig = {
//   lines: { duration: 0.8, stagger: 0.15 },
//   words: { duration: 0.6, stagger: 0.06 },
//   chars: { duration: 0.4, stagger: 0.01 },
// };

// function initMaskTextScrollReveal() {
//   document.querySelectorAll('[data-split="heading"]').forEach((heading) => {
//     const type = heading.dataset.splitReveal || "lines";
//     const typesToSplit =
//       type === "lines"
//         ? ["lines"]
//         : type === "words"
//         ? ["lines", "words"]
//         : ["lines", "words", "chars"];

//     SplitText.create(heading, {
//       type: typesToSplit.join(", "),
//       mask: "lines",
//       autoSplit: true,
//       linesClass: "line",
//       wordsClass: "word",
//       charsClass: "letter",
//       onSplit: function (instance) {
//         const targets = instance[type];
//         const config = splitConfig[type];
//         return gsap.from(targets, {
//           yPercent: 110,
//           duration: config.duration,
//           stagger: config.stagger,
//           ease: "expo.out",
//           scrollTrigger: {
//             trigger: heading,
//             start: "clamp(top 80%)",
//             once: true,
//           },
//         });
//       },
//     });
//   });
// }

// initMaskTextScrollReveal();

