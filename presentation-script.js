// ======================================
// PRESENTATION VARIABLES
// ======================================

let currentSlide = 1;
const totalSlides = 7;
let selectedProfile = null;
let currentProblem = null;

// Problem database
const problems = {
    engineering: {
        statement: `
            <h3>🔧 Problema de Ingeniería en Sistemas</h3>
            <p><strong>Situación:</strong> Necesitas calcular el volumen de un servidor en forma de prisma rectangular para determinar el espacio de almacenamiento.</p>
            <p><strong>Dimensiones del servidor:</strong></p>
            <ul>
                <li>Largo: 50 cm</li>
                <li>Ancho: 20 cm</li>
                <li>Alto: 10 cm</li>
            </ul>
            <p><strong>Pregunta:</strong> ¿Cuál es el volumen del servidor en litros?</p>
            <p><em>Recuerda: 1 litro = 1000 cm³</em></p>
        `,
        correctAnswer: 10,
        unit: "litros",
        solution: `
            <strong>Solución paso a paso:</strong><br>
            1. Aplicamos la fórmula del volumen de un prisma rectangular: V = largo × ancho × alto<br>
            2. V = 50 cm × 20 cm × 10 cm = 10,000 cm³<br>
            3. Convertimos a litros: 10,000 cm³ ÷ 1000 = 10 litros<br><br>
            <strong>Respuesta:</strong> El servidor tiene un volumen de 10 litros.
        `
    },
    fashion: {
        statement: `
            <h3>✂️ Problema de Diseño de Modas</h3>
            <p><strong>Situación:</strong> Estás diseñando una falda cónica y necesitas calcular la cantidad de tela necesaria para la superficie lateral.</p>
            <p><strong>Especificaciones de la falda:</strong></p>
            <ul>
                <li>Radio de la base: 0.5 metros</li>
                <li>Altura de la falda: 0.9 metros</li>
            </ul>
            <p><strong>Pregunta:</strong> ¿Cuál es el área lateral de la falda en metros cuadrados?</p>
            <p><em>Nota: Para el área lateral del cono usa A = πrg, donde g es la generatriz</em></p>
            <p><em>Generatriz: g = √(r² + h²)</em></p>
        `,
        correctAnswer: 1.62,
        unit: "m²",
        tolerance: 0.05,
        solution: `
            <strong>Solución paso a paso:</strong><br>
            1. Primero calculamos la generatriz: g = √(r² + h²)<br>
            2. g = √(0.5² + 0.9²) = √(0.25 + 0.81) = √1.06 ≈ 1.03 m<br>
            3. Aplicamos la fórmula del área lateral: A = πrg<br>
            4. A = π × 0.5 × 1.03 ≈ 3.14159 × 0.5 × 1.03 ≈ 1.62 m²<br><br>
            <strong>Respuesta:</strong> El área lateral de la falda es aproximadamente 1.62 m².
        `
    }
};

// ======================================
// INITIALIZATION
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    initializePresentation();
    setupEventListeners();
    updateSlideCounter();
    updateProgressBar();
});

function initializePresentation() {
    // Show first slide
    showSlide(1);
    
    // Update navigation buttons
    updateNavigationButtons();
    
    console.log('Presentation initialized');
}

function setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Touch/swipe support for mobile
    let startX = null;
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', function(e) {
        if (startX === null) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                changeSlide(1); // Swipe left - next slide
            } else {
                changeSlide(-1); // Swipe right - previous slide
            }
        }
        
        startX = null;
    });
    
    // Prevent right-click context menu for cleaner presentation
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(handleWindowResize, 250));
}

function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
            event.preventDefault();
            changeSlide(1);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            changeSlide(-1);
            break;
        case 'Home':
            event.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            event.preventDefault();
            goToSlide(totalSlides);
            break;
        case 'Escape':
            // Could be used for fullscreen toggle in the future
            break;
    }
}

function handleWindowResize() {
    // Ensure proper scaling on resize
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.transition = 'none';
        // Force reflow
        slide.offsetHeight;
        slide.style.transition = '';
    });
}

// ======================================
// SLIDE NAVIGATION
// ======================================

function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    
    if (newSlide >= 1 && newSlide <= totalSlides) {
        goToSlide(newSlide);
    }
}

function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;
    
    // Hide current slide
    const currentSlideElement = document.getElementById(`slide${currentSlide}`);
    if (currentSlideElement) {
        currentSlideElement.classList.remove('active');
        if (slideNumber > currentSlide) {
            currentSlideElement.classList.add('prev');
        }
    }
    
    // Show new slide
    const newSlideElement = document.getElementById(`slide${slideNumber}`);
    if (newSlideElement) {
        // Remove all classes first
        newSlideElement.classList.remove('prev', 'active');
        
        // Add appropriate animation class
        if (slideNumber > currentSlide) {
            newSlideElement.classList.add('slide-in-right');
        } else {
            newSlideElement.classList.add('slide-in-left');
        }
        
        // Activate the slide
        setTimeout(() => {
            newSlideElement.classList.add('active');
            newSlideElement.classList.remove('slide-in-right', 'slide-in-left');
        }, 50);
    }
    
    currentSlide = slideNumber;
    updateSlideCounter();
    updateProgressBar();
    updateNavigationButtons();
    
    // Special handling for interactive slide
    if (currentSlide === 7) {
        resetInteractiveModule();
    }
    
    // Announce slide change for accessibility
    announceSlideChange();
}

function updateSlideCounter() {
    const currentSlideElement = document.getElementById('currentSlide');
    const totalSlidesElement = document.getElementById('totalSlides');
    
    if (currentSlideElement) {
        currentSlideElement.textContent = currentSlide;
    }
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progress = (currentSlide / totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides;
    }
}

