function copyEmail(event) {
  // 1. <a> 태그의 기본 동작(화면 맨 위로 튕기는 현상)을 막기
  event.preventDefault();

  const email = 'sejin040676@gmail.com';

  // 2. 복사 기능 (서버 환경과 로컬 환경 모두 지원하는 만능 코드)
  if (navigator.clipboard && window.isSecureContext) {
    // 웹 서버 환경 (정상적인 복사)
    navigator.clipboard
      .writeText(email)
      .then(() => {
        alert('이메일 주소가 복사되었습니다!');
      })
      .catch((err) => {
        console.error('복사 에러:', err);
        alert('복사에 실패했습니다. 직접 복사해 주세요.');
      });
  } else {
    // 로컬 환경 (file:// 로 열었을 때 우회해서 복사하는 구형 방식)
    const textArea = document.createElement('textarea');
    textArea.value = email;
    // 화면에 보이지 않게 처리
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      alert('이메일 주소가 복사되었습니다!');
    } catch (err) {
      console.error('복사 에러:', err);
      alert('복사에 실패했습니다. 직접 복사해 주세요.');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
