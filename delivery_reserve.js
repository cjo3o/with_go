
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
let bag_type = '';
let count = 0;

function minus(a) {
    if (a.parentNode.children[1].value > 0) {
        a.parentNode.children[1].value--;
        count--;
        console.log(count);
        $totalPrice.innerText = Number($totalPrice.innerText) - Number(a.parentNode.getAttribute('data-price'));
    }
}

function plus(a) {
    a.parentNode.children[1].value++;
    count++;
    console.log(count);
    $totalPrice.innerText = Number($totalPrice.innerText) + Number(a.parentNode.getAttribute('data-price'));
    if (bag_type.length === 0 ) {
        bag_type = a.parentNode.children[1].name;
        console.log(bag_type);
    }

}

function openModal() {
    event.preventDefault();
    $touModal_container.style.display = 'block';
}

function closeModal() {
    for (let i = 0; i < 2; i++) {
        const modal = $close[i].parentNode.parentNode;
        console.log(modal);
        modal.style.display = 'none';
    }

}

function openSelectLocation() {
    if (!!$start_location) {
        $start_location.classList.add('fade_in');
        $start_location_contents.classList.add('up');
        $start_location.style.display = 'flex';
        console.log($start_location);
    }
}

async function  deliverySubmit() {
    const arr = [$date, $start, $arrive, $name, $phone];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === '') {
            alert(`${arr[i].name}을(를) 입력해주세요.`);
            // arr[i].focus();
            window.scrollTo({top:arr[i].offsetTop, behavior: 'smooth'});
            return;
        }
    }
    if (Number($totalPrice.innerText) === 0) {
        alert('짐 개수를 선택해주세요.');
    }
    else {
        const res = await supabase.from('delivery').insert([
            {name: $name.value, phone: $phone.value, delivery_date: $date.value, delivery_start: $start.value, delivery_arrive: $arrive.value, bag_type, count, price: Number($totalPrice.innerText)}
        ]).select();
        console.log('삽입');
        console.log(res.data);

        if (res.status === 409) {
            alert('사용중인 전화번호입니다.');
            window.scrollTo({top:$phone.offsetTop, behavior: 'smooth'});
        }
    }

}

$select_location.addEventListener('click', function (){
    if(!!document.querySelector('input[name="start_location"]:checked')){
        console.log(document.querySelector('input[name="start_location"]:checked').parentNode.children[1].innerText);
        $start.value = document.querySelector('input[name="start_location"]:checked').parentNode.children[1].innerText;
        console.log($start.value + "입니다.");

        closeModal();
    }
    else{
        alert("장소를 선택해주세요.")
    }
});

