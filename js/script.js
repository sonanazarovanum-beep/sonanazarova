// ================================
// PYTHAGORAS SQUARE CALCULATOR
// ================================

function calculatePythagorasSquare() {
    const dateInput = document.getElementById('pythagoras-date');
    const dateStr = dateInput.value.trim();
    
    // Validate date format DD.MM.YYYY
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(dateStr)) {
        alert('Пожалуйста, введите дату в формате ДД.ММ.ГГГГ (например, 28.02.1986)');
        return;
    }
    
    const result = calculatePythagoras(dateStr);
    
    // Display working numbers
    document.getElementById('s1-value').textContent = result.S1;
    document.getElementById('s2-value').textContent = result.S2;
    document.getElementById('s3-value').textContent = result.S3;
    document.getElementById('s4-value').textContent = result.S4;
    
    // Display matrix
    for (let i = 1; i <= 9; i++) {
        const cellValue = result.matrix[i] || '-';
        document.getElementById(`cell-${i}`).textContent = cellValue;
    }
    
    // Show results
    document.getElementById('pythagoras-calculations').style.display = 'block';
    document.getElementById('pythagoras-result').style.display = 'block';
    
    // Scroll to result
    document.getElementById('pythagoras-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calculatePythagoras(dateStr) {
    // dateStr формат: DD.MM.YYYY

    // 1. все цифры даты
    const dateDigits = dateStr.replace(/\D/g, '').split('').map(Number);

    // 2. S1 — сумма всех цифр даты
    const S1 = dateDigits.reduce((sum, n) => sum + n, 0);

    // 3. S2 — сумма цифр S1 (с приведением к однозначному)
    const S2_original = S1.toString().split('').reduce((sum, n) => sum + Number(n), 0);
    
    // Массив всех промежуточных значений S2
    const S2_intermediate = [];
    let S2_temp = S2_original;
    S2_intermediate.push(S2_temp);
    
    while (S2_temp > 9) {
        S2_temp = S2_temp.toString().split('').reduce((sum, n) => sum + Number(n), 0);
        S2_intermediate.push(S2_temp);
    }
    const S2_final = S2_temp;

    // 4. ПЕРВОЕ ЗНАЧАЩЕЕ ЧИСЛО ДНЯ (не ноль!)
    const day = dateStr.split('.')[0]; // "28" или "05"
    const dayFirstDigit = Number(day[0]); // первый символ
    const daySecondDigit = Number(day[1]); // второй символ
    
    // Если первая цифра 0, берём вторую цифру
    const firstSignificantDigit = dayFirstDigit === 0 ? daySecondDigit : dayFirstDigit;

    // 5. S3 — S1 − 2 × первое значащее число дня
    const S3_original = S1 - 2 * firstSignificantDigit;

    // 6. S4 — сумма цифр |S3| (с приведением к однозначному)
    const S4_first = Math.abs(S3_original).toString().split('').reduce((sum, n) => sum + Number(n), 0);
    
    // Массив всех промежуточных значений S4
    const S4_intermediate = [];
    let S4_temp = S4_first;
    S4_intermediate.push(S4_temp);
    
    while (S4_temp > 9) {
        S4_temp = S4_temp.toString().split('').reduce((sum, n) => sum + Number(n), 0);
        S4_intermediate.push(S4_temp);
    }
    const S4_final = S4_temp;

    // 7. Собираем ВСЕ цифры для матрицы
    const allDigits = [];
    
    // Цифры даты
    dateDigits.forEach(d => allDigits.push(d));
    
    // Цифры S1
    S1.toString().split('').forEach(d => allDigits.push(Number(d)));
    
    // ВСЕ промежуточные значения S2 (включая конечное)
    S2_intermediate.forEach(num => {
        num.toString().split('').forEach(d => allDigits.push(Number(d)));
    });
    
    // Цифры S3
    Math.abs(S3_original).toString().split('').forEach(d => allDigits.push(Number(d)));
    
    // ВСЕ промежуточные значения S4 (включая конечное)
    S4_intermediate.forEach(num => {
        num.toString().split('').forEach(d => allDigits.push(Number(d)));
    });

    // 8. матрица Пифагора
    const matrix = {
        1: "", 2: "", 3: "",
        4: "", 5: "", 6: "",
        7: "", 8: "", 9: ""
    };

    allDigits.forEach(d => {
        if (d >= 1 && d <= 9) {
            matrix[d] += d.toString();
        }
    });

    return {
        date: dateStr,
        S1,
        S2: S2_original,      // Показываем первое значение
        S3: S3_original,      
        S4: S4_first,         // Показываем первое значение
        S2_final,             
        S4_final,             
        firstSignificantDigit,
        matrix
    };
}

