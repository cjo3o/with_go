const searchBtn = document.querySelector("#search_btn");
const changeContainer = document.querySelector(".change_btn_container");
const tableContainer = document.querySelector(".table_container");
const $checkbox1 = document.querySelector("#keep_btn");
const $checkbox2 = document.querySelector("#delivery_btn");
const $search_reserveBox = document.querySelector("#search_reserveBox");
const $storage_table = document.querySelector(".storage_table");
const $delivery_table = document.querySelector(".delivery_table");
const $view_table_container = document.querySelector(".view_table_container");
const $search_check = document.querySelector(".search_check");
const $search_checkBox = document.querySelector("#search_checkBox");
const $search_check_btn = document.querySelector(".search_check_btn");
const $check_detail = document.querySelector(".check_detail");
const $check_detail_contents = document.querySelector(".check_detail_contents");
const $cancelBtn = document.querySelector(".cancelBtn");

if ($checkbox1) {
  $checkbox1.addEventListener("change", function () {
    if (this.checked) {
      if ($checkbox2) {
        $checkbox2.checked = false;
      }
    }
  });
}

if ($checkbox2) {
  $checkbox2.addEventListener("change", function () {
    if (this.checked) {
      if ($checkbox1) {
        $checkbox1.checked = false;
      }
    }
  });
}

const checkboxWrappers = changeContainer
  ? changeContainer.querySelectorAll(".change_btn")
  : [];
if (checkboxWrappers) {
  checkboxWrappers.forEach((wrapper) => {
    wrapper.addEventListener("click", function () {
      this.classList.toggle("checked");
      const checkbox = this.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    });
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", async () => {
    await searchReserve();
  });
}

if ($checkbox1) {
  $checkbox1.addEventListener("change", async function () {
    if (this.checked) {
      if ($checkbox2) $checkbox2.checked = false;
      $storage_table.style.display = "block";
      $delivery_table.style.display = "none";

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      if (userId) await autoLoadUserReservations(userId, "storage");
    }
  });
}

