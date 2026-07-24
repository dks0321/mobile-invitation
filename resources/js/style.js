$(function () {

    //파티클
    let isRunning = true;

    const duration = 1000 * 60; // 최대 1분
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function () {

        if (!isRunning || Date.now() > animationEnd) {
            clearInterval(interval);
            return;
        }

        confetti({
            particleCount: 2,
            startVelocity: 0,
            gravity: 1,
            drift: 0,
            ticks: 300,
            scalar: 0.8,
            spread: 30,
            origin: {
                x: Math.random(),
                y: -0.1
            },
            colors: ['#fbeefa'],
            shapes: ['circle']
        });
    }, 350);

    // 스크롤하면 종료
    // $(window).one('scroll', function () {
    //     isRunning = false;
    // });

    //텍스트 애니메이션
    var $greetingTxt = $('.group-greeting');

    // $greetingTxt.hide();

    function showGreeting() {
        if ($(window).scrollTop() >= 300) {
            $greetingTxt.animate({
                opacity: 1
              }, 1700);
            $(window).off('scroll', showGreeting);
        }
    }

    showGreeting(); // 처음 로드 시 확인
    $(window).on('scroll', showGreeting);


    // 갤러리
    const $items = $('.gallery-item');
    const $btnMore = $('.btn-more');

    // 처음 9개만 표시
    $items.hide().slice(0, 9).show();

    if ($items.length <= 9) {
        $btnMore.hide();
    }

    // 더보기
    $btnMore.on('click', function () {

        $items.slice(9).fadeIn(300);
        $(this).hide();

    });

    $('.gallery-popup').hide();

    // 팝업 슬라이드 생성
    const $wrapper = $('.gallery-popup .swiper-wrapper');

    $('.gallery-item img').each(function () {

        $wrapper.append(`
                    <div class="swiper-slide">
                        <img src="${this.src}" alt="${this.alt}">
                    </div>
                `);

    });

    // Swiper
    const gallerySwiper = new Swiper('.gallerySwiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });

    // 썸네일 클릭
    $items.on('click', function () {

        $('.gallery-popup').fadeIn(200);

        gallerySwiper.slideTo($(this).index(), 0);
        $('body').addClass('scroll-lock');

    });

    // 닫기
    $('.btn-close').on('click', function () {

        $('.gallery-popup').fadeOut(200);
        // body 스크롤 복구
        $('body').removeClass('scroll-lock');

    });

    // 배경 클릭 시 닫기
    $('.gallery-popup').on('click', function (e) {

        if (e.target === this) {
            $(this).fadeOut(200);
        }

    });


    //d-day
    var targetDate = new Date('2027-12-04');

    function updateDday() {
        var now = new Date();
        var diff = targetDate - now;
        var day = Math.ceil(diff / (1000 * 60 * 60 * 24));

        $('.dDay').text(day > 0 ? `D-${day}` : 'D-Day');
    }

    updateDday();
    setInterval(updateDday, 60000); // 1분마다만 갱신

    //account
    $('.btn-accordian').click(function () {
        var $accountBtn = $(this).parent();

        if (!$accountBtn.hasClass('on')) {

            $accountBtn.stop().animate({
                height: $accountBtn[0].scrollHeight
            }, 300).addClass('on');
        } else {
            $accountBtn.stop().animate({
                height: 50
            }, 300).removeClass('on');
        }
    });

    $('.btn-copy').click(function () {

        var copyTxt = $(this).data('copy');

        if (navigator.clipboard && window.isSecureContext) {

            navigator.clipboard.writeText(copyTxt).then(function () {
                alert(copyTxt + ' 복사되었습니다.');
            });

        } else {

            const $temp = $('<textarea>');
            $('body').append($temp);

            $temp.val(copyTxt).select();
            document.execCommand('copy');
            $temp.remove();

            alert(copyTxt + ' 복사되었습니다.');
        }

    });


});

