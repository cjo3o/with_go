async function post() {
    const name = document.querySelector('#name').value;
    const pw = document.querySelector('#password').value;
    const title = document.querySelector('#title').value;
    const question_txt = document.querySelector('#write_text').value;
    const secret = document.querySelector('input[name="secret"]').checked;
    const type = document.querySelector('input[name="type"]:checked');
    const file = document.querySelector('#file').files[0];

    // 입력값 검증
    if (name.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "이름을 입력해주세요.",
        });
        return;  // 함수 종료
    } else if (pw.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "비밀번호를 입력해주세요.",
        });
        return;  // 함수 종료
    } else if (title.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "제목을 입력해주세요.",
        });
        return;  // 함수 종료
    } else if (!type) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "예약 종류를 선택해주세요.",
        });
        return;  // 함수 종료
    } else if (question_txt.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "내용을 입력하세요.",
        });
        return;  // 함수 종료
    }

    let fileUrl = '';
    // 파일이 있으면 파일 업로드 후 URL 받기
    if (file) {
        fileUrl = await uploadFile(file);
    }

    // 게시글 저장
    const result = await savePost(name, pw, title, secret, question_txt, type, fileUrl);

    if (result.success) {
        await Swal.fire({
            icon: "success",
            title: "등록 완료",
            text: "게시글이 성공적으로 등록되었습니다.",
        });

        window.location.href = 'inquiry.html';
    } else {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "게시글 등록이 실패하였습니다."
        });
    }
}

// 게시글 저장 함수
async function savePost(name, pw, title, secret, question_txt, type, fileUrl = '') {
    const res = await supabase.from('question').insert([{
        name,
        pw,
        title,
        question_txt,
        secret,
        type: type.value,
        image_url: fileUrl
    }]).select();

    console.log(res);
    
    if (res.error) {
        return { success: false, errorMessage: '게시글 등록 중 오류가 발생했습니다.' };
    }

    return { success: true };
}

// 파일 업로드 함수
async function uploadFile(file) {
    const filename = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
    await supabase.storage.from('images').upload(`question_uploads/${filename}`, file);

    const res = await supabase.storage.from('images').getPublicUrl(`question_uploads/${filename}`);
    return res.data.publicUrl;
}

const passwordtext = document.getElementById('password');

// 비밀번호 입력값 처리
passwordtext.addEventListener('input', function (event) {
    let inputValue = passwordtext.value;
    passwordtext.value = inputValue.replace(/[^0-9]/g, ''); // 숫자만 입력되도록 제한

    if (passwordtext.value.length > 6) {
        passwordtext.value = passwordtext.value.substring(0, 6); // 최대 6자리로 제한
    }
});
