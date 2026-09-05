(function(){
  const featuredGrid=document.querySelector('#featuredPublications');
  const latestGrid=document.querySelector('#latestPublications');
  const categoryGrid=document.querySelector('#categoryRecommendations');
  if(!featuredGrid&&!latestGrid&&!categoryGrid)return;
  const CSV_URL='./data/official-publications.csv';
  const featuredTitles=['DOUBLE CROSS','경찰무도의 본질과 미래','ACTS MISSION ALLIANCE'];
  const categoryOrder=['ACTS·선교','경찰무도·무도교육','태권검도','드론·AI·안전','글로벌리더십·다문화·공익','인증·자격·품질','미디어·저널리즘'];
  const categoryLabels={
    'ACTS·선교':'ACTS · 선교',
    '경찰무도·무도교육':'경찰무도 · 무도교육',
    '태권검도':'태권검도',
    '드론·AI·안전':'드론 · AI · 안전',
    '글로벌리더십·다문화·공익':'글로벌 리더십 · 공익',
    '인증·자격·품질':'인증 · 자격 · 품질',
    '미디어·저널리즘':'미디어 · 저널리즘'
  };
  const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  function parseCsv(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const ch=text[i];if(quoted){if(ch==='"'&&text[i+1]==='"'){cell+='"';i++;}else if(ch==='"')quoted=false;else cell+=ch;}else{if(ch==='"')quoted=true;else if(ch===','){row.push(cell);cell='';}else if(ch==='\n'){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}else cell+=ch;}}if(cell.length||row.length){row.push(cell);rows.push(row);}if(!rows.length)return[];const headers=rows.shift().map(v=>v.trim());return rows.filter(r=>r.some(v=>String(v).trim())).map(r=>{const o={};headers.forEach((h,i)=>o[h]=String(r[i]??'').trim());return o;});}
  function byNewest(a,b){return String(b.publish_date||'').localeCompare(String(a.publish_date||''))||Number(a.source_row||9999)-Number(b.source_row||9999);}
  function featuredCard(rec,index){const href=`./catalog/official/?isbn=${encodeURIComponent(rec.isbn||'')}`;return `<a class="featured-publication" href="${href}"><div class="featured-number">FEATURED 0${index+1}</div><div><p class="kicker">${esc(rec.category||'OFFICIAL PUBLICATION')}</p><h3>${esc(rec.title)}</h3><p class="small">${esc(rec.series||'IPMA Publishing')}</p></div><div class="featured-meta"><span><b>ISBN</b> ${esc(rec.isbn)}</span><span><b>발행일</b> ${esc(rec.publish_date)}</span><span><b>출판/저작</b> ${esc(rec.publisher_copyright)}</span></div><div class="featured-link">공식 출판정보 보기 →</div></a>`;}
  function latestCard(rec,index){const href=`./catalog/official/?isbn=${encodeURIComponent(rec.isbn||'')}`;return `<a class="latest-publication" href="${href}"><div class="latest-rank">NEW ${String(index+1).padStart(2,'0')}</div><div class="latest-body"><p class="kicker">${esc(rec.category||'OFFICIAL PUBLICATION')}</p><h3>${esc(rec.title)}</h3><p class="small">${esc(rec.series||'IPMA Publishing')}</p></div><div class="latest-meta"><span>${esc(rec.publish_date)}</span><span>ISBN ${esc(rec.isbn)}</span></div></a>`;}
  function categoryCard(rec,index){const detail=`./catalog/official/?isbn=${encodeURIComponent(rec.isbn||'')}`;const collection=`./catalog/?category=${encodeURIComponent(rec.category||'')}`;return `<article class="category-recommendation"><a class="category-recommendation-main" href="${detail}"><div class="category-shelf-index">SHELF ${String(index+1).padStart(2,'0')}</div><p class="kicker">${esc(categoryLabels[rec.category]||rec.category||'COLLECTION')}</p><h3>${esc(rec.title)}</h3><p class="small">${esc(rec.series||'IPMA Publishing')}</p><div class="category-recommendation-meta"><span>${esc(rec.publish_date)}</span><span>ISBN ${esc(rec.isbn)}</span></div></a><a class="category-collection-link" href="${collection}">이 분야 전체 보기 →</a></article>`;}
  fetch(CSV_URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('load');return r.text();}).then(text=>{
    const records=parseCsv(text);
    if(featuredGrid){const selected=featuredTitles.map(title=>records.find(r=>r.title===title)).filter(Boolean);featuredGrid.innerHTML=selected.length?selected.map(featuredCard).join(''):'<div class="featured-loading">대표 출판물 정보를 찾지 못했습니다.</div>';}
    if(latestGrid){const latest=records.filter(r=>/^\d{4}-\d{2}-\d{2}$/.test(r.publish_date||'')).sort(byNewest).slice(0,6);latestGrid.innerHTML=latest.length?latest.map(latestCard).join(''):'<div class="featured-loading">최근 발행 출판물 정보를 찾지 못했습니다.</div>';}
    if(categoryGrid){const recommendations=categoryOrder.map(category=>records.filter(r=>r.category===category&&/^\d{4}-\d{2}-\d{2}$/.test(r.publish_date||'')).sort(byNewest)[0]).filter(Boolean);categoryGrid.innerHTML=recommendations.length?recommendations.map(categoryCard).join(''):'<div class="featured-loading">분야별 추천 도서를 찾지 못했습니다.</div>';}
  }).catch(()=>{
    if(featuredGrid)featuredGrid.innerHTML='<div class="featured-loading">대표 출판물 정보를 불러오지 못했습니다. DIGITAL LIBRARY에서 전체 출판물을 확인해 주세요.</div>';
    if(latestGrid)latestGrid.innerHTML='<div class="featured-loading">최근 발행 출판물을 불러오지 못했습니다.</div>';
    if(categoryGrid)categoryGrid.innerHTML='<div class="featured-loading">분야별 추천 도서를 불러오지 못했습니다.</div>';
  });
})();
