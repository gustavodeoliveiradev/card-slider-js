document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELEÇÃO DE ELEMENTOS (DOM) ---
    const carousel = document.querySelector('.carousel');
    const firstCard = carousel.querySelector('.card');
    const leftArrow = document.getElementById('left');
    const rightArrow = document.getElementById('right');
    const searchInput = document.getElementById('searchInput');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    // --- 2. CONFIGURAÇÃO DE ESTADO ---
    let isDragging = false, startX, startScrollLeft, autoPlayInterval;
    const scrollGap = 16; // Mesmo valor definido no CSS Gap

    // --- 3. LÓGICA DE TEMA (PERSISTÊNCIA) ---
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (savedTheme === 'light') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    };

    const toggleTheme = () => {
        let theme = document.documentElement.getAttribute('data-theme');
        const isDark = theme === 'dark';
        
        theme = isDark ? 'light' : 'dark';
        themeIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // --- 4. LÓGICA DO CARROSSEL (MOTOR) ---
    const getScrollValue = () => firstCard.offsetWidth + scrollGap;

    const startAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => carousel.scrollLeft += getScrollValue(), 3000);
    };

    const stopAutoPlay = () => clearInterval(autoPlayInterval);

    const infiniteScroll = () => {
        if (carousel.scrollLeft === 0) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
            carousel.classList.remove("no-transition");
        } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove("no-transition");
        }
    };

    // --- 5. LÓGICA DE ARRASTE (DRAG) ---
    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX || e.touches[0].pageX;
        startScrollLeft = carousel.scrollLeft;
        stopAutoPlay();
    };

    const dragging = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX || e.touches[0].pageX;
        carousel.scrollLeft = startScrollLeft - (x - startX);
    };

    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
        startAutoPlay();
    };

    // --- 6. FILTRO DE BUSCA ---
    const filterCards = (e) => {
        const term = e.target.value.toLowerCase();
        const allCards = carousel.querySelectorAll('.card');

        if (term === "") {
            carousel.classList.remove("filtering");
            allCards.forEach(card => card.style.display = "flex");
            carousel.scrollLeft = carousel.offsetWidth;
            startAutoPlay();
            return;
        }

        stopAutoPlay();
        carousel.classList.add("filtering");
        carousel.scrollLeft = 0;

        allCards.forEach(card => {
            if (card.classList.contains('clone')) {
                card.style.display = "none";
                return;
            }
            const name = card.querySelector('h2').innerText.toLowerCase();
            card.style.display = name.includes(term) ? "flex" : "none";
        });
    };

    // --- 7. INICIALIZAÇÃO E CLONAGEM ---
    const setupClones = () => {
        const cardPerView = Math.round(carousel.offsetWidth / firstCard.offsetWidth);
        const children = [...carousel.children];

        children.slice(-cardPerView).reverse().forEach(card => {
            carousel.insertAdjacentHTML("afterbegin", card.outerHTML.replace('class="card"', 'class="card clone"'));
        });

        children.slice(0, cardPerView).forEach(card => {
            carousel.insertAdjacentHTML("beforeend", card.outerHTML.replace('class="card"', 'class="card clone"'));
        });

        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    };

    // --- 8. REGISTRO DE EVENTOS ---
    initTheme();
    setupClones();
    startAutoPlay();

    themeToggle.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', filterCards);
    
    rightArrow.addEventListener('click', () => carousel.scrollLeft += getScrollValue());
    leftArrow.addEventListener('click', () => carousel.scrollLeft -= getScrollValue());

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("touchstart", dragStart);
    carousel.addEventListener("mousemove", dragging);
    carousel.addEventListener("touchmove", dragging);
    document.addEventListener("mouseup", dragStop);
    document.addEventListener("touchend", dragStop);

    carousel.addEventListener("scroll", infiniteScroll);
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
});