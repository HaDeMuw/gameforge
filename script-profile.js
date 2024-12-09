// script-profile.js
document.addEventListener('DOMContentLoaded', function() {
    const usernameElement = document.getElementById('username');
    const bioElement = document.getElementById('bio');
    const avatarElement = document.getElementById('avatar');
    const gamesCountElement = document.getElementById('games-count');
    const friendsCountElement = document.getElementById('friends-count');
    const levelElement = document.getElementById('level');
    const postForm = document.getElementById('post-form');
    const postInput = document.getElementById('post-input');
    const postImageUpload = document.getElementById('post-image-upload');
    const previewContainer = document.getElementById('preview-container');
    const postsContainer = document.getElementById('posts-container');
    const editForm = document.getElementById('edit-form');
    const newUsernameInput = document.getElementById('new-username');
    const newBioInput = document.getElementById('new-bio');
    const avatarUpload = document.getElementById('avatar-upload');
    const saveChangesBtn = document.getElementById('save-changes-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const cartCountElement = document.getElementById('cart-count');

    // Кнопки отладки
    const debugBtn = document.getElementById('debug-btn');
    const debugPopup = document.getElementById('debug-popup');
    const closeDebugBtn = document.getElementById('close-debug-btn');
    const clearPostsBtnDebug = document.getElementById('clear-posts-btn-debug');
    const clearGamesBtnDebug = document.getElementById('clear-games-btn-debug');
    const clearAllBtnDebug = document.getElementById('clear-all-btn-debug');

    // Дополнительные кнопки настроек
    const editInfoSettingsBtn = document.getElementById('edit-info-settings-btn');

    // Попап уведомлений
    const notificationPopup = document.getElementById('notification-popup');
    const notificationMessage = document.getElementById('notification-message');
    const closeNotificationBtn = document.getElementById('close-notification-btn');

    // Инициализация данных профиля
    let username = localStorage.getItem('username') || 'Имя пользователя';
    let bio = localStorage.getItem('bio') || 'Описание профиля...';
    let avatarUrl = localStorage.getItem('avatarUrl') || 'img/user.png';
    let friendsCount = parseInt(localStorage.getItem('friendsCount')) || 3;
    let level = parseInt(localStorage.getItem('level')) || 3;
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let games = JSON.parse(localStorage.getItem('games')) || [];
    let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

    usernameElement.textContent = username;
    bioElement.textContent = bio;
    avatarElement.src = avatarUrl;
    gamesCountElement.textContent = games.length;
    friendsCountElement.textContent = friendsCount;
    levelElement.textContent = level;
    cartCountElement.textContent = cartCount;

    // Обновление списка постов
    function renderPosts() {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <div class="post-author">${username}</div>
                <div class="post-content">${post.content}</div>
                ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
                <div class="post-actions">
                    <button class="delete-post-btn" data-id="${posts.indexOf(post)}">Удалить</button>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });

        // Привязка обработчиков событий для удаления постов
        const deletePostButtons = document.querySelectorAll('.delete-post-btn');
        deletePostButtons.forEach(button => {
            button.addEventListener('click', function() {
                const postId = parseInt(this.getAttribute('data-id'));
                posts.splice(postId, 1);
                localStorage.setItem('posts', JSON.stringify(posts));
                renderPosts();
                showNotification('Комментарий удален!');
            });
        });
    }

    renderPosts();

    // Обработка формы добавления поста
    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const postContent = postInput.value.trim();
        const postImage = previewContainer.querySelector('.preview-image');
        let postImageSrc = null;

        if (postImage) {
            postImageSrc = postImage.src;
        }

        if (postContent || postImageSrc) {
            const newPost = {
                content: postContent,
                image: postImageSrc
            };
            posts.push(newPost);
            localStorage.setItem('posts', JSON.stringify(posts));
            postInput.value = '';
            previewContainer.innerHTML = '';
            renderPosts();
            showNotification('Комментарий добавлен!');
        } else {
            showNotification('Введите текст или прикрепите изображение!');
        }
    });

    // Редактирование имени пользователя и описания
    function toggleEditForm() {
        editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
        newUsernameInput.value = username;
        newBioInput.value = bio;
    }

    function saveChanges() {
        const newUsername = newUsernameInput.value.trim();
        const newBio = newBioInput.value.trim();
        if (newUsername) {
            username = newUsername;
            usernameElement.textContent = username;
            localStorage.setItem('username', username);
        }
        if (newBio) {
            bio = newBio;
            bioElement.textContent = bio;
            localStorage.setItem('bio', bio);
        }
        showNotification('Информация обновлена!');
        toggleEditForm();
    }

    function cancelEdit() {
        toggleEditForm();
    }

    // Изменение аватара
    function editAvatar() {
        avatarUpload.click();
    }

    // Привязка обработчиков событий
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', saveChanges);
    }
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', cancelEdit);
    }

    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarUrl = e.target.result;
                    avatarElement.src = avatarUrl;
                    localStorage.setItem('avatarUrl', avatarUrl);
                    showNotification('Аватар обновлен!');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Обработка вкладок
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });

    // Настройки профиля
    if (editInfoSettingsBtn) {
        editInfoSettingsBtn.addEventListener('click', toggleEditForm);
    }

    // Купленные игры
    function renderGames() {
        const gamesList = document.querySelector('#games-tab .games-list');
        gamesList.innerHTML = '';
        let games = JSON.parse(localStorage.getItem('games') || '[]');
        
        if (games.length === 0) {
            gamesList.innerHTML = '<p>У вас пока нет игр в библиотеке.</p>';
            return;
        }
    
        games.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.className = 'game-item';
            gameItem.innerHTML = `
                <img src="${game.imageUrl}" alt="${game.title}">
                <span>${game.title}</span>
            `;
            gamesList.appendChild(gameItem);
        });
    }

    renderGames();

    // Очистка комментариев
    const clearPostsBtn = document.getElementById('clear-posts-btn');
    if (clearPostsBtn) {
        clearPostsBtn.addEventListener('click', function() {
            posts = [];
            localStorage.removeItem('posts');
            renderPosts();
            showNotification('Комментарии очищены!');
        });
    }

    // Очистка купленных игр
    const clearGamesBtn = document.getElementById('clear-games-btn');
    if (clearGamesBtn) {
        clearGamesBtn.addEventListener('click', function() {
            games = [];
            localStorage.removeItem('games');
            renderGames();
            gamesCountElement.textContent = games.length;
            showNotification('Купленные игры очищены!');
        });
    }

    // Очистка всего
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            posts = [];
            games = [];
            localStorage.clear();
            renderPosts();
            renderGames();
            gamesCountElement.textContent = games.length;
            showNotification('Все данные очищены!');
        });
    }

    // Функция для отображения уведомлений
    function showNotification(message) {
        notificationMessage.textContent = message;
        notificationPopup.style.display = 'block';
        setTimeout(() => {
            notificationPopup.style.display = 'none';
        }, 3000);
    }

    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', function() {
            notificationPopup.style.display = 'none';
        });
    }

    // Обработка кнопки отладки
    if (debugBtn) {
        debugBtn.addEventListener('click', function() {
            debugPopup.style.display = debugPopup.style.display === 'none' ? 'block' : 'none';
        });
    }

    if (closeDebugBtn) {
        closeDebugBtn.addEventListener('click', function() {
            debugPopup.style.display = 'none';
        });
    }

    // Очистка комментариев через попап отладки
    if (clearPostsBtnDebug) {
        clearPostsBtnDebug.addEventListener('click', function() {
            posts = [];
            localStorage.removeItem('posts');
            renderPosts();
            showNotification('Комментарии очищены!');
            debugPopup.style.display = 'none';
        });
    }

    // Очистка купленных игр через попап отладки
    if (clearGamesBtnDebug) {
        clearGamesBtnDebug.addEventListener('click', function() {
            games = [];
            localStorage.removeItem('games');
            renderGames();
            gamesCountElement.textContent = games.length;
            showNotification('Купленные игры очищены!');
            debugPopup.style.display = 'none';
        });
    }

    // Очистка всего через попап отладки
    if (clearAllBtnDebug) {
        clearAllBtnDebug.addEventListener('click', function() {
            posts = [];
            games = [];
            localStorage.clear();
            renderPosts();
            renderGames();
            gamesCountElement.textContent = games.length;
            showNotification('Все данные очищены!');
            debugPopup.style.display = 'none';
        });
    }

    // Функция для добавления товара в корзину
    function addToCart(id, title, price, imageUrl) {
        let cartItems = [];

        // Получаем текущую корзину из localStorage
        if (localStorage.getItem('cart')) {
            cartItems = JSON.parse(localStorage.getItem('cart'));
        }

        // Добавляем новый товар в корзину
        cartItems.push({ id, title, price, imageUrl });

        // Сохраняем обновленную корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Обновляем счетчик корзины
        cartCount++;
        cartCountElement.textContent = cartCount;
        localStorage.setItem('cartCount', cartCount);

        // Добавляем игру в библиотеку
        addGameToLibrary(id, title, imageUrl);

        showNotification('Товар добавлен в корзину!');
    }

    // Функция для добавления игры в купленные игры
    function addGameToLibrary(id, name, imageUrl) {
        const game = { id, name, imageUrl };

        // Получаем текущие купленные игры из localStorage
        let games = [];
        if (localStorage.getItem('games')) {
            games = JSON.parse(localStorage.getItem('games'));
        }

        // Добавляем новую игру в список купленных игр
        games.push(game);

        // Сохраняем обновленный список купленных игр в localStorage
        localStorage.setItem('games', JSON.stringify(games));

        // Обновляем количество купленных игр
        gamesCountElement.textContent = games.length;
        showNotification('Игра добавлена в библиотеку!');
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

    // Инициализация счетчика корзины при загрузке страницы
    updateCartCount();

    // Функция для загрузки и предварительного просмотра изображений
    function handlePostImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewImage = document.createElement('img');
                previewImage.className = 'preview-image';
                previewImage.src = e.target.result;

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-preview-btn';
                removeBtn.innerHTML = '×';
                removeBtn.addEventListener('click', function() {
                    previewContainer.removeChild(previewImage);
                    previewContainer.removeChild(removeBtn);
                });

                previewContainer.appendChild(previewImage);
                previewContainer.appendChild(removeBtn);
            };
            reader.readAsDataURL(file);
        }
    }

    if (postImageUpload) {
        postImageUpload.addEventListener('change', handlePostImageUpload);
    }

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
    
    // Экспорт функции addToCart для использования в других скриптах
    window.addToCart = addToCart;
    renderGames();
});