$(function () {
    var app = {

        initialize: function () {
            if (window.NodeList && !NodeList.prototype.forEach) { // Vor IE 11
                NodeList.prototype.forEach = Array.prototype.forEach;
            }

            this.setUpListeners();
        },

        setUpListeners: function () {
            this.mobileMenu();
            this.announcementBar();
            this.smallCardsSlider();
            this.depCardsSlider();
            this.onResizeSlider();
            this.inputSelect();
            this.videoPlayOnClick();
            this.descriptionBlockViewToggle();
            this.applyBlockViewToggle();
            this.applyBlockSwitchViewToggle();
            this.fixBtn();
            this.popup();
        },

        mobileMenu: function () {
            //========= Open search & menu
            $('.js-toggle-header').on('click', function (e) {
                e.preventDefault();
                
                var dataToggle = $(this).attr('data-toggle'),
                    thisLink = $(this);

                $('.header_hidden#toggle-' + dataToggle).toggleClass('_show');
                thisLink.toggleClass('_active');

                $('.header_hidden').not('#toggle-' + dataToggle).removeClass('_show');
                $('.js-toggle-header').not(thisLink).removeClass('_active');

                setTimeout(function () {
                    if ($('.header_hidden').hasClass('_show')) {
                        $('body').addClass('no-overflow');
                    } else {
                        $('body').removeClass('no-overflow');
                    }

                    if ($('#toggle-search').hasClass('_show')) {
                        $('.search-block .search-input').focus();
                    }
                }, 300);
            });

            //========== Close search & menu
            $(document).on('click', function (event) {
                if (!$(event.target).closest('.header').length) {
                    $('.header_hidden').removeClass('_show');
                    $('.js-toggle-header').removeClass('_active');
                    $('body').removeClass('no-overflow');
                }
            });

            //========== Close search
            $('.js-close-search').on('click', function (e) {
                $('.header_hidden').removeClass('_show');
                $('.js-toggle-header').removeClass('_active');
                $('body').removeClass('no-overflow');
            });

        },

        announcementBar: function () {

            var annEl = $('.header');
            if (annEl.get(0)) {
                var annElTop = annEl.offset().top;

                $(document).on({
                    scroll: function (event) {

                        if (window.scrollY > annElTop) {
                            annEl.addClass('fixed-top');
                        } else {
                            annEl.removeClass('fixed-top');
                        }
                    }
                });
            }

        },

        smallCardsSlider: function () {
            if ($('#js-small-cards').get(0)) {
                $('#js-small-cards').slick({
                    slidesToShow: 1,
                    variableWidth: true,
                    infinite: false,
                    arrows: false,
                    lazyLoad: true,
                    dots: true,
                    adaptiveHeight: false,
                    mobileFirst: true,
                    responsive: [
                        {
                            breakpoint: 767,
                            settings: 'unslick'
                        }
                    ]
                });
            }
        },

        depCardsSlider: function () {
            if ($('#js-dep-cards').get(0)) {
                $('#js-dep-cards').slick({
                    slidesToShow: 1,
                    variableWidth: true,
                    infinite: false,
                    arrows: false,
                    lazyLoad: true,
                    dots: true,
                    adaptiveHeight: false,
                    mobileFirst: true,
                    responsive: [
                        {
                            breakpoint: 767,
                            settings: 'unslick'
                        }
                    ]
                });
            }
        },

        onResizeSlider: function () {

            $(window).resize(function () {
                if ($(document).width() <= 767) {
                    app.smallCardsSlider();
                    app.depCardsSlider();
                }
            });
        },

        inputSelect: function () {
            setTimeout(function () {
                if ($('.js-input-styler').get(0)) {
                    $('.js-input-styler').styler();
                }

                if ($('.form-radio').get(0)) {
                    $('.form-radio input[type="radio"]').styler();
                    $('.form-radio').styler();
                }
            }, 100);
        },

        videoPlayOnClick: function () {
            var imageOverlies = $('.talk-video__overlay');
            if (imageOverlies.hasClass('talk-video__overlay_no-video')) {
                return;
            }

            imageOverlies.on({
                click: function () {
                    $(this).hide();
                }
            })
        },

        descriptionBlockViewToggle: function () {
            const open = document.getElementById('description-open');
            const close = document.getElementById('description-close');
            const block = document.querySelector('.description-block');

            if (open) {
                open.onclick = function () {
                    if (block.dataset.expanded === 'false') {
                        block.classList.add('description-block_expanded');
                        block.dataset.expanded = 'true';
                    }
                }
            }

            if (close) {
                close.onclick = function () {
                    if (block.dataset.expanded === 'true') {
                        block.classList.remove('description-block_expanded');
                        block.dataset.expanded = 'false';
                    }
                }
            }
        },

        applyBlockViewToggle: function () {
            if (document.querySelectorAll('.apply-block-point').length === 0) {
                setTimeout(function () {
                    //app.applyBlockViewToggle();
                }, 1500);
            }

            
            $(document).on("click", ".apply-block-point", function() {
                if (this.dataset.expanded === 'false') {
                    this.classList.remove('apply-block-point_closed');
                    this.classList.add('apply-block-point_opened');
                    this.dataset.expanded = 'true';
                } else {
                    this.classList.remove('apply-block-point_opened');
                    this.classList.add('apply-block-point_closed');
                    this.dataset.expanded = 'false';
                }
            });
            
            /*
            document.querySelectorAll('.apply-block-point')
                .forEach(function (el) {
                    el.onclick = function () {
                        if (el.dataset.expanded === 'false') {
                            el.classList.remove('apply-block-point_closed');
                            el.classList.add('apply-block-point_opened');
                            el.dataset.expanded = 'true';
                        } else {
                            el.classList.remove('apply-block-point_opened');
                            el.classList.add('apply-block-point_closed');
                            el.dataset.expanded = 'false';
                        }
                    }
                });
                */
        },

        fixBtn: function () {
            let element = $('.js-fix-mobile');
            if (element.get(0) && element.find('.btn').get(0)) {
                let elementTop = element.offset().top;
                if ($(window).width() < 768) {
                    $(document).on({
                        scroll: function (event) {

                            if (window.scrollY > elementTop) {
                                element.addClass('fixed-bottom');
                                $('body').addClass('course-btn-fixed');
                            } else {
                                element.removeClass('fixed-bottom');
                                $('body').removeClass('course-btn-fixed');
                            }
                        }
                    });
                }
            }
        },


        applyBlockSwitchViewToggle: function () {
            document.querySelectorAll('.apply-switch')
                .forEach(function (el) {
                    el.onclick = function () {
                        if (el.dataset.active === 'false') {
                            document.querySelectorAll('.apply-switch')
                                .forEach(function (t) {
                                    t.classList.remove('active');
                                    t.dataset.active = 'false';
                                });

                            document.querySelectorAll('.apply-switch-body')
                                .forEach(function (b) {
                                    if (b.dataset.switch === el.dataset.switch) {
                                        el.classList.add('active');
                                        el.dataset.active = 'true';
                                        b.classList.remove('hidden');
                                        b.classList.add('active');
                                    } else {
                                        b.classList.add('hidden');
                                        b.classList.remove('active');
                                    }
                                });
                        }
                    }
                });
        },
        
        popup: function () {
            if ($('.popup-dismiss').get(0)) {
                $('.popup-dismiss').on("click", function () {
                    $.magnificPopup.close();
                });
            }

            if ($('#popup-thanks').get(0)) {
                $('.open-popup-thanks').magnificPopup({
                    items: {
                        src: '#popup-thanks',
                        type: 'inline',
                        midClick: true,
                    }
                });
            }
        }

    };

    app.initialize();
});
