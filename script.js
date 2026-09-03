/* =========================
   POVEL VISUALS
   JavaScript
   ========================= */


/* =========================
   ELEMENTE
   ========================= */

const menuButton = document.getElementById("menuButton");
const closeButton = document.getElementById("closeButton");
const menu = document.getElementById("menu");

const photos = document.querySelectorAll(".photo img");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");


/* =========================
   MENÜ
   ========================= */

menuButton.addEventListener("click", () => {

    menu.classList.add("active");

    menuButton.setAttribute("aria-expanded", "true");

});


function closeMenu() {

    menu.classList.remove("active");

    menuButton.setAttribute("aria-expanded", "false");

}


closeButton.addEventListener("click", closeMenu);


const menuLinks = document.querySelectorAll(".menu a");

menuLinks.forEach(link => {

    link.addEventListener("click", closeMenu);

});


/* =========================
   LIGHTBOX
   ========================= */

photos.forEach(photo => {

    photo.addEventListener("click", () => {

        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

        lightboxClose.focus();

    });

});


function closeLightbox() {

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

}


lightboxClose.addEventListener("click", closeLightbox);


lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {

        closeLightbox();

    }

});


/* =========================
   TASTATUR-STEUERUNG
   ========================= */

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") {
        return;
    }


    if (menu.classList.contains("active")) {

        closeMenu();

    }


    if (lightbox.classList.contains("active")) {

        closeLightbox();

    }

});


/* =========================
   MASONRY GALERIE
   ========================= */

function arrangeGallery() {

    const gallery = document.getElementById("galleryGrid");

    if (!gallery) {
        return;
    }


    const photoElements = Array.from(
        gallery.querySelectorAll(".photo")
    );


    if (photoElements.length === 0) {
        return;
    }


    /* =========================
       SPALTEN
       ========================= */

    const columns =
        window.innerWidth <= 700 ? 2 : 3;


    const gap =
        window.innerWidth <= 700 ? 12 : 20;


    /* =========================
       GALERIE-BREITE
       ========================= */

    const galleryWidth = gallery.clientWidth;


    const columnWidth =
        (galleryWidth - gap * (columns - 1)) / columns;


    /* =========================
       HÖHEN ZURÜCKSETZEN
       ========================= */

    const columnHeights =
        new Array(columns).fill(0);


    /* =========================
       BILDER POSITIONIEREN
       ========================= */

    photoElements.forEach(photo => {

        const image = photo.querySelector("img");

        if (!image) {
            return;
        }


        /* Bildbreite setzen */

        photo.style.width =
            `${columnWidth}px`;


        /* Position absolut */

        photo.style.position =
            "absolute";


        /* Kürzeste Spalte suchen */

        let shortestColumn = 0;


        for (let i = 1; i < columns; i++) {

            if (
                columnHeights[i] <
                columnHeights[shortestColumn]
            ) {

                shortestColumn = i;

            }

        }


        /* Position berechnen */

        const left =
            shortestColumn *
            (columnWidth + gap);


        const top =
            columnHeights[shortestColumn];


        /* Position anwenden */

        photo.style.left =
            `${left}px`;

        photo.style.top =
            `${top}px`;


        /* Höhe bestimmen */

        const photoHeight =
            photo.offsetHeight;


        /* Spaltenhöhe aktualisieren */

        columnHeights[shortestColumn] =
            top + photoHeight + gap;

    });


    /* =========================
       GESAMTHÖHE
       ========================= */

    const galleryHeight =
        Math.max(...columnHeights) - gap;


    gallery.style.height =
        `${Math.max(galleryHeight, 0)}px`;

}


/* =========================
   GALERIE INITIALISIEREN
   ========================= */

function updateGallery() {

    arrangeGallery();

}


/* =========================
   SEITE GELADEN
   ========================= */

window.addEventListener("load", () => {

    updateGallery();

});


/* =========================
   BILDER GELADEN
   ========================= */

photos.forEach(photo => {

    if (photo.complete) {

        updateGallery();

    } else {

        photo.addEventListener(
            "load",
            updateGallery
        );

    }

});


/* =========================
   FENSTERGRÖSSE
   ========================= */

let resizeTimer;


window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);


    resizeTimer = setTimeout(() => {

        updateGallery();

    }, 100);

});
