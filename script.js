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


/*
 * Merkt sich, welches Element vor dem Öffnen
 * fokussiert war.
 */

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


if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {
            openMenu(menuButton);
        }
    );

}


if (closeButton) {

    closeButton.addEventListener(
        "click",
        closeMenu
    );

}


menuLinks.forEach(link => {

    link.addEventListener(
        "click",
        closeMenu
    );

});


/* =========================
   FOKUS-FALLE IM MENÜ
   ========================= */

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


/* =========================
   LIGHTBOX
   ========================= */

function openLightbox(photo, trigger) {

    if (!lightbox || !lightboxImage) {
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
        image.currentSrc || image.src;

    lightboxImage.alt =
        image.alt;


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

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";


    if (lastFocusedElement) {

        lastFocusedElement.focus();

    }

}


if (galleryGrid) {

    /*
     * Bilder per Tastatur erreichbar machen
     * und für Screenreader beschreiben.
     */

    galleryGrid
        .querySelectorAll(".photo")
        .forEach((photo, index) => {

            if (!photo.hasAttribute("tabindex")) {

                photo.setAttribute(
                    "tabindex",
                    "0"
                );

            }


            if (!photo.hasAttribute("role")) {

                photo.setAttribute(
                    "role",
                    "button"
                );

            }


            if (!photo.hasAttribute("aria-label")) {

                photo.setAttribute(
                    "aria-label",
                    `Foto ${index + 1} vergrößern`
                );

            }

        });


    /*
     * Event Delegation:
     * Ein Listener reicht für alle Fotos.
     */

    galleryGrid.addEventListener(
        "click",
        (event) => {

            const photo =
                event.target.closest(".photo");


            if (photo) {

                openLightbox(
                    photo,
                    photo
                );

            }

        }
    );


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
                event.target.closest(".photo");


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


if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


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


/* =========================
   TASTATUR-STEUERUNG
   ========================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {
            return;
        }


        /*
         * Lightbox zuerst schließen.
         */

        if (
            lightbox &&
            lightbox.classList.contains("active")
        ) {

            closeLightbox();

            return;

        }


        /*
         * Danach Menü schließen.
         */

        if (
            menu &&
            menu.classList.contains("active")
        ) {

            closeMenu();

        }

    }
);


/* =========================
   MASONRY GALERIE
   ========================= */

function arrangeGallery() {

    if (!galleryGrid) {
        return;
    }


    const photoElements =
        Array.from(
            galleryGrid.querySelectorAll(".photo")
        );


    if (photoElements.length === 0) {
        return;
    }


    /*
     * Anzahl der Spalten bestimmen.
     */

    let columns;


    if (window.innerWidth <= 700) {

        columns = 2;

    }
    else {

        columns = 3;

    }


    /*
     * Spalten zurücksetzen.
     */

    photoElements.forEach(photo => {

        photo.style.position = "absolute";

        photo.style.top = "0";

        photo.style.left = "0";

    });


    /*
     * Breite des Containers.
     */

    const galleryWidth =
        galleryGrid.clientWidth;


    /*
     * Abstand zwischen den Spalten.
     */

    const gap =
        window.innerWidth <= 700
            ? 12
            : 20;


    /*
     * Breite eines Bildes.
     */

    const columnWidth =
        (
            galleryWidth -
            gap * (columns - 1)
        ) / columns;


    /*
     * Aktuelle Höhe jeder Spalte.
     */

    const columnHeights =
        new Array(columns).fill(0);


    /*
     * Bilder verteilen.
     */

    photoElements.forEach(photo => {

        /*
         * Kürzeste Spalte finden.
         */

        let shortestColumn = 0;


        for (
            let i = 1;
            i < columns;
            i++
        ) {

            if (
                columnHeights[i] <
                columnHeights[shortestColumn]
            ) {

                shortestColumn = i;

            }

        }


        /*
         * Position berechnen.
         */

        const left =
            shortestColumn *
            (columnWidth + gap);


        const top =
            columnHeights[
                shortestColumn
            ];


        /*
         * Position setzen.
         */

        photo.style.width =
            `${columnWidth}px`;

        photo.style.left =
            `${left}px`;

        photo.style.top =
            `${top}px`;


        /*
         * Höhe des Bildes bestimmen.
         */

        const photoHeight =
            photo.offsetHeight;


        /*
         * Höhe der Spalte aktualisieren.
         */

        columnHeights[
            shortestColumn
        ] =
            top +
            photoHeight +
            gap;

    });


    /*
     * Höhe der Galerie anpassen.
     */

    const galleryHeight =
        Math.max(...columnHeights) - gap;


    galleryGrid.style.height =
        `${Math.max(galleryHeight, 0)}px`;

}


/* =========================
   GALERIE AKTUALISIEREN
   ========================= */

function updateGallery() {

    arrangeGallery();

}


/* =========================
   AUTOMATISCHE
   HINTERGRUNDBILDER
   ========================= */


