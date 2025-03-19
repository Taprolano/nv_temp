/**
 * Sistema multilingua per il sito web del Dr. Nicola Vaia
 * Gestisce il caricamento dinamico delle traduzioni e l'applicazione al DOM
 */

// Oggetto globale per la gestione delle traduzioni
const TranslationManager = {
    currentLang: 'it',
    translations: {},
    supportedLanguages: ['it', 'en'],

    // Ottiene il parametro 'lang' dalla URL
    getLangFromUrl(defaultLang = 'it') {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang')?.toLowerCase() || defaultLang;
        return this.supportedLanguages.includes(urlLang) ? urlLang : defaultLang;
    },

    // Carica il file JSON in base al parametro lang
    async loadTranslations(lang) {
        try {
            // Crea il percorso del file JSON in base al parametro lang
            const filePath = `json/translation_${lang.toUpperCase()}.json`;

            // Usa fetch per ottenere il file JSON
            const response = await fetch(filePath);

            // Verifica se la richiesta ha avuto successo
            if (!response.ok) {
                console.warn(`Impossibile caricare le traduzioni per ${lang}. Caricamento del file di lingua predefinito.`);
                return this.loadTranslations('it');
            }

            // Converti la risposta in un oggetto JSON
            this.translations = await response.json();
            this.currentLang = lang;

            console.log(`Traduzioni caricate per la lingua: ${lang}`);
            return this.translations;
        } catch (error) {
            console.error('Errore durante il caricamento del JSON:', error);
            // Fallback a un oggetto vuoto per evitare errori
            return {};
        }
    },

    // Applica le traduzioni agli elementi con data-i18n
    applyTranslations() {
        if (!this.translations) return;

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[key]) {
                element.textContent = this.translations[key];
            }
        });

        // Applica traduzioni agli attributi (es. placeholder, alt, title)
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const data = element.getAttribute('data-i18n-attr').split(',');
            data.forEach(item => {
                const [attr, key] = item.trim().split(':');
                if (attr && key && this.translations[key]) {
                    element.setAttribute(attr, this.translations[key]);
                }
            });
        });
    },

    // Aggiorna l'URL con il parametro della lingua selezionata
    updateUrlLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) return;

        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
    },

    // Cambia la lingua e aggiorna la pagina
    async changeLanguage(lang) {
        if (lang === this.currentLang) return;

        await this.loadTranslations(lang);
        this.updateUrlLanguage(lang);
        this.applyTranslations();

        // Aggiorna il selettore della lingua nell'interfaccia
        const langSelector = document.getElementById('language-selector');
        if (langSelector) {
            langSelector.value = lang;
        }

        // Dispara un evento per notificare altri script
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    },

    // Inizializza il sistema di traduzioni
    async init() {
        // Ottieni la lingua dalla URL o usa il default
        this.currentLang = this.getLangFromUrl();

        // Carica le traduzioni
        await this.loadTranslations(this.currentLang);

        // Applica le traduzioni al DOM
        this.applyTranslations();

        // Imposta il selettore della lingua nell'interfaccia
        const langSelector = document.getElementById('language-selector');
        if (langSelector) {
            langSelector.value = this.currentLang;

            // Listener per il cambio lingua
            langSelector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // Dispara evento init completato
        document.dispatchEvent(new CustomEvent('translationsLoaded', {
            detail: { language: this.currentLang }
        }));
    }
};

// Inizializzazione del sito
document.addEventListener('DOMContentLoaded', async () => {
    // Inizializza il sistema di traduzioni
    await TranslationManager.init();

    // Inizializza il menu laterale
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) {
        // Quando l'utente clicca su un link nel menu laterale, chiude il menu
        sideMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(sideMenu);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            });
        });
    }

    // Inizializza Hero Swiper
    const heroSwiper = new Swiper('.hero-swiper', {
        direction: 'horizontal',
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1200,
        pagination: false, // Remove pagination
        navigation: {
            nextEl: '.hero-button-next',
            prevEl: '.hero-button-prev',
        },
        on: {
            slideChangeTransitionStart: function() {
                // Anima il contenuto della slide quando cambia
                const activeSlide = document.querySelector('.swiper-slide-active .hero-content');
                if (activeSlide) {
                    activeSlide.style.opacity = '0';
                    activeSlide.style.transform = 'translateY(30px)';

                    setTimeout(() => {
                        activeSlide.style.opacity = '1';
                        activeSlide.style.transform = 'translateY(0)';
                        activeSlide.style.transition = 'all 1s ease';
                    }, 300);
                }
            }
        }
    });

    // Inizializza Testimonials Swiper
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        }
    });

    // Gestione dello scroll e dell'header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth Scroll per ancore
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            // Ignora gli href vuoti o "#"
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Chiudi il menu mobile se è aperto
                const sideMenu = document.getElementById('sideMenu');
                if (sideMenu) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(sideMenu);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }

                // Calcola l'offset a causa dell'header fisso
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animazioni di ingresso per le sezioni
    const animateSections = () => {
        const sections = document.querySelectorAll('section:not(.hero-section)');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        sections.forEach(section => {
            section.classList.add('section-animate');
            observer.observe(section);
        });
    };

    animateSections();

    // Inizializza AOS (Animate On Scroll)
    AOS.init({
        once: true,
        offset: 100,
        duration: 800
    });
});
