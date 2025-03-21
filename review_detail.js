// Supabase 연결
const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
const supabasePassword = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";

var supabase = window.supabase.createClient(supabaseUrl, supabasePassword);

// URL에서 review_num 가져오기
const urlParams = new URLSearchParams(window.location.search);
const reviewNum = urlParams.get('review_num');

async function fetchReviewDetail() {
    if (!reviewNum) {
        document.getElementById("review-detail").innerHTML = "<p>잘못된 접근입니다.</p>";
        return;
    }

    const { data, error } = await supabase
        .from("review")
        .select("*")
        .eq("review_num", reviewNum)
        .single();

    if (error || !data) {
        document.getElementById("review-detail").innerHTML = "<p>후기를 불러오는 데 실패했습니다.</p>";
        return;
    }

    const html = `
    <h2>${data.title}</h2>
    <p><strong>작성자:</strong> ${data.name}</p>
    <p><strong>작성일:</strong> ${new Date(data.created_at).toLocaleDateString()}</p>
    <p><strong>내용:</strong><br>${data.review_txt}</p>
    ${data.file_url ? `<img src="${data.file_url}" class="detail-image" alt="첨부 이미지">` : ""}
  `;

    document.getElementById("review-detail").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", fetchReviewDetail);

