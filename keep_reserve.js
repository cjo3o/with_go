let $totalPrice = document.querySelector('#total_price');

const $close = document.querySelectorAll('.close');
const $keep_location = document.querySelector('.keep_location');
const $keep_location_contents = document.querySelector('.keep_location_contents');
const $location = document.querySelectorAll('input[name="keep_location"]');
const $select_location = document.querySelector('.select_location');
const $touModal_container = document.querySelector('.touModal_container');
const $storage_reservation = document.querySelector('#storage_reservation');

const $dateStart = document.querySelector('#date_start');
const $dateEnd = document.querySelector('#date_end');
const $location_a = document.querySelector('#location_a');
const $name = document.querySelector('#name');
const $phone = document.querySelector('#phone');
const small = document.querySelector('#small');
const medium = document.querySelector('#medium');
const large = document.querySelector('#large');
const agree = document.querySelector('#agree');

const $check_start_date = document.querySelector('#check_start_date');
const $check_end_date = document.querySelector('#check_end_date');
const $check_location = document.querySelector('#check_location');
const $check_name = document.querySelector('#check_name');
const $check_phone = document.querySelector('#check_phone');
const $keep_reservation_contents = document.querySelector('.keep_reservation_contents');
const $keep_reservation_check_contents = document.querySelector('.keep_reservation_check_contents');
const $check_small = document.querySelector('#check_small');
const $check_medium = document.querySelector('#check_medium');
const $check_large = document.querySelector('#check_large');
const $check_price = document.querySelector('#check_price');

const supabase = window.supabase.createClient(
    "https://zgrjjnifqoactpuqolao.supabase.co",           // ✅ 네 프로젝트 URL로 변경
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0"                        // ✅ anon key만 써야 함 (절대 service_role ❌)
);

function minus(a) {
    if (a.parentNode.children[1].value > 0) {
        a.parentNode.children[1].value--;
        $totalPrice.innerText = Number($totalPrice.innerText) - Number(a.parentNode.getAttribute('data-price'));
    }
}

function plus(a) {
    a.parentNode.children[1].value++;
    $totalPrice.innerText = Number($totalPrice.innerText) + Number(a.parentNode.getAttribute('data-price'));
}

function openModal() {
    event.preventDefault();
    $touModal_container.style.display = 'block';
}

function closeModal() {
    for (let i = 0; i < 2; i++) {
        const modal = $close[i].parentNode.parentNode;
        modal.style.display = 'none';
    }

}

async function storageSelect() {
    const arr = [$dateStart, $dateEnd, $location_a, $name, $phone];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === '') {
            alert(`${arr[i].name}을(를) 입력해주세요.`);
            // Swal.fire({
            //     icon: "error",
            //     title: "알림",
            //     text: `${arr[i].name}을(를) 입력해주세요!`,
            // });
            window.scrollTo({top: arr[i].offsetTop, behavior: 'smooth'});
            return;
        }
    }

    if (agree.checked === false) {
        alert('이용약관을 확인해주세요.');
        window.scrollTo({top: agree.offsetTop, behavior: 'smooth'});
        return;
    }

    if (Number($totalPrice.innerText) === 0) {
        alert('짐 개수를 선택해주세요.');
    } else {
        const brr = [$check_start_date, $check_end_date, $check_location, $check_name, $check_phone];
        for (let i = 0; i < brr.length; i++) {
            brr[i].innerHTML = arr[i].value;
        }

        $check_name.innerHTML = $name.value;
        $check_phone.innerHTML = $phone.value;
        $check_location.innerHTML = $location_a.value;
        $check_small.innerHTML = small.value;
        $check_medium.innerHTML = medium.value;
        $check_large.innerHTML = large.value;
        $check_price.innerHTML = Number($totalPrice.innerText);
        $keep_reservation_contents.style.display = 'none';
        $keep_reservation_check_contents.style.display = 'block';

        window.scrollTo({top: 0, behavior: 'smooth'});

    }
}

