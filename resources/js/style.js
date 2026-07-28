$(function () {

    //파티클
    let isRunning = true;

    const duration = 1000 * 90; // 최대 90초
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

    //텍스트 애니메이션
    var $greetingTxt = $('.group-greeting');

    // $greetingTxt.hide();

    function showGreeting() {
        if ($(window).scrollTop() >= 300) {
            $greetingTxt.animate({
                opacity: 1
            }, 2000);
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


    // 디데이 타이핑 이벤트
    const $calendar = $('.sc-calendar');
    const $ddayBox = $('.dday-box');

    let isTypingStart = false;

    function startTyping() {

        if (isTypingStart) return;

        isTypingStart = true;


        const contents = $ddayBox.contents().toArray();

        $ddayBox.empty().addClass('typing');

        const queue = [];


        // 기존 HTML 구조 저장
        $.each(contents, function (_, node) {

            // 텍스트
            if (node.nodeType === 3) {
                [...node.textContent].forEach(char => {
                    queue.push({
                        type: 'text',
                        value: char
                    });
                });
            }

            // 태그(i, span)
            else {
                queue.push({
                    type: 'html',
                    value: $(node).clone()
                });
            }
        });

        let index = 0;
        let $text = null;

        function typing() {
            // 종료
            if (index >= queue.length) {

                $ddayBox
                    .removeClass('typing')
                    .addClass('done');

                return;
            }

            const item = queue[index];

            // 아이콘 / span 처리
            if (item.type === 'html') {

                $text = null;

                const $clone = item.value;

                $ddayBox.append($clone);

                // 하트 애니메이션
                if ($clone.hasClass('ico-love')) {
                    setTimeout(function () {
                        $clone.addClass('show');
                    }, 100);
                    index++;
                    setTimeout(typing, 500);
                    return;
                }

                // D-Day 타이핑
                if ($clone.hasClass('dDay')) {
                    const ddayText = $clone.text();
                    $clone.text('');

                    let d = 0;

                    function typeDday() {
                        if (d >= ddayText.length) {
                            index++;
                            setTimeout(typing, 300);
                            return;
                        }

                        $clone.append(ddayText.charAt(d));
                        d++;
                        setTimeout(typeDday, 100);

                    }

                    typeDday();
                    return;
                }
                index++;
                setTimeout(typing, 200);
                return;
            }

            // 일반 텍스트
            if (!$text) {

                $text = $('<span class="typing-word"></span>');

                $ddayBox.append($text);

            }
            $text.append(item.value);

            // 공백 후 새 span 생성
            if (item.value === ' ') {
                $text = null;
            }

            index++;

            // 타이핑 속도
            let speed = 90 + Math.random() * 60;

            // 희수 / 경서 천천히
            if (index < 5) {
                speed = 130;
            }

            // 결혼식 부분
            if (index > 8) {
                speed = 100;
            }

            setTimeout(typing, speed);
        }
        typing();
    }

    // sc-calendar 화면 도달 체크
    let isTyping = false;

    // sc-calendar 문서 기준 top 값
    const calendarTop = $calendar.offset().top;

    $(window).on('scroll', function () {

        const dayScrollTop = $(window).scrollTop();

        // 캘린더 위치 도달 시 실행
        if (dayScrollTop >= calendarTop && !isTyping) {
            isTyping = true;
            startTyping(); // 기존 타이핑 함수 실행

        }

    });

    //계좌 펼치기/접기
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

