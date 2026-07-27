document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initGallery();
    initTestimonials();
});

function initMenu() {
    const header = document.querySelector(".header");
    const toggle = document.querySelector(".menu-toggle");
    const menuLinks = document.querySelectorAll(".menu a");

    if (!header || !toggle) return;

    function closeMenu() {
        header.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
    }

    toggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    menuLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });
}

function initGallery() {
    const track = document.querySelector("#galleryTrack");
    const prev = document.querySelector("#prevPage");
    const next = document.querySelector("#nextPage");
    const lightbox = document.querySelector("#lightbox");
    const lightboxImage = document.querySelector("#lightboxImage");
    const closeLightbox = document.querySelector(".close-lightbox");
    const lightPrev = document.querySelector(".light-arrow.left");
    const lightNext = document.querySelector(".light-arrow.right");

    if (!track || !prev || !next) return;

    const originals = Array.from(track.querySelectorAll("img")).map((image, index) => {
        image.dataset.galleryIndex = String(index);
        return image.cloneNode(true);
    });

    let visible = getVisibleSlides();
    let currentIndex = visible;
    let isAnimating = false;
    let pointerStart = null;
    let pointerMoved = false;
    let activeLightboxIndex = 0;

    function getVisibleSlides() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 5;
    }

    function getGap() {
        return parseFloat(getComputedStyle(track).gap) || 0;
    }

    function getStepSize() {
        const slide = track.querySelector("img");
        if (!slide) return 0;
        return slide.getBoundingClientRect().width + getGap();
    }

    function createSlide(source, index, clone) {
        const slide = source.cloneNode(true);
        slide.dataset.galleryIndex = String(index);
        if (clone) slide.dataset.clone = "true";
        return slide;
    }

    function renderSlides() {
        const previousVisible = visible;
        visible = getVisibleSlides();
        track.innerHTML = "";

        originals.slice(-visible).forEach((slide, offset) => {
            const index = originals.length - visible + offset;
            track.appendChild(createSlide(slide, index, true));
        });

        originals.forEach((slide, index) => {
            track.appendChild(createSlide(slide, index, false));
        });

        originals.slice(0, visible).forEach((slide, index) => {
            track.appendChild(createSlide(slide, index, true));
        });

        const currentGroup = Math.max(0, Math.floor((currentIndex - previousVisible) / previousVisible));
        currentIndex = visible + currentGroup * visible;

        if (currentIndex < visible || currentIndex >= originals.length + visible) {
            currentIndex = visible;
        }

        move(false);
    }

    function move(animate) {
        track.style.transition = animate ? "transform .55s cubic-bezier(.22,.61,.36,1)" : "none";
        track.style.transform = `translate3d(-${currentIndex * getStepSize()}px, 0, 0)`;

        if (!animate) {
            track.offsetHeight;
            track.style.transition = "transform .55s cubic-bezier(.22,.61,.36,1)";
        }
    }

    function goNext() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex += visible;
        move(true);
    }

    function goPrev() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex -= visible;
        move(true);
    }

    function normalizeLoop() {
        if (currentIndex >= originals.length + visible) {
            currentIndex = visible;
            move(false);
        }

        if (currentIndex < visible) {
            currentIndex = originals.length;
            move(false);
        }

        isAnimating = false;
    }

    function openLightbox(index) {
        if (!lightbox || !lightboxImage) return;
        activeLightboxIndex = index;
        lightboxImage.src = originals[activeLightboxIndex].src;
        lightboxImage.alt = originals[activeLightboxIndex].alt || "Imagem ampliada da galeria";
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
        closeLightbox?.focus();
    }

    function closeActiveLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    function showLightboxImage(direction) {
        activeLightboxIndex = (activeLightboxIndex + direction + originals.length) % originals.length;
        openLightbox(activeLightboxIndex);
    }

    function handleDrag(distance) {
        if (Math.abs(distance) < 50) return;
        if (distance > 0) goNext();
        if (distance < 0) goPrev();
    }

    next.addEventListener("click", goNext);
    prev.addEventListener("click", goPrev);
    track.addEventListener("transitionend", normalizeLoop);

    track.addEventListener("click", event => {
        const image = event.target.closest("img");
        if (!image || pointerMoved) return;
        openLightbox(Number(image.dataset.galleryIndex));
    });

    track.addEventListener("pointerdown", event => {
        pointerStart = event.clientX;
        pointerMoved = false;
        track.setPointerCapture?.(event.pointerId);
        track.style.cursor = "grabbing";
    });

    track.addEventListener("pointermove", event => {
        if (pointerStart === null) return;
        if (Math.abs(event.clientX - pointerStart) > 8) {
            pointerMoved = true;
        }
    });

    track.addEventListener("pointerup", event => {
        if (pointerStart === null) return;
        const distance = pointerStart - event.clientX;
        pointerStart = null;
        track.style.cursor = "grab";
        handleDrag(distance);
        setTimeout(() => {
            pointerMoved = false;
        }, 0);
    });

    track.addEventListener("pointercancel", () => {
        pointerStart = null;
        pointerMoved = false;
        track.style.cursor = "grab";
    });

    closeLightbox?.addEventListener("click", closeActiveLightbox);
    lightPrev?.addEventListener("click", () => showLightboxImage(-1));
    lightNext?.addEventListener("click", () => showLightboxImage(1));

    lightbox?.addEventListener("click", event => {
        if (event.target === lightbox) closeActiveLightbox();
    });

    window.addEventListener("keydown", event => {
        if (!lightbox?.classList.contains("active")) return;
        if (event.key === "Escape") closeActiveLightbox();
        if (event.key === "ArrowLeft") showLightboxImage(-1);
        if (event.key === "ArrowRight") showLightboxImage(1);
    });

    let resizeFrame = null;
    window.addEventListener("resize", () => {
        if (resizeFrame) cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
            const nextVisible = getVisibleSlides();
            if (nextVisible !== visible) {
                renderSlides();
                return;
            }
            move(false);
        });
    });

    renderSlides();
}