// const tossPayments = TossPayments("test_ck_ZLKGPx4M3MGo5A04daGqrBaWypv1"); // ✅ 반드시 수정

// function startPayment() {
//     const name = document.getElementById("name").value;
//     const phone = document.getElementById("phone").value;
//     const dateStart = document.getElementById("date_start").value;
//     const dateEnd = document.getElementById("date_end").value;
//     const location = document.getElementById("location_a").value;
//     const small = document.getElementById("small").value;
//     const medium = document.getElementById("medium").value;
//     const large = document.getElementById("large").value;
//     const price = Number(document.getElementById("total_price").innerText);
//
//     // 1️⃣ 예약 정보 임시 저장 (결제 성공 후 Supabase에 저장 예정)
//     localStorage.setItem("reservationData", JSON.stringify({
//         name, phone, dateStart, dateEnd, location,
//         small, medium, large, price
//     }));
//
//     // 2️⃣ 결제창 띄우기
//         tossPayments.requestPayment("카드", {
//             amount: price,
//             orderId: "order_" + new Date().getTime(),
//             orderName: "보관 예약 결제",
//             customerName: name,
//             successUrl: "http://localhost:5173/reservation.html?from=payment", // ✅ 개발 중일 땐 localhost 사용
//             failUrl: "http://localhost:5173/fail.html"
//         });
// }
async function startPayment() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const dateStart = document.getElementById("date_start").value;
    const dateEnd = document.getElementById("date_end").value;
    const location = document.getElementById("location_a").value;
    const small = document.getElementById("small").value;
    const medium = document.getElementById("medium").value;
    const large = document.getElementById("large").value;
    const price = Number(document.getElementById("total_price").innerText);

    const reservationData = {
        name, phone, dateStart, dateEnd, location,
        small, medium, large, price
    };

    localStorage.setItem("reservationData", JSON.stringify(reservationData));

    // const response = await fetch("http://localhost:4000/toss/pay", {
    const response = await fetch("https://port-0-with-go-back-manag68qe4cb4639.sel4.cloudtype.app/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            // orderId: "order_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10000),
            amount: price,
            orderName: "보관 예약 결제",
            customerName: name
        })
    })
};
console.log("결제 요청 데이터:", {
    // orderId: "order_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10000),
    amount: price,
    orderName: "보관 예약 결제",
    customerName: name
});

const result = await response.json();
if (result.url) {
    window.location.href = result.url;
} else {
    alert("결제 요청 실패");
}


async function insertReservation() {
    // 결제 성공했는지 체크
    if (!paymentKey || !orderId || !amount) {
        alert("필수 결제 정보가 누락되었습니다.");
        return;
    }

    const reservationData = JSON.parse(localStorage.getItem("reservationData"));

    if (!reservationData) {
        alert("저장된 예약 정보가 없습니다.");
        return;
    }

    const {data, error} = await supabase
        .from("storage")
        .insert([{
            name: reservationData.name,
            phone: reservationData.phone,
            storage_start_date: reservationData.dateStart,
            storage_end_date: reservationData.dateEnd,
            location: reservationData.location,
            small: parseInt(reservationData.small) || 0,
            medium: parseInt(reservationData.medium) || 0,
            large: parseInt(reservationData.large) || 0,
            price: parseInt(reservationData.price) || 0
        }]);
    console.log(data);
    console.log(error);
    console.log("Insert할 데이터:", {
        name: reservationData.name,
        phone: reservationData.phone,
        storage_start_date: reservationData.dateStart,
        storage_end_date: reservationData.dateEnd,
        location: reservationData.location,
        small: parseInt(reservationData.small),
        medium: parseInt(reservationData.medium),
        large: parseInt(reservationData.large),
        price: parseInt(reservationData.price)
    });

    if (error) {
        console.error("예약 저장 실패", error);
        Swal.fire("오류", "예약 저장에 실패했습니다.", "error");
    } else {
        Swal.fire({
            title: "🎉 예약이 완료되었습니다!",
            text: "홈페이지로 이동합니다.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            didClose: () => {
                localStorage.removeItem("reservationData");
                window.location.href = "reservation.html";
            }
        });
    }
}

