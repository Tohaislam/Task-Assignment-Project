

(function ($) {
  "use strict";

  var windowOn = $(window);
  let mm = gsap.matchMedia();

  // sticky header
  function pinned_header() {
    var lastScrollTop = 500;

    windowOn.on('scroll', function () {
      var currentScrollTop = $(this).scrollTop();

      if (currentScrollTop > lastScrollTop) {
        $('.header-sticky').removeClass('sticky');
        $('.header-sticky').addClass('transformed');
      } else if ($(this).scrollTop() <= 500) {
        $('.header-sticky').removeClass('sticky');
        $('.header-sticky').removeClass('transformed');
      } else {
        $('.header-sticky').addClass('sticky');
        $('.header-sticky').removeClass('transformed');
      }
      lastScrollTop = currentScrollTop;
    });
  }
  pinned_header();




  // Smooth active
  var device_width = window.screen.width;

  if (device_width > 767) {
    if (document.querySelector("#has_smooth").classList.contains("has-smooth")) {
      const smoother = ScrollSmoother.create({
        smooth: 0.9,
        effects: device_width < 1025 ? false : true,
        smoothTouch: 0.1,
        normalizeScroll: {
          allowNestedScroll: true,
        },
        ignoreMobileResize: true,
      });
    }

  }


  // Modern Preloader with GSAP
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const percent = preloader.querySelector('.preloader__percent');
    const panels = preloader.querySelectorAll('.preloader__panel');
    const content = preloader.querySelector('.preloader__content');

    const tl = gsap.timeline();

    // Percentage counter
    let count = { value: 0 };
    tl.to(count, {
      value: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (percent) percent.textContent = Math.floor(count.value);
      }
    });

    // Content fade out
    tl.to(content, {
      y: -40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut"
    });

    // Panel sliding animation
    tl.to(panels, {
      yPercent: -100,
      duration: 1,
      stagger: 0.1,
      ease: "expo.inOut",
      onComplete: () => {
        preloader.style.display = 'none';
        preloader.remove();
      }
    }, "-=0.4");

    // Main content reveal
    tl.from('#smooth-wrapper', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    }, "-=0.8");

    // Safety fallback: Force remove preloader after 5s if still present
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 1,
          ease: "expo.inOut",
          onComplete: () => preloader.remove()
        });
      }
    }, 5000);
  });


  // nice select activation 
  $('select').niceSelect();

  // Side Info Js (Modern GSAP)
  $(".side-toggle").on("click", function () {
    $(".side-info").addClass("info-open");
    $(".offcanvas-overlay").addClass("overlay-open");

    // GSAP Staggered Entrance
    gsap.fromTo(".side-info__item",
      {
        y: 40,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.4 // Wait for sidebar slide
      }
    );
  });

  $(".side-info-close, .offcanvas-overlay").on("click", function () {
    $(".side-info").removeClass("info-open");
    $(".offcanvas-overlay").removeClass("overlay-open");

    // Reset items for next time
    gsap.to(".side-info__item", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in"
    });
  });


  // meanmenu activation 
  $('.main-menu').meanmenu({
    meanScreenWidth: "1199",
    meanMenuContainer: '.mobile-menu',
    meanMenuCloseSize: '28px',
  });



  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);



  // Counter active
  if ('counterUp' in window) {
    const skill_counter = window.counterUp.default
    const skill_cb = entries => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting && !el.classList.contains('odometer-initialized')) {
          const finalValue = el.getAttribute('data-final') || parseFloat(el.innerText.replace(/[^0-9.]/g, ''));

          if (finalValue !== null && !isNaN(finalValue)) {
            const od = new Odometer({
              el: el,
              value: 0,
              format: '', // Default format
              theme: 'default'
            });
            od.update(finalValue);
            el.classList.add('odometer-initialized');
          }
        }
      })
    }

    const IO = new IntersectionObserver(skill_cb, {
      threshold: 1
    })

    const els = document.querySelectorAll('.odometer-num');
    els.forEach((el) => {
      IO.observe(el)
    });
  }

  // Magnific Video popup
  if ($('.video-popup').length && 'magnificPopup' in jQuery) {
    $('.video-popup').magnificPopup({
      type: 'iframe',
    });
  }



  // featured-works slider
  if (document.querySelector('.featured-works__slider')) {
    var featured_works_slider = new Swiper('.featured-works__slider', {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      slidesPerView: 2,
      spaceBetween: 32,
      speed: 1000,
      grabCursor: true,
      centeredSlides: true,

      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 1,
          spaceBetween: 20,
          centeredSlides: false,
        },
        1200: {
          slidesPerView: 2,
          spaceBetween: 32,
        },
      },
      on: {
        slideChangeTransitionStart: function () {
          // Premium entrance for prev/next slides
          gsap.to(".swiper-slide-prev .featured-works__item", {
            x: -40,
            rotation: -3,
            skewX: -1,
            duration: 1.2,
            ease: "power3.out"
          });
          gsap.to(".swiper-slide-next .featured-works__item", {
            x: 40,
            rotation: 3,
            skewX: 1,
            duration: 1.2,
            ease: "power3.out"
          });
          gsap.to(".swiper-slide-active .featured-works__item", {
            x: 0,
            rotation: 0,
            skewX: 0,
            duration: 1.2,
            ease: "power3.out"
          });
        },
        slideChange: function () {
          const activeSlide = this.slides[this.activeIndex];
          if (!activeSlide) return;

          const subtitle = activeSlide.getAttribute('data-subtitle');
          const name = activeSlide.getAttribute('data-name');
          const tag1 = activeSlide.getAttribute('data-tag1');
          const tag2 = activeSlide.getAttribute('data-tag2');
          const index = activeSlide.getAttribute('data-index');

          // Left Content Update
          if (document.querySelector(".featured-works__subtitle")) {
            gsap.to(".featured-works__content--left .featured-works__info", {
              opacity: 0,
              y: -20,
              duration: 0.3,
              ease: "power2.in",
              onComplete: () => {
                document.querySelector(".featured-works__subtitle").textContent = subtitle;
                document.querySelector(".featured-works__name").textContent = name;
                gsap.to(".featured-works__content--left .featured-works__info", {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power2.out"
                });
              }
            });
          }

          // Right Content Update
          if (document.querySelector(".featured-works__counter")) {
            gsap.to(".featured-works__content--right .featured-works__info", {
              opacity: 0,
              y: 20,
              duration: 0.3,
              ease: "power2.in",
              onComplete: () => {
                document.querySelector(".featured-works__counter").innerHTML = `${index}<span>/06</span>`;
                const tags = document.querySelectorAll(".featured-works__tag");
                if (tags[0]) tags[0].textContent = tag1;
                if (tags[1]) tags[1].textContent = tag2;
                gsap.to(".featured-works__content--right .featured-works__info", {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power2.out"
                });
              }
            });
          }
        }
      }
    });
  }

  // services slider
  if (document.querySelector('.services__slider')) {
    var services_slider = new Swiper('.services__slider', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 1500,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      on: {
        slideChangeTransitionStart: function () {
          const activeSlide = this.slides[this.activeIndex];
          if (!activeSlide) return;

          // 1. Tags Staggered Pop-in
          const tags = activeSlide.querySelectorAll(".services__tag");
          gsap.fromTo(tags,
            { opacity: 0, scale: 0.7, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "back.out(2)", delay: 0.4 }
          );

          // 2. Small Images Fade + Scale
          const subThumbs = activeSlide.querySelectorAll(".services__sub-thumb");
          gsap.fromTo(subThumbs,
            { opacity: 0, scale: 0.8, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
          );

          // 3. CTA Button Bounce Effect
          const ctaBtn = activeSlide.querySelector(".theme-btn-secondary");
          if (ctaBtn) {
            gsap.fromTo(ctaBtn,
              { opacity: 0, scale: 0.8, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.6)", delay: 0.8 }
            );
          }

          // 4. Main Thumb Reveal from Left to Right
          const mainThumb = activeSlide.querySelector(".services__main-thumb");
          if (mainThumb) {
            gsap.fromTo(mainThumb,
              { clipPath: "inset(0 100% 0 0)" },
              { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power3.inOut" }
            );
          }
        }
      }
    });
  }






  // Featured Works Animation
  if (document.querySelectorAll(".featured-works").length > 0) {
    // Section Header Animation
    gsap.from(".featured-works__header", {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".featured-works",
        start: "top 80%",
      }
    });

    // Slider Entrance Animation (Desktop)
    mm.add("(min-width: 1200px)", () => {
      const slides = gsap.utils.toArray(".featured-works__slider .swiper-slide");

      // Left Content Overlay & First Slide
      gsap.from(".featured-works__content--left", {
        x: -150,
        opacity: 0,
        rotation: -5,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".featured-works",
          start: "top 70%",
        }
      });
      if (slides[0]) {
        gsap.from(slides[0], {
          x: -150,
          opacity: 0,
          rotation: -5,
          skewX: -5,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".featured-works",
            start: "top 70%",
          }
        });
      }

      // Center Slide (Main Highlight)
      if (slides[1]) {
        gsap.from(slides[1], {
          scale: 0.7,
          opacity: 0,
          duration: 1.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".featured-works",
            start: "top 70%",
          }
        });
      }

      // Right Content Overlay & Third Slide
      gsap.from(".featured-works__content--right", {
        x: 150,
        opacity: 0,
        rotation: 5,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".featured-works",
          start: "top 70%",
        }
      });
      if (slides[2]) {
        gsap.from(slides[2], {
          x: 150,
          opacity: 0,
          rotation: 5,
          skewX: 5,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".featured-works",
            start: "top 70%",
          }
        });
      }
    });

    // Project Card Reveal Animation
    gsap.utils.toArray(".featured-works__item").forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        scale: 0.9,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      });
    });

    // Hover Parallax Effect for Cards
    const cards = document.querySelectorAll(".featured-works__item");
    cards.forEach(card => {
      const img = card.querySelector("img");

      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out"
        });
      });

      card.addEventListener("mousemove", (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(img, {
          x: x * 30, // Increased movement for better parallax
          y: y * 30,
          scale: 1.15,
          duration: 0.6,
          ease: "power2.out"
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        });
        gsap.to(img, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      });
    });
  }



  // Image Reveal Animation
  let img_anim_reveal = document.querySelectorAll(".img_anim_reveal");

  img_anim_reveal.forEach((img_reveal) => {
    let image = img_reveal.querySelector("img");
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: img_reveal,
        start: "top 50%",
      }
    });

    tl.set(img_reveal, { autoAlpha: 1 });
    tl.from(img_reveal, 1.5, {
      yPercent: -100,
      ease: Power2.out
    });
    tl.from(image, 1.5, {
      yPercent: 100,
      scale: 1.3,
      delay: -1.5,
      ease: Power2.out
    });
  });


  // CTA Section  Animation
  if (document.querySelector(".cta")) {
    //  Whole section fade-in with blur reduction
    gsap.from(".cta", {
      opacity: 0,
      filter: "blur(30px)",
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".cta",
        start: "top 80%",
      }
    });



    //. Floating Parallax for shapes (Scrub effect)
    gsap.to(".cta__shape", {
      y: (i, el) => -50 - (i * 20),
      x: (i, el) => (i % 2 === 0 ? 30 : -30),
      rotate: (i, el) => (i % 2 === 0 ? 10 : -10),
      scrollTrigger: {
        trigger: ".cta",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });

    // Content Reveal Stagger (subtitle & contact)
    gsap.from([".cta__subtitle-wrap", ".cta__contact-info", ".cta__btn-wrap"], {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".cta__content",
        start: "top 80%",
      }
    });
  }



  // stacking item with header
  if (document.querySelectorAll(".header-stacking-items").length > 0) {
    mm.add("(min-width: 991px)", () => {
      const items = gsap.utils.toArray(".item");

      items.forEach((item, i) => {
        const content = item.querySelector(".body");
        const header = item.querySelector(".header");
        gsap.to(content, {
          height: 0,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top " + header.clientHeight * i,
            endTrigger: ".final",
            end: "top " + header.clientHeight * items.length,
            pin: true,
            pinSpacing: false,
            scrub: true,
          }
        });
      });
    });
  }




  // stacking item with scale
  if (document.querySelectorAll(".pin-panel").length > 0) {
    mm.add("(min-width: 991px)", () => {
      let tl = gsap.timeline();
      let scaleItem = document.querySelectorAll('.pin-panel')

      scaleItem.forEach((item, index) => {

        gsap.set(scaleItem, {
          scale: 1
        });

        tl.to(item, {
          scale: .8,
          scrollTrigger: {
            trigger: item,
            pin: item,
            scrub: 1,
            start: 'top 10%',
            end: "bottom 90%",
            endTrigger: '.footer1',
            pinSpacing: false,
            markers: false,
          },
        })
      })
    });
  }


  // hover move btn 
  const all_btn = gsap.utils.toArray(".btn-move");
  const all_btn_cirlce = gsap.utils.toArray(".btn-item");

  all_btn.forEach((btn, i) => {
    $(btn).mousemove(function (e) {
      callParallax(e);
    });
    function callParallax(e) {
      parallaxIt(e, all_btn_cirlce[i], 80);
    }

    function parallaxIt(e, target, movement) {
      var $this = $(btn);
      var relX = e.pageX - $this.offset().left;
      var relY = e.pageY - $this.offset().top;

      gsap.to(target, 0.3, {
        x: ((relX - $this.width() / 2) / $this.width()) * movement,
        y: ((relY - $this.height() / 2) / $this.height()) * movement,
        scale: 1.1,
        ease: Power2.easeOut,
      });
    }
    $(btn).mouseleave(function (e) {
      gsap.to(all_btn_cirlce[i], 0.3, {
        x: 0,
        y: 0,
        scale: 1,
        ease: Power2.easeOut,
      });
    });
  });



  // GSAP Fade Animation 
  let fadeArray_items = document.querySelectorAll(".fade-anim");
  if (fadeArray_items.length > 0) {
    const fadeArray = gsap.utils.toArray(".fade-anim")
    // gsap.set(fadeArray, {opacity:0})
    fadeArray.forEach((item, i) => {

      var fade_direction = "bottom"
      var onscroll_value = 1
      var duration_value = 1.15
      var fade_offset = 50
      var delay_value = 0.15
      var ease_value = "power2.out"

      if (item.getAttribute("data-offset")) {
        fade_offset = item.getAttribute("data-offset");
      }
      if (item.getAttribute("data-duration")) {
        duration_value = item.getAttribute("data-duration");
      }

      if (item.getAttribute("data-direction")) {
        fade_direction = item.getAttribute("data-direction");
      }
      if (item.getAttribute("data-on-scroll")) {
        onscroll_value = item.getAttribute("data-on-scroll");
      }
      if (item.getAttribute("data-delay")) {
        delay_value = item.getAttribute("data-delay");
      }
      if (item.getAttribute("data-ease")) {
        ease_value = item.getAttribute("data-ease");
      }

      let animation_settings = {
        opacity: 0,
        ease: ease_value,
        duration: duration_value,
        delay: delay_value,
      }

      if (fade_direction == "top") {
        animation_settings['y'] = -fade_offset
      }
      if (fade_direction == "left") {
        animation_settings['x'] = -fade_offset;
      }

      if (fade_direction == "bottom") {
        animation_settings['y'] = fade_offset;
      }

      if (fade_direction == "right") {
        animation_settings['x'] = fade_offset;
      }

      if (onscroll_value == 1) {
        animation_settings['scrollTrigger'] = {
          trigger: item,
          start: 'top 85%',
        }
      }
      gsap.from(item, animation_settings);
    })
  }


  /////////////////////////////////////////////////////
  let text_animation = gsap.utils.toArray(".move-anim");

  if (text_animation) {
    text_animation.forEach(splitTextLine => {
      var delay_value = 0.1
      if (splitTextLine.getAttribute("data-delay")) {
        delay_value = splitTextLine.getAttribute("data-delay");
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: 'top 85%',
          duration: 1,
          scrub: false,
          markers: false,
          toggleActions: 'play none none none'
        }
      });

      const itemSplitted = new SplitText(splitTextLine, {
        type: "lines"
      });
      gsap.set(splitTextLine, {
        perspective: 400
      });
      itemSplitted.split({
        type: "lines"
      })
      tl.from(itemSplitted.lines, {
        duration: 1,
        delay: delay_value,
        opacity: 0,
        rotationX: -80,
        force3D: true,
        transformOrigin: "top center -50",
        stagger: 0.1
      });
    });
  }

  // Animation Word
  let animation_word_anim_items = document.querySelectorAll(".word-anim");

  animation_word_anim_items.forEach((word_anim_item) => {

    var stagger_value = 0.04
    var translateX_value = false
    var translateY_value = false
    var onscroll_value = 1
    var data_delay = 0.1
    var data_duration = 0.75

    if (word_anim_item.getAttribute("data-stagger")) {
      stagger_value = word_anim_item.getAttribute("data-stagger");
    }
    if (word_anim_item.getAttribute("data-translateX")) {
      translateX_value = word_anim_item.getAttribute("data-translateX");
    }

    if (word_anim_item.getAttribute("data-translateY")) {
      translateY_value = word_anim_item.getAttribute("data-translateY");
    }

    if (word_anim_item.getAttribute("data-on-scroll")) {
      onscroll_value = word_anim_item.getAttribute("data-on-scroll");
    }
    if (word_anim_item.getAttribute("data-delay")) {
      data_delay = word_anim_item.getAttribute("data-delay");
    }
    if (word_anim_item.getAttribute("data-duration")) {
      data_duration = word_anim_item.getAttribute("data-duration");
    }

    if (onscroll_value == 1) {
      if (translateX_value && !translateY_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: data_duration,
          x: translateX_value,
          autoAlpha: 0,
          stagger: stagger_value,
          delay: data_delay,
          scrollTrigger: {
            trigger: word_anim_item,
            start: 'top 90%'
          }
        });
      }

      if (translateY_value && !translateX_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          y: translateY_value,
          autoAlpha: 0,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: word_anim_item,
            start: 'top 90%'
          }
        });
      }

      if (translateY_value && translateX_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: translateX_value,
          y: translateY_value,
          autoAlpha: 0,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: word_anim_item,
            start: 'top 90%'
          }
        });
      }

      if (!translateX_value && !translateY_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: 20,
          autoAlpha: 0,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: word_anim_item,
            start: 'top 85%',
          }
        });
      }
    } else {
      if (translateX_value > 0 && !translateY_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: translateX_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }

      if (translateY_value > 0 && !translateX_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          y: translateY_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }

      if (translateY_value > 0 && translateX_value > 0) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: translateX_value,
          y: translateY_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }

      if (!translateX_value && !translateY_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: 20,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }

    }

  });


  // Animation Character
  var animation_char_come_items = document.querySelectorAll(".char-anim")
  animation_char_come_items.forEach((item) => {

    var stagger_value = 0.05
    var translateX_value = 20
    var translateY_value = false
    var onscroll_value = 1
    var data_delay = 0.1
    var data_duration = 1
    var ease_value = "power2.out"

    if (item.getAttribute("data-stagger")) {
      stagger_value = item.getAttribute("data-stagger");
    }
    if (item.getAttribute("data-translateX")) {
      translateX_value = item.getAttribute("data-translateX");
    }
    if (item.getAttribute("data-translateY")) {
      translateY_value = item.getAttribute("data-translateY");
    }
    if (item.getAttribute("data-on-scroll")) {
      onscroll_value = item.getAttribute("data-on-scroll");
    }
    if (item.getAttribute("data-delay")) {
      data_delay = item.getAttribute("data-delay");
    }
    if (item.getAttribute("data-ease")) {
      ease_value = item.getAttribute("data-ease");
    }
    if (item.getAttribute("data-duration")) {
      data_duration = item.getAttribute("data-duration");
    }

    if (onscroll_value == 1) {
      if (translateX_value > 0 && !translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: data_duration,
          delay: data_delay,
          x: translateX_value,
          autoAlpha: 0,
          stagger: stagger_value,
          ease: ease_value,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        });
      }
      if (translateY_value > 0 && !translateX_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: data_duration,
          delay: data_delay,
          y: translateY_value,
          autoAlpha: 0,
          ease: ease_value,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        });
      }
      if (translateX_value && translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 2,
          delay: data_delay,
          y: translateY_value,
          x: translateX_value,
          autoAlpha: 0,
          ease: ease_value,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        });
      }
      if (!translateX_value && !translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          x: 50,
          autoAlpha: 0,
          stagger: stagger_value,
          ease: ease_value,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        });
      }
    } else {
      if (translateX_value > 0 && !translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          x: translateX_value,
          ease: ease_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }
      if (translateY_value > 0 && !translateX_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          y: translateY_value,
          autoAlpha: 0,
          ease: ease_value,
          stagger: stagger_value
        });
      }
      if (translateX_value && translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          y: translateY_value,
          x: translateX_value,
          ease: ease_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }
      if (!translateX_value && !translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          ease: ease_value,
          x: 50,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }
    }

  });


  // typewritter text 
  if (document.querySelectorAll(".typewriter-text").length > 0) {

    typing(0, $('.typewriter-text').data('text'));

    function typing(index, text) {

      var textIndex = 1;

      var tmp = setInterval(function () {
        if (textIndex < text[index].length + 1) {
          $('.typewriter-text').text(text[index].substr(0, textIndex));
          textIndex++;
        } else {
          setTimeout(function () { deleting(index, text) }, 2000);
          clearInterval(tmp);
        }

      }, 150);

    }

    function deleting(index, text) {

      var textIndex = text[index].length;

      var tmp = setInterval(function () {

        if (textIndex + 1 > 0) {
          $('.typewriter-text').text(text[index].substr(0, textIndex));
          textIndex--;
        } else {
          index++;
          if (index == text.length) { index = 0; }
          typing(index, text);
          clearInterval(tmp);
        }

      }, 150)

    }
  }

  // button effect
  var mouse = { x: 0, y: 0 };
  var pos = { x: 0, y: 0 };
  var ratio = 0.65;
  var active = false;

  var allParalax = document.querySelectorAll('.parallax-wrap');

  allParalax.forEach(function (e) {
    e.addEventListener("mousemove", mouseMoveBtn);
  })

  function mouseMoveBtn(e) {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    mouse.x = e.pageX;
    mouse.y = e.pageY - scrollTop;

  }
  gsap.ticker.add(updatePosition);

  $(".parallax-wrap").mouseenter(function (e) {
    gsap.to(this, { duration: 0.3, scale: 2 });
    gsap.to($(this).children(), { duration: 0.3, scale: 0.5 });
    active = true;
  });

  $(".parallax-wrap").mouseleave(function (e) {
    gsap.to(this, { duration: 0.3, scale: 1 });
    gsap.to($(this).children(), { duration: 0.3, scale: 1, x: 0, y: 0 });
    active = false;
  });

  function updatePosition() {
    pos.x += (mouse.x - pos.x) * ratio;
    pos.y += (mouse.y - pos.y) * ratio;

  }


  $(".parallax-wrap").mousemove(function (e) {
    parallaxCursorBtn(e, this, 2);
    callParallaxBtn(e, this);
  });

  function callParallaxBtn(e, parent) {
    parallaxItBtn(e, parent, parent.querySelector(".parallax-element"), 20);
  }

  function parallaxItBtn(e, parent, target, movement) {
    var boundingRect = parent.getBoundingClientRect();
    var relX = e.pageX - boundingRect.left;
    var relY = e.pageY - boundingRect.top;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    gsap.to(target, {
      duration: 0.3,
      x: (relX - boundingRect.width / 2) / boundingRect.width * movement,
      y: (relY - boundingRect.height / 2 - scrollTop) / boundingRect.height * movement,
      ease: Power2.easeOut
    });
  }

  function parallaxCursorBtn(e, parent, movement) {
    var rect = parent.getBoundingClientRect();
    var relX = e.pageX - rect.left;
    var relY = e.pageY - rect.top;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
    pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2 - scrollTop) / movement;
  }

  // Pin Active
  var pin_fixed = document.querySelector('.pin-element');
  if (pin_fixed && device_width > 991) {

    gsap.to(".pin-element", {
      scrollTrigger: {
        trigger: ".pin-area",
        pin: ".pin-element",
        start: "top top",
        end: "bottom bottom",
        pinSpacing: false,
      }
    });
  }



  // Image Cliping Effect
  document.addEventListener("DOMContentLoaded", () => {
    const initialClipPaths = [
      "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
      "polygon(33.33% 0%, 33.33% 0%, 33.33% 0%, 33.33% 0%)",
      "polygon(65.66% 0%, 66.66% 0%, 66.66% 0%, 66.66% 0%)",
      "polygon(0% 33.33%, 0% 33.33%, 0% 33.33%, 0% 33.33%)",
      "polygon(33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%)",
      "polygon(65.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%)",
      "polygon(0% 66.66%, 0% 66.66%, 0% 66.66%, 0% 66.66%)",
      "polygon(33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%)",
      "polygon(65.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%)"
    ];
    const finalClipPaths = [
      "polygon(0% 0%, 34.33% 0%, 34.33% 34.33%, 0% 34.33%)",
      "polygon(32.33% 0%, 66.66% 0%, 66.66% 33.33%, 33.33% 34.33%)",
      "polygon(65.66% 0%, 100% 0%, 100% 33.33%, 65.66% 34.33%)",
      "polygon(0% 33.33%, 33.33% 33.33%, 33.33% 66.66%, 0% 66.66%)",
      "polygon(30.33% 33.33%, 66.66% 33.33%, 66.66% 66.66%, 33.33% 66.66%)",
      "polygon(65.66% 33.33%, 100% 32.33%, 100% 66.66%, 65.66% 66.66%)",
      "polygon(0% 65.66%, 33.33% 66.66%, 33.33% 100%, 0% 100%)",
      "polygon(30.33% 66.66%, 66.66% 65.66%, 66.66% 100%, 33.33% 100%)",
      "polygon(65.66% 66.66%, 100% 65.66%, 100% 100%, 65.66% 100%)"
    ];
    // Create mask divs for each wrapper
    document.querySelectorAll(".tw-clip-anim").forEach(wrapper => {
      const img = wrapper.querySelector(".tw-anim-img[data-animate='true']");
      if (!img) return;
      const url = img.src;
      // Remove old masks if any (reuse safe)
      wrapper.querySelectorAll(".mask").forEach(m => m.remove());
      for (let i = 0; i < 9; i++) {
        const mask = document.createElement("div");
        mask.className = `mask mask-${i + 1}`;
        Object.assign(mask.style, {
          backgroundImage: `url(${url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          inset: "0"
        });
        wrapper.appendChild(mask);
      }
    });
    // Animate masks
    gsap.utils.toArray(".tw-clip-anim").forEach(wrapper => {
      const masks = wrapper.querySelectorAll(".mask");
      if (!masks.length) return;
      gsap.set(masks, { clipPath: (i) => initialClipPaths[i] });
      const order = [
        [".mask-1"],
        [".mask-2", ".mask-4"],
        [".mask-3", ".mask-5", ".mask-7"],
        [".mask-6", ".mask-8"],
        [".mask-9"]
      ];
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapper, start: "top 75%" }
      });
      order.forEach((targets, i) => {
        const validTargets = targets
          .map(c => wrapper.querySelector(c))
          .filter(el => el); // filter out nulls

        if (validTargets.length) {
          tl.to(validTargets, {
            clipPath: (j, el) => finalClipPaths[Array.from(masks).indexOf(el)],
            duration: 1,
            ease: "power4.out",
            stagger: 0.1
          }, i * 0.125);
        }
      });
    });
  })

  // Parallax Effect for Buttons
  function parallaxEffect() {
    $(document).on("mousemove", ".parallax-wrap", function (e) {
      const wrapper = $(this);
      const target = wrapper.find(".parallax-target");
      const rect = wrapper[0].getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = x - centerX;
      const deltaY = y - centerY;

      gsap.to(target, {
        x: deltaX * 0.4,
        y: deltaY * 0.4,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    $(document).on("mouseleave", ".parallax-wrap", function () {
      const target = $(this).find(".parallax-target");
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    });
  }
  parallaxEffect();

  // CTA Mouse Parallax
  function ctaMouseParallax() {
    const ctaSection = document.querySelector('.cta');
    if (!ctaSection) return;

    ctaSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth) - .5;
      const yPos = (clientY / window.innerHeight) - .5;

      const shapes = ctaSection.querySelectorAll('.cta__shape-wrap .cta__shape--1, .cta__bg-shape');
      shapes.forEach((shape, index) => {
        const factor = (index + 1) * 30;
        gsap.to(shape, {
          x: xPos * factor,
          y: yPos * factor,
          duration: 2.5,
          ease: 'power2.out'
        });
      });
    });

    ctaSection.addEventListener('mouseleave', () => {
      const shapes = ctaSection.querySelectorAll('.cta__shape-wrap .cta__shape--1, .cta__bg-shape');
      shapes.forEach((shape) => {
        gsap.to(shape, {
          x: 0,
          y: 0,
          duration: 2.5,
          ease: 'power2.out'
        });
      });
    });
  }
  ctaMouseParallax();

  // CTA Continuous Floating & Glow
  function ctaContinuousAnim() {
    // 1. Floating images (Continuous Loop)
    gsap.utils.toArray(".cta__shape").forEach((shape, i) => {
      gsap.to(shape, {
        y: "+=25",
        x: "+=15",
        rotation: i % 2 === 0 ? 4 : -4,
        duration: 3 + i,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // 2. Background glow (Soft animated blur movement)
    gsap.to(".cta__shape-blur", {
      scale: 1.15,
      opacity: 0.4,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.6
    });
  }
  ctaContinuousAnim();

  // Mouse Follower  
  function mouseFollower() {
    const follower = document.querySelector(".mouse-follower .cursor-outline");
    const dot = document.querySelector(".mouse-follower .cursor-dot");
    if (!follower || !dot) return;

    window.addEventListener("mousemove", (e) => {
      follower.animate(
        [{ opacity: 1, left: `${e.clientX}px`, top: `${e.clientY}px`, easing: "ease-in-out" }],
        { duration: 800, fill: "forwards" }
      );
      dot.animate(
        [{ opacity: 1, left: `${e.clientX}px`, top: `${e.clientY}px`, easing: "ease-in-out" }],
        { duration: 500, fill: "forwards" }
      );
    });

    // Hide cursor on links & buttons
    $("a, button").on("mouseenter mouseleave", function () {
      $(".mouse-follower").toggleClass("hide-cursor");
    });

    // Magnify on headings
    var headings = $(".section-top__title");
    headings.on("mouseenter mouseleave", function () {
      $(".mouse-follower").toggleClass("highlight-cursor-head");
    });

    // Highlight on paragraphs
    $("p").on("mouseenter mouseleave", function () {
      $(".mouse-follower").toggleClass("highlight-cursor-para");
    });
  }
  mouseFollower();

  // Back to top progress
  function backToTopProgress() {
    const progressPath = document.querySelector('.progress-wrap path');
    if (!progressPath) return;

    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = function () {
      const scroll = $(window).scrollTop();
      const height = $(document).height() - $(window).height();
      const progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;
    }
    updateProgress();
    $(window).scroll(updateProgress);

    const offset = 50;
    $(window).on('scroll', function () {
      if ($(this).scrollTop() > offset) {
        $('.progress-wrap').addClass('active-progress');
      } else {
        $('.progress-wrap').removeClass('active-progress');
      }
    });

    $('.progress-wrap').on('click', function (event) {
      event.preventDefault();
      gsap.to(window, { scrollTo: 0, duration: 1.5, ease: "power4.inOut" });
      return false;
    });
  }
  backToTopProgress();


})(jQuery);