function showSlide(slideNumber) {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev');
    });
    
    // Show target slide
    const targetSlide = document.getElementById(`slide${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');
    }
}

function announceSlideChange() {
    // Create accessible announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Diapositiva ${currentSlide} de ${totalSlides}`;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ======================================
// INTERACTIVE MODULE (SLIDE 7)
// ======================================

function selectProfile(profile) {
    selectedProfile = profile;
    currentProblem = problems[profile];
    
    // Hide profile selection
    const profileSelection = document.getElementById('profileSelection');
    const problemSection = document.getElementById('problemSection');
    
    if (profileSelection && problemSection) {
        profileSelection.style.display = 'none';
        problemSection.style.display = 'block';
        
        // Update problem statement
        const problemStatement = document.getElementById('problemStatement');
        const unitLabel = document.getElementById('unitLabel');
        
        if (problemStatement) {
            problemStatement.innerHTML = currentProblem.statement;
        }
        
        if (unitLabel) {
            unitLabel.textContent = currentProblem.unit;
        }
        
        // Clear previous answer and feedback
        const userAnswer = document.getElementById('userAnswer');
        const feedback = document.getElementById('feedback');
        const resetBtn = document.querySelector('.reset-btn');
        
        if (userAnswer) userAnswer.value = '';
        if (feedback) {
            feedback.style.display = 'none';
            feedback.className = 'feedback';
        }
        if (resetBtn) resetBtn.style.display = 'none';
    }
    
    // Focus on input for better UX
    setTimeout(() => {
        const input = document.getElementById('userAnswer');
        if (input) input.focus();
    }, 300);
}

function checkAnswer() {
    const userAnswerElement = document.getElementById('userAnswer');
    const feedback = document.getElementById('feedback');
    const resetBtn = document.querySelector('.reset-btn');
    
    if (!userAnswerElement || !feedback || !currentProblem) return;
    
    const userAnswer = parseFloat(userAnswerElement.value);
    const correctAnswer = currentProblem.correctAnswer;
    const tolerance = currentProblem.tolerance || 0.01;
    
    if (isNaN(userAnswer)) {
        showFeedback('Por favor, ingresa un número válido.', 'incorrect');
        return;
    }
    
    const isCorrect = Math.abs(userAnswer - correctAnswer) <= tolerance;
    
    if (isCorrect) {
        showFeedback(
            `<strong>¡Correcto! 🎉</strong><br><br>${currentProblem.solution}`,
            'correct'
        );
    } else {
        showFeedback(
            `<strong>Respuesta incorrecta. 🤔</strong><br><br>
            Tu respuesta: ${userAnswer} ${currentProblem.unit}<br>
            Respuesta correcta: ${correctAnswer} ${currentProblem.unit}<br><br>
            ${currentProblem.solution}`,
            'incorrect'
        );
    }
    
    // Show reset button
    if (resetBtn) {
        resetBtn.style.display = 'inline-block';
    }
    
    // Disable input and button to prevent multiple submissions
    userAnswerElement.disabled = true;
    const checkBtn = document.querySelector('.solution-input button');
    if (checkBtn) checkBtn.disabled = true;
}

function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.innerHTML = message;
        feedback.className = `feedback ${type}`;
        feedback.style.display = 'block';
        
        // Smooth scroll to feedback
        feedback.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

function resetModule() {
    selectedProfile = null;
    currentProblem = null;
    
    // Show profile selection, hide problem section
    const profileSelection = document.getElementById('profileSelection');
    const problemSection = document.getElementById('problemSection');
    
    if (profileSelection && problemSection) {
        profileSelection.style.display = 'block';
        problemSection.style.display = 'none';
    }
    
    // Reset form elements
    resetInteractiveModule();
}

function resetInteractiveModule() {
    const userAnswer = document.getElementById('userAnswer');
    const feedback = document.getElementById('feedback');
    const resetBtn = document.querySelector('.reset-btn');
    const checkBtn = document.querySelector('.solution-input button');
    
    if (userAnswer) {
        userAnswer.value = '';
        userAnswer.disabled = false;
    }
    
    if (feedback) {
        feedback.style.display = 'none';
        feedback.className = 'feedback';
    }
    
    if (resetBtn) {
        resetBtn.style.display = 'none';
    }
    
    if (checkBtn) {
        checkBtn.disabled = false;
    }
}

// ======================================
// UTILITY FUNCTIONS
// ======================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format numbers for display
function formatNumber(num, decimals = 2) {
    return parseFloat(num.toFixed(decimals));
}

// ======================================
// ACCESSIBILITY ENHANCEMENTS
// ======================================

// Add screen reader only styles
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);

// ======================================
// PRESENTATION CONTROLS
// ======================================

// Add presentation mode toggle (future enhancement)
function togglePresentationMode() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

// Add slide overview mode (future enhancement)
function showSlideOverview() {
    console.log('Slide overview mode - future enhancement');
}

// ======================================
// PERFORMANCE OPTIMIZATIONS
// ======================================

// Lazy load animations only when needed
function optimizeAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
        
        // Add CSS for reduced motion
        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizeAnimations);

// ======================================
// ERROR HANDLING
// ======================================

window.addEventListener('error', function(event) {
    console.error('Presentation error:', event.error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
    `;
    errorMessage.textContent = 'Se produjo un error en la presentación. Por favor, recarga la página.';
    
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }, 5000);
});

// ======================================
// EXPORT FOR TESTING (if needed)
// ======================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        changeSlide,
        goToSlide,
        selectProfile,
        checkAnswer,
        resetModule,
        problems
    };
}

console.log('Presentation script loaded successfully');