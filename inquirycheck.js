// URL에서 text_num을 가져오는 함수
function getPostIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // 'text_num' 파라미터를 가져옴
}

// Supabase에서 게시글 상세 정보를 가져오는 함수
async function fetchPostDetails(postId) {
    const { data, error } = await supabase
        .from('question') // 'question' 테이블에서
        .select('*') // 모든 열을 선택
        .eq('text_num', postId); // 'text_num'이 postId인 게시글을 찾음

    if (error) {
        console.error('게시글 조회 오류:', error);
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

    // 게시글의 상세 정보를 cen_heder에 삽입
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

// 페이지 로드 후 게시글을 표시
document.addEventListener('DOMContentLoaded', displayPostDetails);
