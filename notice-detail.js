document.addEventListener("DOMContentLoaded", function () {
    // URL에서 공지사항 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    let noticeId = urlParams.get("id") || "1"; // 기본값을 "1"로 설정

    // 공지사항 데이터 (JSON 형태로 저장)
    const notices = {
        "1": {
            title: "[KTX특송] 3월 미운영 매장 공지",
            date: "25-02-27 16:43",
            content: `
                <p class="ktx-notice1">3월 10일 (월) 오송</p>
                <p class="ktx-notice1">3월 14일 (금) 광주송정</p>
                <p class="ktx-notice1">3월 21일 (금) 천안아산</p>
                <p class="ktx-notice1">3월 24일 (월) 목포</p>
                <p class="ktx-notice1">3월 28일 (금) 광주송정</p>
                <br>
                <p class="ktx-notice2">*매주 일요일은 특송 서비스 미운영입니다*</p>
                <p class="ktx-notice">위 내용 참고하시어, 이용에 착오 없으시길 바랍니다.</p>
                <p class="ktx-notice">더욱 친절한 서비스로 보답해 드리겠습니다.</p>
                <p class="ktx-notice">감사합니다.</p>
            `
        },
        "2": {
            title: "[보관함] 대구관광안내소 보관함 철거 안내",
            date: "25-02-28 09:00",
            content: `
                <p class="storage-notice">대구관광안내소 내 보관함 철거 일정 안내입니다.</p>
                <p class="storage-notice-weight">3월 5일 (화) 보관함 철거 예정</p>
                <p class="storage-notice">이용에 참고 부탁드립니다.</p>
            `
        },
        "3": {
            title: "[짐배송] 가격 인상 안내",
            date: "03-10 14:00",
            content: `
                <p class="delivery-notice"><span class="highlight-text">2025년 3월 15일부터</span> 짐배송 서비스 가격이 조정됩니다.</p>
                <p class="delivery-notice">고객 여러분의 많은 이해 부탁드립니다.</p>
            `
        }
    };

    // 공지사항 내용 업데이트 (HTML 유지하면서 데이터 변경)
    if (notices[noticeId]) {
        document.getElementById("notice-title").textContent = notices[noticeId].title;
        document.getElementById("notice-date").textContent = notices[noticeId].date;
        document.getElementById("notice-text").innerHTML = notices[noticeId].content;
    } else {
        document.querySelector(".notice-content").innerHTML = "<p class='content-style'>존재하지 않는 공지사항입니다.</p>";
    }
    const noticeList = document.querySelector(".notice-list ul");
    noticeList.innerHTML = ""; // 기존 리스트 초기화

    Object.keys(notices)
        .filter(id => id !== noticeId) // 현재 공지사항 제외
        .slice(0, 2) // 최대 2개만 표시
        .forEach(id => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a href="notice-detail.html?id=${id}">${notices[id].title}</a>`;
            noticeList.appendChild(listItem);
        });
});