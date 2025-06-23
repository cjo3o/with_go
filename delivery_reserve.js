let $totalPrice = document.querySelector('#total_price');

const $close = document.querySelectorAll('.close');
const $start_location = document.querySelector('.start_location');
const $start_location_contents = document.querySelector('.start_location_contents');
const $start = document.querySelector('#start');
const $select_location = document.querySelector('.select_location');
const $touModal_container = document.querySelector('.touModal_container');
const $date = document.querySelector('#date');
const $arrive = document.querySelector('#arrive');
const $detail_adr = document.querySelector('#detail_adr');
const $name = document.querySelector('#name');
const $phone = document.querySelector('#phone');
// const small = document.querySelector('#small');
const under = document.querySelector('#under');
const over = document.querySelector('#over');
const agree = document.querySelector('#agree');
const $check_date = document.querySelector('#check_date');
const $check_start = document.querySelector('#check_start');
const $check_arrive = document.querySelector('#check_arrive');
const $check_detail_adr = document.querySelector('#check_detail_adr');
const $check_name = document.querySelector('#check_name');
const $check_phone = document.querySelector('#check_phone');
const $keep_reservation_contents = document.querySelector('.keep_reservation_contents');
const $keep_reservation_check_contents = document.querySelector('.keep_reservation_check_contents');
// const $check_small = document.querySelector('#check_small');
const $check_under = document.querySelector('#check_under');
const $check_over = document.querySelector('#check_over');
const $check_price = document.querySelector('#check_price');

// function minus(a) {
//     if (a.parentNode.children[1].value > 0) {
//         a.parentNode.children[1].value--;
//         $totalPrice.innerText = Number($totalPrice.innerText) - Number(a.parentNode.getAttribute('data-price'));
//     }
// }
//
// function plus(a) {
//     a.parentNode.children[1].value++;
//     $totalPrice.innerText = Number($totalPrice.innerText) + Number(a.parentNode.getAttribute('data-price'));
// }

// const supabase = window.supabase.createClient(
//     "https://zgrjjnifqoactpuqolao.supabase.co",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0"                        // ✅ anon key만 써야 함 (절대 service_role ❌)
// );

console.log($start, $arrive); // 둘 중 하나라도 null이면 연결 실패


$start.addEventListener('input', resetValues);
$arrive.addEventListener('input', resetValues);

function resetValues() {
    under.value = 0;
    over.value = 0;
    $totalPrice.innerText = 0;
}


function underM() {
    if (under.value > 0) {
        if (($start.value.includes('대구') && $arrive.value.includes('대구')) || ($start.value.includes('경주') && $arrive.value.includes('경주'))) {
            under.value--;
            $totalPrice.innerText = Number($totalPrice.innerText) - Number(10000);
        } else if (($start.value.includes('대구') && $arrive.value.includes('경주')) || ($start.value.includes('경주') && $arrive.value.includes('대구'))) {
            under.value--;
            $totalPrice.innerText = Number($totalPrice.innerText) - Number(20000);
        } else {
            alert('출발지와 도착지를 선택해 주세요');
            window.scrollTo({top: $start.offsetTop, behavior: 'smooth'});
        }
    }
}

function underP() {
    if (($start.value.includes('대구') && $arrive.value.includes('대구')) || ($start.value.includes('경주') && $arrive.value.includes('경주'))) {
        under.value++;
        $totalPrice.innerText = Number($totalPrice.innerText) + Number(10000);
    } else if (($start.value.includes('대구') && $arrive.value.includes('경주')) || ($start.value.includes('경주') && $arrive.value.includes('대구'))) {
        under.value++;
        $totalPrice.innerText = Number($totalPrice.innerText) + Number(20000);
    } else {
        alert('출발지와 도착지를 선택해 주세요');
        window.scrollTo({top: $start.offsetTop, behavior: 'smooth'});
    }
}

function overM() {
    if (over.value > 0) {
        if (($start.value.includes('대구') && $arrive.value.includes('대구')) || ($start.value.includes('경주') && $arrive.value.includes('경주'))) {
            over.value--;
            $totalPrice.innerText = Number($totalPrice.innerText) - Number(15000);
        } else if (($start.value.includes('대구') && $arrive.value.includes('경주')) || ($start.value.includes('경주') && $arrive.value.includes('대구'))) {
            over.value--;
            $totalPrice.innerText = Number($totalPrice.innerText) - Number(25000);
        } else {
            alert('출발지와 도착지를 선택해 주세요');
            window.scrollTo({top: $start.offsetTop, behavior: 'smooth'});
        }
    }
}

