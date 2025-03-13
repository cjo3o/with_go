document.querySelector('#input-button-post').addEventListener('click', async function () {
    const post = document.querySelector('#post_text').value;

    if (price.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "입력 실패",
            text: "게시글을 입력하셔야 합니다",
        });
        return;
    }
    const res = await supabase
        .from('post')
        .insert([
            { post }
        ]).select();

    if (res.status === 201) {
        await Swal.fire({
            title: "저장 성공",
            icon: "success",
            draggable: true
        })
        postSelect();
    }

})

const $postDiv = document.querySelector('#post-div');
async function postSelect() {
    const res = await supabase.from('post').select();
    let rows = '';
    for (let i = 0; i < res.data.length; i++) {
        rows = rows + `
        <tr>
            <td>${res.data[i].id}</td>
            <td>${res.data[i].user_id}</td>
            <td>${res.data[i].post}</td>
            <td>${res.data[i].created_at}</td>
        </tr>
    `;
    }
    let post = `
<div>
    <table>
        <tr>
            <th>id</th>
            <th>userid</th>
            <th>게시글</th>
            <th>게시글날짜</th>
        </tr>
        ${rows}
    </table>
</div>
`;

    $postDiv.innerHTML = post;
    $postDiv.classList.add('show');
}

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById('upload_file');
    const fileNameSpan = document.getElementById('file_name');

    fileInput.addEventListener('change', function () {
        if (this.files.length > 0) {
            fileNameSpan.textContent = this.files[0].name;
        } else {
            fileNameSpan.textContent = '선택된 파일 없음';
        }
    });
});

