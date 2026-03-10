document.addEventListener('DOMContentLoaded', function () {
    const leftArrow = document.getElementById('left');
    const rightArrow = document.getElementById('right');
    const carousel = document.querySelector('.carousel');
    let autoPlayInterval;
    let isDragging = false, startX, startScrollLeft;

    // 1. Função que calcula o deslocamento
    const getScrollValue = () => {
        const firstCard = carousel.querySelector('.card');
        return firstCard.offsetWidth + 16;
    };

    // 2. Funções de Movimento
    const moveRight = () => {
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: getScrollValue(), behavior: 'smooth' });
        }
    };

    const moveLeft = () => {
        carousel.scrollBy({ left: -getScrollValue(), behavior: 'smooth' });
    };

    // 3. Lógica de Arrastar (Drag)
    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX || e.touches[0].pageX; // Suporte para touch
        startScrollLeft = carousel.scrollLeft;
        stopAutoPlay(); // Pausa o auto-play enquanto arrasta
    }

    const dragging = (e) => {
        if (!isDragging) return;
        // 1. Impedir comportamentos padrão (como arrastar a imagem fantasmagórica)
        e.preventDefault();
        // 2. Identificar a posição atual (seja do mouse ou do dedo no touch)
        const x = e.pageX || e.touches[0].pageX;
        // 3. Calcular e aplicar o novo scroll
        carousel.scrollLeft = startScrollLeft - (x - startX);
    }

    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
        startAutoPlay(); // Retoma o auto-play ao soltar
    }

    // 4. Lógica do Auto-play
    const startAutoPlay = () => {
        // Evita criar múltiplos intervalos
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(moveRight, 3000);
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
    };

    // 5. Eventos
    rightArrow.addEventListener('click', moveRight);
    leftArrow.addEventListener('click', moveLeft);

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Suporte para Celular (Touch Events)
    carousel.addEventListener("touchstart", dragStart);
    carousel.addEventListener("touchmove", dragging);
    document.addEventListener("touchend", dragStop);

    // Iniciar
    startAutoPlay();
});