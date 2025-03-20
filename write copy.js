document.querySelector('#input-btn').addEventListener('click', async function () {
    const name = document.querySelector('#name').value;
    const password = document.querySelector('#password').value;
    const title = document.querySelector('#title').value;
    const text = document.querySelector('#review_text').value;
    const radio = document.querySelector('input[name="type"]:checked');


    if (name.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "이름을 입력해주세요.",
        });
    } else if (password.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "비밀번호를 입력해주세요.",
        });
    } else if (title.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "제목을 입력해주세요.",
        });
    } else if (!radio) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "예약 종류를 선택해주세요.",
        });
    }
    else if (text.length == 0) {
        await Swal.fire({
            icon: "error",
            title: "등록 실패",
            text: "내용을 입력해주세요.",
        });
    }
});

 const passwordtext = document.getElementById('password');

 passwordtext.addEventListener('input', function(event) {
     let inputValue = passwordtext.value;
     passwordtext.value = inputValue.replace(/[^0-9]/, '');

     if (passwordtext.value.length > 4) {
        passwordtext.value = passwordtext.value.substring(0, 4);
     }
 });