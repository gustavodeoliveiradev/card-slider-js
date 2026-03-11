document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const leftArrow = document.getElementById('left');
    const rightArrow = document.getElementById('right');
    const firstCard = carousel.querySelector('.card');

    let isDragging = false, startX, startScrollLeft, autoPlayInterval;

    // --- 1. CONFIGURAÇÃO DO LOOP INFINITO (CLONAGEM) ---

    // Descobrimos quantos cards cabem na tela por vez
    let cardPerView = Math.round(carousel.offsetWidth / firstCard.offsetWidth);

    // Pegamos os cards atuais e transformamos em uma lista (Array)
    const children = [...carousel.children];

    // Clonamos os últimos cards e colocamos no INÍCIO
    children.slice(-cardPerView).reverse().forEach(card => {
        carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });

    // Clonamos os primeiros cards e colocamos no FINAL
    children.slice(0, cardPerView).forEach(card => {
        carousel.insertAdjacentHTML("beforeend", card.outerHTML);
    });

    // Removemos a animação rapidinho para pular os clones iniciais
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");


    // --- 2. FUNÇÕES DE APOIO ---

    const getScrollValue = () => firstCard.offsetWidth + 16;

    const startAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => carousel.scrollLeft += getScrollValue(), 3000);
    };

    const stopAutoPlay = () => clearInterval(autoPlayInterval);


    // --- 3. LÓGICA DE DRAG (ARRASTAR) ---

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


    // --- 4. O "PULO DO GATO": INFINITE SCROLL ---

    const infiniteScroll = () => {
        // Se estiver no início (clones da esquerda), pula para o final real
        if (carousel.scrollLeft === 0) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
            carousel.classList.remove("no-transition");
        }
        // Se chegar no fim (clones da direita), pula para o início real
        else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove("no-transition");
        }
    };


    // --- 5. EVENTOS ---

    // Botões
    rightArrow.addEventListener('click', () => {
        carousel.scrollLeft += getScrollValue();
    });

    leftArrow.addEventListener('click', () => {
        carousel.scrollLeft -= getScrollValue();
    });

    // Drag e Scroll
    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("touchstart", dragStart);

    carousel.addEventListener("mousemove", dragging);
    carousel.addEventListener("touchmove", dragging);

    document.addEventListener("mouseup", dragStop);
    document.addEventListener("touchend", dragStop);

    carousel.addEventListener("scroll", infiniteScroll);

    // Auto-play
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
});