function overP() {
    if (($start.value.includes('대구') && $arrive.value.includes('대구')) || ($start.value.includes('경주') && $arrive.value.includes('경주'))) {
        over.value++;
        $totalPrice.innerText = Number($totalPrice.innerText) + Number(15000);
    } else if (($start.value.includes('대구') && $arrive.value.includes('경주')) || ($start.value.includes('경주') && $arrive.value.includes('대구'))) {
        over.value++;
        $totalPrice.innerText = Number($totalPrice.innerText) + Number(25000);
    } else {
        alert('출발지와 도착지를 선택해 주세요');
        window.scrollTo({top: $start.offsetTop, behavior: 'smooth'});
    }
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

function openSelectLocation() {
    if (!!$start_location) {
        $start_location.classList.add('fade_in');
        $start_location_contents.classList.add('up');
        $start_location.style.display = 'flex';
    }
}

function searchAddress() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            $arrive.value = data.address;
            $arrive.dispatchEvent(new Event('input'));
        }
    }).open();
}

function deliverySubmit() {
    const arr = [$date, $start, $arrive, $detail_adr, $name, $phone];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === '') {
            alert(`${arr[i].name}을(를) 입력해주세요.`);
            // Swal.fire({
            //     icon: "error",
            //     title: "알림",
            //     text: `${arr[i].name}을(를) 입력해주세요!`,
            // });
            // window.scrollTo({top: arr[i].offsetTop, behavior: 'smooth'});
            arr[i].focus();
            return;
        }
    }

    if (
        !$arrive.value.includes('대구') &&
        !$arrive.value.includes('경주')
    ) {
        alert('도착지는 대구, 경주 지역만 가능합니다.');
        window.scrollTo({top: $arrive.offsetTop, behavior: 'smooth'});
        return;
    }


    if (agree.checked === false) {
        alert('이용약관을 확인해주세요.');
        window.scrollTo({top: agree.offsetTop, behavior: 'smooth'});
        return;
    }

    if (Number($totalPrice.innerText) === 0) {
        alert('짐 개수를 선택해주세요.');
    } else {
        const brr = [$check_date, $check_start, $check_arrive, $check_detail_adr, $check_name, $check_phone];
        for (let i = 0; i < brr.length; i++) {
            brr[i].innerHTML = arr[i].value;
        }

        $check_under.innerHTML = under.value;
        $check_over.innerHTML = over.value;
        $check_price.innerHTML = Number($totalPrice.innerText);
        $keep_reservation_contents.style.display = 'none';
        $keep_reservation_check_contents.style.display = 'block';

        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

// async function paymentSubmit() {
//     const res = await supabase.auth.getUser();
//     await supabase.from('delivery').insert([
//         {
//             user_id: res.data.user.id,
//             name: $name.value,
//             phone: $phone.value,
//             delivery_date: $date.value,
//             delivery_start: $start.value,
//             delivery_arrive: $arrive.value,
//             detail_adr: $detail_adr.value,
//             under: under.value,
//             over: over.value,
//             price: Number($totalPrice.innerText)
//         }
//     ]).select();
//
//
//     await Swal.fire({
//         title: "예약이 완료되었습니다!",
//         icon: "success",
//         draggable: true
//     });
//     location.href = 'index.html';
// }

const tossPayments = TossPayments("test_ck_ZLKGPx4M3MGo5A04daGqrBaWypv1"); // ✅ 반드시 수정
//
// function startPayment() {
//     const name = document.getElementById("name").value;
//     const phone = document.getElementById("phone").value;
//     // const mail = document.getElementById("mail").value;
//     const delivery_date = document.getElementById("date").value;
//     const delivery_start = document.getElementById("start").value;
//     const delivery_arrive = document.getElementById("arrive").value;
//     const detail_adr = document.getElementById("detail_adr").value;
//     // const small = document.getElementById("small").value;
//     const under = document.getElementById("under").value;
//     const over = document.getElementById("over").value;
//     const price = Number(document.getElementById("total_price").innerText);
//
//     // 1️⃣ 예약 정보 임시 저장 (결제 성공 후 Supabase에 저장 예정)
//     localStorage.setItem("reservationData", JSON.stringify({
//         name, phone, delivery_date, delivery_start, delivery_arrive,
//         detail_adr, under, over, price
//     }));
//
//     // 2️⃣ 결제창 띄우기
//     tossPayments.requestPayment("카드", {
//         amount: price,
//         orderId: "order_" + new Date().getTime(),
//         orderName: "보관 예약 결제",
//         customerName: name,
//         successUrl: "http://localhost:5173/reservation.html?from=payment", // ✅ 개발 중일 땐 localhost 사용
//         failUrl: "http://localhost:5173/fail.html"
//     });
// }

async function startPayment() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const delivery_date = document.getElementById("date").value;
    const delivery_start = document.getElementById("start").value;
    const delivery_arrive = document.getElementById("arrive").value;
    const detail_adr = document.getElementById("detail_adr").value;
    const under = document.getElementById("under").value;
    const over = document.getElementById("over").value;
    const price = Number(document.getElementById("total_price").innerText);

    const reservationData = {
        name, phone, delivery_date, delivery_start, delivery_arrive,
        detail_adr, under, over, price
    };

    localStorage.setItem("reservationData", JSON.stringify(reservationData));

    // ✅ 결제창 딩우기
    tossPayments.requestPayment("카드", {
        amount: price,
        orderId: "order_" + new Date().getTime(),
        orderName: "배송 예약 결제",
        customerName: name,
        successUrl: "http://localhost:5173/reservation.html?from=payment",
        failUrl: "http://localhost:5173/fail.html"
    });
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

    const { data, error } = await supabase
        .from("delivery")
        .insert([{
            name: reservationData.name,
            phone: reservationData.phone,
            delivery_date: reservationData.delivery_date,
            delivery_start: reservationData.delivery_start,
            delivery_arrive: reservationData.delivery_arrive,
            detail_adr: reservationData.detail_adr,
            under: parseInt(reservationData.under) || 0,
            over: parseInt(reservationData.over) || 0,
            price: parseInt(reservationData.price) || 0
        }]);
    console.log(data);
    console.log(error);
}

