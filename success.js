const supabase = window.supabase.createClient(
    "https://zgrjjnifqoactpuqolao.supabase.co",           // ✅ 네 프로젝트 URL로 변경
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0"                        // ✅ anon key만 써야 함 (절대 service_role ❌)
);

async function insertReservation() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentKey = urlParams.get("paymentKey");
    const orderId = urlParams.get("orderId");
    const amount = urlParams.get("amount");

    // 결제 성공했는지 체크
    if (!paymentKey || !orderId || !amount) {
        alert("필수 결제 정보가 누락되었습니다.");
        return;
    }

    const reservationData = JSON.parse(localStorage.getItem("reservationData"));

    if (!reservationData) {
        alert("저장된 예약 정보가 없습니다.");
        return;
    }

    const { data, error } = await supabase
        .from("storage")
        .insert([{
            name: reservationData.name,
            phone: reservationData.phone,
            mail: reservationData.mail,
            storage_start_date: reservationData.dateStart,
            storage_end_date: reservationData.dateEnd,
            location: reservationData.location,
            reservation_country: reservationData.country,
            small: reservationData.small,
            medium: reservationData.medium,
            large: reservationData.large,
            price: reservationData.price
        }]);

    if (error) {
        console.error("예약 저장 실패", error);
        Swal.fire("오류", "예약 저장에 실패했습니다.", "error");
    } else {
        Swal.fire({
            title: "🎉 예약이 완료되었습니다!",
            text: "홈페이지로 이동합니다.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            localStorage.removeItem("reservationData"); // 저장정보 삭제
            window.location.href = "index.html";
        });
    }
}

insertReservation();
