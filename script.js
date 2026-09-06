/* =========================
   POVEL VISUALS
   JavaScript
   ========================= */

"use strict";


/* ==================================================
   ELEMENTE
   ================================================== */

const menuButton = document.getElementById("menuButton");
const closeButton = document.getElementById("closeButton");
const menu = document.getElementById("menu");

const menuLinks = menu
    ? menu.querySelectorAll("a")
    : [];

const galleryGrid = document.getElementById("galleryGrid");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

const contactForm = document.getElementById("contactForm");
const contactSubject = document.getElementById("contactSubject");
const emailSubject = document.getElementById("emailSubject");

const photoPurchaseButton = document.getElementById("photoPurchaseButton");


/* ==================================================
   FOKUS-VERWALTUNG
   ==================================================

   Merkt sich, welches Element vor dem Öffnen von Menü
   oder Lightbox fokussiert war, damit der Fokus beim
   Schließen wieder dorthin zurückspringt.
   ================================================== */

let lastFocusedElement = null;


/* ==================================================
   MENÜ
   ================================================== */

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

    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {

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

        if (
            event.key !== "Tab" ||
            !menu.classList.contains("active")
        ) {

            return;

        }

        const focusable = menu.querySelectorAll(
            "a[href], button:not([disabled])"
        );

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


/* ==================================================
   LIGHTBOX
   ================================================== */

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

    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {

        lastFocusedElement.focus();

    }

}


/* ==================================================
   GALERIE → BILDER ANKLICKBAR MACHEN
   ================================================== */

if (galleryGrid) {

    const galleryPhotos = galleryGrid.querySelectorAll(".photo");


    /* Fotos per Tastatur erreichbar und für
       Screenreader verständlich machen. */

    galleryPhotos.forEach((photo, index) => {

        if (!photo.hasAttribute("tabindex")) {
            photo.setAttribute("tabindex", "0");
        }

        if (!photo.hasAttribute("role")) {
            photo.setAttribute("role", "button");
        }

        if (!photo.hasAttribute("aria-label")) {
            photo.setAttribute(
                "aria-label",
                `Foto ${index + 1} vergrößern`
            );
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


/* ==================================================
   SHOP → "BILD ANFRAGEN"
   ==================================================

   Setzt beim Klick automatisch den Betreff auf
   "Photo Purchase" – im sichtbaren Feld und im
   versteckten Feld, das FormSubmit tatsächlich
   als E-Mail-Betreff verwendet.
   ================================================== */

function activatePhotoPurchase() {

    if (!contactSubject) {
        return;
    }

    contactSubject.value = "Photo Purchase";

    if (emailSubject) {
        emailSubject.value = "Photo Purchase";
    }

    /* Merken, dass die Anfrage aus dem Shop kommt,
       damit der Betreff auch nach einem versehentlichen
       Neuladen der Seite erhalten bleibt. */

    try {

        sessionStorage.setItem("photoPurchase", "true");

    } catch (error) {

        /* sessionStorage evtl. nicht verfügbar
           (z. B. im privaten Modus) – kein Problem,
           die Seite funktioniert trotzdem. */

    }

}


if (photoPurchaseButton) {

    photoPurchaseButton.addEventListener(
        "click",
        activatePhotoPurchase
    );

}


/* Betreff nach einem Neuladen der Seite wiederherstellen,
   falls die Markierung aus sessionStorage noch besteht. */

function restorePhotoPurchase() {

    if (!contactSubject) {
        return;
    }

    let purchaseActive = false;

    try {

        purchaseActive =
            sessionStorage.getItem("photoPurchase") === "true";

    } catch (error) {

        purchaseActive = false;

    }

    if (purchaseActive) {

        contactSubject.value = "Photo Purchase";

        if (emailSubject) {
            emailSubject.value = "Photo Purchase";
        }

    }

}


/* ==================================================
   KONTAKTFORMULAR
   ==================================================

   Der tatsächliche E-Mail-Betreff (verstecktes Feld)
   übernimmt beim Absenden immer den Inhalt des
   sichtbaren Betreff-Felds – egal ob vorausgefüllt
   durch den Shop-Button oder frei eingetippt, und
   egal ob nachträglich noch geändert.
   ================================================== */

if (contactForm) {

    contactForm.addEventListener("submit", () => {

        if (
            contactSubject &&
            emailSubject &&
            contactSubject.value.trim() !== ""
        ) {

            emailSubject.value = contactSubject.value.trim();

        }

        try {

            sessionStorage.removeItem("photoPurchase");

        } catch (error) {

            /* nichts zu tun */

        }

    });

}


/* ==================================================
   HINTERGRUNDFOTOS FÜR ÜBER MICH, KONTAKT,
   SPENDEN UND SHOP
   ==================================================

   Für diese vier Bereiche wird automatisch je ein
   Querformat-Foto aus der Galerie verwendet
   (Breite > Höhe). Die Reihenfolge richtet sich
   nach der Reihenfolge der Fotos in der Galerie,
   unabhängig davon, welches Bild zufällig zuerst
   fertig geladen hat.

   Ohne JavaScript bleibt es beim einfarbigen dunklen
   Hintergrund – das Layout bricht dadurch nicht.
   ================================================== */

function setupSectionBackgrounds() {

    if (!galleryGrid) {
        return;
    }

    const imageSources = Array.from(
        galleryGrid.querySelectorAll(".photo img")
    )
        .map(image => image.getAttribute("src"))
        .filter(src => Boolean(src));

    if (imageSources.length === 0) {
        return;
    }

    const isLandscape = new Array(imageSources.length).fill(false);
    let resolvedCount = 0;

    function handleResult(index, landscape) {

        isLandscape[index] = landscape;
        resolvedCount++;

        if (resolvedCount === imageSources.length) {
            applySectionBackgrounds();
        }

    }

    imageSources.forEach((src, index) => {

        const testImage = new Image();

        testImage.onload = () => {

            handleResult(
                index,
                testImage.naturalWidth > testImage.naturalHeight
            );

        };

        testImage.onerror = () => {

            handleResult(index, false);

        };

        testImage.src = src;

    });


    function applySectionBackgrounds() {

        /* Reihenfolge bleibt stabil (wie in der Galerie),
           unabhängig davon, in welcher Reihenfolge die
           Bilder tatsächlich fertig geladen haben. */

        const landscapeSources = imageSources.filter(
            (src, index) => isLandscape[index]
        );

        const sections = [
            { selector: ".about", fallback: "images/foto1.jpg" },
            { selector: ".contact", fallback: "images/foto2.jpg" },
            { selector: ".donate", fallback: "images/foto3.jpg" },
            { selector: ".shop", fallback: "images/foto4.jpg" }
        ];

        sections.forEach((section, index) => {

            const element = document.querySelector(section.selector);

            if (!element) {
                return;
            }

            const source =
                landscapeSources.length > 0
                    ? landscapeSources[index % landscapeSources.length]
                    : section.fallback;

            element.style.setProperty(
                "--section-background",
                `url("${source}")`
            );

        });

    }

}


/* ==================================================
   TASTATURSTEUERUNG (ESC)
   ================================================== */

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


/* ==================================================
   INITIALISIERUNG
   ================================================== */

window.addEventListener("load", () => {

    restorePhotoPurchase();
    setupSectionBackgrounds();

});