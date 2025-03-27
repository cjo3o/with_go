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

document.addEventListener('DOMContentLoaded', displayPostDetails);


document.getElementById("modify-link").addEventListener("click", function (event) {
    event.preventDefault();  // 기본 동작(페이지 이동)을 막음
    window.location.href = "modify.html";  // 수정 페이지로 이동
});

