import './styles/style.css'

gsap.registerPlugin();

/* Menu Open  */
document.addEventListener("DOMContentLoaded", function() {
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
            ease: "power2.inOut"
        })
        .to(navServicesList, {
            height: servicesHeight,
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut"
        }, "<")
        .to(dropdownIcon, {
            rotate: 0,
            duration: 0.3,
            ease: "power2.inOut"
        }, "<")

        .to(navItems, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.08,
            ease: "power2.out"
        }, "+=0.025");


    dropdownTrigger.addEventListener("mouseenter", () => timeline.play());
    navbar.addEventListener("mouseleave", () => timeline.reverse());
});