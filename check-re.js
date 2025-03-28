const searchBtn = document.querySelector('#search_btn');
const changeContainer = document.querySelector('.change_btn_container');
const tableContainer = document.querySelector('.table_container');
const $checkbox1 = document.querySelector('#keep_btn');
const $checkbox2 = document.querySelector('#delivery_btn');
const $search_reserveBox = document.querySelector('#search_reserveBox');
const $storage_table = document.querySelector('.storage_table');
const $delivery_table = document.querySelector('.delivery_table');
const $view_table_container = document.querySelector('.view_table_container');
const $search_check = document.querySelector('.search_check');
const $check_detail = document.querySelector('.check_detail');
const $check_detail_contents = document.querySelector('.check_detail_contents');
const $cancelBtn = document.querySelector('.cancelBtn');

if ($checkbox1) {
    $checkbox1.addEventListener('change', function () {
            if (this.checked) {
                if ($checkbox2) {$checkbox2.checked = false;}
            }
        }
    )
    ;
}

if ($checkbox2) {
    $checkbox2.addEventListener('change', function () {
            if (this.checked) {
                if ($checkbox1) {$checkbox1.checked = false;}
            }
        }
    )
    ;
}

const checkboxWrappers = changeContainer ? changeContainer.querySelectorAll('.change_btn') : [];
if (checkboxWrappers) {
    checkboxWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function () {
            this.classList.toggle('checked');
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
            }
        });
    });
}

if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
        await searchReserve();
    });
}

async function searchReserve() {
    if (!supabase) {
        console.error('Supabase 클라이언트가 초기화되지 않았습니다.');
        alert('데이터베이스 연결에 문제가 발생했습니다.');
        return;
    }

    if (!tableContainer) {
        console.error('테이블 컨테이너 요소를 찾을 수 없습니다.');
        return;
    }

    tableContainer.innerHTML = '';
    let rows = '';

    const checkedOptions = [];
    if ($checkbox1 && $checkbox1.checked) checkedOptions.push('keep_btn');
    if ($checkbox2 && $checkbox2.checked) checkedOptions.push('delivery_btn');

    if (checkedOptions.length === 0) {
        alert('검색할 옵션을 선택해주세요.');
        return;
    }

    if (!$search_reserveBox || !$search_reserveBox.value) {
        alert('전화번호를 입력해주세요.');
        return;
    }

    let hasResults = false;

    console.log("검색 시작!");
    console.log("입력된 전화번호:", $search_reserveBox.value);


    if (checkedOptions.includes('keep_btn')) {
        const {data, error} = await supabase
            .from('storage')
            .select('*')
            .eq('phone', $search_reserveBox.value)
            .order('storage_start_date', {ascending: false});

        console.log("Supabase 응답:", data, error);

        if (error) {
            console.error('Supabase 데이터 조회 오류 (보관):', error);
            alert('데이터 조회 중 오류가 발생했습니다 (보관).');
            return;
        }

        if (data && data.length > 0) {
            hasResults = true;
            rows = data.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.phone}</td>
                    <td>${item.storage_start_date}</td>
                    <td>${item.storage_end_date}</td>
                    <td>${item.small}</td>
                    <td>${item.medium}</td>
                    <td>${item.large}</td>
                    <td>${item.price}</td>
                </tr>
            `).join('');

            if ($storage_table) {
                $view_table_container.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>연락처</th>
                                <th>보관일자</th>
                                <th>보관종료</th>
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
                `;
            }
        }
    }

    if (checkedOptions.includes('delivery_btn')) {
        const {data, error} = await supabase
            .from('delivery')
            .select('*')
            .eq('phone', $search_reserveBox.value)
            .order('delivery_date', {ascending: false});

        console.log("Supabase 응답:", data, error);

        if (error) {
            console.error('Supabase 데이터 조회 오류 (배송):', error);
            alert('데이터 조회 중 오류가 발생했습니다 (배송).');
            return;
        }

        if (data && data.length > 0) {
            hasResults = true;
            rows = data.map(item => `
                <tr>
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
            `).join('');

            if ($delivery_table) {
                $view_table_container.innerHTML = `
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
                `;
                $delivery_table.style.display = 'block';
                $search_check.style.display = 'flex';
            }
        }
    }

    if (!hasResults) {
        tableContainer.innerHTML = '<tr><td colspan="8">검색 결과가 없습니다.</td></tr>';
    }
}

function addCloseEvent() {
    const $close = document.querySelector('.close');
    if ($close) {
        $close.addEventListener('click', function () {
            $check_detail.classList.remove('fade_in');
            $check_detail_contents.classList.remove('slide_up');
            console.log('클릭');
        });
    }
}

// openDetail 함수
window.openDetail = function (td) {
    const row = td.parentElement; // 클릭한 td의 부모 tr 요소
    const location = row.cells[2].innerText; // 보관 장소
    const date = row.cells[1].innerText; // 보관 일자
    const number = row.cells[0].innerText; // 수화물 번호
    const price = row.cells[3].innerText; // 가격
    const stat = row.cells[4].innerText; // 상태
    $check_detail_contents.innerHTML = `
            <span class="close">&times;</span>
            <h1>조회 상세 정보</h1>
            <span>${stat}</span>
            <span style="font-size: 1.3rem;">보관 장소 : ${location}</span>
            <span>보관 일자 : ${date}</span>
            <span>수화물 번호 : ${number}</span>
            <ul>가격
                <li>소형 1개 1000원</li>
                <li>중형 1개 2000원</li>
                <li>대형 1개 3000원</li>
            </ul>
            <hr>
            <p>총합<span>${price}원</span></p>
        `;
    $check_detail.classList.add('fade_in');
    $check_detail_contents.classList.add('slide_up');

    // close 버튼 이벤트 리스너 추가
    addCloseEvent();
};
