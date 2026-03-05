window.addEventListener('load', function () {
  const imgSlider = document.querySelector('.img-slider');
  const imgSliderTrack = document.querySelector('.img-slider-track');
  const pages = document.querySelectorAll('.page');
  const imgIndicator = document.querySelector('.img-indicator');
  const dots = imgIndicator ? imgIndicator.querySelectorAll('.dot') : [];

  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0;
  let autoSlideInterval;
  const realPageCount = pages.length - 1;

  // 모바일 감지 함수
  const isMobile = () => window.innerWidth <= 767;

  function updateSlider(withTransition = true) {
    if (!imgSliderTrack) return;
    imgSliderTrack.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
    imgSliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    const activeIndex = currentIndex === realPageCount ? 0 : currentIndex;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    // 모바일이면 자동 슬라이드 시작 안 함
    if (isMobile()) return;

    autoSlideInterval = setInterval(() => {
      currentIndex++;
      updateSlider();
      if (currentIndex === realPageCount) {
        setTimeout(() => {
          currentIndex = 0;
          updateSlider(false);
        }, 500);
      }
    }, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // --- 모바일 터치 및 드래그 로직 ---
  let touchStartX = 0;
  let touchEndX = 0;

  if (imgSlider) {
    imgSlider.addEventListener(
      'touchstart',
      (e) => {
        stopAutoSlide();
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    imgSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        // 50px 이상 이동 시 슬라이드
        if (diff > 0)
          nextBtn.click(); // 왼쪽으로 밀면 다음
        else prevBtn.click(); // 오른쪽으로 밀면 이전
      }
      if (!isMobile()) startAutoSlide();
    });

    // 데스크탑 호버
    imgSlider.addEventListener('mouseenter', stopAutoSlide);
    imgSlider.addEventListener('mouseleave', () => {
      if (!isMobile()) startAutoSlide();
    });
  }

  if (prevBtn)
    prevBtn.addEventListener('click', () => {
      if (currentIndex === 0) {
        currentIndex = realPageCount;
        updateSlider(false);
        setTimeout(() => {
          currentIndex--;
          updateSlider();
        }, 20);
      } else {
        currentIndex--;
        updateSlider();
      }
    });

  if (nextBtn)
    nextBtn.addEventListener('click', () => {
      currentIndex++;
      if (currentIndex === realPageCount) {
        updateSlider();
        setTimeout(() => {
          currentIndex = 0;
          updateSlider(false);
        }, 500);
      } else {
        updateSlider();
      }
    });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      updateSlider();
    });
  });

  // 창 크기 변경 시 오토슬라이드 재시작/중지 감지
  window.addEventListener('resize', () => {
    if (isMobile()) stopAutoSlide();
    else startAutoSlide();
  });

  updateSlider();
  startAutoSlide();
});
