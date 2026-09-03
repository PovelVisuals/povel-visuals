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

// Menü öffnen
menuButton.addEventListener("click", () => {

    menu.classList.add("active");

    menuButton.setAttribute("aria-expanded", "true");

});


// Menü schließen
function closeMenu() {

    menu.classList.remove("active");

    menuButton.setAttribute("aria-expanded", "false");

}


// X-Button
closeButton.addEventListener("click", closeMenu);


// Menü schließen, wenn ein Link angeklickt wird
const menuLinks = document.querySelectorAll(".menu a");

menuLinks.forEach(link => {

    link.addEventListener("click", closeMenu);

});


/* =========================
   LIGHTBOX
   ========================= */

// Bild öffnen
photos.forEach(photo => {

    photo.addEventListener("click", () => {

        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

        lightboxClose.focus();

    });

});


// Lightbox schließen
function closeLightbox() {

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

}


// X-Button
lightboxClose.addEventListener("click", closeLightbox);


// Klick auf den dunklen Hintergrund
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


    // Menü schließen
    if (menu.classList.contains("active")) {

        closeMenu();

    }


    // Lightbox schließen
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


    // Anzahl der Spalten bestimmen
    let columns;

    if (window.innerWidth <= 700) {

        columns = 2;

    } else {

        columns = 3;

    }


    // Spalten zurücksetzen
    photoElements.forEach(photo => {

        photo.style.position = "absolute";
        photo.style.top = "0";
        photo.style.left = "0";

    });


    // Breite des Containers
    const galleryWidth = gallery.clientWidth;


    // Abstand zwischen den Spalten
    const gap = window.innerWidth <= 700 ? 12 : 20;


    // Breite eines Bildes
    const columnWidth =
        (galleryWidth - gap * (columns - 1)) / columns;


    // Aktuelle Höhe jeder Spalte
    const columnHeights = new Array(columns).fill(0);


    // Bilder verteilen
    photoElements.forEach(photo => {

        // Kürzeste Spalte finden
        let shortestColumn = 0;

        for (let i = 1; i < columns; i++) {

            if (
                columnHeights[i] <
                columnHeights[shortestColumn]
            ) {

                shortestColumn = i;

            }

        }


        // Position berechnen
        const left =
            shortestColumn *
            (columnWidth + gap);


        const top =
            columnHeights[shortestColumn];


        // Position setzen
        photo.style.width = `${columnWidth}px`;
        photo.style.left = `${left}px`;
        photo.style.top = `${top}px`;


        // Höhe des Bildes bestimmen
        const photoHeight = photo.offsetHeight;


        // Höhe der Spalte aktualisieren
        columnHeights[shortestColumn] =
            top + photoHeight + gap;

    });


    // Höhe der Galerie anpassen
    const galleryHeight =
        Math.max(...columnHeights) - gap;


    gallery.style.height =
        `${Math.max(galleryHeight, 0)}px`;

}

/* =========================
   GALERIE LADEN
   ========================= */

function updateGallery() {

    arrangeGallery();

}


/* Galerie initial berechnen */

window.addEventListener("load", () => {

    updateGallery();

});


/* Jedes Bild neu berechnen,
   sobald es geladen wurde */

photos.forEach(photo => {

    photo.addEventListener("load", () => {

        updateGallery();

    });

});


/* Bei Änderung der Fenstergröße
   neu berechnen */

window.addEventListener("resize", () => {

    updateGallery();

});
