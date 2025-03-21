/**
 * Sistema multilingua per il sito web del Dr. Nicola Vaia
 * Gestisce il caricamento dinamico delle traduzioni e l'applicazione al DOM
 * Versione ottimizzata per performance e accessibilità
 */

// Oggetto globale per la gestione delle traduzioni
const TranslationManager = {
    currentLang: 'it',
    translations: {},
    supportedLanguages: ['it', 'en'],
    translationsCache: {}, // Cache per le traduzioni già caricate

    // Ottiene il parametro 'lang' dalla URL o dal localStorage
    getLangFromUrl(defaultLang = 'it') {
        // Prima controlla se c'è una lingua salvata nel localStorage
        const savedLang = localStorage.getItem('preferred_language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            return savedLang;
        }

        // Altrimenti controlla l'URL
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang')?.toLowerCase() || defaultLang;
        return this.supportedLanguages.includes(urlLang) ? urlLang : defaultLang;
    },

    // Carica il file JSON in base al parametro lang
    async loadTranslations(lang) {
        try {
            // Verifica se abbiamo già caricato questa lingua
            if (this.translationsCache[lang]) {
                console.log(`Traduzioni caricate dalla cache per la lingua: ${lang}`);
                this.translations = this.translationsCache[lang];
                this.currentLang = lang;
                return this.translations;
            }

            // Crea il percorso del file JSON in base al parametro lang
            const filePath = `json/translation_${lang.toUpperCase()}.json`;

            // Usa fetch per ottenere il file JSON
            const response = await fetch(filePath, {
                cache: 'default', // Permette al browser di memorizzare nella cache
                headers: {
                    'Accept': 'application/json'
                }
            });

            // Verifica se la richiesta ha avuto successo
            if (!response.ok) {
                console.warn(`Impossibile caricare le traduzioni per ${lang}. Caricamento del file di lingua predefinito.`);
                return this.loadTranslations('it');
            }

            // Converti la risposta in un oggetto JSON
            this.translations = await response.json();
            this.currentLang = lang;

            // Salva nella cache
            this.translationsCache[lang] = this.translations;

            // Salva la preferenza dell'utente
            localStorage.setItem('preferred_language', lang);

            console.log(`Traduzioni caricate per la lingua: ${lang}`);
            return this.translations;
        } catch (error) {
            console.error('Errore durante il caricamento del JSON:', error);
            // Fallback a un oggetto vuoto per evitare errori
            return {};

// Funzione per gestire lo smooth scroll migliorata per mobile
            function setupSmoothScroll() {
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

                            // Aggiungiamo un ritardo per permettere al menu di chiudersi completamente
                            setTimeout(() => {
                                // Calcola l'offset a causa dell'header fisso
                                const header = document.querySelector('header');
                                const headerHeight = header ? header.offsetHeight : 0;
                                const elementPosition = targetElement.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }, 100);
                        }
                    });
                });
            }

// Gestione dei menu e del comportamento responsive
            function setupNavigation() {
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

                // Gestione dello scroll e dell'header
                const header = document.querySelector('header');
                if (header) {
                    // Ottimizzazione: utilizziamo requestAnimationFrame per gestire lo scroll
                    let lastScrollPosition = 0;
                    let scrollTicking = false;

                    window.addEventListener('scroll', () => {
                        lastScrollPosition = window.scrollY;

                        if (!scrollTicking) {
                            window.requestAnimationFrame(() => {
                                if (lastScrollPosition > 50) {
                                    header.classList.add('scrolled');
                                } else {
                                    header.classList.remove('scrolled');
                                }
                                scrollTicking = false;
                            });

                            scrollTicking = true;
                        }
                    });
                }

                // Active menu item on scroll
                const sections = document.querySelectorAll('section[id]');
                const navLinks = document.querySelectorAll('.nav-link');

                if (sections.length > 0 && navLinks.length > 0) {
                    // Utilizziamo IntersectionObserver per il highlighting dei menu
                    const observerOptions = {
                        root: null,
                        rootMargin: '-100px 0px -80% 0px',
                        threshold: 0
                    };

                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const id = entry.target.getAttribute('id');
                                navLinks.forEach(link => {
                                    link.classList.remove('active');
                                    if (link.getAttribute('href') === `#${id}`) {
                                        link.classList.add('active');
                                    }
                                });
                            }
                        });
                    }, observerOptions);

                    sections.forEach(section => {
                        observer.observe(section);
                    });
                }
            }

// Setup Swiper e altre animazioni
            function setupAnimations() {
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
                    pagination: false,
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

                // Back to Top Button
                const backToTopButton = document.querySelector('.back-to-top');
                if (backToTopButton) {
                    let lastScrollTop = 0;
                    let scrollThrottleTimer;

                    window.addEventListener('scroll', () => {
                        if (scrollThrottleTimer) return;

                        scrollThrottleTimer = setTimeout(() => {
                            const scrollTop = window.scrollY;

                            // Mostra il pulsante solo quando si scorre verso l'alto o si è oltre la soglia
                            if (scrollTop > 300) {
                                backToTopButton.classList.add('show');
                            } else {
                                backToTopButton.classList.remove('show');
                            }

                            lastScrollTop = scrollTop;
                            scrollThrottleTimer = null;
                        }, 100);
                    });

                    backToTopButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }
            }

