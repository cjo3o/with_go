document.addEventListener("keydown", function (event) {
  if (
    event.key === "Backspace" &&
    !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
  ) {
    history.back(); // 이전 페이지로 이동
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("name").focus(); // 이름 입력창에 포커스
});

async function getCurrentUserId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session && session.user) return session.user.id;
  return null;
}

async function post() {
  const name = document.querySelector("#name").value;
  const pw = document.querySelector("#password").value;
  const title = document.querySelector("#title").value;
  const question_txt = document.querySelector("#write_text").value;
  const secret = document.querySelector('input[name="secret"]').checked;
  const type = document.querySelector('input[name="type"]:checked');
  const file = document.querySelector("#file").files[0];
  const userId = await getCurrentUserId();
  const checkbox = document.getElementById("checkbox");

  // 입력값 검증
  if (name.length == 0) {
    await Swal.fire({
      icon: "error",
      title: "등록 실패",
      text: "작성자를 입력해주세요.",
    });
    return; // 함수 종료
  } else if (pw.length == 0) {
    await Swal.fire({
      icon: "error",
      title: "등록 실패",
      text: "비밀번호를 입력해주세요.",
    });
    return; // 함수 종료
  } else if (title.length == 0) {
    await Swal.fire({
      icon: "error",
      title: "등록 실패",
      text: "제목을 입력해주세요.",
    });
    return; // 함수 종료
  } else if (!type) {
    await Swal.fire({
      icon: "error",
      title: "등록 실패",
      text: "예약 종류를 선택해주세요.",
    });
    return; // 함수 종료
  } else if (question_txt.length == 0) {
    await Swal.fire({
      icon: "error",
      title: "등록 실패",
      text: "내용을 입력하세요.",
    });
    return; // 함수 종료
  } else if (!checkbox.checked) {
    await Swal.fire({
      icon: "error",
      title: "등록 실패",
      text: "안내사항을 체크해주세요.",
    });
    return;
  }

  let fileUrl = "";
  // 파일이 있으면 파일 업로드 후 URL 받기

  // 파일 확장자 허용 목록
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];

  if (file) {
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      await Swal.fire({
        icon: "error",
        title: "파일 업로드 실패",
        html: "지원되지 않는 파일 형식입니다.<br>jpg, jpeg, png, gif, bmp 파일만 업로드 가능합니다.",
        confirmButtonText: "확인",
      });
      return; // 함수 종료
    }
    fileUrl = await uploadFile(file);
  }

  // 게시글 저장
  const result = await savePost(
    name,
    pw,
    title,
    secret,
    question_txt,
    type,
    fileUrl,
    userId
  );

  if (result.success) {
    await Swal.fire({
      icon: "success",
      title: "등록 완료",
      text: "게시글이 성공적으로 등록되었습니다.",
    });

    window.location.href = "inquiry.html";
  } else {
    await Swal.fire({
      icon: "error",
      title: "등록 실패",
      text: "게시글 등록이 실패하였습니다.",
    });
  }
}

// 게시글 저장 함수
async function savePost(
  name,
  pw,
  title,
  secret,
  question_txt,
  type,
  fileUrl = "",
  userId = null
) {
  const res = await supabase
    .from("question")
    .insert([
      {
        name,
        pw,
        title,
        question_txt,
        secret,
        type: type.value,
        image_url: fileUrl,
        user_id: userId,
      },
    ])
    .select();

  if (res.error) {
    return {
      success: false,
      errorMessage: "게시글 등록 중 오류가 발생했습니다.",
    };
  }

  return { success: true };
}

// 파일 업로드 함수
async function uploadFile(file) {
  const filename = `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
  await supabase.storage
    .from("images")
    .upload(`question_uploads/${filename}`, file);

  const res = await supabase.storage
    .from("images")
    .getPublicUrl(`question_uploads/${filename}`);
  return res.data.publicUrl;
}

const passwordtext = document.getElementById("password");

// 비밀번호 입력값 처리
passwordtext.addEventListener("input", function (event) {
  let inputValue = passwordtext.value;
  passwordtext.value = inputValue.replace(/[^0-9]/g, ""); // 숫자만 입력되도록 제한

  if (passwordtext.value.length > 6) {
    passwordtext.value = passwordtext.value.substring(0, 6); // 최대 6자리로 제한
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  // 로그인 세션 확인
  const { data: { session } } = await supabase.auth.getSession();
  // 안내문 대상 div
  const checkboxGroup = document.getElementById("checkbox-group1");
  if (checkboxGroup) {
      if (session) {
          // 로그인 상태면 안내문 변경
          checkboxGroup.innerHTML = `
              <label class="column">안내사항 <em>*</em></label>
              <input type="checkbox" name="checkbox" id="checkbox" class="checkbox1"/>
              <label for="checkbox" class="column2">
                  비밀번호는 수정, 삭제, 비밀글 열람시 필요하니 꼭! 기억해주세요.
              </label>
          `;
      } else {
          // 비로그인(원래 안내문 유지) - 아무 것도 안해도 됨
      }
  }
});
