import './styles/style.css'
import barba from '@barba/core'


console.log(barba);

gsap.registerPlugin();

/* Barba.JS */
const overlay = document.querySelector('.transition-overlay');

const animationLeave = (container) => {
  return gsap.timeline()
    .to(overlay, {
      opacity: 0.5,
      duration: 0.5,
      ease: 'power2.out'
    });
};

const animationEnter = (container) => {
  return gsap.timeline()
    .set(container, {
      y: '100vh',
      opacity: 1
    }) 
    .to(container, {
      y: '0vh',
      duration: 1,
      ease: 'power4.out'
    })
    .to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in'
    }, '-=0.5'); // overlap fade-out
};

barba.init({
  transitions: [{
    async leave({ current }) {
      await animationLeave(current.container);
    },
    async enter({ next }) {
      await animationEnter(next.container);
    }
  }]
});



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
