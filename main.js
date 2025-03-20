/**
 * Script aggiuntivo per funzionalità avanzate
 * Sito web Dr. Nicola Vaia - Chirurgo Plastico
 * Versione ottimizzata per performance e accessibilità
 */

// Performance: utilizziamo moduli per organizzare il codice
const DoctorSite = (function() {
    // Cache degli elementi DOM frequentemente utilizzati
    const DOM = {};

    // Impostazioni e configurazioni
    const config = {
        animationDelay: 500,
        scrollThreshold: 50,
        animationOffset: 100
    };

    // Loader di pagina
    const PageLoader = {
        init: function() {
            // Creiamo il loader solo se stiamo caricando una pagina fresca (non da cache)
            if (window.performance && window.performance.navigation.type !== 1) {
                const loader = document.createElement('div');
                loader.className = 'loader';
                loader.setAttribute('aria-label', 'Caricamento pagina');
                loader.innerHTML = '<div class="loader-spinner" role="status"></div>';
                document.body.appendChild(loader);

                // Rimuovi il loader quando la pagina è caricata
                const hideLoader = () => {
                    if (loader) {
                        loader.classList.add('hidden');
                        setTimeout(() => {
                            loader.parentNode?.removeChild(loader);
                        }, 500);
                    }
                };

                // Gestisci vari eventi di caricamento
                if (document.readyState === 'complete') {
                    hideLoader();
                } else {
                    window.addEventListener('load', hideLoader);

                    // Fallback per garantire la rimozione del loader
                    setTimeout(hideLoader, 5000);
                }
            }
        }
    };

    // Gestione del selettore di lingua
    const LanguageSelector = {
        init: function() {
            const langSelector = document.getElementById('language-selector');

            if (!langSelector) return;

            DOM.langSelector = langSelector;

            // Migliora l'interazione con il selettore
            langSelector.addEventListener('focus', function() {
                this.parentNode.classList.add('focused');
            });

            langSelector.addEventListener('blur', function() {
                this.parentNode.classList.remove('focused');
            });

            // Migliora l'accessibilità della tastiera
            langSelector.addEventListener('keydown', function(e) {
                // Permetti la navigazione con le frecce su/giù senza aprire il menu
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const currentIdx = this.selectedIndex;
                    const newIdx = e.key === 'ArrowUp'
                        ? Math.max(0, currentIdx - 1)
                        : Math.min(this.options.length - 1, currentIdx + 1);

                    this.selectedIndex = newIdx;

                    // Attiva il cambio linguaggio immediatamente
                    if (typeof TranslationManager !== 'undefined') {
                        TranslationManager.changeLanguage(this.value);
                    }
                }
            });
        }
    };

    // Animazioni ottimizzate di scroll
    const ScrollAnimations = {
        init: function() {
            if (!('IntersectionObserver' in window)) return;

            const elements = document.querySelectorAll('.fade-in-up');

            // Usiamo un IntersectionObserver per ottimizzare le animazioni
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            elements.forEach(element => {
                observer.observe(element);
            });
        }
    };

    // Hero Animations ottimizzate
    const HeroAnimations = {
        init: function() {
            const animateActiveSlide = () => {
                const activeSlide = document.querySelector('.swiper-slide-active .hero-content');
                if (!activeSlide) return;

                // Ottimizziamo per performance: usiamo classList invece di style
                activeSlide.classList.add('hero-content-animate-out');

                setTimeout(() => {
                    activeSlide.classList.remove('hero-content-animate-out');
                    activeSlide.classList.add('hero-content-animate-in');
                }, 200);
            };

            // Anima all'inizio
            setTimeout(animateActiveSlide, config.animationDelay);

            // Aggiungi listener per il cambio della slide
            document.addEventListener('slideChangeTransitionStart', animateActiveSlide);

            // Ottimizza le animazioni su dispositivi mobili meno potenti
            if (window.matchMedia('(max-width: 768px)').matches) {
                const mobileHero = document.querySelector('.hero-mobile-content');
                if (mobileHero) {
                    mobileHero.classList.add('hero-content-animate-in');
                }
            }
        }
    };

    // Gestione form di contatto migliorata
    const ContactForm = {
        init: function() {
            const form = document.getElementById('contactForm');

            if (!form) return;

            DOM.contactForm = form;

            // Funzione di validazione avanzata
            const validateForm = () => {
                let isValid = form.checkValidity();

                // Validazione personalizzata aggiuntiva
                const email = form.querySelector('input[type="email"]');
                if (email && email.value) {
                    // Pattern email migliorato
                    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
                    if (!validEmail) {
                        email.setCustomValidity('Inserisci un indirizzo email valido');
                        isValid = false;
                    } else {
                        email.setCustomValidity('');
                    }
                }

                return isValid;
            };

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Validazione completa
                if (!validateForm()) {
                    e.stopPropagation();
                    this.classList.add('was-validated');

                    // Scorri fino al primo campo con errori
                    const firstError = this.querySelector(':invalid');
                    if (firstError) {
                        firstError.focus();
                    }

                    return;
                }

                // Feedback UX durante invio
                const submitBtn = this.querySelector('.btn-submit');
                const originalText = submitBtn.textContent;
                const formData = new FormData(this);

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Invio...';

                // Simulazione invio asincrono ottimizzata
                // In una vera implementazione, qui andrebbe una chiamata fetch o XMLHttpRequest
                setTimeout(() => {
                    // Mostra messaggio di successo con transizione graduale
                    form.classList.add('form-success-transition');

                    setTimeout(() => {
                        form.innerHTML = `
                            <div class="alert alert-success" role="alert">
                              <h4 class="alert-heading">Messaggio inviato!</h4>
                              <p>Grazie per averci contattato. Riceverai una risposta al più presto.</p>
                            </div>
                        `;
                        form.classList.remove('form-success-transition');
                    }, 300);
                }, 1500);
            });

            // Miglioria per usabilità: mostra validazione in tempo reale
            form.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', function() {
                    if (this.checkValidity()) {
                        this.classList.add('is-valid');
                        this.classList.remove('is-invalid');
                    } else if (this.value) {
                        this.classList.add('is-invalid');
                        this.classList.remove('is-valid');
                    }
                });
            });
        }
    };

    // Gestione della navigazione sticky ottimizzata
    const StickyNavigation = {
        init: function() {
            const header = document.querySelector('header');
            if (!header) return;

            DOM.header = header;

            // Ottimizzazione dello scroll con debounce
            let lastScrollY = 0;
            let ticking = false;

            window.addEventListener('scroll', () => {
                lastScrollY = window.scrollY;

                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        if (lastScrollY > config.scrollThreshold) {
                            header.classList.add('scrolled');
                        } else {
                            header.classList.remove('scrolled');
                        }
                        ticking = false;
                    });

                    ticking = true;
                }
            });

            // Controlla posizione iniziale
            if (window.scrollY > config.scrollThreshold) {
                header.classList.add('scrolled');
            }
        }
    };

    // Miglioramenti per prestazioni
    const PerformanceOptimizations = {
        init: function() {
            // Precarica immagini importanti
            if ('connection' in navigator && (!navigator.connection.saveData)) {
                const preloadImages = [
                    'assets/img/reconstructive-surgery.jpg',
                    'assets/img/aesthetic-surgery.jpg'
                ];

                preloadImages.forEach(src => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.as = 'image';
                    link.href = src;
                    document.head.appendChild(link);
                });
            }

            // Defer loading per immagini non critiche
            const deferImages = document.querySelectorAll('img[data-src]');
            if ('IntersectionObserver' in window && deferImages.length > 0) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '100px'
                });

                deferImages.forEach(img => imageObserver.observe(img));
            }
        }
    };

    // Miglioramenti per accessibilità
    const AccessibilityImprovements = {
        init: function() {
            // Focus trap per il menu laterale per migliorare la navigazione da tastiera
            const sideMenu = document.getElementById('sideMenu');
            if (!sideMenu) return;

            // Migliora il focus quando il menu laterale è aperto
            sideMenu.addEventListener('shown.bs.offcanvas', () => {
                // Trova il primo elemento focusabile nel menu
                const firstFocusable = sideMenu.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            });

            // Gestisci il focus quando il menu è chiuso
            sideMenu.addEventListener('hidden.bs.offcanvas', () => {
                // Ripristina il focus al pulsante che ha aperto il menu
                const openButton = document.querySelector('[data-bs-target="#sideMenu"]');
                if (openButton) {
                    openButton.focus();
                }
            });

            // Aggiungi descrizioni ARIA per migliorare screen reader
            document.querySelectorAll('.social-item').forEach(item => {
                if (!item.hasAttribute('aria-label')) {
                    const icon = item.querySelector('i');
                    if (icon) {
                        const iconClass = Array.from(icon.classList).find(c => c.startsWith('fa-'));
                        if (iconClass) {
                            const label = iconClass.replace('fa-', '');
                            item.setAttribute('aria-label', label);
                        }
                    }
                }
            });
        }
    };

    // Inizializzazione principale
    const init = function() {
        // Cache elementi DOM principali
        DOM.body = document.body;
        DOM.window = window;

        // Inizializza il loader di pagina (per prime impressioni)
        PageLoader.init();

        // Inizializza componenti nell'ordine ottimale
        PerformanceOptimizations.init();
        StickyNavigation.init();
        LanguageSelector.init();
        ScrollAnimations.init();
        HeroAnimations.init();
        ContactForm.init();
        AccessibilityImprovements.init();

        console.log('Tutti i moduli JavaScript sono stati inizializzati');
    };

    // Metodo pubblico per reinizializzare componenti dopo cambi dinamici
    const refresh = function() {
        ScrollAnimations.init();
    };

    // API pubblica
    return {
        init: init,
        refresh: refresh
    };
})();

