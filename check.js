const $check_detail = document.querySelector('.check_detail');
const $check_detail_contents = document.querySelector('.check_detail_contents');
const $search_check = document.querySelector('.search_check');
const $view_table_container = document.querySelector('.view_table_container');
const $delivery_table = document.querySelector('.delivery_table');
const $search_reserveBox = document.querySelector('#search_reserveBox');
const $cancelBtn = document.querySelector('.cancelBtn');

async function searchReserve() {
    const res = await supabase.from('delivery').select().eq('phone', $search_reserveBox.value).order('delivery_date', {ascending: false});
    let rows = '';


    if (res.data.length === 0) {
        await Swal.fire({
            icon: "error",
            title: "조회할 내역이 존재하지 않습니다.",
            text: "연락처를 확인해 주세요."
        })
    } else {
        res.data.forEach(item => {
            rows += `
                <tr onclick="openDetail(this)">
                    <td>${item.delivery_date}</td>
                    <td>${item.name}</td>
                    <td>${item.phone}</td>
                    <td>${item.delivery_start}</td>
                    <td>${item.delivery_arrive}</td>
                    <td>${item.small}</td>
                    <td>${item.medium}</td>
                    <td>${item.large}</td>
                    <td>${item.price}</td>
                </tr>
                `
        })
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
    const $cancelBtn = document.querySelector('.cancelBtn');

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
                                       `;
    $cancelBtn.innerHTML = `
                            <button class="cancelReserve" onclick="cancelReserve()">
                                예약취소
                            </button>
                           `;
    $check_detail.classList.add('fade_in');
    $check_detail_contents.classList.add('slide_up');
    $cancelBtn.classList.add('slide_up');
}

function closeDetail() {
    $check_detail_contents.classList.remove('slide_up');
    $cancelBtn.classList.remove('slide_up');
    $check_detail.classList.remove('fade_in');
}

async function cancelReserve() {
    const result = await Swal.fire({
        title: "정말 취소하시겠습니까?",
        text: "취소하시면 복구하실 수 없습니다!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "확인",
        cancelButtonText: "취소"
    });

    // if (result.isConfirmed) {
    //     const inputResult = await Swal.fire({
    //         title: "예약번호를 입력해 주세요.",
    //         input: "text",
    //         inputAttributes: {
    //             autocapitalize: "off"
    //         },
    //         showCancelButton: true,
    //         confirmButtonText: "확인",
    //         cancelButtonText: "취소",
    //         showLoaderOnConfirm: true,
    //         preConfirm: async (input_re_num) => {
    //             if (input_re_num === re_num) {
    //                 return {success: true, message: "예약번호가 일치합니다!"};
    //             } else {
    //                 return Swal.showValidationMessage(`예약번호가 일치하지 않습니다!`);
    //             }
    //         },
    //         allowOutsideClick: () => !Swal.isLoading()
    //     });
    //
    //     if (inputResult.isConfirmed && inputResult.value.success) {
    //         await Swal.fire({
    //             title: "알림",
    //             text: "예약이 취소되었습니다.",
    //             icon: "success"
    //         });
    //
    //         // 데이터베이스에서 예약 삭제
    //         await supabase.from('delivery').delete().eq('re_num', re_num).select();
    //         closeDetail();
    //         $view_table_container.style.display = 'none';
    //         $search_check.style.display = 'flex';
    //     }
    // }
}
