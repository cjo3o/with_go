function getPostIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function fetchPostDetails(postId) {
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('text_num', postId);

    if (error) {
        console.error('게시글 조회 오류:', error);
        return null;
    }

    return data ? data[0] : null;
}


async function displayPostDetails() {
    const postId = getPostIdFromURL();

    if (!postId) {
        alert('게시글 text_num을 찾을 수 없습니다.');
        return;
    }

    const postDetails = await fetchPostDetails(postId);

    if (!postDetails) {
        alert('게시글을 찾을 수 없습니다.');
        return;
    }


    const postHeaderHTML1 = `
        <h1>${postDetails.title}</h1>
        <div>
            <p style="margin-right:25px; font-size: 15px;">작성자: ${postDetails.name}</p>
            <p style="font-size: 15px;">작성일: ${new Date(postDetails.created_at).toLocaleDateString()} ${new Date(postDetails.created_at).toLocaleTimeString()}</p>
        </div>
    `;
    const postHeaderHTML2 = `
            <p>${postDetails.question_txt}</p>
    `;

    document.getElementById('cen_heder2').innerHTML = postHeaderHTML1;
    document.getElementById('cen_content').innerHTML = postHeaderHTML2;

}

async function deletePost(postId) {
    const { error } = await supabase
        .from('question')
        .delete()
        .eq('text_num', postId);  // 해당 게시글 삭제

    if (error) {
        console.error('게시글 삭제 오류:', error);
        Swal.fire({
            title: "삭제 실패",
            text: "게시글 삭제에 실패했습니다.",
            icon: "error"
        });
        return;
    }

    Swal.fire({
        title: "Deleted!",
        text: "게시글 삭제에 성공하였습니다.",
        icon: "success"
    }).then(() => {
        window.location.href = 'inquiry.html';  // 삭제 후 목록 페이지로 이동
    });
}

// 비밀글 여부 확인
async function isSecretPost(postId) {
    const postDetails = await fetchPostDetails(postId);
    return postDetails && postDetails.secret === true;  // 'secret' 컬럼이 true이면 비밀글
}

// 비밀번호 입력 팝업
async function promptForPassword(postId) {
    const { value: password } = await Swal.fire({
        text: '비밀번호를 입력하세요',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        inputValidator: (value) => {
            if (!value) {
                return '비밀번호를 입력하세요.';
            }
        }
    });

     if (password) {
        const postDetails = await fetchPostDetails(postId);
        if (postDetails.pw === password) {
            deletePost(postId);  // 비밀번호가 맞으면 삭제
        } else {
            Swal.fire({
                title: '비밀번호 오류',
                text: '입력하신 비밀번호가 올바르지 않습니다.',
                icon: 'error'
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', displayPostDetails);


document.getElementById("modify").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = `modify.html?id=${getPostIdFromURL()}`;
});

// 삭제 버튼 클릭 시 게시글 삭제
document.getElementById("delete").addEventListener("click", async function (event) {
    event.preventDefault();  // 기본 동작(페이지 이동)을 막음

    const postId = getPostIdFromURL();
    if (!postId) {
        Swal.fire({
            title: "Error!",
            text: "게시글 ID를 찾을 수 없습니다.",
            icon: "error"
        });
        return;
    }

    const isSecret = await isSecretPost(postId);  // 비밀글 여부 확인

    if (isSecret) {
        // 비밀글이면 비밀번호 입력 없이 바로 삭제
        Swal.fire({
            text: "해당 게시글을 삭제하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "확인"
        }).then((result) => {
            if (result.isConfirmed) {
                deletePost(postId);  // 삭제 함수 호출
            }
        });
    } else {
        // 비밀글이 아니면 비밀번호 입력 팝업
        promptForPassword(postId);
    }
});