document.addEventListener('DOMContentLoaded', async () => {
    const res = await supabase.from('partner_place')
        .select('*')
        .order('partner_id', {ascending: true});

    const $keep_adr_container = document.querySelectorAll('.keep_adr_container');
    const partner_placeData = await res.data.map((item) => {
        return `<div class="keep_adr">
                            <div class="keep_adr_infor">
                                <p class="title">${item.name}</p>
                                <p class="location">${item.address}</p>
                            </div>
                            <a href="partner_details.html?id=${item.partner_id}"
                               onclick="window.open(this.href, '_blank', 'width=800, height=650'); return false;">상세보기</a>
                        </div>
                        `;
    }).join('');

    $keep_adr_container[1].innerHTML += partner_placeData;
})
