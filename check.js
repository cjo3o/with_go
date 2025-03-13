const $check_detail = document.querySelector('.check_detail');
const $check_detail_contents = document.querySelector('.check_detail_contents');
const $search_check = document.querySelector('.search_check');
const $search_checkBox = document.querySelector('#search_checkBox');
const $search_check_btn = document.querySelector('.search_check_btn');
const $view_table_container = document.querySelector('.view_table_container');
const $alert = document.querySelector('.alert');
const $keep_btn = document.querySelector('.keep_btn');
const $delivery_btn = document.querySelector('.delivery_btn');
const $keep_table = document.querySelector('.keep_table');
const $delivery_table = document.querySelector('.delivery_table');
const $click_infor = document.querySelector('.click_infor');
const $search_reserveBox = document.querySelector('#search_reserveBox');


// $keep_btn.addEventListener('click', function () {
//     $keep_btn.classList.add('active');
//     $keep_table.classList.add('up');
//     $delivery_btn.classList.remove('active');
//     $delivery_table.classList.remove('up');
//     checkKeepTableVisibility(); // Keep 테이블의 가시성 확인
// });
//
// $delivery_btn.addEventListener('click', function () {
//     $keep_btn.classList.remove('active');
//     $keep_table.classList.remove('up');
//     $delivery_btn.classList.add('active');
//     $delivery_table.classList.add('up');
//     checkDeliveryTableVisibility(); // Delivery 테이블의 가시성 확인
// });
//
// // close 버튼 클릭 이벤트 리스너
// function addCloseEvent() {
//     const $close = document.querySelector('.close');
//     if ($close) {
//         $close.addEventListener('click', function () {
//             $check_detail.classList.remove('fade_in');
//             $check_detail_contents.classList.remove('slide_up');
//             console.log('클릭');
//         });
//     }
// }
//
// // openDetail 함수
// window.openDetail = function (td) {
//     const row = td.parentElement; // 클릭한 td의 부모 tr 요소
//     const location = row.cells[2].innerText; // 보관 장소
//     const date = row.cells[1].innerText; // 보관 일자
//     const number = row.cells[0].innerText; // 수화물 번호
//     const price = row.cells[3].innerText; // 가격
//     const stat = row.cells[4].innerText; // 상태
//     $check_detail_contents.innerHTML = `
//         <span class="close">&times;</span>
//         <h1>조회 상세 정보</h1>
//         <span>${stat}</span>
//         <span style="font-size: 1.3rem;">보관 장소 : ${location}</span>
//         <span>보관 일자 : ${date}</span>
//         <span>수화물 번호 : ${number}</span>
//         <ul>가격
//             <li>소형 1개 1000원</li>
//             <li>중형 1개 2000원</li>
//             <li>대형 1개 3000원</li>
//         </ul>
//         <hr>
//         <p>총합<span>${price}원</span></p>
//     `;
//     $check_detail.classList.add('fade_in');
//     $check_detail_contents.classList.add('slide_up');
//
//     // close 버튼 이벤트 리스너 추가
//     addCloseEvent();
// };
//
// function checkSearch() {
//     const searchValue = $search_checkBox.value.toLowerCase(); // 검색 입력값
//     const rows = document.querySelectorAll('table tbody tr'); // 테이블의 모든 행 선택
//     let hasMatchingRows = false;
//
//     rows.forEach(row => {
//         const numberCell = row.cells[0]; // 수화물 번호가 있는 셀 선택
//
//         // 수화물 번호가 검색값을 포함하는지 확인
//         if (numberCell.textContent.toLowerCase().includes(searchValue)) {
//             row.style.display = ''; // 행을 표시
//             hasMatchingRows = true; // 검색된 값이 있는 행이 존재함
//         } else {
//             row.style.display = 'none'; // 행을 숨김
//         }
//     });
//
//     // 검색된 값이 있는 행이 없으면 테이블 숨기기
//     if (!hasMatchingRows) {
//         $view_table_container.style.display = 'none'; // 테이블 숨기기
//         $alert.style.display = "block"; // 경고 메시지 표시
//     } else {
//         $view_table_container.style.display = ''; // 테이블 표시
//         $alert.classList.remove("on");
//     }
//
//     // 검색창 관련 로직
//     $search_check.style.display = 'none';
//
//     checkKeepTableVisibility();
//     checkDeliveryTableVisibility();
// }
//
// function checkKeepTableVisibility() {
//     const rows = $keep_table.querySelectorAll('tbody tr'); // Keep 테이블의 모든 행 선택
//     let hasRows = Array.from(rows).some(row => row.style.display !== 'none'); // 표시된 행이 있는지 확인
//
//     if (!hasRows) {
//         $keep_table.classList.remove("up");// Keep 테이블 숨기기
//         $alert.style.display = "block";
//     } else {
//         $keep_table.style.display = '';// Keep 테이블 표시
//         $alert.style.display = 'none';
//     }
// }
//
// function checkDeliveryTableVisibility() {
//     const rows = $delivery_table.querySelectorAll('tbody tr'); // Delivery 테이블의 모든 행 선택
//     let hasRows = Array.from(rows).some(row => row.style.display !== 'none'); // 표시된 행이 있는지 확인
//
//     if (!hasRows) {
//         $delivery_table.classList.remove("up"); // Delivery 테이블 숨기기
//         $alert.style.display = "block";
//     } else {
//         $delivery_table.style.display = ''; // Delivery 테이블 표시
//         $alert.style.display = 'none';
//     }
// }