// Inizializzazione al caricamento del DOM
document.addEventListener('DOMContentLoaded', DoctorSite.init);

// Aggiornamento in caso di cambi dinamici nel DOM
document.addEventListener('translationsApplied', DoctorSite.refresh);

// Precarica immagini chiave
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        const imagesToPreload = [
            'assets/img/plastic-surgeon.jpg',
            'assets/img/aesthetic-surgery.jpg'
        ];

        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, { timeout: 2000 });
}

// Gestione della visibilità del pulsante WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    const footer = document.querySelector('footer');
    const backToTopButton = document.querySelector('.back-to-top');

    if (!whatsappButton || !footer || !backToTopButton) return;

    let lastScrollTop = 0;
    let scrollThrottleTimer;

    // Funzione per controllare la visibilità del pulsante WhatsApp
    function checkWhatsAppButtonVisibility() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const footerTop = footer.getBoundingClientRect().top + window.scrollY;

        // Mostra il pulsante solo quando si è scrollato oltre una certa soglia
        // e non si è arrivati al footer
        if (scrollTop > 300 && scrollTop + windowHeight < footerTop) {
            whatsappButton.classList.add('show');
        } else {
            whatsappButton.classList.remove('show');
        }

        // Sincronizza la visibilità con il pulsante back-to-top
        if (backToTopButton.classList.contains('show') && scrollTop + windowHeight < footerTop) {
            whatsappButton.classList.add('show');
        }
    }

    // Usa throttling per ottimizzare le prestazioni durante lo scroll
    window.addEventListener('scroll', function() {
        if (scrollThrottleTimer) return;

        scrollThrottleTimer = setTimeout(function() {
            checkWhatsAppButtonVisibility();
            scrollThrottleTimer = null;
        }, 100);
    });

    // Controlla la visibilità anche al caricamento della pagina
    checkWhatsAppButtonVisibility();

    // Controlla la visibilità al ridimensionamento della finestra
    window.addEventListener('resize', checkWhatsAppButtonVisibility);
});
