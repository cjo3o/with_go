window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (postId) {
        await loadPostData(postId);
    }
};

async function loadPostData(postId) {
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('text_num', postId)
        .single();

    if (error) {
        console.error('데이터 가져오기 오류:', error);
        return;
    }

    console.log(data);

 
    document.getElementById('name').value = data.name;
    document.getElementById('password').value = data.pw;
    document.getElementById('title').value = data.title;
    document.getElementById('write_text').value = data.question_txt;
    document.getElementById('secret-toggle').checked = data.secret;

    const typeInput = document.querySelector(`input[name="type"][value="${data.type}"]`);
    if (typeInput) {
        typeInput.checked = true;
    }
}

async function post() {
    const name = document.getElementById('name').value;
    const pw = document.getElementById('password').value;
    const title = document.getElementById('title').value;
    const question_txt = document.getElementById('write_text').value;
    const secret = document.getElementById('secret-toggle').checked;
    const type = document.querySelector('input[name="type"]:checked').value;
    const file = document.getElementById('file').files[0];

    if (!name || !pw || !title || !type || !question_txt) {
        await Swal.fire({
            icon: "error",
            title: "수정 실패",
            text: "모든 필드를 입력해주세요.",
        });
        return;
    }

    let fileUrl = '';
    if (file) {
        fileUrl = await uploadFile(file);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (postId) {
        const result = await updatePost(postId, name, pw, title, secret, question_txt, type, fileUrl);

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
                title: "수정 실패",
                text: result.errorMessage
            });
        }
    }
}

async function uploadFile(file) {
    const filename = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
    await supabase.storage.from('images').upload(filename, file);

    const res = await supabase.storage.from('images').getPublicUrl(filename);
    return res.data.publicUrl;
}

async function updatePost(postId, name, pw, title, secret, question_txt, type, fileUrl = '') {
    const { data, error } = await supabase
        .from('question')
        .update({
            name,
            pw,
            title,
            question_txt,
            secret,
            type,
            image_url: fileUrl
        })
        .eq('id', postId);

    if (error) {
        return { success: false, errorMessage: '게시글 수정 중 오류가 발생했습니다.' };
    }

    return { success: true };
}