// async function paymentSubmit() {
//     const res = await supabase.from('storage').insert([
//         {
//             name: $name.value,
//             phone: $phone.value,
//             storage_start_date: $dateStart.value,
//             storage_end_date: $dateEnd.value,
//             location: $location_a.value,
//             mail: $mail.value,
//             reservation_country: $country.value,
//             small: small.value,
//             medium: medium.value,
//             large: large.value,
//             price: Number($totalPrice.innerText)
//         }
//     ]).select();
//     console.log(res);
//     await Swal.fire({
//         title: "보관예약이 완료되었습니다!",
//         icon: "success",
//         draggable: true
//     })
//     location.href = 'index.html';
// }

// $close.addEventListener('click',function () {
//     $keep_location.classList.remove('fade_in');
//     $keep_location_contents.classList.remove('up');
//     $keep_location.style.display = 'block';
// })

function openKeepLocation() {
    if (!!$keep_location) {
        $keep_location.classList.add('fade_in');
        $keep_location_contents.classList.add('up');
        $keep_location.style.display = 'flex';
    }
}

$select_location.addEventListener('click', function () {
    const selectedRadio = document.querySelector('input[name="keep_location"]:checked');
    if (selectedRadio) {
        const selectedTitle = selectedRadio.closest('.card_title')?.querySelector('h3')?.innerText;
        if (selectedTitle) {
            $location_a.value = selectedTitle;
            closeModal();
        } else {
            alert("선택된 장소의 이름을 찾을 수 없습니다.");
        }
    } else {
        alert("보관장소를 선택해주세요.")
    }
});

const startDatePicker = document.getElementById('date_start');
const endDatePicker = document.getElementById('date_end');

// 시작 날짜 선택 제한 설정
startDatePicker.addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    const today = new Date();

    if (selectedDate < today) {
        const todayFormatted = today.toISOString().split('T')[0];
        this.value = todayFormatted;
    }
});

const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];
startDatePicker.setAttribute('min', todayFormatted);

// 종료 날짜 선택 제한 설정 (시작 날짜 이후만 선택 가능하도록)
endDatePicker.addEventListener('change', function () {
    const startDate = new Date(startDatePicker.value);
    const selectedDate = new Date(this.value);

    if (selectedDate < startDate) {
        this.value = startDatePicker.value;
    }
});

endDatePicker.setAttribute('min', startDatePicker.value);

// 시작 날짜가 변경될 때 종료 날짜의 min 속성 업데이트
startDatePicker.addEventListener('change', function () {
    endDatePicker.setAttribute('min', this.value);
    // 종료 날짜가 시작 날짜보다 이전으로 설정된 경우, 종료 날짜를 시작 날짜로 업데이트
    if (new Date(endDatePicker.value) < new Date(this.value)) {
        endDatePicker.value = this.value;
    }
});

