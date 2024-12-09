document.addEventListener('DOMContentLoaded', function() {
    const gamesList = document.getElementById('games-list');
    const cartCountElement = document.getElementById('cart-count');

    // Function to update cart count
    function updateCartCount() {
        let cartCount = 0;
        if (localStorage.getItem('cart')) {
            cartCount = JSON.parse(localStorage.getItem('cart')).length;
        }
        cartCountElement.textContent = cartCount;
    }

    // Function to render games
    function renderGames() {
        let games = JSON.parse(localStorage.getItem('games') || '[]');
        gamesList.innerHTML = '';

        games.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.className = 'game-item';

            gameItem.innerHTML = `
                <img src="${game.imageUrl}" alt="${game.title}" class="game-cover">
                <div class="game-details">
                    <h3 class="game-title">${game.title}</h3>
                    <button class="play-button">Играть</button>
                    <div class="game-hours">Награно: 0 часов</div>
                    <div class="friends-played">Играли друзья: [Список друзей]</div>
                    <p class="game-description">Описание игры: ${game.description || 'Нет описания'}</p>
                    <div class="achievements-list">
                        <span class="achievement">Достижение 1</span>
                        <span class="achievement">Достижение 2</span>
                        <!-- Add more achievements as needed -->
                    </div>
                </div>
            `;

            gamesList.appendChild(gameItem);
        });
    }

    // Render games on page load
    renderGames();
    updateCartCount();

    // Example event listener for play button (you might want to implement actual game launching here)
    gamesList.addEventListener('click', function(e) {
        if (e.target && e.target.matches('.play-button')) {
            alert('Запуск игры... (Это просто пример)');
        }
    });

    // Получаем ссылки из футера
    const developmentLinks = document.querySelectorAll('.footer-links a[href="#"]');

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
});