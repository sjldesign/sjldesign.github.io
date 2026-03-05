window.onload = function () {
  const cards = document.querySelectorAll('.card');
  const dots = document.querySelectorAll('.controls .dot');
  const track = document.querySelector('.slider-track');

  let currentIndex = 0;
  let autoSlideInterval;

  // 모바일 감지 함수
  const isMobile = () => window.innerWidth <= 767;

  function updateSlider() {
    cards.forEach((card, index) => {
      card.classList.remove('active', 'prev-card', 'next-card');
      if (index === currentIndex) {
        card.classList.add('active');
      } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
        card.classList.add('prev-card');
      } else if (index === (currentIndex + 1) % cards.length) {
        card.classList.add('next-card');
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    // 모바일에서는 오토슬라이드 실행 방지
    if (isMobile()) return;

    autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateSlider();
    }, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // 카드/인디케이터 호버 시 멈춤 (데스크탑)
  cards.forEach((card) => {
    card.addEventListener('mouseenter', stopAutoSlide);
    card.addEventListener('mouseleave', () => !isMobile() && startAutoSlide());
  });

  dots.forEach((dot) => {
    dot.addEventListener('mouseenter', stopAutoSlide);
    dot.addEventListener('mouseleave', () => !isMobile() && startAutoSlide());
    dot.addEventListener('click', () => {
      currentIndex = parseInt(dot.getAttribute('data-index'));
      updateSlider();
    });
  });

  // --- 드래그 및 터치 슬라이드 로직 ---
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  const dragThreshold = 60;

  function onDragStart(e) {
    stopAutoSlide();
    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
    currentTranslate = currentX - startX;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    if (currentTranslate < -dragThreshold) {
      currentIndex = (currentIndex + 1) % cards.length;
    } else if (currentTranslate > dragThreshold) {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    }

    updateSlider();
    currentTranslate = 0;
    // 터치 종료 후 모바일이 아닐 때만 다시 시작
    if (!isMobile()) startAutoSlide();
  }

  if (track) {
    track.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    track.addEventListener('touchstart', onDragStart, { passive: true });
    window.addEventListener('touchmove', onDragMove, { passive: true });
    window.addEventListener('touchend', onDragEnd);
  }

  // 창 크기 변경 시 오토슬라이드 반응형 처리
  window.addEventListener('resize', () => {
    if (isMobile()) stopAutoSlide();
    else startAutoSlide();
  });

  updateSlider();
  startAutoSlide();
};