if ($checkbox2) {
  $checkbox2.addEventListener("change", async function () {
    if (this.checked) {
      if ($checkbox1) $checkbox1.checked = false;
      $delivery_table.style.display = "block";
      $storage_table.style.display = "none";

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      if (userId) await autoLoadUserReservations(userId, "delivery");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const userId = user?.id;
  // const userEmail = user?.email;

  // 로그인 안 됨: 안내만
  if (!userId) {
    // 숨길 영역들(검색, 테이블 등)
    if ($view_table_container) $view_table_container.style.display = "none";
    if ($search_check) $search_check.style.display = "none";
    if ($search_checkBox) $search_checkBox.style.display = "none";
    if (changeContainer) changeContainer.style.display = "none";
    // 상세 영역도 숨김
    if ($check_detail) $check_detail.style.display = "none";

    // 안내문구만 표시
    const section = document.querySelector(".section2 .check_contents");
    if (section) {
      section.innerHTML = `
                <div style="width: 100%; display: flex; justify-content: center; align-items: center; height: 200px;">
                    <h2 style="color: white; font-size: 1.5rem;">로그인 후 확인 가능합니다.</h2>
                </div>
            `;
    }
    return;
  }

  // 체크박스 기본값: 보관만 체크된 상태로 설정
  if ($checkbox1) $checkbox1.checked = true;
  if ($checkbox2) $checkbox2.checked = false;

  // $storage_table.style.display = 'block';
  // $delivery_table.style.display = 'none';

  const selectedType = $checkbox1?.checked ? "storage" : "delivery";
  await autoLoadUserReservations(userId, selectedType);
});

// document.addEventListener("DOMContentLoaded", async () => {
//     const { data: { user }, error } = await supabase.auth.getUser();
//
//     const userId = user?.id;
//     const userEmail = user?.email;
//
//     if (!userEmail || !userId) {
//         console.warn("로그인 정보가 없습니다. 자동 조회 불가");
//         return;
//     }
//
//     // 체크박스 기본값: 보관만 체크된 상태로 설정
//     if ($checkbox1) $checkbox1.checked = true;
//     if ($checkbox2) $checkbox2.checked = false;
//
//     const selectedType = $checkbox1?.checked ? 'storage' : 'delivery';
//     await autoLoadUserReservations(userEmail, selectedType);
// });

async function autoLoadUserReservations(userId, type) {
  const itemsPerPage = 10;
  let currentPage = 1;

  function renderPagination(totalPages) {
    return `
            <div class="pagination">
                <button onclick="changePage(1)" ${
                  currentPage === 1 ? "disabled" : ""
                }>처음</button>
                <button onclick="changePage(${currentPage - 1})" ${
      currentPage === 1 ? "disabled" : ""
    }>이전</button>
                <span>${currentPage} / ${totalPages}</span>
                <button onclick="changePage(${currentPage + 1})" ${
      currentPage === totalPages ? "disabled" : ""
    }>다음</button>
                <button onclick="changePage(${totalPages})" ${
      currentPage === totalPages ? "disabled" : ""
    }>마지막</button>
            </div>
        `;
  }

  function displayPage(data, page, container, renderRow, headerHtml) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageRows = data.slice(start, end).map(renderRow).join("");
    const totalPages = Math.ceil(data.length / itemsPerPage);

    container.innerHTML = `
            <table class="styled-table">
                ${headerHtml}
                <tbody>
                    ${pageRows}
                </tbody>
            </table>
            ${renderPagination(totalPages)}
        `;

    window.changePage = function (page) {
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayPage(data, currentPage, container, renderRow, headerHtml);
      }
    };
  }

  if (type === "storage") {
    $storage_table.innerHTML = ""; // ✅ 기존 목록 초기화

    const { data, error } = await supabase
      .from("storage")
      .select("*")
      .eq("user_id", userId)
      .neq("situation", "취소")
      .order("storage_start_date", { ascending: false });

    if (error || !data || data.length === 0) {
      document.querySelector(".alert").style.display = "block";
      return;
    }

    document.querySelector(".alert").style.display = "none";

    const renderRow = (item) => `
            <tr onclick="openDetail_st(this)" data-id="${
              item.reservation_number
            }">
                <td>${item.name}</td>
                <td>${item.phone}</td>
                <td>${item.situation || "접수"}</td>
                <td>${item.storage_start_date}</td>
                <td>${item.storage_end_date}</td>
                <td>${item.small}</td>
                <td>${item.medium}</td>
                <td>${item.large}</td>
                <td>${item.price}</td>
            </tr>
        `;

    const headerHtml = `
            <thead>
                <tr>
                    <th>이름</th>
                    <th>연락처</th>
                    <th>진행상태</th>
                    <th>보관일자</th>
                    <th>보관종료</th>
                    <th>소형</th>
                    <th>중형</th>
                    <th>대형</th>
                    <th>가격</th>
                </tr>
            </thead>
        `;

    displayPage(data, currentPage, $storage_table, renderRow, headerHtml);
  } else if (type === "delivery") {
    $delivery_table.innerHTML = ""; // ✅ 기존 목록 초기화

    const { data, error } = await supabase
      .from("delivery")
      .select("*")
      .eq("user_id", userId)
      .neq("situation", "취소")
      .order("delivery_date", { ascending: false });

    if (error || !data || data.length === 0) {
      document.querySelector(".alert").style.display = "block";
      return;
    }

    document.querySelector(".alert").style.display = "none";

    const mergedData = await Promise.all(
      data.map(async (item) => {
        const { data: driverRow } = await supabase
          .from("deliveryList")
          .select("driver_name, driver_phone")
          .eq("re_num", item.re_num)
          .maybeSingle();

        return {
          ...item,
          driver_name: driverRow?.driver_name || "미배정",
          driver_phone: driverRow?.driver_phone || "",
        };
      })
    );

    const renderRow = (item) => `
            <tr onclick="openDetail_de(this)" data-id="${item.re_num}">
                <td>${item.delivery_date}</td>
                <td>${item.name}</td>
                <td>${item.phone}</td>
                <td>${item.situation || "접수"}</td>
                <td>${item.delivery_start}</td>
                <td>${item.delivery_arrive}</td>
                <td>${item.under}</td>
                <td>${item.over}</td>
                <td>${item.price}</td>
            </tr>
        `;

    const headerHtml = `
            <thead>
                <tr>
                    <th>배송일자</th>
                    <th>이름</th>
                    <th>연락처</th>
                    <th>진행상태</th>
                    <th>배송 출발지</th>
                    <th>배송 도착지</th>
                    <th>26인치이하</th>
                    <th>26인치초과</th>
                    <th>가격</th>
                </tr>
            </thead>
        `;

    displayPage(
      mergedData,
      currentPage,
      $delivery_table,
      renderRow,
      headerHtml
    );
  }
}