// Inizializzazione del sito
            document.addEventListener('DOMContentLoaded', async () => {
                // Prefetch delle lingue aggiuntive
                if ('connection' in navigator && navigator.connection.saveData !== true) {
                    // Precarica la lingua alternativa solo se l'utente non è in modalità risparmio dati
                    const prefetchLang = TranslationManager.currentLang === 'it' ? 'en' : 'it';
                    const linkElement = document.createElement('link');
                    linkElement.rel = 'prefetch';
                    linkElement.href = `json/translation_${prefetchLang.toUpperCase()}.json`;
                    linkElement.as = 'fetch';
                    linkElement.type = 'application/json';
                    document.head.appendChild(linkElement);
                }

                // Inizializza il sistema di traduzioni
                await TranslationManager.init();

                // Setup navigazione e menu
                setupNavigation();

                // Setup Scroll
                setupSmoothScroll();

                // Setup Swiper e Animazioni
                setupAnimations();

                // Inizializza AOS (Animate On Scroll) con throttling
                AOS.init({
                    once: true,
                    offset: 100,
                    duration: 800,
                    throttleDelay: 99  // Aumenta il delay per migliorare le performance
                });
            });

// Ottimizzazione per il caricamento delle pagine
            if ('IntersectionObserver' in window) {
                // Lazy loading per le immagini in background
                document.addEventListener('DOMContentLoaded', () => {
                    // Imposta un observer per ritardare il caricamento delle immagini di sfondo
                    const bgImages = document.querySelectorAll('.hero-slide, .hero-mobile-image');

                    const bgObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const style = entry.target.getAttribute('style');
                                if (style && style.includes('background-image: url')) {
                                    // L'elemento ha già un'immagine di sfondo
                                    bgObserver.unobserve(entry.target);
                                } else if (entry.target.dataset.bgImage) {
                                    // Carica l'immagine di sfondo da data-attribute
                                    entry.target.style.backgroundImage = `url('${entry.target.dataset.bgImage}')`;
                                    bgObserver.unobserve(entry.target);
                                }
                            }
                        });
                    }, {
                        rootMargin: '100px'
                    });

                    bgImages.forEach(img => bgObserver.observe(img));
                });
            }

// Gestione dark mode del sistema
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // L'utente preferisce il tema scuro
                document.documentElement.classList.add('dark-theme');
            }

// Ascolta cambiamenti nella preferenza di modalità chiaro/scuro
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                    if (event.matches) {
                        document.documentElement.classList.add('dark-theme');
                    } else {
                        document.documentElement.classList.remove('dark-theme');
                    }
                });
            }
        }
    },

    // Applica le traduzioni agli elementi con data-i18n
    applyTranslations() {
        if (!this.translations || Object.keys(this.translations).length === 0) return;

        // Traduci gli elementi di testo
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

        // Aggiorna il meta tag di descrizione
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && this.translations['site_description']) {
            metaDesc.setAttribute('content', this.translations['site_description']);
        }

        // Aggiorna i meta tag OG se presenti
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && this.translations['site_title']) {
            ogTitle.setAttribute('content', this.translations['site_title']);
        }

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && this.translations['site_description']) {
            ogDesc.setAttribute('content', this.translations['site_description']);
        }

        // Dispara un evento di traduzione completata
        document.dispatchEvent(new CustomEvent('translationsApplied', {
            detail: { language: this.currentLang }
        }));
    },

    // Aggiorna l'URL con il parametro della lingua selezionata
    updateUrlLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) return;

        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);

        try {
            window.history.replaceState({}, '', url);
        } catch (e) {
            console.warn('Impossibile aggiornare la cronologia del browser:', e);
        }
    },

    // Cambia la lingua e aggiorna la pagina
    async changeLanguage(lang) {
        if (lang === this.currentLang) return;

        // Mostra indicatore di caricamento
        document.body.classList.add('loading-language');

        await this.loadTranslations(lang);
        this.updateUrlLanguage(lang);
        this.applyTranslations();

        // Aggiorna il selettore della lingua nell'interfaccia
        const langSelector = document.getElementById('language-selector');
        if (langSelector) {
            langSelector.value = lang;
        }

        // Rimuovi indicatore di caricamento
        document.body.classList.remove('loading-language');

        // Dispara un evento per notificare altri script
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    },

    // Inizializza il sistema di traduzioni
    async init() {
        // Ottieni la lingua dalla URL o dal localStorage
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

            // Gestisce il focus sulla lingua
            langSelector.addEventListener('focus', function() {
                this.parentNode.classList.add('focused');
            });

            langSelector.addEventListener('blur', function() {
                this.parentNode.classList.remove('focused');
            });
        }

        // Dispara evento init completato
        document.dispatchEvent(new CustomEvent('translationsLoaded', {
            detail: { language: this.currentLang }
        }));
    }
};
