const supabaseUrl = "https://wunmezoxjspgtstkpgwv.supabase.co";  // 여기에 실제 Supabase URL 입력!
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bm1lem94anNwZ3RzdGtwZ3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MjUwMTgsImV4cCI6MjA1NTAwMTAxOH0.MoL5es2vyhmm-WyRx585rgd6he-zn5I3YopLrdHQ4cc"; // 여기에 실제 Supabase anon 키 입력!

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener("DOMContentLoaded", function () {
    // ✅ 기본적으로 첫 번째 페이지 보이기
    loadFAQ();
    showPage(1);

    // ✅ FAQ 질문 클릭하면 답변 토글
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("question")) {
            const answer = event.target.nextElementSibling;

            // ✅ 다른 열린 answer 닫기
            document.querySelectorAll(".answer").forEach((ans) => {
                if (ans !== answer) {
                    ans.classList.remove("active");
                    ans.style.maxHeight = "0";
                    ans.style.opacity = "0"; // ✅ 숨기기
                }
            });

            // ✅ 현재 클릭한 answer 열기/닫기
            answer.classList.toggle("active");

            if (answer.classList.contains("active")) {
                setTimeout(() => {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    answer.style.opacity = "1"; // ✅ 보이기
                }, 10);
            } else {
                answer.style.maxHeight = "0";
                answer.style.opacity = "0"; // ✅ 다시 숨기기
            }
        }
    });
});

