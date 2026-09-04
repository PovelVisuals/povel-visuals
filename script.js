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

const photoPurchaseButton =
    document.getElementById("photoPurchaseButton");


/* ==================================================
   FOKUS
   ================================================== */

let lastFocusedElement = null;


/* ==================================================
   MENÜ
   ================================================== */

function openMenu(trigger) {

    if (!menu || !menuButton) {
        return;
    }


    lastFocusedElement =
        trigger || document.activeElement;


    menu.classList.add("active");

    menuButton.setAttribute(
        "aria-expanded",
        "true"
    );


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


    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );


    menu.inert = true;

    menu.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow = "";


    if (lastFocusedElement) {

        lastFocusedElement.focus();

    }

}


/* Menü öffnen */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            openMenu(menuButton);

        }
    );

}


/* Menü über X schließen */

if (closeButton) {

    closeButton.addEventListener(
        "click",
        closeMenu
    );

}


/* Menü beim Klick auf einen Link schließen */

menuLinks.forEach(link => {

    link.addEventListener(
        "click",
        closeMenu
    );

});


/* ==================================================
   FOKUS-FALLE IM MENÜ
   ================================================== */

if (menu) {

    menu.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Tab" ||
                !menu.classList.contains("active")
            ) {

                return;

            }


            const focusable =
                menu.querySelectorAll(
                    "a[href], button:not([disabled])"
                );


            if (focusable.length === 0) {
                return;
            }


            const first = focusable[0];

            const last =
                focusable[focusable.length - 1];


            if (
                event.shiftKey &&
                document.activeElement === first
            ) {

                event.preventDefault();

                last.focus();

            }


            else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {

                event.preventDefault();

                first.focus();

            }

        }
    );

}


/* ==================================================
   LIGHTBOX
   ================================================== */

function openLightbox(photo, trigger) {

    if (
        !lightbox ||
        !lightboxImage
    ) {

        return;

    }


    const image =
        photo.querySelector("img");


    if (!image) {
        return;
    }


    lastFocusedElement =
        trigger || document.activeElement;


    lightboxImage.src =
        image.src;


    lightboxImage.alt =
        image.alt;


    lightbox.classList.add("active");


    lightbox.inert = false;

    lightbox.removeAttribute(
        "aria-hidden"
    );


    document.body.style.overflow =
        "hidden";


    if (lightboxClose) {

        lightboxClose.focus();

    }

}


function closeLightbox() {

    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "active"
    );


    lightbox.inert = true;


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    if (lastFocusedElement) {

        lastFocusedElement.focus();

    }

}


/* ==================================================
   GALERIE
   ================================================== */

if (galleryGrid) {


    /*
       Alle Fotos werden per Tastatur
       erreichbar gemacht.
    */

    galleryGrid
        .querySelectorAll(".photo")
        .forEach(
            (photo, index) => {


                if (
                    !photo.hasAttribute(
                        "tabindex"
                    )
                ) {

                    photo.setAttribute(
                        "tabindex",
                        "0"
                    );

                }


                if (
                    !photo.hasAttribute(
                        "role"
                    )
                ) {

                    photo.setAttribute(
                        "role",
                        "button"
                    );

                }


                if (
                    !photo.hasAttribute(
                        "aria-label"
                    )
                ) {

                    photo.setAttribute(
                        "aria-label",
                        `Foto ${index + 1} vergrößern`
                    );

                }

            }
        );


    /*
       Klick auf ein Foto
    */

    galleryGrid.addEventListener(
        "click",
        (event) => {

            const photo =
                event.target.closest(
                    ".photo"
                );


            if (photo) {

                openLightbox(
                    photo,
                    photo
                );

            }

        }
    );


    /*
       Öffnen mit Enter oder Leertaste
    */

    galleryGrid.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {

                return;

            }


            const photo =
                event.target.closest(
                    ".photo"
                );


            if (photo) {

                event.preventDefault();


                openLightbox(
                    photo,
                    photo
                );

            }

        }
    );

}


/* Lightbox X-Button */

if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


/* Klick auf Hintergrund */

