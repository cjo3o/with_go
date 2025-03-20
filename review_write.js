// Supabase 연결
const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
const supabasePassword = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";

var supabase = window.supabase.createClient(supabaseUrl, supabasePassword);

document.addEventListener("DOMContentLoaded", function () {
    // 파일 선택 시 파일명 표시
    const fileInput = document.getElementById("upload_file");
    const fileNameSpan = document.getElementById("file_name");

    fileInput.addEventListener("change", function () {
      fileNameSpan.textContent = this.files.length > 0
        ? this.files[0].name
        : "선택된 파일 없음";
    });

    // 확인 버튼 클릭 이벤트
    document.getElementById("submit-btn").addEventListener("click", async function () {
      const name = document.getElementById("name").value.trim();
      const password = document.getElementById("password").value.trim();
      const title = document.getElementById("title").value.trim();
      const review_txt = document.getElementById("review_text").value.trim();
      const user_id = crypto.randomUUID(); // UUID 생성

      // 유효성 검사
      if (!name || !password || !title || !review_txt) {
        await Swal.fire({
          icon: "error",
          title: "입력 실패",
          text: "*표시된 항목을 모두 입력해 주세요.",
        });
        return;
      }
      

      // Supabase에 후기 삽입
      const { error } = await supabase
        .from("review")
        .insert([
          {
            name,
            password,
            title,
            review_txt,
            // user_id,
            created_at: new Date()
          }
        ]);

      if (error) {
        console.error("Supabase 오류:", error.message);
        await Swal.fire({
          icon: "error",
          title: "등록 실패",
          text: "저장에 실패했습니다. 다시 시도해주세요.",
        });
        return;
      }

      // 성공 팝업 후 페이지 이동
      await Swal.fire({
        icon: "success",
        title: "저장 성공",
        text: "후기가 성공적으로 등록되었습니다.",
        confirmButtonText: "확인"
      });

      window.location.href = "review.html";
    });
  });
  
