/**
 * Script aggiuntivo per funzionalità avanzate
 * Sito web Dr. Nicola Vaia - Chirurgo Plastico
 */

// Loader di paging
const PageLoader = {
    init: function() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 500);
        });
    }
};

// Gestione del selettore di lingua
const LanguageSelector = {
    init: function() {
        const langSelector = document.getElementById('language-selector');

        if (langSelector) {
            // Gestisci il focus e l'hover del selettore
            langSelector.addEventListener('focus', function() {
                this.parentNode.classList.add('focused');
            });

            langSelector.addEventListener('blur', function() {
                this.parentNode.classList.remove('focused');
            });

            // Assicurati che il selettore sia correttamente impostato al caricamento
            langSelector.value = TranslationManager.currentLang;

            // Aggiungi evento per gestire il cambio lingua
            langSelector.addEventListener('change', function() {
                const newLang = this.value;
                TranslationManager.changeLanguage(newLang);
            });
        }
    }
};

// Animazioni di scroll
const ScrollAnimations = {
    init: function() {
        const elements = document.querySelectorAll('.fade-in-up');

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

// Hero Animations
const HeroAnimations = {
    init: function() {
        // Anima il contenuto della slide attiva
        const animateActiveSlide = () => {
            const activeSlide = document.querySelector('.swiper-slide-active .hero-content');
            if (activeSlide) {
                activeSlide.style.opacity = '0';
                activeSlide.style.transform = 'translateY(40px)';

                setTimeout(() => {
                    activeSlide.style.opacity = '1';
                    activeSlide.style.transform = 'translateY(0)';
                    activeSlide.style.transition = 'all 1.2s ease';
                }, 200);
            }
        };

        // Anima all'inizio
        setTimeout(animateActiveSlide, 500);

        // Aggiungi listener per il cambio della slide
        document.addEventListener('slideChangeTransitionStart', animateActiveSlide);
    }
};

// Gestione form di contatto
const ContactForm = {
    init: function() {
        const form = document.getElementById('contactForm');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Validazione base del form
                if (!this.checkValidity()) {
                    e.stopPropagation();
                    this.classList.add('was-validated');
                    return;
                }

                // Simulazione invio form
                const submitBtn = this.querySelector('.btn-submit');
                const originalText = submitBtn.textContent;

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Invio...';

                // Simulazione invio asincrono
                setTimeout(() => {
                    // Mostra messaggio di successo
                    form.innerHTML = `
            <div class="alert alert-success" role="alert">
              <h4 class="alert-heading">Messaggio inviato!</h4>
              <p>Grazie per averci contattato. Riceverai una risposta al più presto.</p>
            </div>
          `;
                }, 1500);
            });
        }
    }
};

// Gestione della navigazione sticky
const StickyNavigation = {
    init: function() {
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
    }
};

// Inizializzazione di tutti i moduli
document.addEventListener('DOMContentLoaded', function() {
    // Inizializza il loader di pagina
    PageLoader.init();

    // Inizializza le animazioni di scroll
    ScrollAnimations.init();

    // Inizializza il selettore di lingua
    LanguageSelector.init();

    // Inizializza le animazioni dell'hero
    HeroAnimations.init();

    // Inizializza la gestione del form di contatto
    ContactForm.init();

    // Inizializza la navigazione sticky
    StickyNavigation.init();

    console.log('Tutti i moduli JavaScript sono stati inizializzati');
});
