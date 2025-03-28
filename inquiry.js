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
    const pageBtnsContainer = document.getElementById("pageBtns");
    pageBtnsContainer.innerHTML = "";

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage(totalPages);
        }
    };

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("page-btn");
        if (i === currentPage) pageBtn.classList.add("active");

        pageBtn.onclick = () => {
            currentPage = i;
            updatePage(totalPages);
        };

        pageBtnsContainer.appendChild(pageBtn);
    }

    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage(totalPages);
        }
    };
}

function updatePage(totalPages) {
    renderPagination(totalPages);
    fetchReviews(currentPage, currentType);
}

function updatePage(totalPages) {

    const url = new URL(window.location);
    url.searchParams.set('pageNum', currentPage);
    window.history.pushState({}, '', url);

    renderPagination(totalPages);
    loadPage(currentPage);
}

class getdate {
    constructor(a) {
        a ? this.date = new Date(a) : this.date = new Date();
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
    get getTime() {
        let hours = this.date.getHours();
        let minutes = this.date.getMinutes();
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;
        return hours + ":" + minutes;
    }
}
async function loadPage(page) {
    const offset = (page - 1) * itemsPerPage;
    const to = (page * itemsPerPage) - 1;

    const { data } = await supabase
        .from('question')
        .select('text_num, type, title, name, secret, created_at, stat')
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

        let displayTitle = '';


        if (item.secret) {
            displayTitle = '🔑 비밀글입니다.';
        } else {
            if (item.title === undefined || item.title === null || item.title === '') {
                displayTitle = '제목 오류입니다.';
            } else {
                displayTitle = item.title;
            }
        }

        const inquiryUrl = `inquirycheck.html?id=${item.text_num}`;

        if (item.created_at != null && today.fullDate == item.created_at.slice(0, 10)) {
            let localTime = new getdate(item.created_at);
            row.innerHTML = `
            <td>${item.text_num}</td>
            <td>${item.type}</td>
            <td class="title"><a href="${inquiryUrl}">${displayTitle}</a></td>
            <td>${item.name}</td>
            <td>${localTime.getTime}</td>
            <td>${item.stat}</td>
        `;
        } else if (item.created_at != null) {
            row.innerHTML = `
            <td>${item.text_num}</td>
            <td>${item.type}</td>
            <td class="title"><a href="${inquiryUrl}">${displayTitle}</a></td>
            <td>${item.name}</td>
            <td>${item.created_at.slice(0, 10)}</td>
            <td>${item.stat}</td>
        `;
        }
        else {
            row.innerHTML = `
            <td>${item.text_num}</td>
            <td>${item.type}</td>
            <td class="title"><a href="${inquiryUrl}">${displayTitle}</a></td>
            <td>${item.name}</td>
            <td>저장오류</td>
            <td>${item.stat}</td>
        `;
        }

        const titleLink = row.querySelector('.title a');

        if (item.secret) {
            titleLink.addEventListener('click', (e) => {
                e.preventDefault();
                showPasswordPopup(item.text_num);  // 비밀번호 팝업을 띄움
            });
        }

        // row.onclick = () => {
        //     window.location.href = `inquirycheck.html?id=${item.text_num}`;
        // };

        boardList.appendChild(row);
    });
}

async function showPasswordPopup(postId) {
    // Swal.fire로 비밀번호 입력 팝업 생성
    const { value: enteredPassword, isConfirmed } = await Swal.fire({
        text: '작성시 입력한 비밀번호를 입력하세요',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off',
            placeholder: '비밀번호 숫자 6자리를 입력하세요',
            inputMode: 'numeric',  // 모바일에서 숫자 키패드로 입력할 수 있도록 설정
            maxlength: 6,  // 최대 6자리 입력 가능
            pattern: '^[0-9]{1,6}$',
        },
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        reverseButtons: true,
        inputValidator: (value) => {
            if (!value) {
                return '비밀번호가 입력해주세요.';
            }
            if (!/^\d{1,6}$/.test(value)) {
                return '숫자만 입력 가능하며, 최대 6자리까지 가능합니다.';
            }
        },
        customClass: {
            input: 'custom-input'  // custom class 추가
        },
        didOpen: () => {
            // 'custom-input' 클래스에 CSS를 적용
            const inputElement = document.querySelector('.swal2-input');
            if (inputElement) {
                inputElement.style.height = '35px'; // 크기 조정 (원하는 크기로 변경)
                event.target.value = event.target.value.replace(/[^0-9]/g, '');
            }
        }
    });

    // 사용자가 비밀번호 입력을 취소했거나 비밀번호가 입력되지 않았을 경우
    if (!isConfirmed || !enteredPassword) {
        return;
    }

    // 비밀번호 확인 과정 (예시)
    const { data, error } = await supabase
        .from('question')
        .select('pw')
        .eq('text_num', postId)
        .single();

    if (error) {
        Swal.fire({
            icon: 'error',
            title: '게시글을 찾을 수 없습니다.',
            text: '게시글을 찾는 데 실패했습니다.'
        });
        return;
    }

    if (data.pw === enteredPassword) {
        // 비밀번호가 맞으면 상세 페이지로 이동
        window.location.href = `inquirycheck.html?id=${postId}`;
    } else {
        Swal.fire({
            icon: 'error',
            title: '비밀번호가 틀렸습니다.',
            text: '입력한 비밀번호가 맞지 않습니다.'
        });
    }
}
