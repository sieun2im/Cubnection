    function goToPage() {
    // 카드 클릭 시 이동할 경로
    // 예: location.href = "next.html";
    console.log("카드를 클릭했습니다.");
    }

    document.querySelector(".close-icon")?.addEventListener("click", (e) => {
    e.stopPropagation(); 
    console.log("닫기 버튼 클릭");
    });
