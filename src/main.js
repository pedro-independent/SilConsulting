import './styles/style.css'

gsap.registerPlugin();

/* Menu Open  */
const dropdown = document.querySelector('.dropdown-nav-link');
const navbar = document.querySelector('.navbar');
const navServicesWrapper = document.querySelector('.nav-services-list-wrap');

// Set the initial state of the nav services wrapper using GSAP
gsap.set(navServicesWrapper, { display: "none", opacity: 0 });

function expandNavbar() {
    // Make the wrapper visible before animating it
    gsap.set(navServicesWrapper, { display: "flex" });

    // Animate both the navbar height and the wrapper's opacity at the same time
    gsap.to(navbar, {
        height: "13em",
        duration: 0.4,
        ease: "power2.out"
    });
    gsap.to(navServicesWrapper, {
        opacity: 1,
        duration: 0.3,
        delay: 0.2, 
        ease: "power2.out"
    });
}

function collapseNavbar() {
    gsap.to(navServicesWrapper, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            gsap.set(navServicesWrapper, { display: "none" });
        }
    });

    gsap.to(navbar, {
        height: "3em",
        duration: 0.4,
        ease: "power2.in"
    });
}

// Event Listeners
dropdown.addEventListener("mouseenter", expandNavbar);
navbar.addEventListener("mouseleave", collapseNavbar);