window.addEventListener('load', function () {
  // 1. 이미지 슬라이더 전체 박스를 찾기
  const imgSlider = document.querySelector('.img-slider');

  // 만약 현재 페이지에 이미지 슬라이더가 없다면 아래 코드는 실행하지 않고 종료
  if (!imgSlider) return;

  // 2. document 전체가 아닌, imgSlider 안에서만 요소를 찾기
  const imgSliderTrack = imgSlider.querySelector('.img-slider-track');
  const pages = imgSlider.querySelectorAll('.page');
  const imgIndicator = imgSlider.querySelector('.img-indicator');
  const prevBtn = imgSlider.querySelector('.prev-btn');
  const nextBtn = imgSlider.querySelector('.next-btn');

  let currentIndex = 0;
  let autoSlideInterval;

  // 무한 슬라이드를 위한 실제 페이지 수 (마지막 복제본 제외)
  const realPageCount = pages.length - 1;

  // --- 인디케이터 동적 생성 로직 ---
  if (imgIndicator && realPageCount > 0) {
    imgIndicator.innerHTML = ''; // 초기화

    for (let i = 0; i < realPageCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.setAttribute('data-index', i);
      imgIndicator.appendChild(dot);
    }
  }

  const dots = imgIndicator ? imgIndicator.querySelectorAll('.dot') : [];

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
      if (diff > 0 && nextBtn) nextBtn.click();
      else if (prevBtn) prevBtn.click();
    }
    if (!isMobile()) startAutoSlide();
  });

  imgSlider.addEventListener('mouseenter', stopAutoSlide);
  imgSlider.addEventListener('mouseleave', () => {
    if (!isMobile()) startAutoSlide();
  });

  if (prevBtn) {
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
  }

  if (nextBtn) {
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
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      updateSlider();
    });
  });

  window.addEventListener('resize', () => {
    if (isMobile()) stopAutoSlide();
    else startAutoSlide();
  });

  updateSlider();
  startAutoSlide();
});
