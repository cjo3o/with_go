document.addEventListener('DOMContentLoaded', async function () {
    // URL에서 text_num 파라미터를 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const textNum = urlParams.get('id'); // 'text_num'이 URL에 포함된 값을 가져옵니다.

    // text_num이 없으면 오류 처리
    if (!textNum) {
        alert("잘못된 접근입니다.");
        window.location.href = "inquirycheck.html"; // 잘못된 접근시 목록 페이지로 이동
    }

    const { data, error } = await supabase
        .from('question') // 게시글이 저장된 테이블 이름
        .select('*')
        .eq('text_num', textNum)  // 해당 ID의 게시글을 가져옴
        .single();  // 하나의 레코드만 가져옴

    if (error) {
        console.error('게시글을 불러오는 데 실패했습니다:', error);
        alert("게시글을 불러오지 못했습니다.");
        return;
    }

    // 불러온 데이터로 입력 필드 채우기
    document.getElementById('name').value = data.name;
    document.getElementById('password').value = data.pw;
    document.getElementById('title').value = data.title;
    document.getElementById('write_text').value = data.question_txt;
    document.getElementById('secret-toggle').checked = data.secret;

    // 예약 종류 (라디오 버튼) 처리
    const typeRadio = document.querySelector(`input[name="type"][value="${data.type}"]`);
    if (typeRadio) {
        typeRadio.checked = true;
    }

    // 첨부파일 처리 (필요에 따라 파일 URL을 처리할 수 있습니다)
    // 예를 들어, `data.file_url`이 있을 경우 처리할 수 있음

    // 수정 버튼 클릭 시
    document.getElementById('input-btn').addEventListener('click', async function () {
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const title = document.getElementById('title').value;
        const content = document.getElementById('write_text').value;
        const secret = document.getElementById('secret-toggle').checked;
        const type = document.querySelector('input[name="type"]:checked').value;

        // 입력된 데이터를 Supabase에 업데이트
        const { data: updatedData, error: updateError } = await supabase
            .from('question')
            .update({
                name: name,
                pw: password,
                title: title,
                question_txt: content,
                secret: secret,
                type: type
            })
            .eq('text_num', textNum);  // 수정할 게시글 ID를 지정

        if (updateError) {
            console.error('수정 실패:', updateError);
            alert("수정에 실패했습니다.");
        } else {
            Swal.fire({
                title: '수정 완료!',
                text: '수정이 완료되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
            }).then(() => {
                window.location.href = 'inquiry.html'; // 수정 완료 후 목록 페이지로 리디렉션
            });
        }
    });
});

const passwordtext = document.getElementById('password');

passwordtext.addEventListener('input', function (event) {
    let inputValue = passwordtext.value;
    passwordtext.value = inputValue.replace(/[^0-9]/g, '');

    if (passwordtext.value.length > 6) {
        passwordtext.value = passwordtext.value.substring(0, 6);
    }
});

