document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    const readMoreLinks = document.querySelectorAll('.read-more');

    const newsData = [
        {
            id: 1,
            title: 'Раскрыты время предварительной загрузки и релиза Path of Exile 2 в раннем доступе',
            date: '5 декабря 2024',
            description: 'Хотя он будет доступен на официальном сайте, игроки на ПК также могут загрузить клиент через торрент. Что касается других платформ, игроки на Xbox Series X/S могут предварительно загрузить его уже сейчас. Игроки PS5 должны подождать 24 часа до раннего доступа и приобрести один из наборов основателя, чтобы начать загрузку. Нет никаких обновлений о предварительной загрузке для Steam, поэтому следите за дальнейшими подробностями.',
            image: 'img/news/news1.jpg',
            thumbnails: ['img/news/news1_thumb1.jpg', 'img/news/news1_thumb2.jpg', 'img/news/news1_thumb3.jpg']
        },
        {
            id: 2,
            title: 'Разработчики амбициозного приключенческого экшена "Война миров: Сибирь" благодарят игроков за тёплый приём трейлера',
            date: '6 декабря 2024',
            description: 'Разработчики выражают огромную благодарность за тёплый приём и отмечают, что спустя несколько дней после демонстрации удалось достичь 1700 публикаций от игровых ресурсов, блогеров и различных сайтов. Премьерный трейлер смог собрать 173 000 просмотров на канале 1C Game Studio и целых 12 000 лайков. Цифры довольно-таки впечатляющие!',
            image: 'img/news/news2.jpg',
            thumbnails: ['img/news/news2_thumb1.jpg', 'img/news/news2_thumb2.jpg', 'img/news/news2_thumb3.jpg']
        },
        {
            id: 3,
            title: 'Создатель Days Gone недоволен, что Sony не упомянула игры Bend Studios в ролике, посвящённом 30-летию PlayStation',
            date: '5 декабря 2024',
            description: 'Именно это видео заставило Джона Гарвина вновь атаковать PlayStation. В благодарственном видео было показано множество игр всех поколений PlayStation. Включены только избранные, поэтому некоторые проекты PS Studios не получили свою «минуту славы». Режиссер Days Gone уже давно имел сильную обиду на Sony из-за отмены второй части. Джон Гарвин много лет провёл в студии Bend. Он также работал над серией Syphon Filter для первой PlayStation в то время, когда команда ещё работала под названием Eidetic. Гарвин опубликовал запись, в которой косвенно критикует Sony за то, что она не включила Days Gone и серию Syphon Filter в материал, посвящённый 30-летнему юбилею. Создатель сослался на появившийся на экране текст «Речь идет о... игнорировании Bend Studio... как будто Syphon Filter и Days Gone никогда не существовали.',
            image: 'img/news/news3.jpg',
            thumbnails: ['img/news/news3_thumb1.jpg', 'img/news/news3_thumb2.jpg', 'img/news/news3_thumb3.jpg']
        },
        {
            id: 4,
            title: 'Первый новогодний подарочек! Студия Mechanics VoiceOver внезапно выпустила русскую озвучку для ремейка Silent Hill 2',
            date: '4 декабря 2024',
            description: 'Озвучивание ключевых персонажей игры выполнили талантливые актеры: Джеймс Сандерленд в исполнении Андрея Мишутина, Мэри Шеперд-Сандерленд и Мария — Екатерина Дмитрова, Анжела Ороско — Елена Лунина, Лора — Елена Байбикова, Эдди Домбровски — Константин Карасик, а другие роли исполнили Андрей Маслов, Дмитрий Рыбин и Пётр Слепцов. В данный момент в работе находится ещё одна озвучка данного проекта от студии GamesVoice, которая успешно провела сборы, но точной даты выхода своей работы пока не называла.',
            image: 'img/news/news4.jpg',
            thumbnails: ['img/news/news4_thumb1.jpg', 'img/news/news4_thumb2.jpg', 'img/news/news4_thumb3.jpg']
        },
        {
            id: 5,
            title: '"Фанаты Dishonored и Prey почувствуют себя как дома": Рафаэль Колантонио рассказал о своей новой загадочной РПГ',
            date: '5 декабря 2024',
            description: 'Пусть в нем и не было раскрыто ничего конкретного, но все же нашлась интересная информация, которая должна порадовать фанатов RPG в целом и «старой доброй» Arkane в частности, в особенности поклонников серий Dishonored и Prey. В связи с этим возникает вопрос: если Колантонио с такой страстью говорит о разрабатываемом проекте, который он называет прямо-таки идеальным для команды, то почему первой игрой студии WolfEye оказалась именно Weird West?',
            image: 'img/news/news5.jpg',
            thumbnails: ['img/news/news5_thumb1.jpg', 'img/news/news5_thumb2.jpg', 'img/news/news5_thumb3.jpg']
        }
    ];

    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const newsId = parseInt(this.getAttribute('data-news-id'));
            const news = newsData.find(n => n.id === newsId);

            if (news) {
                document.querySelector('.modal-title').textContent = news.title;
                document.querySelector('.modal-date').textContent = news.date;
                document.querySelector('.modal-image').src = news.image;
                document.querySelector('.modal-description').textContent = news.description;

                const thumbnailsContainer = document.querySelector('.modal-images');
                thumbnailsContainer.innerHTML = ''; // Очистить предыдущие миниатюры

                news.thumbnails.forEach(thumbnail => {
                    const img = document.createElement('img');
                    img.src = thumbnail;
                    img.alt = 'Дополнительное изображение';
                    img.className = 'modal-thumbnail';
                    thumbnailsContainer.appendChild(img);
                });

                modal.style.display = 'block';
            }
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function updateCartCount() {
        let cartCount = 0;
        if (localStorage.getItem('cart')) {
            cartCount = JSON.parse(localStorage.getItem('cart')).length;
        }
        document.getElementById('cart-count').textContent = cartCount;
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

    updateCartCount();
});