let $totalPrice = document.querySelector('#total_price');

const $close = document.querySelector('.close');
const $keep_location = document.querySelector('.keep_location');
const $keep_location_contents = document.querySelector('.keep_location_contents');
const $location = document.querySelector('#location');
const $select_location = document.querySelector('.select_location');

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

$close.addEventListener('click',function () {
    $keep_location.classList.remove('fade_in');
    $keep_location_contents.classList.remove('up');
})

function openKeepLocation() {
    $keep_location.classList.add('fade_in');
    $keep_location_contents.classList.add('up');
}

$select_location.addEventListener('click', function (){
    if(!!document.querySelector('input[name="keep_location"]:checked')){
        $location.value = document.querySelector('input[name="keep_location"]:checked').parentNode.children[1].innerText;

        $close.click();
    }else{
        alert("보관장소를 선택해주세요.")
    }
});

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
