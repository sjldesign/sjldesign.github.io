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
});
