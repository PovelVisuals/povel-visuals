/* =========================
   POVEL VISUALS
   JavaScript
   ========================= */

"use strict";


/* =========================
   ELEMENTE
   ========================= */

const menuButton = document.getElementById("menuButton");
const closeButton = document.getElementById("closeButton");
const menu = document.getElementById("menu");
const menuLinks = menu ? menu.querySelectorAll("a") : [];

const galleryGrid = document.getElementById("galleryGrid");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

/* Merkt sich, welches Element vor dem Öffnen fokussiert war,
   damit der Fokus beim Schließen dorthin zurückspringt. */
let lastFocusedElement = null;


/* =========================
   MENÜ
   ========================= */

function openMenu(trigger) {

    if (!menu || !menuButton) {
        return;
    }

    lastFocusedElement = trigger || document.activeElement;

    menu.classList.add("active");
    menuButton.setAttribute("aria-expanded", "true");

    menu.inert = false;
    menu.removeAttribute("aria-hidden");

    document.body.style.overflow = "hidden";

    if (closeButton) {
        closeButton.focus();
    }

}


function closeMenu() {

    if (!menu || !menuButton) {
        return;
    }

    menu.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");

    menu.inert = true;
    menu.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }

}


if (menuButton) {

    menuButton.addEventListener("click", () => {
        openMenu(menuButton);
    });

}


if (closeButton) {

    closeButton.addEventListener("click", closeMenu);

}


menuLinks.forEach(link => {

    link.addEventListener("click", closeMenu);

});


/* ---------- Fokus-Falle im Menü ---------- */

if (menu) {

    menu.addEventListener("keydown", (event) => {

        if (event.key !== "Tab" || !menu.classList.contains("active")) {
            return;
        }

        const focusable = menu.querySelectorAll("a[href], button:not([disabled])");

        if (focusable.length === 0) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {

            event.preventDefault();
            last.focus();

        } else if (!event.shiftKey && document.activeElement === last) {

            event.preventDefault();
            first.focus();

        }

    });

}


/* =========================
   LIGHTBOX
   ========================= */

function openLightbox(photo, trigger) {

    if (!lightbox || !lightboxImage) {
        return;
    }

    const image = photo.querySelector("img");

    if (!image) {
        return;
    }

    lastFocusedElement = trigger || document.activeElement;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightbox.classList.add("active");
    lightbox.inert = false;
    lightbox.removeAttribute("aria-hidden");

    document.body.style.overflow = "hidden";

    if (lightboxClose) {
        lightboxClose.focus();
    }

}


function closeLightbox() {

    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("active");
    lightbox.inert = true;
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }

}


if (galleryGrid) {

    /* Bilder per Tastatur erreichbar und für Screenreader beschreiben */

    galleryGrid.querySelectorAll(".photo").forEach((photo, index) => {

        if (!photo.hasAttribute("tabindex")) {
            photo.setAttribute("tabindex", "0");
        }

        if (!photo.hasAttribute("role")) {
            photo.setAttribute("role", "button");
        }

        if (!photo.hasAttribute("aria-label")) {
            photo.setAttribute("aria-label", `Foto ${index + 1} vergrößern`);
        }

    });


    /* Ein Listener für alle Fotos (Event-Delegation) */

    galleryGrid.addEventListener("click", (event) => {

        const photo = event.target.closest(".photo");

        if (photo) {
            openLightbox(photo, photo);
        }

    });


    galleryGrid.addEventListener("keydown", (event) => {

        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        const photo = event.target.closest(".photo");

        if (photo) {
            event.preventDefault();
            openLightbox(photo, photo);
        }

    });

}


if (lightboxClose) {

    lightboxClose.addEventListener("click", closeLightbox);

}


if (lightbox) {

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

}


/* =========================
   TASTATUR-STEUERUNG (ESC)
   ========================= */

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") {
        return;
    }

    if (lightbox && lightbox.classList.contains("active")) {
        closeLightbox();
        return;
    }

    if (menu && menu.classList.contains("active")) {
        closeMenu();
    }

});
