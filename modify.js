document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id"); // URL에서 게시글 ID 가져오기

    if (!postId) {
        Swal.fire({
            icon: "error",
            title: "오류",
            text: "게시글 ID를 찾을 수 없습니다."
        });
        return;
    }

    // 게시글 데이터 가져오기
    const postData = await getPostData(postId);

    if (!postData) {
        Swal.fire({
            icon: "error",
            title: "게시글을 불러오는 데 실패했습니다.",
            text: "게시글 데이터를 가져오는 데 실패했습니다."
        });
        return;
    }

    // 게시글 내용 표시
    document.getElementById("post-title").textContent = postData.title;
    document.getElementById("post-name").textContent = `작성자: ${postData.name}`;
    document.getElementById("post-content").textContent = postData.question_txt;

    // 수정 버튼 클릭 시 수정 페이지로 이동
    document.getElementById("modify").addEventListener("click", function () {
        window.location.href = `modify.html?id=${postId}`;  // 수정 페이지로 이동
    });

    // 삭제 버튼 클릭 시 게시글 삭제
    document.getElementById("delete").addEventListener("click", async function () {
        const confirmDelete = await Swal.fire({
            icon: "warning",
            title: "정말 삭제하시겠습니까?",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        });

        if (confirmDelete.isConfirmed) {
            const result = await deletePost(postId);

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "삭제 완료",
                    text: "게시글이 삭제되었습니다."
                });
                window.location.href = "inquiry.html"; // 삭제 후 목록으로 이동
            } else {
                Swal.fire({
                    icon: "error",
                    title: "삭제 실패",
                    text: "게시글 삭제에 실패하였습니다."
                });
            }
        }
    });
});

// 게시글 데이터 가져오기
async function getPostData(postId) {
    const { data, error } = await supabase
        .from("question")
        .select("*")
        .eq("id", postId)
        .single();

    if (error) {
        return null;
    }

    return data;
}

// 게시글 삭제
async function deletePost(postId) {
    const { error } = await supabase
        .from("question")
        .delete()
        .eq("id", postId);

    return { success: !error };
}