/*
 * Hier werden nur Querformat-Fotos verwendet.
 *
 * Ein Foto gilt als Querformat, wenn:
 *
 * naturalWidth > naturalHeight
 *
 * Dadurch ist es egal, ob du später
 * weitere Fotos hinzufügst.
 */

function setBackgroundImages() {

    if (!galleryGrid) {
        return;
    }


    const backgroundSections = [

        document.querySelector(".about"),

        document.querySelector(".contact"),

        document.querySelector(".donate")

    ].filter(Boolean);


    if (
        backgroundSections.length === 0
    ) {
        return;
    }


    const images =
        Array.from(
            galleryGrid.querySelectorAll("img")
        );


    /*
     * Nur erfolgreich geladene
     * Querformat-Bilder auswählen.
     */

    const landscapeImages =
        images.filter(image => {

            return (
                image.complete &&
                image.naturalWidth > 0 &&
                image.naturalHeight > 0 &&
                image.naturalWidth > image.naturalHeight
            );

        });


    /*
     * Falls kein Querformat vorhanden ist,
     * nichts verändern.
     */

    if (
        landscapeImages.length === 0
    ) {
        return;
    }


    /*
     * Die Bilder werden gemischt,
     * damit nicht immer dieselben drei
     * Fotos verwendet werden.
     */

    const shuffled =
        [...landscapeImages].sort(
            () => Math.random() - 0.5
        );


    /*
     * Jedem Bereich ein eigenes Bild geben.
     */

    backgroundSections.forEach(
        (section, index) => {

            const image =
                shuffled[
                    index % shuffled.length
                ];


            section.style.setProperty(
                "--section-background",
                `url("${image.currentSrc || image.src}")`
            );

        }
    );

}


/* =========================
   HINTERGRUNDBILDER LADEN
   ========================= */


/*
 * Da deine Galerie-Bilder "lazy" geladen werden,
 * dürfen wir für die Hintergrundbilder nicht darauf
 * warten, dass sie alle bereits sichtbar sind.
 *
 * Deshalb laden wir die Bildgrößen zusätzlich
 * über neue Image-Objekte.
 */

function loadBackgroundImages() {

    if (!galleryGrid) {
        return;
    }


    const imageElements =
        Array.from(
            galleryGrid.querySelectorAll("img")
        );


    if (
        imageElements.length === 0
    ) {
        return;
    }


    const imagePromises =
        imageElements.map(
            imageElement => {

                return new Promise(
                    resolve => {

                        /*
                         * Falls das Bild bereits
                         * geladen wurde.
                         */

                        if (
                            imageElement.complete &&
                            imageElement.naturalWidth > 0
                        ) {

                            resolve({
                                width:
                                    imageElement.naturalWidth,

                                height:
                                    imageElement.naturalHeight,

                                src:
                                    imageElement.currentSrc ||
                                    imageElement.src
                            });

                            return;
                        }


                        /*
                         * Bild separat laden,
                         * ohne das Lazy Loading
                         * der Galerie zu beeinflussen.
                         */

                        const image =
                            new Image();


                        image.onload = () => {

                            resolve({
                                width:
                                    image.naturalWidth,

                                height:
                                    image.naturalHeight,

                                src:
                                    image.src
                            });

                        };


                        image.onerror = () => {

                            resolve(null);

                        };


                        image.src =
                            imageElement.src;

                    }
                );

            }
        );


    Promise.all(imagePromises)
        .then(results => {

            /*
             * Nur gültige Bilder behalten.
             */

            const landscapeImages =
                results.filter(
                    result =>
                        result &&
                        result.width >
                        result.height
                );


            if (
                landscapeImages.length === 0
            ) {
                return;
            }


            const sections = [

                document.querySelector(".about"),

                document.querySelector(".contact"),

                document.querySelector(".donate")

            ].filter(Boolean);


            /*
             * Zufällige Reihenfolge.
             */

            const shuffled =
                [...landscapeImages].sort(
                    () => Math.random() - 0.5
                );


            sections.forEach(
                (section, index) => {

                    const image =
                        shuffled[
                            index %
                            shuffled.length
                        ];


                    section.style.setProperty(
                        "--section-background",
                        `url("${image.src}")`
                    );

                }
            );

        });

}


/* =========================
   INITIALISIERUNG
   ========================= */

window.addEventListener(
    "load",
    () => {

        /*
         * Galerie berechnen.
         */

        updateGallery();


        /*
         * Hintergrundbilder setzen.
         */

        loadBackgroundImages();

    }
);


/* =========================
   GALERIE NEU BERECHNEN
   ========================= */


/*
 * Jedes Bild neu berechnen,
 * sobald es geladen wurde.
 */

if (galleryGrid) {

    galleryGrid
        .querySelectorAll("img")
        .forEach(photo => {

            photo.addEventListener(
                "load",
                () => {

                    updateGallery();

                },
                {
                    once: false
                }
            );

        });

}


/*
 * Bei Änderung der Fenstergröße
 * neu berechnen.
 */

window.addEventListener(
    "resize",
    () => {

        updateGallery();

    }
);