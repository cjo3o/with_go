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
      // const user_id = localStorage.getItem("user_id"); // UUID 생성
      const file = fileInput.files[0];
      const res = await supabase.auth.getUser();
      // 유효성 검사
      if (!name || !password || !title || !review_txt) {
        await Swal.fire({
          icon: "error",
          title: "입력 실패",
          text: "*표시된 항목을 모두 입력해 주세요.",
        });
        return;
      }

      // 파일이 있을 경우 Supabase Storage에 업로드
      let file_url = null;

      if (file) {
        const fileExt = file.name.split(".")[1];      // 한글파일도 저장 가능
        const fileName = crypto.randomUUID() + "." + fileExt;
        const filePath = `review_uploads/${fileName}`;

        const { error: uploadError } = await supabase
            .storage
            .from("images") // 버킷명
            .upload(filePath, file);

        if (uploadError) {
          console.error("파일 업로드 오류:", uploadError.message);
          await Swal.fire({
            icon: "error",
            title: "파일 업로드 실패",
            text: "파일 업로드에 실패했습니다. 다시 시도해주세요.",
          });
          return;
        }

        // 업로드한 파일의 public URL 가져오기
        const { data: publicUrl } = supabase
            .storage
            .from("images")
            .getPublicUrl(filePath);

        file_url = publicUrl.publicUrl;
      }

      // Supabase에 후기 데이터 저장
      const { error } = await supabase
        .from("review")
        .insert([
          {
            name,
            password,
            title,
            review_txt,
            user_id: res.data.user.id,
            created_at: new Date(),
            file_url: file_url // 있으면 URL, 없으면 null
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
  
