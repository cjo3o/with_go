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

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('page-btn');

        if (i === currentPage) {
            pageBtn.classList.add('active');
        }

       
        pageBtn.addEventListener('click', () => {
            currentPage = i;

            const url = new URL(window.location);
            url.searchParams.set('pageNum', currentPage);
            window.history.pushState({}, '', url);

            renderPagination(totalPages);
            loadPage(currentPage);
        });

        pageBtnsContainer.appendChild(pageBtn);
    }
}
class getdate{
    constructor(){
        this.date=new Date();
    }
    get fullDate(){
        let fullmonth = this.date.getMonth()+1;
        let fulldate = this.date.getDate();
        if(fullmonth<10){
            fullmonth = '0'+fullmonth;
        }
        if(fulldate<10){
            
        }
        
        return this.date.getFullYear()+"-"+month;
    }
}
async function loadPage(page) {
    const offset = (page - 1) * itemsPerPage;
    const to = (page * itemsPerPage) - 1;

    const { data } = await supabase
        .from('question')
        .select('text_num, type, title, name, created_at')
        .order('created_at', { ascending: sortDirection === 'asc' })
        .range(offset, to);

    const boardList = document.getElementById('board_list');
    boardList.innerHTML = '';

    if (data.length === 0) {
        boardList.innerHTML = `<tr><td colspan="6">등록된 게시글이 없습니다.</td></tr>`;
        return;
    }

    data.forEach((item) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.text_num}</td>
            <td>${item.type}</td>
            <td class="title"><a href="view.html?id=${item.id}">${item.title}</a></td>
            <td>${item.name}</td>
            <td>${item.created_at.slice(11,19)}</td>
            <td>${item.status}</td>
        `;
        row.innerHTML = `
            <td>${item.text_num}</td>
            <td>${item.type}</td>
            <td class="title"><a href="view.html?id=${item.id}">${item.title}</a></td>
            <td>${item.name}</td>
            <td>${item.created_at.slice(0,10)}</td>
            <td>${item.status}</td>
        `;

        row.onclick = () => {
            window.location.href = `view.html?id=${item.id}`;
        };

        boardList.appendChild(row);
    });
}

