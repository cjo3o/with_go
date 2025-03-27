// Supabase 연결
const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
const supabasePassword = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";
const supabase = window.supabase.createClient(supabaseUrl, supabasePassword);

document.addEventListener("DOMContentLoaded", async function () {
  const fileInput = document.getElementById("upload_file");
  const fileNameSpan = document.getElementById("file_name");
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode"); // 'edit' 또는 null
  const reviewNum = urlParams.get("review_num");

  // 파일 이름 표시
  fileInput.addEventListener("change", function () {
    fileNameSpan.textContent = this.files.length > 0 ? this.files[0].name : "선택된 파일 없음";
  });

  // 수정 모드일 경우 기존 데이터 불러오기
  if (mode === "edit" && reviewNum) {
    const { data, error } = await supabase.from("review").select("*").eq("review_num", reviewNum).single();
    if (error || !data) {
      Swal.fire("불러오기 실패", "리뷰 데이터를 불러오는 데 실패했습니다.", "error");
      return;
    }

    // 데이터 채우기
    document.getElementById("name").value = data.name;
    document.getElementById("password").value = data.password;
    document.getElementById("title").value = data.title;
    document.getElementById("review_text").value = data.review_txt;
    let originFile_name = data.file_url.split('/').pop();

    if (data.type === "배송") document.getElementById("type1").checked = true;
    if (data.type === "보관") document.getElementById("type2").checked = true;
  }

  // 저장 버튼 클릭
  document.getElementById("submit-btn").addEventListener("click", async function () {
    const name = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value.trim();
    const title = document.getElementById("title").value.trim();
    const type = document.querySelector('input[name="type"]:checked')?.value;
    const review_txt = document.getElementById("review_text").value.trim();
    const file = fileInput.files[0];

    const { data: userRes } = await supabase.auth.getUser();
    const user_id = userRes?.user?.id;

    if (!name || !password || !title || !type || !review_txt) {
      await Swal.fire("입력 실패", "* 표시된 항목을 모두 입력해 주세요.", "error");
      return;
    }

    let file_url = null;
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = crypto.randomUUID() + "." + fileExt;
      const filePath = `review_uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file);
      if (uploadError) {
        Swal.fire("파일 업로드 실패", "파일 업로드 중 오류가 발생했습니다.", "error");
        return;
      }

      const { data: publicUrl } = supabase.storage.from("images").getPublicUrl(filePath);
      file_url = publicUrl.publicUrl;
    }

    // 모드에 따라 insert 또는 update
    if (mode === "edit" && reviewNum) {  // 업데이트
      if(file_url) {
        const originFilePath = "review_uploads/" + originFile_name;
        await supabase.storage.from('images').remove([originFilePath]); //기존 파일 삭제
        const {error: updateError} = await supabase.from("review").update({
          name,
          password,
          title,
          type,
          review_txt,
          file_url // 새로 파일을 넣은 경우는 업데이트
        }).eq("review_num", reviewNum);

        if (updateError) {
          Swal.fire("수정 실패", "수정 중 문제가 발생했습니다.", "error");
          return;
        }

        await Swal.fire("수정 성공", "후기가 성공적으로 수정되었습니다.", "success");
        window.location.href = "review.html";
      }else{//새로 넣은 파일이 없어서 url이 존재 하지 않으면 파일url 업데이트 하지 않음
        const {error: updateError} = await supabase.from("review").update({
          name,
          password,
          title,
          type,
          review_txt,
        }).eq("review_num", reviewNum);

        if (updateError) {
          Swal.fire("수정 실패", "수정 중 문제가 발생했습니다.", "error");
          return;
        }

        await Swal.fire("수정 성공", "후기가 성공적으로 수정되었습니다.", "success");
        window.location.href = "review.html";
      }
    } else {  // 저장
      const { error } = await supabase.from("review").insert([{
        name,
        password,
        title,
        type,
        review_txt,
        user_id,
        created_at: new Date(),
        file_url
      }]);

      if (error) {
        Swal.fire("등록 실패", "후기 등록에 실패했습니다.", "error");
        return;
      }

      await Swal.fire("등록 성공", "후기가 등록되었습니다.", "success");
      window.location.href = "review.html";
    }
  });
});