function openDetail_st(trTag) {
  const id = trTag.getAttribute("data-id");
  window.selectedReservationId = id; // storage_id 저장

  const name = trTag.children[0].innerText;
  const phone = trTag.children[1].innerText;
  const situation = trTag.children[2].innerText;
  const storage_start_date = trTag.children[3].innerText;
  const storage_end_date = trTag.children[4].innerText;
  const small = trTag.children[5].innerText;
  const medium = trTag.children[6].innerText;
  const large = trTag.children[7].innerText;
  const price = trTag.children[8].innerText;

  $check_detail_contents.innerHTML = `
        <span class="close" onclick="closeDetail()">&times;</span>
        <h2>조회 상세 정보</h2>
        <div class="data">
            <div class="info-row"><span class="label">보관일자</span><span class="value">${storage_start_date}</span></div>
            <div class="info-row"><span class="label">보관종료</span><span class="value">${storage_end_date}</span></div>
            <div class="info-row"><span class="label">이 름</span><span class="value">${name}</span></div>
            <div class="info-row"><span class="label">연 락 처</span><span class="value">${phone}</span></div>
            <div class="info-row"><span class="label">진행상태</span><span class="value">${situation}</span></div>
        </div>
        <ul>
            <li>소형 : ${small}</li>
            <li>중형 : ${medium}</li>
            <li>대형 : ${large}</li>
        </ul>
        <hr>
        <div class="d-total">
            <strong>총 합</strong>
            <span>${price} 원</span>
        </div>
    `;
  $cancelBtn.innerHTML = `
        <button class="cancelReserve" onclick="cancelReserve()">
            예약취소
        </button>
    `;
  $check_detail.classList.add("fade_in");
  $check_detail_contents.classList.add("slide_up");
  $cancelBtn.classList.add("slide_up");
}

function openDetail_de(trTag) {
  const id = trTag.getAttribute("data-id");
  window.selectedReservationId = id;

  // 테이블에서 값 추출
  const date = trTag.children[0].innerText;
  const name = trTag.children[1].innerText;
  const phone = trTag.children[2].innerText;
  const situation = trTag.children[3].innerText;
  const start = trTag.children[4].innerText;
  const arrive = trTag.children[5].innerText;
  const under = trTag.children[6].innerText;
  const over = trTag.children[7].innerText;
  const price = trTag.children[8].innerText;

  // 여기서만 기사 정보 fetch (비동기!)
  supabase
    .from("deliveryList")
    .select("driver_name, driver_phone")
    .eq("re_num", id)
    .maybeSingle()
    .then(({ data: driverRow }) => {
      const driverName = driverRow?.driver_name || "미배정";
      const driverPhone = driverRow?.driver_phone || "";

      $check_detail_contents.innerHTML = `
                <span class="close" onclick="closeDetail()">&times;</span>
                <h2>조회 상세 정보</h2>
                <div class="data">
                    <div class="info-row"><span class="label">배송일자</span><span class="value">${date}</span></div>
                    <div class="info-row"><span class="label">출 발 지</span><span class="value">${start}</span></div>
                    <div class="info-row"><span class="label">도 착 지</span><span class="value">${arrive}</span></div>
                    <div class="info-row"><span class="label">이 름</span><span class="value">${name}</span></div>
                    <div class="info-row"><span class="label">연 락 처</span><span class="value">${phone}</span></div>
                    <div class="info-row"><span class="label">진행상태</span><span class="value">${situation}</span></div>
                </div>
                <hr>
                <div class="size">
                    <p>ㆍ26인치이하 : ${under}</p>
                    <p>ㆍ26인치초과 : ${over}</p>
                </div>
                <hr>
                <div>
                    <p>ㆍ배정기사 : ${driverName}</p>
                    <p>ㆍ기사번호 : ${driverPhone}</p>
                </div>
                <hr>
                <div class="d-total">
                    <strong>총 합</strong>
                    <span>${price} 원</span>
                </div>
            `;
      $cancelBtn.innerHTML = `
                <button class="cancelReserve" onclick="cancelReserve()">
                    예약취소
                </button>
            `;
      $check_detail.classList.add("fade_in");
      $check_detail_contents.classList.add("slide_up");
      $cancelBtn.classList.add("slide_up");
    });
}

function closeDetail() {
  $check_detail_contents.classList.remove("slide_up");
  $cancelBtn.classList.remove("slide_up");
  $check_detail.classList.remove("fade_in");
}

async function cancelReserve() {
  const result = await Swal.fire({
    title: "정말 취소하시겠습니까?",
    text: "취소하시면 복구하실 수 없습니다!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });

  if (result.isConfirmed) {
    const id = window.selectedReservationId;
    if (!id) {
      Swal.fire("오류", "예약 ID가 없습니다.", "error");
      return;
    }

    const isStorage = $checkbox1?.checked;
    const table = isStorage ? "storage" : "delivery";
    const idColumn = isStorage ? "reservation_number" : "re_num";

    const { error } = await supabase
      .from(table)
      .update({ situation: "취소" })
      .eq(idColumn, id);

    if (error) {
      Swal.fire("오류", "삭제 중 문제가 발생했습니다.", "error");
    } else {
      Swal.fire("삭제 완료", "예약이 성공적으로 취소되었습니다.", "success");
      closeDetail();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      await autoLoadUserReservations(userId, table);
    }
  }
}

// document.getElementById('search_reserveBox').addEventListener('input', function (e) {
//     let num = e.target.value.replace(/[^0-9]/g, '');
//
//     if (num.length < 4) {
//         e.target.value = num;
//     } else if (num.length < 8) {
//         e.target.value = `${num.slice(0, 3)}-${num.slice(3)}`;
//     } else {
//         e.target.value = `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
//     }
// });