$select_location.addEventListener('click', function () {
    if (!!document.querySelector('input[name="start_location"]:checked')) {
        $start.value = document.querySelector('input[name="start_location"]:checked').parentNode.children[1].innerText;
        $start.dispatchEvent(new Event('input'));
        closeModal();
    } else {
        alert("장소를 선택해주세요.")
    }
});

const startDatePicker = document.getElementById('date');

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
// endDatePicker.addEventListener('change', function () {
//     const startDate = new Date(startDatePicker.value);
//     const selectedDate = new Date(this.value);
//
//     if (selectedDate < startDate) {
//         this.value = startDatePicker.value;
//     }
// });

document.addEventListener('DOMContentLoaded', async function () {
    const loginData = await supabase.auth.getUser();
    if (loginData?.data?.user?.user_metadata?.name) {
        $name.value = loginData.data.user.user_metadata.name;
    }

    // 빠른 예약에서 가져온 값 자동 세팅
    const name = localStorage.getItem("reservation_name");
    const phone = localStorage.getItem("reservation_phone");
    const carrier = localStorage.getItem("reservation_carrier");

    if (name) $name.value = name;
    if (phone) $phone.value = phone;

    // select box 자동 선택
    const $carrierSelect = document.getElementById("carrier");
    if ($carrierSelect && carrier) {
        const matchedOption = [...$carrierSelect.options].find(opt => opt.text === carrier);
        if (matchedOption) {
            $carrierSelect.value = matchedOption.value;
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const radioButtons = document.querySelectorAll('input[name="kl"]');
    const startBox = document.querySelector('.delivery_start_box');
    const stayBox = document.querySelector('.delivery_start_stay_box');

    radioButtons.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                radioButtons.forEach(rb => rb.classList.remove('active'));
                radio.classList.add('active');

                if (index === 0) {
                    startBox.style.display = 'block';
                    stayBox.style.display = 'none';
                } else {
                    startBox.style.display = 'none';
                    stayBox.style.display = 'block';
                }
            }
        });
    });

    // 페이지 진입 시 '보관함'이 기본 선택되도록
    radioButtons[0].checked = true;
    radioButtons[0].classList.add('active');
    startBox.style.display = 'block';
    stayBox.style.display = 'none';

    // if (radioButtons[0]) {
    //     radioButtons[0].checked = true;
    //     radioButtons[0].classList.add('active');
    // }
    // if (startBox) startBox.style.display = 'block';
    // if (stayBox) stayBox.style.display = 'none';

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

    const container = document.querySelector(".delivery_start_card_list");
    container.innerHTML = "";

    data.forEach((place) => {
        const template = document.querySelector("#card-template");
        const clone = template.content.cloneNode(true);
        clone.querySelector('input').value = place.name;
        clone.querySelector('h3').textContent = place.name;
        clone.querySelectorAll('p')[0].textContent = `운영시간 : ${place.hours || "오전10시 ~ 오후10시"}`;
        clone.querySelectorAll('p')[1].textContent = place.address;
        container.appendChild(clone);
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

    const container = document.querySelector(".delivery_start_stay_card_list");
    container.innerHTML = "";

    data.forEach((place) => {
        const template = document.querySelector("#partner-card-template");
        const clone = template.content.cloneNode(true);
        clone.querySelector('input').value = place.name;
        clone.querySelector('h3').textContent = place.name;
        clone.querySelectorAll('p')[0].textContent = `운영시간 : ${place.hours || "오전10시 ~ 오후10시"}`;
        clone.querySelectorAll('p')[1].textContent = place.address;
        container.appendChild(clone);
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


