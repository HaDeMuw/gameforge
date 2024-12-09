document.addEventListener('DOMContentLoaded', function() {
    const gameContainers = document.querySelectorAll('.game-container');
    const indicators = document.querySelectorAll('.indicator');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close');
    const cartCountElement = document.getElementById('cart-count');
    const addToCartPopup = document.getElementById('add-to-cart-popup');
    const closePopupButton = addToCartPopup.querySelector('.close-popup');
    const progressBar = document.getElementById('progress-bar');

    // Проверяем, существует ли элемент cartCountElement
    if (!cartCountElement) {
        console.error('Элемент с идентификатором cart-count не найден в DOM');
        return;
    }

    console.log('Элемент cart-count найден:', cartCountElement);

    // Функция для отображения игры по индексу
    function showGame(index) {
        gameContainers.forEach((container, i) => {
            if (i === index) {
                container.style.display = 'flex';
                container.classList.add('active');
            } else {
                container.style.display = 'none';
                container.classList.remove('active');
            }
        });

        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Обработчик клика на индикатор
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showGame(index);
        });
    });

    // Автоматическое переключение игр каждые 5 секунд
    let currentIndex = 0;
    setInterval(() => {
        currentIndex = (currentIndex + 1) % gameContainers.length;
        showGame(currentIndex);
    }, 5000);

    // Инициализация первой игры
    showGame(currentIndex);

    // Открытие модального окна при клике на миниатюру
    const thumbnails = document.querySelectorAll('.game-thumbnails img');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.getAttribute('data-src');
        });
    });

    // Закрытие модального окна при клике на кнопку закрытия
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Закрытие модального окна при клике вне изображения
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Функция для добавления товара в корзину
    function addToCart(id, title, price, imageUrl) {
        let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        
        cartItems.push({ id, title, price: price === 'БЕСПЛАТНО' ? 'БЕСПЛАТНО' : parseInt(price), imageUrl });
        localStorage.setItem('cart', JSON.stringify(cartItems));
    
        updateCartCount();
        showAddToCartPopup();
    }

    // Обновление счетчика корзины
    function updateCartCount() {
        let cartCount = 0;

        // Получаем текущую корзину из localStorage
        if (localStorage.getItem('cart')) {
            const cartItems = JSON.parse(localStorage.getItem('cart'));
            cartCount = cartItems.length;
        }

        // Обновляем счетчик корзины
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        } else {
            console.error('Элемент cart-count не найден при обновлении счетчика');
        }
    }

    // Функция для отображения попапа с прогрессбаром
    function showAddToCartPopup() {
        addToCartPopup.style.display = 'block';

        // Сбросим ширину прогресс-бара до 0 перед началом анимации
        progressBar.style.width = '0';

        // Анимация прогресс-бара
        progressBar.style.animation = 'fillProgress 3s forwards';

        // Устанавливаем таймер для автоматического закрытия попапа
        setTimeout(function() {
            addToCartPopup.style.display = 'none';
            // Сбрасываем анимацию прогресс-бара
            progressBar.style.animation = '';
        }, 3500); // Закрываем попап через 2.5 секунды после завершения анимации
    }

    // Обработчик клика на кнопку "Купить"
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function() {
            const gameContainer = this.closest('.game-container');
            const gameTitle = gameContainer.querySelector('.game-title').textContent;
            const gamePrice = parseInt(gameContainer.querySelector('.game-price').textContent.replace(/\D/g, ''));
            const gameId = this.getAttribute('data-id');
            const gameImageUrl = gameContainer.querySelector('.game-image img').src; // Assuming there's an image in .game-image
    
            addToCart(gameId, gameTitle, gamePrice, gameImageUrl);
        });
    });

    // Обработчик клика на кнопку закрытия попапа
    closePopupButton.addEventListener('click', function() {
        addToCartPopup.style.display = 'none';
        // Сбрасываем анимацию прогресс-бара
        progressBar.style.animation = '';
    });

    // Закрытие попапа при клике вне его содержимого
    window.addEventListener('click', function(event) {
        if (event.target === addToCartPopup) {
            addToCartPopup.style.display = 'none';
            // Сбрасываем анимацию прогресс-бара
            progressBar.style.animation = '';
        }
    });

    // Получаем ссылки из футера
    const developmentLinks = document.querySelectorAll('.more-button, .footer-links a[href="#"]');

    // Обработчик клика на ссылки "В разработке"
    developmentLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Предотвращаем переход по ссылке
            const developmentPopup = document.getElementById('development-popup');
            developmentPopup.style.display = 'block';

            setTimeout(() => {
                developmentPopup.style.display = 'none';
            }, 4000);
        });
    });

    // Получаем кнопку закрытия попапа
    const closeDevelopmentPopupButton = document.getElementById('development-popup').querySelector('.close-popup');

    // Обработчик клика на кнопку закрытия попапа
    closeDevelopmentPopupButton.addEventListener('click', function() {
        const developmentPopup = document.getElementById('development-popup');
        developmentPopup.style.display = 'none';
    });

    // Закрытие попапа при клике вне его содержимого
    window.addEventListener('click', function(event) {
        const developmentPopup = document.getElementById('development-popup');
        if (event.target === developmentPopup) {
            developmentPopup.style.display = 'none';
        }
    });

    // Инициализация счетчика корзины при загрузке страницы
    updateCartCount();
});