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
const small = document.querySelector('#small');
const medium = document.querySelector('#medium');
const large = document.querySelector('#large');
const agree = document.querySelector('#agree');
const $check_date = document.querySelector('#check_date');
const $check_start = document.querySelector('#check_start');
const $check_arrive = document.querySelector('#check_arrive');
const $check_detail_adr = document.querySelector('#check_detail_adr');
const $check_name = document.querySelector('#check_name');
const $check_phone = document.querySelector('#check_phone');
const $keep_reservation_contents = document.querySelector('.keep_reservation_contents');
const $keep_reservation_check_contents = document.querySelector('.keep_reservation_check_contents');
const $check_small = document.querySelector('#check_small');
const $check_medium = document.querySelector('#check_medium');
const $check_large = document.querySelector('#check_large');
const $check_price = document.querySelector('#check_price');

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
        const brr = [$check_date, $check_start, $check_arrive, $check_detail_adr, $check_name, $check_phone];
        for (let i = 0; i < brr.length; i++) {
            brr[i].innerHTML = arr[i].value;
        }

        $check_small.innerHTML = small.value;
        $check_medium.innerHTML = medium.value;
        $check_large.innerHTML = large.value;
        $check_price.innerHTML = Number($totalPrice.innerText);
        $keep_reservation_contents.style.display = 'none';
        $keep_reservation_check_contents.style.display = 'block';

        window.scrollTo({top: 0, behavior: 'smooth'});

    }
}

async function paymentSubmit() {
    const res = await supabase.from('delivery').insert([
        {
            name: $name.value,
            phone: $phone.value,
            delivery_date: $date.value,
            delivery_start: $start.value,
            delivery_arrive: $arrive.value,
            detail_adr: $detail_adr.value,
            small: small.value,
            medium: medium.value,
            large: large.value,
            price: Number($totalPrice.innerText)
        }
    ]).select();


    await Swal.fire({
        title: "예약이 완료되었습니다!",
        text: `예약취소시 예약번호가 필요합니다!`,
        icon: "success",
        draggable: true
    })

    await Swal.fire({
        text: `예약번호 : ${res.data[0].re_num}`,
        icon: "success",
        draggable: true
    })

    location.href = 'index.html';
}

$select_location.addEventListener('click', function () {
    if (!!document.querySelector('input[name="start_location"]:checked')) {
        $start.value = document.querySelector('input[name="start_location"]:checked').parentNode.children[1].innerText;

        closeModal();
    } else {
        alert("장소를 선택해주세요.")
    }
});