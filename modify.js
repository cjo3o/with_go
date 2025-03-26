async function post() {
    const name = document.querySelector('#name').value;
    const pw = document.querySelector('#password').value;
    const title = document.querySelector('#title').value;
    const question_txt = document.querySelector('#write_text').value;
    const secret = document.querySelector('input[name="secret"]').checked;
    const type = document.querySelector('input[name="type"]:checked');
    const file = document.querySelector('#file').files[0];

    if (name.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "수정 실패",
            text: "이름을 입력해주세요.",
        });
    } else if (pw.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "수정 실패",
            text: "비밀번호를 입력해주세요.",
        });
    } else if (title.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "수정 실패",
            text: "제목을 입력해주세요.",
        });
    } else if (!type) {
        await Swal.fire({
            icon: "error",
            title: "수정 실패",
            text: "예약 종류를 선택해주세요.",
        });
    }
    else if (question_txt.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "수정 실패",
            text: "내용을 입력하세요.",
        });
    } else {
        let fileUrl = '';
        if (file) {
            fileUrl = await uploadFile(file);
        }

        const result = await savePost(name, pw, title, secret, question_txt, type, fileUrl);

        if (result.success) {
            await Swal.fire({
                icon: "success",
                title: "수정 완료",
                text: "게시글이 성공적으로 수정되었습니다.",
            });

            window.location.href = 'inquiry.html';
        } else {
            await Swal.fire({
                icon: "error",
                title: "등록 실패",
                text: "게시글 수정에 실패했습니다."
            });
        }
    }

    if (!file) {
        savePost(name, pw, title, secret, question_txt, type)
    } else {
        const fileUrl = await uploadFile(file);
        savePost(name, pw, title, secret, question_txt, type, fileUrl);
    }
}

async function savePost(name, pw, title, secret, question_txt, type, fileUrl = '') {
    const res = await supabase.from('question').insert([{ name, pw, title, question_txt, secret, type: type.value, image_url: fileUrl }]).select();

    console.log(res);
    
    if (res.error) {
        return { success: false, errorMessage: '게시글 수정 중 오류가 발생했습니다.' };
    }

    return { success: true };
}

async function uploadFile(file) {
    const filename = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
    await supabase.storage.from('images').upload(filename, file);

    const res = await supabase.storage.from('images').getPublicUrl(filename);
    return res.data.publicUrl;
}


const passwordtext = document.getElementById('password');

passwordtext.addEventListener('input', function (event) {
    let inputValue = passwordtext.value;
    passwordtext.value = inputValue.replace(/[^0-9]/g, '');

    if (passwordtext.value.length > 4) {
        passwordtext.value = passwordtext.value.substring(0, 4);
    }
});


async function fetchPostDetails(postId) {
    const { data, error } = await supabase
        .from('question') // 'question' 테이블에서
        .select('*') // 모든 열을 선택
        .eq('text_num', postId); // 'text_num'이 postId인 게시글을 찾음

    if (error) {
        console.error('게시글 수정 오류:', error);
        return null; // 오류가 발생하면 null 반환
    }

    return data ? data[0] : null; // 데이터가 있으면 첫 번째 게시글 반환
}

// 게시글 상세 정보를 표시하는 함수
async function displayPostDetails() {
    const postId = getPostIdFromURL(); // URL에서 게시글 text_num 가져오기

    if (!postId) {
        alert('게시글 text_num을 찾을 수 없습니다.');
        return;
    }

    const postDetails = await fetchPostDetails(postId); // 게시글 상세 데이터 가져오기

    if (!postDetails) {
        alert('게시글을 찾을 수 없습니다.');
        return;
    }

    const postHeaderHTML1 = `
        ${postDetails.name}
    `;


    document.getElementById('name').innerHTML = postHeaderHTML1;

}

// 페이지 로드 후 게시글을 표시
document.addEventListener('DOMContentLoaded', displayPostDetails);
