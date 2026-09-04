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

    menu.removeAttribute(
        "aria-hidden"
    );

    document.body.style.overflow =
        "hidden";

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

    document.body.style.overflow =
        "";

    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {

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


/* Menü schließen */

if (closeButton) {

    closeButton.addEventListener(
        "click",
        closeMenu
    );

}


/* Menü beim Klick auf Link schließen */

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

            const first =
                focusable[0];

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

    lightbox.classList.add(
        "active"
    );

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

    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {

        lastFocusedElement.focus();

    }

}


/* ==================================================
   GALERIE
   ================================================== */

if (galleryGrid) {

    const galleryPhotos =
        galleryGrid.querySelectorAll(
            ".photo"
        );


    /* Fotos tastaturfähig machen */

    galleryPhotos.forEach(
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


    /* Foto anklicken */

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


    /* Foto mit Enter / Leertaste öffnen */

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


/* Lightbox schließen */

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

function activatePhotoPurchase() {

    if (!contactSubject) {
        return;
    }

    /*
       Sichtbares Betreff-Feld
    */

    contactSubject.value =
        "Photo Purchase";


    /*
       Tatsächlicher E-Mail-Betreff
       bei FormSubmit
    */

    if (emailSubject) {

        emailSubject.value =
            "Photo Purchase";

    }


    /*
       Merken, dass der Besucher
       aus dem Shop kommt.
    */

    try {

        sessionStorage.setItem(
            "photoPurchase",
            "true"
        );

    } catch (error) {

        /* SessionStorage eventuell nicht verfügbar */

    }

}


/*
   Shop-Button

   Wir verwenden mehrere Events,
   damit es auch auf mobilen Geräten
   zuverlässig funktioniert.
*/

if (photoPurchaseButton) {

    photoPurchaseButton.addEventListener(
        "pointerdown",
        activatePhotoPurchase
    );

    photoPurchaseButton.addEventListener(
        "click",
        activatePhotoPurchase
    );

}


/* ==================================================
   PHOTO PURCHASE NACH NAVIGATION
   ================================================== */

function checkPhotoPurchase() {

    if (!contactSubject) {
        return;
    }

    let purchaseActive = false;


    try {

        purchaseActive =
            sessionStorage.getItem(
                "photoPurchase"
            ) === "true";

    } catch (error) {

        purchaseActive = false;

    }


    if (purchaseActive) {

        contactSubject.value =
            "Photo Purchase";

        if (emailSubject) {

            emailSubject.value =
                "Photo Purchase";

        }

    }

}


window.addEventListener(
    "load",
    checkPhotoPurchase
);


/* ==================================================
   KONTAKTFORMULAR
   ================================================== */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        () => {

            /*
               Prüfen, ob es sich um
               einen Bildkauf handelt.
            */

            let purchaseActive = false;

            try {

                purchaseActive =
                    sessionStorage.getItem(
                        "photoPurchase"
                    ) === "true";

            } catch (error) {

                purchaseActive = false;

            }


            /*
               Bei Bildkauf immer
               Photo Purchase verwenden.
            */

            if (purchaseActive) {

                if (contactSubject) {

                    contactSubject.value =
                        "Photo Purchase";

                }

                if (emailSubject) {

                    emailSubject.value =
                        "Photo Purchase";

                }

            }

            /*
               Normaler Kontakt:
               Der eingegebene Betreff
               wird zum E-Mail-Betreff.
            */

            else {

                if (
                    contactSubject &&
                    emailSubject &&
                    contactSubject.value.trim() !== ""
                ) {

                    emailSubject.value =
                        contactSubject.value.trim();

                }

            }


            /*
               Nach dem Absenden
               Shop-Modus zurücksetzen.
            */

            try {

                sessionStorage.removeItem(
                    "photoPurchase"
                );

            } catch (error) {

                /* nichts tun */

            }

        }
    );

}


/* ==================================================
   HINTERGRUNDBILDER
   ==================================================

   Für About Me, Kontakt, Spenden und Shop
   werden automatisch nur Querformat-Fotos
   aus deiner Galerie verwendet.

   Ein Bild gilt als Querformat, wenn:

       Breite > Höhe

   Die Bilder werden über ihre tatsächlichen
   Bildmaße geprüft.
   ================================================== */