// Auto-format date input
document.addEventListener('DOMContentLoaded', function() {
    const pythagorasDateInput = document.getElementById('pythagoras-date');
    
    if (pythagorasDateInput) {
        pythagorasDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 2) {
                value = value.slice(0, 2) + '.' + value.slice(2);
            }
            if (value.length >= 5) {
                value = value.slice(0, 5) + '.' + value.slice(5);
            }
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            e.target.value = value;
        });
        
        pythagorasDateInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculatePythagorasSquare();
            }
        });
    }
});

// ================================
// LIFE PATH NUMBER CALCULATOR
// ================================

function calculateLifePath() {
    const birthdateInput = document.getElementById('birthdate');
    const resultDiv = document.getElementById('calculator-result');
    const resultNumberSpan = document.getElementById('result-number');
    const resultDescriptionDiv = document.getElementById('result-description');
    
    if (!birthdateInput.value) {
        alert('Пожалуйста, введите дату рождения');
        return;
    }
    
    const birthdate = new Date(birthdateInput.value);
    const day = birthdate.getDate();
    const month = birthdate.getMonth() + 1;
    const year = birthdate.getFullYear();
    
    // Calculate life path number
    let lifePathNumber = reduceToSingleDigit(day + month + year);
    
    // Descriptions for each number
    const descriptions = {
        1: "Вы — прирождённый лидер и первопроходец. Ваш путь — быть впереди, создавать новое и вдохновлять других своей независимостью. Вы амбициозны, решительны и не боитесь идти своим путём.",
        2: "Вы — миротворец и дипломат. Ваш дар — находить баланс и гармонию в отношениях. Вы чувствительны, интуитивны и умеете объединять людей. Партнёрство для вас — ключ к успеху.",
        3: "Вы — творческая душа и вдохновитель. Ваша миссия — выражать себя через искусство, слова или любое творчество. Вы оптимистичны, обаятельны и умеете поднимать настроение окружающим.",
        4: "Вы — строитель и организатор. Ваш путь — создавать прочные основы и структуры. Вы практичны, ответственны и трудолюбивы. Ваша сила — в дисциплине и стабильности.",
        5: "Вы — искатель приключений и перемен. Ваша миссия — исследовать мир и расширять границы. Вы свободолюбивы, гибки и легко адаптируетесь. Ваша жизнь — это движение и развитие.",
        6: "Вы — заботливый защитник и наставник. Ваш путь — служить семье и обществу. Вы ответственны, любящи и стремитесь к гармонии. Ваша сила — в умении заботиться о других.",
        7: "Вы — мыслитель и исследователь истины. Ваша миссия — познавать глубины жизни и духовности. Вы аналитичны, интуитивны и ищете смысл во всём. Ваш путь — внутренний поиск.",
        8: "Вы — мастер материального мира и власти. Ваш путь — достигать успеха и изобилия. Вы амбициозны, практичны и обладаете деловой хваткой. Ваша сила — в умении управлять ресурсами.",
        9: "Вы — гуманист и мудрец. Ваша миссия — служить миру и делиться мудростью. Вы сострадательны, щедры и мыслите глобально. Ваш путь — завершение старого и помощь человечеству."
    };
    
    // Display result
    resultNumberSpan.textContent = lifePathNumber;
    resultDescriptionDiv.textContent = descriptions[lifePathNumber];
    resultDiv.style.display = 'block';
    
    // Animate result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function reduceToSingleDigit(num) {
    while (num > 9) {
        num = num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return num;
}

// ================================
// SMOOTH SCROLL TO SECTION
// ================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ================================
// SCROLL REVEAL ANIMATION
// ================================

function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('revealed');
        }
    });
}

// ================================
// PARALLAX EFFECT FOR NUMBERS
// ================================

function parallaxNumbers() {
    const scrolled = window.pageYOffset;
    const numbers = document.querySelectorAll('.floating-number');
    
    numbers.forEach((number, index) => {
        const speed = (index % 3 + 1) * 0.5;
        const yPos = -(scrolled * speed);
        number.style.transform = `translateY(${yPos}px)`;
    });
}

