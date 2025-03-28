document.addEventListener('DOMContentLoaded', function () {
    const $keep_btn = document.querySelector('.keep_btn');
    const $delivery_btn = document.querySelector('.delivery_btn');
    const $keep_table = document.querySelector('.storage_table');
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

// document.addEventListener('DOMContentLoaded', function () {
//     const keepButton = document.querySelector('.keep_btn');
//     const deliveryButton = document.querySelector('.delivery_btn');
//     const keepTable = document.querySelector('.keep_table');
//     const deliveryTable = document.querySelector('.delivery_table');
//
//     function toggleTable(activeButton, activeTable, inactiveButton, inactiveTable) {
//         activeButton.classList.add('active');
//         activeTable.classList.add('up');
//         inactiveButton.classList.remove('active');
//         inactiveTable.classList.remove('up');
//     }
//
//     if (keepButton && deliveryButton && keepTable && deliveryTable) {
//         keepButton.addEventListener('click', function () {
//             toggleTable(keepButton, keepTable, deliveryButton, deliveryTable);
//         });
//
//         deliveryButton.addEventListener('click', function () {
//             toggleTable(deliveryButton, deliveryTable, keepButton, keepTable);
//         });
//     }
//     else {
//         console.error('One or more elements not found.');
//     }
// });

// const checkbox = document.querySelector('input[type="checkbox"]');
// const label = document.querySelector('label');
//
// checkbox.addEventListener('change', function() {
//     if (this.checked) {
//         label.style.backgroundColor = '#000';
//         label.style.color = '#fff';
//         label.style.fontWeight = 'bold';
//     } else {
//         label.style.backgroundColor = '#000';
//         label.style.color = '#fff';
//         label.style.fontWeight = 'bold';
//     }
// });