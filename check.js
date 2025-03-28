const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";
const client = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

const $check_detail = document.querySelector('.check_detail');
const $check_detail_contents = document.querySelector('.check_detail_contents');
const $search_reserveBox = document.querySelector('#search_reserveBox');
const $delivery_table = document.querySelector('.delivery_table');
const $search_check = document.querySelector('.search_check');
const $view_table_container = document.querySelector('.view_table_container');

window.searchReserve = async function () {
    const phone = $search_reserveBox.value.trim();
    if (!phone) return;

    const { data, error } = await client
        .from('delivery')
        .select()
        .eq('phone', phone)
        .order('delivery_date', { ascending: false });

    if (error || !data || data.length === 0) {
        await Swal.fire({
            icon: "error",
            title: "조회할 내역이 존재하지 않습니다.",
            text: "연락처를 확인해 주세요."
        });
        return;
    }

    let rows = '';
    data.forEach((item) => {
        const encoded = encodeURIComponent(JSON.stringify(item));
        rows += `
        <tr onclick='openDetailFromString("${encoded}")'>
            <td>${item.delivery_date}</td>
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td>${item.delivery_start}</td>
            <td>${item.delivery_arrive}</td>
            <td>${item.small}</td>
            <td>${item.medium}</td>
            <td>${item.large}</td>
            <td>${item.price}</td>
        </tr>`;
    });

    $delivery_table.innerHTML = `
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
            <tbody>${rows}</tbody>
        </table>`;

    $view_table_container.style.display = 'block';
    $search_check.style.display = 'none';
};

window.openDetailFromString = function (itemStr) {
    const item = JSON.parse(decodeURIComponent(itemStr));
    window.openDetail(item);
};

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
