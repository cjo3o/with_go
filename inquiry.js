const $boardlist = document.querySelector('#board_list');
    async function boardSelect() {
        const res = await supabase.from('board').select()
        let rows = '';
        for (let i = 0; i < res.data.length; i++) {
            rows += `
                <tr>
                    <td>${res.data[i].seq}</td>
                    <td>${res.data[i].title}</td>
                    <td>${res.data[i].attachment}</td>
                    <td>${res.data[i].name}</td>
                    <td>${res.data[i].created_at}</td>
                    <td>${res.data[i].is_read}</td>
                    <td>${res.data[i].status}</td>
                </tr>`;
        }
        $boardlist.innerHTML = board;
    }

    // CREATE TABLE board (
    //     seq SERIAL PRIMARY KEY,               -- 순번 (자동 증가, 기본 키)
    //     name TEXT NOT NULL,                   -- 이름 (빈값을 허용하지 않음)
    //     password TEXT NOT NULL,               -- 비밀번호 (빈값을 허용하지 않음)
    //     is_secret BOOLEAN DEFAULT FALSE,      -- 비밀글여부 (기본값은 FALSE, 비밀글 여부)
    //     title TEXT NOT NULL,                  -- 제목 (빈값을 허용하지 않음)
    //     attachment TEXT,                      -- 첨부파일 (NULL 허용, 파일 경로 등을 저장할 수 있음)
    //     created_at TIMESTAMP DEFAULT NOW(),   -- 작성일 (기본값으로 현재 시간 자동 삽입)
    //     is_read BOOLEAN DEFAULT FALSE,        -- 조회여부 (기본값은 FALSE)
    //     status TEXT DEFAULT 'active'          -- 상태 (기본값은 'active', 예: active, inactive 등)
    // );