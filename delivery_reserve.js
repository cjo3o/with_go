let $totalPrice = document.querySelector('#total_price');

const $close = document.querySelectorAll('.close');
const $start_location = document.querySelector('.start_location');
const $start_location_contents = document.querySelector('.start_location_contents');
const $start = document.querySelector('#start');
const $select_location = document.querySelector('.select_location');
const $touModal_container = document.querySelector('.touModal_container');
const $date = document.querySelector('#date');
const $arrive = document.querySelector('#arrive');
const $name = document.querySelector('#name');
const $phone = document.querySelector('#phone');
const small = document.querySelector('#small');
const medium = document.querySelector('#medium');
const large = document.querySelector('#large');
const agree = document.querySelector('#agree');

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

async function  deliverySubmit() {
    const arr = [$date, $start, $arrive, $name, $phone];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === '') {
            alert(`${arr[i].name}을(를) 입력해주세요.`);
            // Swal.fire({
            //     icon: "error",
            //     title: "알림",
            //     text: `${arr[i].name}을(를) 입력해주세요!`,
            // });
            window.scrollTo({top:arr[i].offsetTop, behavior: 'smooth'});
            return;
        }
    }

    if (agree.checked === false) {
        alert('이용약관을 확인해주세요.');
        window.scrollTo({top:agree.offsetTop, behavior: 'smooth'});
        return;
    }

    if (Number($totalPrice.innerText) === 0) {
        alert('짐 개수를 선택해주세요.');
    }
    else {
        const res = await supabase.from('delivery').insert([
            {name: $name.value, phone: $phone.value, delivery_date: $date.value, delivery_start: $start.value, delivery_arrive: $arrive.value, small: small.value, medium: medium.value, large: large.value, price: Number($totalPrice.innerText)}
        ]).select();

        if (res.status === 409) {
            alert('사용중인 전화번호입니다.');
            window.scrollTo({top:$phone.offsetTop, behavior: 'smooth'});
            return;
        }

        if (res.status === 201) {
            await Swal.fire({
                title: "배송예약이 완료되었습니다!",
                icon: "success",
                draggable: true
            })
        }
    }
    window.location.href="index.html";
}

$select_location.addEventListener('click', function (){
    if(!!document.querySelector('input[name="start_location"]:checked')){
        $start.value = document.querySelector('input[name="start_location"]:checked').parentNode.children[1].innerText;

        closeModal();
    }
    else{
        alert("장소를 선택해주세요.")
    }
});