// const startDatePicker = document.getElementById('date_start');
// const endDatePicker = document.getElementById('date_end');
//
// startDatePicker.addEventListener('focus', function () {
//     if (this.value === 'YYYY-MM-DD') {
//         this.value = '';
//         this.style.color = 'black';
//     }
// });
//
// startDatePicker.addEventListener('blur', function () {
//     if (this.value === '') {
//         this.value = 'YYYY-MM-DD';
//         this.style.color = 'gray';
//     }
// });
//
// endDatePicker.addEventListener('focus', function () {
//     if (this.value === 'YYYY-MM-DD') {
//         this.value = '';
//         this.style.color = 'black';
//     }
// });
//
// endDatePicker.addEventListener('blur', function () {
//     if (this.value === '') {
//         this.value = 'YYYY-MM-DD';
//         this.style.color = 'gray';
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem("reservation_name");
    const phone = localStorage.getItem("reservation_phone");
    const carrier = localStorage.getItem("reservation_carrier");

    if (name) document.getElementById("name").value = name;
    if (phone) document.getElementById("phone").value = phone;

    // ✅ select 요소에 기본값만 세팅 (사용자 선택 가능)
    const $carrierSelect = document.getElementById("carrier");
    if ($carrierSelect && carrier) {
        const option = [...$carrierSelect.options].find(opt => opt.text === carrier);
        if (option) $carrierSelect.value = option.value;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const radioButtons = document.querySelectorAll('input[name="kl"]');
    const keepBox = document.querySelector('.keep_box');
    const stayBox = document.querySelector('.stay_box');

    radioButtons.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                radioButtons.forEach(rb => rb.classList.remove('active'));
                radio.classList.add('active');

                if (index === 0) {
                    keepBox.style.display = 'block';
                    stayBox.style.display = 'none';
                } else {
                    keepBox.style.display = 'none';
                    stayBox.style.display = 'block';
                }
            }
        });
    });

    // 페이지 진입 시 '보관함'이 기본 선택되도록
    radioButtons[0].checked = true;
    radioButtons[0].classList.add('active');
    keepBox.style.display = 'block';
    stayBox.style.display = 'none';

    loadStoragePlaces();
    loadPartnerPlaces();
});


async function loadStoragePlaces() {
    const {data, error} = await supabase
        .from("storage_place")
        .select("*")
        .order("created_at", {ascending: false});

    if (error) {
        console.error("보관 장소 불러오기 실패:", error);
        return;
    }

    const container = document.querySelector(".keep_box");
    container.innerHTML = "";

    data.forEach((place) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <label>
        <div class="card_title">
          <input type="radio" name="keep_location" value="${place.name}">
          <h3>${place.name}</h3>
        </div>
        <div class="card_body">
          <p>운영시간 : "오전10시 ~ 오후10시"</p>
          <p>${place.address}</p>
        </div>
      </label>
    `;
        container.appendChild(card);
    });
}

async function loadPartnerPlaces() {
    const {data, error} = await supabase
        .from("partner_place")
        .select("*")
        .order("created_at", {ascending: false});

    if (error) {
        console.error("숙소 목록 불러오기 실패:", error);
        return;
    }

    const container = document.querySelector(".stay_box");
    container.innerHTML = "";

    data.forEach((hotel) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <label>
        <div class="card_title">
          <input type="radio" name="keep_location" value="${hotel.name}">
          <h3>${hotel.name}</h3>
        </div>
        <div class="card_body">
          <p>운영시간 : "오전10시 ~ 오후10시"</p>
          <p>${hotel.address}</p>
        </div>
      </label>
    `;
        container.appendChild(card);
    });
}

document.getElementById('phone').addEventListener('input', function (e) {
    let num = e.target.value.replace(/[^0-9]/g, '');

    if (num.length < 4) {
        e.target.value = num;
    } else if (num.length < 8) {
        e.target.value = `${num.slice(0, 3)}-${num.slice(3)}`;
    } else {
        e.target.value = `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentKey = urlParams.get("paymentKey");
    const orderId = urlParams.get("orderId");
    const amount = urlParams.get("amount");

    // URL에 결제 성공 정보가 포함되어 있으면 insertReservation 실행
    if (paymentKey && orderId && amount) {
        insertReservation(); // ✅ 따로 함수로 빼줘야 함
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const {data: {user}} = await supabase.auth.getUser();

    if (user) {
        const nickname = user?.user_metadata?.name || user?.email;
        const nameInput = document.getElementById("name");

        // 입력창에 이미 값이 없을 때만 자동 입력
        if (nameInput && !nameInput.value) {
            nameInput.value = nickname;
        }
    }
});