if (lightbox) {

    lightbox.addEventListener(
        "click",
        (event) => {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );

}


/* ==================================================
   SHOP → PHOTO PURCHASE
   ================================================== */

if (
    photoPurchaseButton &&
    contactSubject &&
    emailSubject
) {

    photoPurchaseButton.addEventListener(
        "click",
        () => {


            /*
               Sichtbares Betreff-Feld
            */

            contactSubject.value =
                "Photo Purchase";


            /*
               Tatsächlicher Betreff
               der E-Mail an dich
            */

            emailSubject.value =
                "Photo Purchase";

        }
    );

}


/* ==================================================
   KONTAKTFORMULAR
   ================================================== */

if (
    contactForm &&
    contactSubject &&
    emailSubject
) {

    contactForm.addEventListener(
        "submit",
        () => {

            /*
               Falls der Besucher über den normalen
               Kontaktbereich kommt und einen eigenen
               Betreff eingibt, wird dieser auch als
               E-Mail-Betreff verwendet.

               Wenn der Shop-Button verwendet wurde,
               bleibt "Photo Purchase" bestehen.
            */

            if (
                contactSubject.value.trim() !== ""
            ) {

                /*
                   Wenn "Photo Purchase" gesetzt wurde,
                   bleibt es exakt so.

                   Andernfalls wird der eingegebene
                   Betreff als E-Mail-Betreff verwendet.
                */

                if (
                    contactSubject.value.trim() !==
                    "Photo Purchase"
                ) {

                    emailSubject.value =
                        contactSubject.value.trim();

                }

            }

        }
    );

}


/* ==================================================
   TASTATURSTEUERUNG
   ================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        /*
           Lightbox zuerst schließen
        */

        if (
            lightbox &&
            lightbox.classList.contains(
                "active"
            )
        ) {

            closeLightbox();

            return;

        }


        /*
           Danach Menü schließen
        */

        if (
            menu &&
            menu.classList.contains(
                "active"
            )
        ) {

            closeMenu();

        }

    }
);


/* ==================================================
   MASONRY GALERIE
   ================================================== */

function arrangeGallery() {

    if (!galleryGrid) {
        return;
    }


    const photoElements =
        Array.from(
            galleryGrid.querySelectorAll(
                ".photo"
            )
        );


    if (
        photoElements.length === 0
    ) {

        return;

    }


    /*
       Spalten bestimmen
    */

    let columns;


    if (
        window.innerWidth <= 700
    ) {

        columns = 2;

    }

    else {

        columns = 3;

    }


    /*
       Galerie vorbereiten
    */

    photoElements.forEach(
        photo => {

            photo.style.position =
                "absolute";

            photo.style.top =
                "0";

            photo.style.left =
                "0";

        }
    );


    /*
       Galeriebreite
    */

    const galleryWidth =
        galleryGrid.clientWidth;


    /*
       Abstand zwischen Bildern
    */

    const gap =
        window.innerWidth <= 700
            ? 12
            : 20;


    /*
       Breite einer Spalte
    */

    const columnWidth =
        (
            galleryWidth -
            gap * (columns - 1)
        ) / columns;


    /*
       Höhe der einzelnen Spalten
    */

    const columnHeights =
        new Array(columns).fill(0);


    /*
       Bilder verteilen
    */

    photoElements.forEach(
        photo => {


            /*
               Kürzeste Spalte finden
            */

            let shortestColumn = 0;


            for (
                let i = 1;
                i < columns;
                i++
            ) {

                if (
                    columnHeights[i] <
                    columnHeights[
                        shortestColumn
                    ]
                ) {

                    shortestColumn = i;

                }

            }


            /*
               Position
            */

            const left =
                shortestColumn *
                (
                    columnWidth +
                    gap
                );


            const top =
                columnHeights[
                    shortestColumn
                ];


            /*
               Position anwenden
            */

            photo.style.width =
                `${columnWidth}px`;


            photo.style.left =
                `${left}px`;


            photo.style.top =
                `${top}px`;


            /*
               Höhe des Fotos
            */

            const photoHeight =
                photo.offsetHeight;


            /*
               Spaltenhöhe aktualisieren
            */

            columnHeights[
                shortestColumn
            ] =
                top +
                photoHeight +
                gap;

        }
    );


    /*
       Gesamthöhe der Galerie
    */

    const galleryHeight =
        Math.max(
            ...columnHeights
        ) - gap;


    galleryGrid.style.height =
        `${Math.max(
            galleryHeight,
            0
        )}px`;

}


/* ==================================================
   GALERIE AKTUALISIEREN
   ================================================== */

function updateGallery() {

    arrangeGallery();

}


/* ==================================================
   GALERIE BEIM LADEN
   ================================================== */

window.addEventListener(
    "load",
    () => {

        updateGallery();

    }
);


/* ==================================================
   BILDER NACH DEM LADEN NEU BERECHNEN
   ================================================== */

if (galleryGrid) {

    galleryGrid
        .querySelectorAll("img")
        .forEach(
            photo => {

                photo.addEventListener(
                    "load",
                    updateGallery
                );

            }
        );

}


/* ==================================================
   FENSTERGRÖSSE
   ================================================== */

window.addEventListener(
    "resize",
    updateGallery
);