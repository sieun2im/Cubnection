function goToPage() {
  // 카드 클릭 시 이동할 페이지
  window.location.href = "../mainpage/mainpage.html"; // 필요 없으면 함수 자체 삭제 가능
}

// 닫기 버튼 클릭 시 mainpage.html로 이동
document.querySelector(".close-icon")?.addEventListener("click", (e) => {
e.stopPropagation(); 
  window.location.href = "../mainpage/mainpage.html"; // 경로에 맞게 조정
});
