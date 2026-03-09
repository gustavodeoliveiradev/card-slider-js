document.addEventListener('DOMContentLoaded', function () {
    const leftArrow = document.getElementById('left');
    const rightArrow = document.getElementById('right');
    const carousel = document.querySelector('.carousel');
    let autoPlayInterval;

    // 1. Função que calcula o deslocamento
    const getScrollValue = () => {
        const firstCard = carousel.querySelector('.card');
        return firstCard.offsetWidth + 16; 
    };

    // 2. Funções de Movimento
    const moveRight = () => {
        // Se chegar ao fim, volta para o começo (efeito infinito simples)
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: getScrollValue(), behavior: 'smooth' });
        }
    };

    const moveLeft = () => {
        carousel.scrollBy({ left: -getScrollValue(), behavior: 'smooth' });
    };

    // 3. Eventos dos Botões
    rightArrow.addEventListener('click', moveRight);
    leftArrow.addEventListener('click', moveLeft);

    // 4. Lógica do Auto-play
    const startAutoPlay = () => {
        autoPlayInterval = setInterval(moveRight, 3000); // 3 segundos
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
    };

    // Iniciar
    startAutoPlay();

    // 5. Pausa ao passar o mouse
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
});