document.addEventListener('DOMContentLoaded', function() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutButton = document.querySelector('.checkout-button');
    const paymentModal = document.getElementById('payment-modal');
    const closeModal = paymentModal.querySelector('.close');
    const cardNumberInput = document.getElementById('card-number');
    const cardHolderInput = document.getElementById('card-holder');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCVCInput = document.getElementById('card-cvc');
    const submitPaymentButton = document.getElementById('submit-payment');
    const successPaymentPopup = document.getElementById('success-payment-popup');
    const closeSuccessPopupButton = successPaymentPopup.querySelector('.close-popup');
    const emptyCartPopup = document.getElementById('empty-cart-popup');
    const closeEmptyCartPopupButton = emptyCartPopup.querySelector('.close-popup');

    const cardNumberElement = document.querySelector('.card-number');
    const cardHolderElement = document.querySelector('.card-holder');
    const cardExpiryElement = document.querySelector('.card-expiry');
    const cardCVCElement = document.querySelector('.card-cvc');

    // Function to display cart items
    function displayCartItems() {
        let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        let games = JSON.parse(localStorage.getItem('games') || '[]');
        let totalPrice = 0;
        let hasPurchasableItems = false;
        let hasFreeGamesToPurchase = false;

        cartItemsElement.innerHTML = '';

        cartItems.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';

            const gameImage = document.createElement('img');
            gameImage.className = 'cart-item-image';
            gameImage.src = item.imageUrl || `img/${item.id}/${item.id}_large.jpg`;
            gameImage.alt = item.title;

            const gameTitleSpan = document.createElement('span');
            gameTitleSpan.className = 'cart-item-title';
            gameTitleSpan.textContent = item.title;

            const gamePriceSpan = document.createElement('span');
            gamePriceSpan.className = 'cart-item-price';

            const isAlreadyPurchased = games.some(game => game.id === item.id);

            if (isAlreadyPurchased) {
                gamePriceSpan.innerHTML = `<i class="fas fa-ban" title="Невозможно купить повторно"></i> ${item.price === null || item.price === 'БЕСПЛАТНО' ? 'БЕСПЛАТНО' : item.price + ' руб.'}`;
                cartItemDiv.classList.add('non-purchasable');
            } else {
                if (item.price === null || item.price === 'БЕСПЛАТНО') {
                    gamePriceSpan.textContent = 'БЕСПЛАТНО';
                    hasFreeGamesToPurchase = true;
                } else {
                    gamePriceSpan.textContent = `${item.price} руб.`;
                    totalPrice += parseInt(item.price) || 0;
                    hasPurchasableItems = true;
                }
            }

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-button';
            removeButton.innerHTML = '×';
            removeButton.addEventListener('click', function() {
                removeCartItem(index);
            });

            cartItemDiv.appendChild(removeButton);
            cartItemDiv.appendChild(gameImage);
            cartItemDiv.appendChild(gameTitleSpan);
            cartItemDiv.appendChild(gamePriceSpan);
            cartItemsElement.appendChild(cartItemDiv);
        });

        totalPriceElement.textContent = `${totalPrice.toLocaleString('ru-RU')} руб.`;
        cartCountElement.textContent = cartItems.length;

        // Disable the checkout button if there are no purchasable items and no free games to purchase
        if (checkoutButton) {
            checkoutButton.disabled = !hasPurchasableItems && !hasFreeGamesToPurchase;
            checkoutButton.style.opacity = hasPurchasableItems || hasFreeGamesToPurchase ? '1' : '0.5';
            checkoutButton.style.cursor = hasPurchasableItems || hasFreeGamesToPurchase ? 'pointer' : 'not-allowed';
        }
    }

    // Function to remove cart items
    function removeCartItem(index) {
        let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        cartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        displayCartItems();
    }

    // Function to open payment modal
    function openPaymentModal() {
        paymentModal.style.display = 'block';
    }

    // Function to close payment modal
    function closePaymentModal() {
        paymentModal.style.display = 'none';
        cardNumberInput.value = '';
        cardHolderInput.value = '';
        cardExpiryInput.value = '';
        cardCVCInput.value = '';
    }

    // Function to show successful payment popup
    function showSuccessPaymentPopup() {
        successPaymentPopup.style.display = 'block';

        setTimeout(function() {
            successPaymentPopup.style.display = 'none';
        }, 3500);
    }

    // Function to show empty cart popup
    function showEmptyCartPopup() {
        emptyCartPopup.style.display = 'block';

        setTimeout(function() {
            emptyCartPopup.style.display = 'none';
        }, 3000);
    }

    // Event listener for checkout button
    checkoutButton.addEventListener('click', function() {
        let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        let games = JSON.parse(localStorage.getItem('games') || '[]');
        let hasPurchasableItems = false;
        let hasFreeGamesToPurchase = false;

        cartItems.forEach(item => {
            if (!games.some(game => game.id === item.id)) {
                if (item.price !== null && item.price !== 'БЕСПЛАТНО') {
                    hasPurchasableItems = true;
                } else {
                    hasFreeGamesToPurchase = true;
                }
            }
        });

        if (cartItems.length === 0) {
            showEmptyCartPopup();
        } else if (hasFreeGamesToPurchase && !hasPurchasableItems) {
            handleFreeGamesPurchase();
        } else {
            openPaymentModal();
        }
    });

    // Function to handle free games purchase
    function handleFreeGamesPurchase() {
        let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        let games = JSON.parse(localStorage.getItem('games') || '[]');

        cartItems.forEach(item => {
            if (!games.some(game => game.id === item.id)) {
                games.push({
                    id: item.id,
                    title: item.title,
                    imageUrl: item.imageUrl
                });
            }
        });

        localStorage.setItem('games', JSON.stringify(games));
        localStorage.removeItem('cart');
        displayCartItems();
        showSuccessPaymentPopup();
    }

    // Event listeners for closing modal
    closeModal.addEventListener('click', closePaymentModal);
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            closePaymentModal();
        }
    });

    // Event listeners for closing success payment popup
    closeSuccessPopupButton.addEventListener('click', function() {
        successPaymentPopup.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === successPaymentPopup) {
            successPaymentPopup.style.display = 'none';
        }
    });

    // Event listeners for closing empty cart popup
    closeEmptyCartPopupButton.addEventListener('click', function() {
        emptyCartPopup.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === emptyCartPopup) {
            emptyCartPopup.style.display = 'none';
        }
    });

    // Card input formatting and updating card display
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        for (let i = 0; i < value.length && i < 16; i++) {
            formattedValue += value[i];
            if ((i + 1) % 4 === 0 && i !== 15) formattedValue += ' ';
        }
        e.target.value = formattedValue;
        cardNumberElement.textContent = formattedValue || '**** **** **** ****';
    });

    cardHolderInput.addEventListener('input', function(e) {
        cardHolderElement.textContent = e.target.value.toUpperCase() || 'Card Holder';
    });

    cardExpiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        if (value.length > 2) {
            formattedValue = value.slice(0, 2) + '/' + value.slice(2, 4);
        } else {
            formattedValue = value;
        }
        e.target.value = formattedValue;
        cardExpiryElement.textContent = formattedValue || 'MM/YY';
    });

    cardCVCInput.addEventListener('input', function(e) {
        cardCVCElement.textContent = 'CVC: ' + (e.target.value || '***');
    });

    // Event listener for payment submission
    submitPaymentButton.addEventListener('click', function() {
        // Check if all fields are filled
        if (!cardNumberInput.value || !cardHolderInput.value || !cardExpiryInput.value || !cardCVCInput.value) {
            alert('Пожалуйста, заполните все поля для оплаты.');
            return;
        }

        // Card number validation (basic length check)
        if (cardNumberInput.value.replace(/\s/g, '').length !== 16) {
            alert('Номер карты должен состоять из 16 цифр.');
            return;
        }

        // Expiry date validation (basic check)
        const expiryParts = cardExpiryInput.value.split('/');
        if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2 || 
            isNaN(expiryParts[0]) || isNaN(expiryParts[1]) || 
            parseInt(expiryParts[0]) < 1 || parseInt(expiryParts[0]) > 12) {
            alert('Пожалуйста, введите корректную дату истечения срока действия карты (MM/YY).');
            return;
        }

        // CVC validation
        if (cardCVCInput.value.length !== 3 || isNaN(cardCVCInput.value)) {
            alert('CVC должен состоять из 3 цифр.');
            return;
        }

        // If all checks pass, proceed with payment
        closePaymentModal();

        // Add games to library after successful payment
        let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        let games = JSON.parse(localStorage.getItem('games') || '[]');

        cartItems.forEach(item => {
            if (!games.some(game => game.id === item.id)) {
                games.push({
                    id: item.id,
                    title: item.title,
                    imageUrl: item.imageUrl
                });
            }
        });

        localStorage.setItem('games', JSON.stringify(games));

        // Clear the cart after adding games to the library
        localStorage.removeItem('cart');
        displayCartItems();
        showSuccessPaymentPopup();
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

    // Initialize cart display
    displayCartItems();
});