async function searchReserve() {
    const res = await supabase.from('delivery').select('delivery_date, name, phone, delivery_start, delivery_arrive, small, medium, large, price').eq('phone', $search_reserveBox.value);
    let rows = '';

    console.log(res.status);

    if (res.data.length === 0) {
        await Swal.fire({
            icon: "error",
            title: "조회할 내역이 존재하지 않습니다.",
            text: "연락처를 확인해 주세요."
        })
    } else {
        for (let i = 0; i < res.data.length; i++) {
            rows += `
                <tr onclick="openDetail(this)">
                    <td>${res.data[i].delivery_date}</td>
                    <td>${res.data[i].name}</td>
                    <td>${res.data[i].phone}</td>
                    <td>${res.data[i].delivery_start}</td>
                    <td>${res.data[i].delivery_arrive}</td>
                    <td>${res.data[i].small}</td>
                    <td>${res.data[i].medium}</td>
                    <td>${res.data[i].large}</td>
                    <td>${res.data[i].price}</td>
                </tr>
                `
        }
        let delivery_table = `
                                <table>
                                    <thead>
                                    <tr>
                                        <th>배송일자</th>
                                        <th>이름</th>
                                        <th>연락처</th>
                                        <th>배송 출발지</th>
                                        <th>배송 도착지</th>
                                        <th>소형</th>
                                        <th>중형</th>
                                        <th>대형</th>
                                        <th>가격</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    ${rows}
                                    </tbody>
                                </table>
                                `
        $delivery_table.innerHTML = delivery_table;
        $view_table_container.style.display = 'block';
        $search_check.style.display = 'none';
    }

}

function openDetail(trTag) {
    const date = trTag.children[0].innerText;
    const name = trTag.children[1].innerText;
    const phone = trTag.children[2].innerText;
    const start = trTag.children[3].innerText;
    const arrive = trTag.children[4].innerText;
    const samll = trTag.children[5].innerText;
    const medium = trTag.children[6].innerText;
    const large = trTag.children[7].innerText;
    const price = trTag.children[8].innerText;

    $check_detail_contents.innerHTML = `
                                        <span class="close" onclick="closeDetail()">&times;</span>
                                        <h1>조회 상세 정보</h1>
                                        <span>배송일자 : ${date}</span>
                                        <span>출발지 : ${start}</span>
                                        <span>도착지 : ${arrive}</span>
                                        <span>이름 : ${name}</span>
                                        <span>연락처 : ${phone}</span>
                                        <ul>
                                            <li>소형 : ${samll}</li>
                                            <li>중형 : ${medium}</li>
                                            <li>대형 : ${large}</li>
                                        </ul>
                                        <hr>
                                        <p>총합 <span>${price} 원</span></p>
                                       `
    $check_detail.classList.add('fade_in');
    $check_detail_contents.classList.add('slide_up');
}

function closeDetail() {
    $check_detail.classList.remove('fade_in');
    $check_detail_contents.classList.remove('slide_up');
}