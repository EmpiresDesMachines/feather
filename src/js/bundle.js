import './lib/spriteSvg';
import gsap from 'gsap';
import barba from '@barba/core';

const animationEnter = (container) => {
  return gsap.to('.between-page', {
    y: '100%',
    delay: 0.5,
    duration: 1,
    ease: 'none',
  });
};

const animationLeave = (container) => {
  return gsap.to('.between-page', {
    y: '0%',
    duration: 1,
    ease: 'none',
  });
};

barba.init({
  transitions: [{
    name: 'void',
    once(data) {

      // preloader();
    },
    leave: (data) => animationLeave(data.current.container),
    enter(data) {
      animationEnter(data.next.container);
    },
    beforeEnter(data) {
      init();
    },
  }],
});

const logo = document.querySelector('.logo');
logo.addEventListener('click', event => {
  event.preventDefault();
  logo.classList.remove('is-void');
});
window.addEventListener('load', preloader);

function preloader() {
  const tl = gsap.timeline({ ease: 'power1.out' });
  tl
    .to('.preloader span', {
      y: '0%',
      duration: 1.2,
      stagger: 0.25,
    })
    .to('.preloader', {
      y: '-100%',
      duration: 0.8,
    }, '+=0.5');
}

init();

function init() {
  const moveButtons = document.querySelectorAll('.btn-scroll');
  const leftBtn = document.querySelector('.btn-scroll--left');
  const rightBtn = document.querySelector('.btn-scroll--right');
  let offset = 0;
  const cases = document.querySelector('.cases');

  if (document.documentElement.clientWidth > 650) {
    window.addEventListener('wheel', moveScreen);
    moveButtons.forEach(button => button.addEventListener('click', moveScreenToOneThird));
  }

  window.addEventListener('resize', () => {
    if (document.documentElement.clientWidth > 650) {
      window.addEventListener('wheel', moveScreen);
      moveButtons.forEach(button => button.addEventListener('click', moveScreenToOneThird));
    } else {
      window.removeEventListener('wheel', moveScreen);
      moveButtons.forEach(button => button.removeEventListener('click', moveScreenToOneThird));
      cases.style = '';
    }
  });

  function moveScreen(event) {
    if (!cases) {

      // throw new Error('no cases');
      return;
    }
    if (event.deltaY > 0) { // scroll down
      if (offset <= -200) {
        ended('right');
        return;
      }

      if (offset - 4 < -200) {
        offset = -200;
        gsap.to(cases, {
          xPercent: (offset),
          ease: 'none',
        });
        ended('right');
        return;
      }
      moveButtons.forEach(btn => btn.classList.remove('ended'));
      gsap.to(cases, {
        xPercent: (offset -= 4),
        ease: 'none',
      });
    }

    if (event.deltaY < 0) { // scroll up
      if (offset >= 0) {
        ended('left');
        return;
      }

      if (offset + 4 > 0) {
        offset = 0;
        gsap.to(cases, {
          xPercent: (offset),
          ease: 'none',
        });
        ended('left');
        return;
      }
      moveButtons.forEach(btn => btn.classList.remove('ended'));
      gsap.to(cases, {
        xPercent: (offset += 4),
        ease: 'none',
      });
    }
  }

  function moveScreenToOneThird(event) {
    if (event.currentTarget.classList.contains('btn-scroll--left')) {
      if (offset >= -33.33) {
        offset = 0;
        gsap.to(cases, {
          xPercent: (offset),
          ease: 'none',
        });
        ended('left');
      } else {
        moveButtons.forEach(btn => btn.classList.remove('ended'));
        gsap.to(cases, {
          xPercent: (offset += 33.33),
          ease: 'none',
        });
      }

    } else { // scroll right
      if (offset <= -166.67) {
        offset = -200;
        gsap.to(cases, {
          xPercent: (offset),
          ease: 'none',
        });
        ended('right');
      } else {
        moveButtons.forEach(btn => btn.classList.remove('ended'));
        gsap.to(cases, {
          xPercent: (offset -= 33.33),
          ease: 'none',
        });
      }
    }
  }

  function ended(dir) {
    dir === 'left'
      ? leftBtn.classList.add('ended')
      : rightBtn.classList.add('ended');
  }

  const outerWrapper = document.querySelector('.outer-wrapper');
  const allCases = document.querySelectorAll('.case');

  allCases.forEach(c => c.addEventListener('click', changePage));

  function changePage(event) {
    event.preventDefault();
    logo.classList.add('is-void');
    const bg = event.currentTarget.getAttribute('data-background');
    outerWrapper.setAttribute('style', 'background: url(img/' + bg + '.jpg) no-repeat 50% 50% / cover');
  }

  if (logo.classList.contains('is-void')) {
    document.querySelector('.logo__text').textContent = 'go back';
  } else {
    document.querySelector('.logo__text').textContent = 'Feather';
  }

}

const menuButtonContainer = document.querySelector('.menu');
const menuButtonHamburger = document.querySelector('.menu-btn');
const menuButtonText = document.querySelector('.menu-btn__text');
const overlay = document.querySelector('.overlay');
const menuContent = document.querySelector('.menu-content');

[overlay, menuContent, menuButtonContainer].forEach(el => el.addEventListener('wheel', (event) => {
  event.preventDefault();
  event.stopPropagation();
}));

overlay.addEventListener('click', closeMenu);
menuButtonContainer.addEventListener('click', toggleMenu);

function toggleMenu() {
  menuButtonHamburger.classList.toggle('is-active');
  if (menuButtonHamburger.classList.contains('is-active')) {
    openMenu();
  } else {
    closeMenu();
  }
}

function openMenu() {
  menuButtonContainer.removeEventListener('click', toggleMenu);
  document.body.classList.add('is-menu');
  menuButtonText.textContent = 'Close';
  const tl = gsap.timeline();
  tl
    .to(overlay, {
      x: '0%',
      duration: 1.2,
      ease: 'bounce.out',
    })
    .to(menuContent, {
      x: '0%',
      ease: 'none',
      onComplete: () => menuButtonContainer.addEventListener('click', toggleMenu),
    });
}

function closeMenu() {
  menuButtonContainer.removeEventListener('click', toggleMenu);
  menuButtonText.textContent = 'Menu';
  const tl = gsap.timeline({ ease: 'none' });
  tl
    .to(menuContent, { x: '100%' })
    .to(overlay, {
      x: '100%',
      duration: 0.6,
      onComplete: () => menuButtonContainer.addEventListener('click', toggleMenu),
    }, '-=0.6');

  menuButtonHamburger.classList.remove('is-active');
  document.body.classList.remove('is-menu');
}