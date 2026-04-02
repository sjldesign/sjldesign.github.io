document.addEventListener('DOMContentLoaded', () => {
  // 1. 부드러운 스크롤 애니메이션 함수 (가속도 적용)
  function smoothScroll(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      window.scrollTo(0, startPosition + distance * ease);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  }

  // 커스텀 요소 스크롤 함수 (쇼츠 전용)
  function smoothScrollBy(element, targetScrollLeft, duration) {
    const startScrollLeft = element.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      element.scrollLeft = startScrollLeft + distance * ease;
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  }

  // 2. 네비게이션 클릭 이벤트
  document.querySelectorAll('.gnb a').forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sections = ['#profile', '#skill', '#work', '#contact'];
      const targetElement = document.querySelector(sections[index]);
      if (targetElement) {
        const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offset = sections[index] === '#contact' ? 0 : 100;
        smoothScroll(targetTop - offset, 500);
      }
    });
  });

  // 3. Top 버튼 관련 기능
  const btnTop = document.querySelector('.btn-top');
  if (btnTop) {
    btnTop.addEventListener('click', () => smoothScroll(0, 500));
    window.addEventListener('scroll', () => {
      btnTop.classList.toggle('show', window.pageYOffset >= 500);
    });
  }

  // 4. 쇼츠 드래그 및 버튼 스크롤 기능
  const slider = document.querySelector('.short-list');
  const prevBtn = document.querySelector('.short .prev-btn');
  const nextBtn = document.querySelector('.short .next-btn');

  if (slider) {
    let isDown = false;
    let isDragged = false; // 드래그 여부 추적
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDown = true;
      isDragged = false; // 초기화
      slider.classList.add('active');
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      // 5px 이상 움직이면 드래그로 간주
      if (Math.abs(e.pageX - (startX + slider.offsetLeft)) > 5) {
        isDragged = true;
      }
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = x - startX;
      slider.scrollLeft = scrollLeft - walk;
    });

    // 드래그 후 클릭 이벤트 방지
    slider.addEventListener('click', (e) => {
      if (isDragged) {
        e.preventDefault();
      }
    });

    // 버튼 클릭 로직
    if (prevBtn && nextBtn) {
      const duration = 600;
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = slider.scrollLeft - slider.offsetWidth;
        smoothScrollBy(slider, target, duration);
      });
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = slider.scrollLeft + slider.offsetWidth;
        smoothScrollBy(slider, target, duration);
      });
    }
  }

  // --- 5. 라이트박스 로직 변경 ---

  // 라이트박스를 여는 공통 함수
  function openLightbox($element) {
    // 클릭한 요소의 가장 가까운 부모인 .work-item이 전체 중 몇 번째인지 계산
    var idx = $element.closest('.work-item').index();

    // 해당 순서와 일치하는 라이트박스 선택
    var $targetBox = $('.work-light-box').eq(idx);
    var $iframe = $targetBox.find('iframe');

    // 원래 적혀있던 src 주소 가져오기
    var videoSrc = $iframe.attr('src');

    // src를 다시 입력하면 영상이 처음부터 자동 재생됨
    $iframe.attr('src', videoSrc);
    $targetBox.fadeIn(500);
  }

  // [데스크탑/모바일 공통] View Video 버튼 클릭 시 라이트박스 열기
  $('.btn-view').click(function (e) {
    e.preventDefault(); // 기본 링크 동작(새 창 열기) 방지
    openLightbox($(this)); // 라이트박스 열기 실행
  });

  // 라이트박스 닫기
  $('.work-light-box').click(function (e) {
    // 배경이나 wrap 클릭 시 닫기
    if ($(e.target).is('.work-light-box') || $(e.target).is('.iframe_wrap')) {
      var $this = $(this);
      var $iframe = $this.find('iframe');
      var currentSrc = $iframe.attr('src');

      $this.fadeOut(500, function () {
        // src를 비워서 소리를 끄고 다시 채워둠 (다음 재생 준비)
        $iframe.attr('src', '');
        $iframe.attr('src', currentSrc);
      });
    }
  });

  // 쇼츠 라이트박스 열기
  $('.btn-short-view').click(function (e) {
    e.preventDefault(); // 기본 링크 이동 방지

    // 클릭한 쇼츠가 몇 번째인지 확인
    var idx = $(this).closest('li').index();

    // 해당 순서와 일치하는 라이트박스 선택
    var $targetBox = $('.short-light-box').eq(idx);
    var $iframe = $targetBox.find('iframe');

    // 클릭 시 자동 재생되도록 src 뒤에 파라미터 추가 (선택 사항)
    var videoSrc = $iframe.attr('src');
    if (videoSrc.indexOf('autoplay') === -1) {
      // 기존 주소에 자동 재생 옵션이 없다면 붙여줌
      $iframe.attr('src', videoSrc + '?autoplay=1');
    }

    $targetBox.fadeIn(500);
  });

  // 쇼츠 라이트박스 닫기
  $('.short-light-box').click(function (e) {
    if ($(e.target).is('.short-light-box') || $(e.target).is('.iframe_wrap')) {
      var $this = $(this);
      var $iframe = $this.find('iframe');
      var currentSrc = $iframe.attr('src');

      $this.fadeOut(500, function () {
        // 재생 중지(소리 끄기)를 위해 src를 비우고, autoplay 파라미터를 제거하여 원상복구
        var stopSrc = currentSrc.replace('?autoplay=1', '');
        $iframe.attr('src', '');
        $iframe.attr('src', stopSrc);
      });
    }
  });
});