function initTestimonials() {
    const track = document.querySelector("#testimonialTrack");
    const prev = document.querySelector("#prevTestimonial");
    const next = document.querySelector("#nextTestimonial");

    if (!track || !prev || !next) return;

    const originals = Array.from(track.querySelectorAll(".testimonial-card")).map(card => card.cloneNode(true));

    let visible = getVisibleCards();
    let currentIndex = visible;
    let isAnimating = false;

    function getVisibleCards() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function getGap() {
        return parseFloat(getComputedStyle(track).gap) || 0;
    }

    function getStepSize() {
        const card = track.querySelector(".testimonial-card");
        if (!card) return 0;
        return card.getBoundingClientRect().width + getGap();
    }

    function createCard(source, clone) {
        const card = source.cloneNode(true);
        if (clone) card.dataset.clone = "true";
        return card;
    }

    function renderCards() {
        const previousVisible = visible;
        visible = getVisibleCards();
        track.innerHTML = "";

        originals.slice(-visible).forEach(card => {
            track.appendChild(createCard(card, true));
        });

        originals.forEach(card => {
            track.appendChild(createCard(card, false));
        });

        originals.slice(0, visible).forEach(card => {
            track.appendChild(createCard(card, true));
        });

        const currentGroup = Math.max(0, Math.floor((currentIndex - previousVisible) / previousVisible));
        currentIndex = visible + currentGroup * visible;

        if (currentIndex < visible || currentIndex >= originals.length + visible) {
            currentIndex = visible;
        }

        move(false);
    }

    function move(animate) {
        track.style.transition = animate ? "transform .55s cubic-bezier(.22,.61,.36,1)" : "none";
        track.style.transform = `translate3d(-${currentIndex * getStepSize()}px, 0, 0)`;

        if (!animate) {
            track.offsetHeight;
            track.style.transition = "transform .55s cubic-bezier(.22,.61,.36,1)";
        }
    }

    function goNext() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex += visible;
        move(true);
    }

    function goPrev() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex -= visible;
        move(true);
    }

    function normalizeLoop() {
        if (currentIndex >= originals.length + visible) {
            currentIndex = visible;
            move(false);
        }

        if (currentIndex < visible) {
            currentIndex = originals.length;
            move(false);
        }

        isAnimating = false;
    }

    next.addEventListener("click", goNext);
    prev.addEventListener("click", goPrev);
    track.addEventListener("transitionend", normalizeLoop);

    let resizeFrame = null;
    window.addEventListener("resize", () => {
        if (resizeFrame) cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
            const nextVisible = getVisibleCards();
            if (nextVisible !== visible) {
                renderCards();
                return;
            }
            move(false);
        });
    });

    renderCards();
}