// ✅ FAQ 데이터 (페이지별로 관리 가능)
const faqData = {
    page1: [
        { question: "예약을 취소/환불 받고 싶어요",
         answer: "여행 일정에 차질이 발생하셨나요?<br><br>\n" +
             "위드고의 예약 취소/환불은 아래와 같이 이루어집니다.<br>\n" +
             "1. 서비스 이용 2일전 취소는 100% 환불 가능하며, 서비스 당일 취소는 불가능 합니다.<br>\n" +
             "2. 서비스 이용 1일전 예약취소에 따른 서비스 요금 환불은 50% 입니다.<br>\n" +
             "3. 당일 현장접수 경우 영수증 제시 후 취소/환불이 가능합니다.단, 고객님의 수화물 운송이 시작되면 취소/환불이 불가합니다."},
        { question: "예약을 변경하고 싶어요",
            answer: "여행 일정이 변경되셨나요?<br>\n" +
                "숙소명을 오기재하셨거나 숙소 또는 이용일자에 변동이 있으신 경우 이용일 2일전까지 (이용국가 서비스일자기준) 변경이 가능합니다.\n" +
                "<br>단 1일전 서비스 변경요청시에는 단 1회에 한하여 이용일자를 변경하실 수 있습니다.<br>\n" +
                "추가 자세한 사항은 고객센터 또는 카카오톡 채널(위드고)로 문의주시면 안내를 도와드리겠습니다." },
        { question: "[공항/역 -> 숙소] 구간 이용시 숙소에서 짐은 언제 받아볼 수 있나요?",
            answer: "대구공항/동대구역에 14:00까지 등록 완료 후 배송기사님 개인 픽에 등록이 되면 대구지역 숙소 프론트에 15:00~17:00에 도착합니다.\n" +
                "<br>경주역에 14:00까지 등록 완료 후 배송기사님 개인 픽에 등록이 되면 경주지역 숙소 프론트에 15:00~17:00에 도착합니다.\n" +
                "지역을 이동할(대구 ~ 경주) 경우 13:00까지 등록해주셔야 됩니다. 이후에 등록되는 짐은 당일 배송이 불가능 할 수도 있습니다.\n" +
                "※ 숙소 도착시간은 운송 당일 교통 상황, 경로에 따라 상이하여, 정확한 시간을 지정할 수 없는 점 양해 부탁드립니다." },
        { question: "[숙소->공항/역] 구간은 짐을 언제 가지러 오시나요?",
            answer: "숙소->대구공항/동대구역/경주역] 구간은 고객님께서 11:00 전에 숙소 프론트에 짐을 맡겨주시면서 '위드고 서비스 이용합니다.'라고\n" +
                "말씀해주시면 저희가 대구공항/동대구역/경주역으로 배송할 짐을 수거합니다.\n" +
                "픽업된 짐은 동지역일 경우 오후 13시 타지역일 경우 오후 14시 이후부터 찾으실 수 있으며, 영업시간(동대구역/경주역 22:00, 공항 20:00) 내에 찾아가지 못한\n" +
                "짐은 하루 당 보관료에 따른 추가요금이 부과됩니다."},
        { question: "위드고 운송서비스는 제휴 호텔만 가능한가요?",
            answer: "호텔뿐만 아니라 다양한 숙박업소도 서비스를 이용할 수 있습니다. 단 위드고 제휴호텔은 상호 업무협약을 통해 고객에게 더나은 서비스를 제공하고\n" +
                " 있습니다.<br>\n" +
                " ※ 현재 에어비앤비는 이용이 불가능 합니다."},
        { question: "위드고 운송예약 마감은 언제까지인가요?",
            answer: "운송 예약은 아래와 같이 이루어집니다.<br>\n" +
                "1. 홈페이지 예약: 당일 서비스 이용 전부터 오후 2시 이전까지 홈페이지에서 예약할 수 있습니다.<br>\n" +
                "※ 단, 숙소->대구공항/동대구역/경주역의 경우 당일 오전 11:00까지만 가능합니다.<br>\n" +
                "※ 대구공항->동대구역/숙소는 오후 2시까지만 가능합니다.<br>\n" +
                "2. 당일 현장 접수: 위드고 매장에서 오후 2시 이전까지 현장 접수 가능합니다.<br>\n" +
                "※ 단, 당일 현장 접수의 경우 운송 서비스가 조기 마감되면 이용이 불가할 수 있습니다.<br>\n" +
                "※ 유선문의는 가능하나 예약은 안됩니다."},
        { question: "보관시간 내에 짐을 찾지 못하면 어떻게 되나요?",
            answer: "보관시간(당일 09:00-22:00)내에 짐을 찾지 않으실 경우, 다음날 오전 9시 이후로 짐을 찾으실 수 있으며, 하루 당 동일요금이 추가로\n" +
                "부과됩니다."},
        { question: "대구 말고 다른 지역에서도 신청할 수 있나요?",
            answer: "현재 대구광역시와 경주시에 서비스를 제공하고 있습니다. 추후 서비스 확대를 위해 노력하겠습니다."}
    ],

    page2: [
        { question: "짐이 파손되거나 분실되면 어떡하나요?",
            answer: "수하물의 분실 및 손실이 발생한 경우, 위드고의 실수로 발생한 것을 입증해야 하며, 입증 시 보상의 최대 금액은 500,000원입니다. 상세한\n" +
                "내용은 주문 신청 시 약관을 참고해주시기 바랍니다." },
        { question: "위드고 보관서비스는 예약할 수 없나요?",
            answer: "위드고 보관서비스는 홈페이지와 어플을 통하여 예약을 하실 수 있습니다. 대구공항/동대구역/경주역 위드고 매장에서 09:00-22:00까지 보관이\n" +
                "가능합니다. 주말/공휴일/성수기의 경우 보관 서비스가 조기 마감될 수 있습니다." },
        { question: "보관서비스는 취소/환불을 받을 수 없나요?",
            answer: "보관서비스의 경우, 보관업의 특성상 고객님께서 짐을 맡기고 결제를 마친 이후부터 보관서비스가 제공되기 때문에 서비스의 이용시간과 관계없이\n" +
                "취소/환불이 불가합니다." },
        { question: "보관서비스는 시간 상관없이 요금이 동일한가요?",
            answer: "위드고 보관서비스의 경우 보관요금은 운영시간 기준(09:00-22:00)으로 1일 요금부터 1주일 요금 1개월 요금 각각 기준에 따라 별도로 책정되어있습니다." +
                "요금 정책표를 참고하시면 됩니다." },
        { question: "장기보관도 가능한가요?",
            answer: "보관은 1개월까지 가능하며, 일주일 이상일시 별도의 요금금액을 확인해 주세요. " +
                "* 요금은 크기에 따라 보관료가 부과됩니다." },
        { question: "서비스가 이용불가능한 날도 있나요?",
            answer: "별도의 휴무일은 없고 365일 운영하고 있습니다." }
    ]
};

// ✅ FAQ 동적 생성 함수
function loadFAQ() {
    for (const page in faqData) {
        const faqContainer = document.getElementById(page);
        faqContainer.innerHTML = ""; // 기존 내용 초기화

        faqData[page].forEach((item) => {
            const faqItem = document.createElement("div");
            faqItem.classList.add("faq-item");

            const question = document.createElement("div");
            question.classList.add("question");
            question.innerHTML = item.question;

            const answer = document.createElement("div");
            answer.classList.add("answer");
            answer.innerHTML = item.answer;

            faqItem.appendChild(question);
            faqItem.appendChild(answer);
            faqContainer.appendChild(faqItem);
        });
    }
}

// ✅ 페이지 변경 함수
function showPage(page) {
    document.getElementById("page1").style.display = page === 1 ? "block" : "none";
    document.getElementById("page2").style.display = page === 2 ? "block" : "none";

    // ✅ 버튼 스타일 업데이트
    document.querySelectorAll(".page-button").forEach((btn) => btn.classList.remove("active"));
    document.querySelectorAll(".page-button")[page - 1].classList.add("active");
}
