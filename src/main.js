import './styles/style.css'

gsap.registerPlugin();

/* Menu Open  */
const dropdown = document.querySelector('.dropdown-nav-link');
const navbar = document.querySelector('.navbar');
const navServicesWrapper = document.querySelector('.nav-services-list-wrap');

function expandNavbar() {
    gsap.to(navbar, {
        height: "13em",
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
            navServicesWrapper.style.display = "flex";
            gsap.fromTo(navServicesWrapper, 
                { opacity: 0 }, 
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );
        }
    });
}

function collapseNavbar() {
    gsap.to(navServicesWrapper, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            navServicesWrapper.style.display = "none";
            gsap.to(navbar, { height: "3em", duration: 0.4, ease: "power2.in" });
        }
    });
}

// Event Listeners
dropdown.addEventListener("mouseenter", expandNavbar);
navbar.addEventListener("mouseleave", collapseNavbar);
