document.addEventListener("DOMContentLoaded", function() {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector('.header').innerHTML = data;

            const $menu = document.querySelector('.menu');
            const $sub_menu_container = document.querySelector('.sub_menu_container');
            const $sub_menu = document.querySelector('.sub_menu');
            const $header_check = document.querySelector('#header_check');
            const $header_acc = document.querySelector('#header_acc');
            const $header_keep = document.querySelector('#header_keep');
            //
            // const $menu_img = document.querySelector('.menu_img');
            // const $sub_menu_modal_container = document.querySelector('.sub_menu_modal_container');
            // const $sub_menu_modal = document.querySelector('.sub_menu_modal');

            // 메뉴 위에 마우스가 올라갔을 때
            $menu.addEventListener('mouseover', function () {
                $sub_menu_container.classList.add('visible');
            });

            // 메뉴에서 마우스가 벗어났을 때
            $menu.addEventListener('mouseout', function () {
                $sub_menu_container.classList.remove('visible');
            });

            $sub_menu.addEventListener('mouseover', function () {
                $sub_menu_container.classList.add('visible');
            });

            $sub_menu.addEventListener('mouseout', function () {
                $sub_menu_container.classList.remove('visible');
            });
            //
            //
            // $menu_img.addEventListener('click', () => {
            //     $sub_menu_modal_container.classList.add('active');
            //     $sub_menu_modal.classList.add('slide');
            // });
            //
            // $sub_menu_modal_container.addEventListener('click', () => {
            //     $sub_menu_modal_container.classList.add('active2');
            //     $sub_menu_modal.classList.add('slide2');
            //
            // })

            $header_check.addEventListener('click', async function () {
                const $check_container = document.querySelector('.check_container');
                event.preventDefault();
                window.scrollTo({top: $check_container.offsetTop, behavior: 'smooth'});
            })
        });

    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector(".footer").innerHTML = data;
        });
});