// ================================
// GEOMETRIC CIRCLES ROTATION
// ================================

function rotateCircles() {
    const scrolled = window.pageYOffset;
    const circles = document.querySelectorAll('.geometric-circle');
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.05;
        const rotation = scrolled * speed;
        circle.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    });
}

// ================================
// SMOOTH CURSOR FOLLOWER (OPTIONAL)
// ================================

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Плавное следование за курсором
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    requestAnimationFrame(animateCursor);
}

// ================================
// INTERSECTION OBSERVER FOR SERVICE CARDS
// ================================

function observeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, {
        threshold: 0.2
    });
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

// ================================
// INTERSECTION OBSERVER FOR NUMBERS
// ================================

function observeNumberCards() {
    const numberCards = document.querySelectorAll('.number-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, {
        threshold: 0.2
    });
    
    numberCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

// ================================
// ANIMATE CONTACT BUTTONS
// ================================

function animateContactButtons() {
    const buttons = document.querySelectorAll('.contact-btn');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.5
    });
    
    buttons.forEach(button => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        button.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(button);
    });
}

// ================================
// HERO SECTION ENTRANCE ANIMATION
// ================================

function heroEntranceAnimation() {
    const heroContent = document.querySelector('.hero-content');
    
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 200);
}

// ================================
// ДОБАВЛЕНИЕ ЭФФЕКТА СВЕЧЕНИЯ ПРИ НАВЕДЕНИИ
// ================================

function addGlowEffect() {
    const cards = document.querySelectorAll('.number-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.boxShadow = '0 0 30px rgba(201, 160, 95, 0.5)';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.boxShadow = 'none';
        });
    });
}

// ================================
// LOADING ANIMATION
// ================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease-out';
        document.body.style.opacity = '1';
    }, 100);
    
    heroEntranceAnimation();
});

// ================================
// EVENT LISTENERS
// ================================

// Scroll events
window.addEventListener('scroll', () => {
    revealOnScroll();
    parallaxNumbers();
    rotateCircles();
});

// Page load events
document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    observeNumberCards();
    observeServiceCards();
    animateContactButtons();
    addGlowEffect();
    animateCursor();
});

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

// Throttle scroll events for better performance
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            revealOnScroll();
            parallaxNumbers();
            rotateCircles();
            ticking = false;
        });
        ticking = true;
    }
});

// ================================
// MOBILE MENU FIX (if needed)
// ================================

// Fix for iOS viewport height
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);

// ================================
// PREVENT SCROLL ON BUTTON CLICK
// ================================

document.querySelectorAll('.contact-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Allow default link behavior
    });
});

// ================================
// ANALYTICS TRACKING (optional)
// ================================

function trackButtonClick(buttonName) {
    console.log(`Button clicked: ${buttonName}`);
    // Here you can add Google Analytics or other tracking code
    // Example: gtag('event', 'click', { 'button_name': buttonName });
}

document.querySelectorAll('.contact-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const btnText = this.querySelector('span').textContent;
        trackButtonClick(btnText);
    });
});

// ================================
// EASTER EGG: SECRET NUMBER SEQUENCE
// ================================

let secretSequence = [];
const secretCode = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
let secretIndex = 0;

document.addEventListener('keypress', (e) => {
    secretSequence.push(e.key);
    
    if (secretSequence.length > secretCode.length) {
        secretSequence.shift();
    }
    
    if (secretSequence.join('') === secretCode.join('')) {
        console.log('🔮 Mind Vision activated! ✨');
        document.querySelectorAll('.floating-number').forEach(num => {
            num.style.color = 'var(--color-accent)';
            num.style.opacity = '0.8';
            num.style.fontSize = '15rem';
            num.style.transition = 'all 2s ease-out';
        });
        
        setTimeout(() => {
            document.querySelectorAll('.floating-number').forEach(num => {
                num.style.color = '';
                num.style.opacity = '';
                num.style.fontSize = '';
            });
        }, 3000);
    }
});

// ================================
// CONSOLE MESSAGE
// ================================

console.log(`
%c╔══════════════════════════════════╗
║   🔮 MIND VISION 🔮             ║
║   Сона Назарова                  ║
║   Нумеролог • Коуч • Аналитик   ║
╚══════════════════════════════════╝
`, 'color: #c9a05f; font-size: 14px; font-weight: bold;');

console.log('%cДобро пожаловать в пространство трансформаций! ✨', 'color: #e6c589; font-size: 12px;');
