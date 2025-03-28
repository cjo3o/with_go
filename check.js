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

    console.log(res.data);

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
}

window.openDetail = function (item) {
    const {
        id,
        delivery_date,
        name,
        phone,
        delivery_start,
        delivery_arrive,
        small,
        medium,
        large,
        price
    } = item;

    $check_detail_contents.innerHTML = `
        <div class="detail-modal">
            <span class="close" style="cursor:pointer; float:right; font-size: 20px;">&times;</span>
            <h2>조회 상세 정보</h2>
            <span class="data">
            <p>배송일자 : ${delivery_date}</p>
            <p>출 발 지 : ${delivery_start}</p>
            <p>도 착 지 : ${delivery_arrive}</p>
            <p>이      름 : ${name}</p>
            <p>연 락 처 : ${phone}</p>
            </span>
            <hr>
            <span class="size">
            <p>ㆍ소형 : ${small}</p>
            <p>ㆍ중형 : ${medium}</p>
            <p>ㆍ대형 : ${large}</p>
           </span>
            <div class="d-total">
                <strong>총 합</strong>
                <span>${price}</span>
                <span>원</span>
            </div>
        </div>
<button class="cancelBtn" onclick="cancelReservation('${id}')">예약 취소</button>`;

    $check_detail.classList.add('fade_in');
    $check_detail_contents.classList.add('slide_up');
    $cancelBtn.classList.add('slide_up');
}

    const $close = document.querySelector('.close');
    $close.addEventListener('click', () => {
        $check_detail.classList.remove('fade_in');
        $check_detail_contents.classList.remove('slide_up');
    });
};


async function cancelReservation(id) {
    const confirmCancel = confirm("정말로 예약을 취소하시겠습니까?");
    if (!confirmCancel) return;

    const { error } = await client
        .from("delivery")
        .delete()
        .eq("id", id);

    if (error) {
        alert("취소 실패했습니다");
    } else {
        alert("예약이 취소되었습니다");
        location.reload();
    }
}
