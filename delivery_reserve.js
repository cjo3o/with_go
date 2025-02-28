let $totalPrice = document.querySelector('#total_price');

const $close = document.querySelector('.close');
const $keep_location = document.querySelector('.keep_location');
const $start_location = document.querySelector('.start_location');
const $arrive_location = document.querySelector('.arrive_location');
const $keep_location_contents = document.querySelector('.keep_location_contents');
const $start_location_contents = document.querySelector('.start_location_contents');
const $arrive_location_contents = document.querySelector('.arrive_location_contents');
const $location = document.querySelector('#location');
const $start = document.querySelector('#start');
const $arrive = document.querySelector('#arrive');
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
    if (!!$keep_location) {
        $keep_location.classList.remove('fade_in');
        $keep_location_contents.classList.remove('up');
    }
    if (!!$start_location) {
        $start_location.classList.remove('fade_in');
        $start_location_contents.classList.remove('up');
    }
    if (!!$arrive_location) {
        $arrive_location.classList.remove('fade_in');
        $arrive_location_contents.classList.remove('up');
    }
})

function openSelectLocation() {
    if (!!$keep_location) {
        $keep_location.classList.add('fade_in');
        $keep_location_contents.classList.add('up');
    }
    if (!!$start_location) {
        $start_location.classList.add('fade_in');
        $start_location_contents.classList.add('up');
    }
    else if (!!$arrive_location) {
        $arrive_location.classList.add('fade_in');
        $arrive_location_contents.classList.add('up');
    }
}

$select_location.addEventListener('click', function (){
    if(!!document.querySelector('input[name="keep_location"]:checked')){
        console.log(document.querySelector('input[name="keep_location"]:checked').parentNode.children[1].innerText);
        $location.value = document.querySelector('input[name="keep_location"]:checked').parentNode.children[1].innerText;

        $close.click();
    }
    else if(!!document.querySelector('input[name="start_location"]:checked')){
        console.log(document.querySelector('input[name="start_location"]:checked').parentNode.children[1].innerText);
        $start.value = document.querySelector('input[name="start_location"]:checked').parentNode.children[1].innerText;
        console.log($start.value + "입니다.");

        $close.click();
    }
    else if(!!document.querySelector('input[name="arrive_location"]:checked')){
        console.log(document.querySelector('input[name="arrive_location"]:checked').parentNode.children[1].innerText);
        $arrive.value = document.querySelector('input[name="arrive_location"]:checked').parentNode.children[1].innerText;
        console.log($arrive.value);

        $close.click();
    }else{
        alert("장소를 선택해주세요.")
    }
});