function setupSectionBackgrounds() {

    const sections = [

        {
            selector: ".about",
            fallback: "images/foto1.jpg"
        },

        {
            selector: ".contact",
            fallback: "images/foto2.jpg"
        },

        {
            selector: ".donate",
            fallback: "images/foto3.jpg"
        },

        {
            selector: ".shop",
            fallback: "images/foto4.jpg"
        }

    ];


    /*
       Alle Bildpfade aus der Galerie holen
    */

    if (!galleryGrid) {
        return;
    }


    const galleryImages =
        Array.from(
            galleryGrid.querySelectorAll(
                "img"
            )
        );


    /*
       Nur unterschiedliche Bildquellen
    */

    const imageSources =
        galleryImages
            .map(
                image => image.getAttribute(
                    "src"
                )
            )
            .filter(
                src => src
            );


    if (
        imageSources.length === 0
    ) {

        return;

    }


    /*
       Querformat-Bilder sammeln
    */

    const landscapeImages = [];


    let loadedImages = 0;


    imageSources.forEach(
        src => {

            const testImage =
                new Image();


            testImage.onload =
                function () {

                    loadedImages++;


                    /*
                       Nur Querformat
                    */

                    if (
                        this.naturalWidth >
                        this.naturalHeight
                    ) {

                        landscapeImages.push(
                            src
                        );

                    }


                    /*
                       Wenn alle Bilder geprüft
                       wurden, Hintergründe setzen.
                    */

                    if (
                        loadedImages ===
                        imageSources.length
                    ) {

                        applySectionBackgrounds();

                    }

                };


            testImage.onerror =
                function () {

                    loadedImages++;


                    if (
                        loadedImages ===
                        imageSources.length
                    ) {

                        applySectionBackgrounds();

                    }

                };


            testImage.src = src;

        }
    );


    /*
       Hintergrundbilder anwenden
    */

    function applySectionBackgrounds() {

        sections.forEach(
            (section, index) => {

                const element =
                    document.querySelector(
                        section.selector
                    );

                if (!element) {
                    return;
                }


                /*
                   Wenn genügend Querformat-Bilder
                   vorhanden sind, werden diese
                   nacheinander verwendet.
                */

                if (
                    landscapeImages.length > 0
                ) {

                    const image =
                        landscapeImages[
                            index %
                            landscapeImages.length
                        ];


                    element.style.setProperty(
                        "--section-background",
                        `url("${image}")`
                    );

                }

                /*
                   Falls kein Querformat-Foto
                   gefunden wurde, Fallback.
                */

                else {

                    element.style.setProperty(
                        "--section-background",
                        `url("${section.fallback}")`
                    );

                }

            }
        );

    }

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

    const columns =
        window.innerWidth <= 700
            ? 2
            : 3;


    /*
       Abstand
    */

    const gap =
        window.innerWidth <= 700
            ? 12
            : 20;


    /*
       Galeriebreite
    */

    const galleryWidth =
        galleryGrid.clientWidth;


    if (
        galleryWidth <= 0
    ) {

        return;

    }


    /*
       Spaltenbreite
    */

    const columnWidth =
        (
            galleryWidth -
            gap * (columns - 1)
        ) / columns;


    /*
       Spaltenhöhen
    */

    const columnHeights =
        new Array(columns).fill(0);


    /*
       Positionierung zurücksetzen
    */

    photoElements.forEach(
        photo => {

            photo.style.position =
                "absolute";

            photo.style.width =
                `${columnWidth}px`;

        }
    );


    /*
       Fotos verteilen
    */

    photoElements.forEach(
        photo => {

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


            photo.style.left =
                `${left}px`;

            photo.style.top =
                `${top}px`;


            /*
               Höhe des Fotos
            */

            const photoHeight =
                photo.offsetHeight;


            columnHeights[
                shortestColumn
            ] =
                top +
                photoHeight +
                gap;

        }
    );


    /*
       Gesamthöhe
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
   INITIALISIERUNG
   ================================================== */

window.addEventListener(
    "load",
    () => {

        updateGallery();

        setupSectionBackgrounds();

    }
);


/* ==================================================
   BILDER NACH DEM LADEN
   ================================================== */

if (galleryGrid) {

    galleryGrid
        .querySelectorAll("img")
        .forEach(
            image => {

                image.addEventListener(
                    "load",
                    () => {

                        updateGallery();

                    }
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