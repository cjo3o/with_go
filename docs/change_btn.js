document.addEventListener('DOMContentLoaded', function () {
    const $keep_btn = document.querySelector('.keep_btn');
    const $delivery_btn = document.querySelector('.delivery_btn');
    const $keep_table = document.querySelector('.keep_table');
    const $delivery_table = document.querySelector('.delivery_table');

    $keep_btn.addEventListener('click', function () {
        $keep_btn.classList.add('active');
        $keep_table.classList.add('up');
        $delivery_btn.classList.remove('active');
        $delivery_table.classList.remove('up');
    })

    $delivery_btn.addEventListener('click', function () {
        $keep_btn.classList.remove('active');
        $keep_table.classList.remove('up');
        $delivery_btn.classList.add('active');
        $delivery_table.classList.add('up');
    })
})