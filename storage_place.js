document.addEventListener('DOMContentLoaded', async () => {
    const res = await supabase.from('storage_place')
        .select('*')
        .order('storage_id', {ascending: true});

    const $keep_adr_container = document.querySelectorAll('.keep_adr_container');
    const storage_placeData = await res.data.map((item) => {
        return `<div class="keep_adr">
                            <div class="keep_adr_infor">
                                <p class="title">${item.name}</p>
                                <p class="location">${item.address}</p>
                            </div>
                            <a href="storage_details.html?id=${item.storage_id}"
                               onclick="window.open(this.href, '_blank', 'width=800, height=650'); return false;">상세보기</a>
                        </div>
                        `;
    }).join('');

    const $storage_input = document.getElementById('storage_input');

    function findStorage(e) {
        console.log($storage_input.value);
    }

    $keep_adr_container[0].innerHTML = storage_placeData;
})
