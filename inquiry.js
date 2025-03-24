document.addEventListener('DOMContentLoaded', async () => {
    await loadPostsAndPagination();
});

let currentPage = 1;
const itemsPerPage = 10;
let sortDirection = 'desc';

function getCurrentPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    const pageNum = params.get('pageNum');
    return pageNum ? parseInt(pageNum) : 1;
}

async function getTotalItems() {
    const { data, error, count } = await supabase
        .from('question')
        .select('*', { count: 'exact' });

    return count;
}

async function loadPostsAndPagination() {
    currentPage = getCurrentPageFromURL();

    const totalItems = await getTotalItems();

    if (totalItems === 0) {
        document.getElementById('pageBtns').innerHTML = '등록된 게시글이 없습니다.';
        return;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    renderPagination(totalPages);
    loadPage(currentPage);
}


function renderPagination(totalPages) {
    const pageBtnsContainer = document.getElementById('pageBtns');
    pageBtnsContainer.innerHTML = '';

    // 이전 버튼 활성화/비활성화
    const prevBtn = document.getElementById('prevBtn');
    prevBtn.hidden = currentPage === 1;  // currentPage가 1이면 비활성화

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage(totalPages);
        }
    });

    // 페이지 번호 버튼 생성
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('page-btn');

        if (i === currentPage) {
            pageBtn.classList.add('active');
        }

        pageBtn.addEventListener('click', () => {
            currentPage = i;
            updatePage(totalPages);
        });

        pageBtnsContainer.appendChild(pageBtn);
    }

    // 다음 버튼 활성화/비활성화
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = currentPage === totalPages;  // currentPage가 마지막 페이지면 비활성화

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage(totalPages);
        }
    });
}

function updatePage(totalPages) {
    // URL에 페이지 번호를 업데이트
    const url = new URL(window.location);
    url.searchParams.set('pageNum', currentPage);
    window.history.pushState({}, '', url);

    renderPagination(totalPages);  // 페이지 버튼을 재렌더링
    loadPage(currentPage);         // 해당 페이지 데이터 로드
}

class getdate {
    constructor() {
        this.date = new Date();
    }
    get fullDate() {
        let fullmonth = this.date.getMonth() + 1;
        let fulldate = this.date.getDate();
        if (fullmonth < 10) {
            fullmonth = '0' + fullmonth;
        }
        if (fulldate < 10) {
            fulldate = '0' + fulldate;
        }

        return this.date.getFullYear() + "-" + fullmonth + "-" + fulldate;
    }
}
async function loadPage(page) {
    const offset = (page - 1) * itemsPerPage;
    const to = (page * itemsPerPage) - 1;

    const { data } = await supabase
        .from('question')
        .select('text_num, type, title, name, created_at, stat')
        .order('created_at', { ascending: sortDirection === 'asc' })
        .range(offset, to);

    const boardList = document.getElementById('board_list');
    boardList.innerHTML = '';

    if (data.length === 0) {
        boardList.innerHTML = `<tr><td colspan="6">등록된 게시글이 없습니다.</td></tr>`;
        return;
    }
    let today = new getdate();
    data.forEach((item) => {

        const row = document.createElement('tr');
        if (item.created_at != null && today.fullDate == item.created_at.slice(0, 10)) {

            let localTime = new Date(item.created_at);

            row.innerHTML = `
            <td>${item.text_num}</td>
            <td>${item.type}</td>
            <td class="title"><a href="view.html?id=${item.id}">${item.title}</a></td>
            <td>${item.name}</td>
            <td>${localTime.getHours() + ":" + localTime.getMinutes()}</td>
            <td>${item.stat}</td>
        `;
        } else if (item.created_at != null) {
            row.innerHTML = `
            <td>${item.text_num}</td>
            <td>${item.type}</td>
            <td class="title"><a href="view.html?id=${item.id}">${item.title}</a></td>
            <td>${item.name}</td>
            <td>${item.created_at.slice(0, 10)}</td>
            <td>${item.stat}</td>
        `;
        } else {
            row.innerHTML = `
            <td>${item.text_num}</td>
            <td>${item.type}</td>
            <td class="title"><a href="view.html?id=${item.id}">${item.title}</a></td>
            <td>${item.name}</td>
            <td>저장오류</td>
            <td>${item.stat}</td>
        `;
        }
        row.onclick = () => {
            window.location.href = `view.html?id=${item.id}`;
        };

        boardList.appendChild(row);
    });
}

