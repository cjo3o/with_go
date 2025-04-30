document.addEventListener("keydown", function (event) {
  if (event.key === "Backspace" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    history.back();
  }
});

function getPostIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchPostDetails(postId) {
  const { data, error } = await supabase
    .from("question")
    .select("*")
    .eq("text_num", postId);

  if (error) {
    console.error("게시글 조회 오류:", error);
    return null;
  }

  return data ? data[0] : null;
}

async function displayPostDetails() {
  const postId = getPostIdFromURL();

  if (!postId) {
    Swal.fire({
      title: "게시글 찾기 실패",
      text: "게시글을 찾을 수 없습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }

  const postDetails = await fetchPostDetails(postId);

  if (!postDetails) {
    Swal.fire({
      title: "게시글 찾기 실패",
      text: "게시글을 찾을 수 없습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }

  const postHeaderHTML1 = `
    <h1>${postDetails.title}</h1>
    <div>
      <p style="margin-right:25px; font-size: 15px;">작성자: ${postDetails.name}</p>
      <p style="font-size: 15px;">작성일: ${new Date(postDetails.created_at).toLocaleDateString()} ${new Date(postDetails.created_at).toLocaleTimeString()}</p>
    </div>
  `;

  const postHeaderHTML2 = `<p>${postDetails.question_txt}</p>`;

  let fileContent = "";
  if (postDetails.image_url) {
    const fileUrl = postDetails.image_url;
    const fileName = fileUrl.split("/").pop();
    const fileExtension = fileName.split(".").pop().toLowerCase();

    fileContent = `<p>첨부 파일: <a href="${fileUrl}" target="_blank">${fileName}</a></p>`;
    if (["jpg", "jpeg", "png", "gif", "bmp"].includes(fileExtension)) {
      fileContent += `
        <div style="text-align: left; margin-top: 10px;">
          <img src="${fileUrl}" alt="첨부된 이미지" style="max-width: 200px; max-height: 200px; cursor: pointer;">
        </div>
      `;
    }
  } else {
    fileContent = `<p>첨부 파일: 첨부된 파일이 없습니다.</p>`;
  }

  let answerContent = "";
  if (postDetails.answer) {
    answerContent = `
      <div style="margin-top:20px;">
        <strong>답변:</strong><br>${postDetails.answer}
      </div>
    `;
  }

  document.getElementById("cen_heder2").innerHTML = postHeaderHTML1;
  document.getElementById("cen_content").innerHTML = postHeaderHTML2;
  document.getElementById("cen_content2").innerHTML = fileContent + answerContent;
}

async function deletePost(postId) {
  const { error } = await supabase
    .from("question")
    .delete()
    .eq("text_num", postId);

  if (error) {
    console.error("게시글 삭제 오류:", error);
    Swal.fire({
      title: "삭제 실패",
      text: "게시글 삭제에 실패했습니다.",
      icon: "error",
    });
    return;
  }

  Swal.fire({
    title: "삭제 완료",
    text: "게시글 삭제에 성공하였습니다.",
    icon: "success",
  }).then(() => {
    window.location.href = "inquiry.html";
  });
}

async function isSecretPost(postId) {
  const postDetails = await fetchPostDetails(postId);
  return postDetails && postDetails.secret === true;
}

async function promptForPassword(postId) {
  const { value: password } = await Swal.fire({
    title: "비밀번호 확인",
    text: "등록한 비밀번호를 입력하세요",
    input: "password",
    inputAttributes: {
      autocapitalize: "off",
      placeholder: "비밀번호",
      inputMode: "numeric",
      maxlength: 6,
      pattern: "^[0-9]{1,6}$",
      autocomplete: "off",
    },
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    reverseButtons: true,
    inputValidator: (value) => {
      if (!value) {
        return "비밀번호를 입력해주세요.";
      }
      if (!/^\d{1,6}$/.test(value)) {
        return "숫자만 입력 가능합니다.";
      }
    },
  });

  if (password) {
    const postDetails = await fetchPostDetails(postId);
    if (postDetails && postDetails.pw === password) {
      return true;
    } else {
      Swal.fire({
        title: "비밀번호 오류",
        text: "입력하신 비밀번호가 올바르지 않습니다.",
        icon: "error",
      });
      return false;
    }
  }
  return false;
}

document.addEventListener("DOMContentLoaded", displayPostDetails);

document.getElementById("modify").addEventListener("click", async function (event) {
  event.preventDefault();

  const postId = getPostIdFromURL();
  if (!postId) {
    Swal.fire({
      title: "Error!",
      text: "게시글 ID를 찾을 수 없습니다.",
      icon: "error",
    });
    return;
  }

  const isSecret = await isSecretPost(postId);

  if (isSecret) {
    window.location.href = `modify.html?id=${postId}`;
  } else {
    const isPasswordCorrect = await promptForPassword(postId);
    if (isPasswordCorrect) {
      window.location.href = `modify.html?id=${postId}`;
    }
  }
});

document.getElementById("delete").addEventListener("click", async function (event) {
  event.preventDefault();

  const postId = getPostIdFromURL();
  if (!postId) {
    Swal.fire({
      title: "Error!",
      text: "게시글 ID를 찾을 수 없습니다.",
      icon: "error",
    });
    return;
  }

  const isSecret = await isSecretPost(postId);

  if (isSecret) {
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "삭제된 후기는 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost(postId);
      }
    });
  } else {
    const isPasswordCorrect = await promptForPassword(postId);
    if (isPasswordCorrect) {
      deletePost(postId);
    }
  }
});


// // 삭제 버튼 클릭 시 게시글 삭제
// document.getElementById("delete").addEventListener("click", async function (event) {
//     event.preventDefault();  // 기본 동작(페이지 이동)을 막음

//     const postId = getPostIdFromURL();
//     if (!postId) {
//         Swal.fire({
//             title: "Error!",
//             text: "게시글 ID를 찾을 수 없습니다.",
//             icon: "error"
//         });
//         return;
//     }

//     const isSecret = await isSecretPost(postId);  // 비밀글 여부 확인

//     if (isSecret) {
//         // 비밀글이면 비밀번호 입력 없이 바로 삭제
//         Swal.fire({
//             title: "정말 삭제하시겠습니까?",
//             text: "삭제된 후기는 복구할 수 없습니다.",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "삭제",
//             cancelButtonText: "취소",
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 deletePost(postId);  // 삭제 함수 호출
//             }
//         });
//     } else {
//         // 비밀글이 아니면 비밀번호 입력 팝업
//         promptForPassword(postId);
//     }
// });
