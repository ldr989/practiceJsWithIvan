window.addEventListener('DOMContentLoaded', () => {
    
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'), 
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent () {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadLine = '2023-05-01';

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());
        
        if ( t <= 0 ) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor( (t / (1000 * 60 * 60 * 24)) );
            seconds = Math.floor( (t / 1000) % 60 );
            minutes = Math.floor( (t / 1000 / 60) % 60);
            hours = Math.floor( (t / (1000 * 60 * 60) % 24) );
        }
              
        
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    // Modal

    /* const modalBtn = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalClose = document.querySelector('.modal__close');

    function showElement(element) {
        element.style.display = 'block';
    }
    function hideElement(element) {
        element.style.display = 'none';

    }

    modalBtn.forEach(e => {
        e.addEventListener('click', (event) => {
            showElement(modal);
        });
    });
    modalClose.addEventListener('click', (event) => {
        hideElement(modal);
    }); */
    
    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);     
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Cards

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.exchangeRate = 87;
            this.changeExchangeRate();
        }

        changeExchangeRate() {
            this.price = this.price * this.exchangeRate;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            
            element.innerHTML =`
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> сом/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method:"POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto; 
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then (data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure); 
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Slider
    // My version

    // const offerSliderWrapper = document.querySelector('.offer__slider-wrapper'),
    //       offerSliders = offerSliderWrapper.querySelectorAll('.offer__slide'),
    //       offerSliderPrev = document.querySelector('.offer__slider-prev'),
    //       offerSliderNext = document.querySelector('.offer__slider-next');
    // let currentSlider = document.querySelector('#current'),
    //     totalOfSliders = document.querySelector('#total');
    

    // function hideSlide () {
    //     offerSliders.forEach(slide => {
    //         slide.classList.add('hide');
    //         slide.classList.remove('show', 'fade');
    //     });
    // }

    // function showSlide (i = 0) {
    //     offerSliders[i].classList.add('show', 'fade');
    //     offerSliders[i].classList.remove('hide');
    // }

    // function addZero (num) {
    //     if (num < 10) {
    //         return `0${num}`;
    //     } else {
    //         return num;
    //     }
    // }

    // function changeNumberOfCurrentSlide () {
    //     offerSliders.forEach((item, index) => {
    //         if (item.classList.contains('show')) {
    //             currentSlider.textContent = addZero((index + 1));
    //         }
    //     });
    // }

    // hideSlide();
    // showSlide();
    // changeNumberOfCurrentSlide();


    // totalOfSliders.textContent = addZero(offerSliders.length);
    

    // offerSliderPrev.addEventListener('click', (event) => {
        
    //     offerSliders.forEach((item, index) => {
    //         if (+currentSlider.innerHTML === (index + 1)) {
    //             if ((index - 1) < 0) {
    //                 hideSlide();
    //                 showSlide((offerSliders.length - 1));
                    
    //             } else {
    //                 hideSlide();
    //                 showSlide((index - 1));
    //             }
    //         }           
    //     });
    //     changeNumberOfCurrentSlide();
    // });
    
    // offerSliderNext.addEventListener('click', () => {
    //     offerSliders.forEach((item, index) => {
    //         if (+currentSlider.innerHTML === (index + 1)) {
    //             if (index === (offerSliders.length - 1) ) {
    //                 hideSlide();
    //                 showSlide(0);
    //             } else {
    //                 hideSlide();
    //                 showSlide((index + 1));
    //             }
    //         }
    //     });
    //     changeNumberOfCurrentSlide();
    // });

    // The sensei's version

    const slides = document.querySelectorAll('.offer__slide'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length -2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;
        makeDotActive(dots[offset / +width.slice(0, width.length - 2)]);

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slideIndex < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);

        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        makeDotActive(dots[offset / +width.slice(0, width.length - 2)]);
        

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slideIndex < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });
    // task by exercise 94, my version

    const slider = document.querySelector('.offer__slider');
    const carouselIndicators = document.createElement('div');

    function makeDotActive(element) {
        dots.forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');
    }

    slider.style.position = 'relative';
    carouselIndicators.classList.add('carousel-indicators');
    slider.append(carouselIndicators);

    slides.forEach(item => {
        const div = document.createElement('div');
        carouselIndicators.append(div);
        div.classList.add('dot');
    });

    
    const dots = document.querySelectorAll('.dot');

    makeDotActive(dots[0]);

    dots.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            const calc = index * +width.slice(0, width.length - 2);

            slidesField.style.transform = `translateX(-${calc}px)`;
            
            makeDotActive(item);
            if (index < 10) {
                current.textContent = `0${(index + 1)}`;
            } else {
                current.textContent = (index + 1);
            }
        });
    });

});