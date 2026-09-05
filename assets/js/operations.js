(function(){
  const form=document.querySelector('#publicationForm');
  const output=document.querySelector('#jsonOutput');
  const message=document.querySelector('#formMessage');
  const copyButton=document.querySelector('#copyJson');
  const jsonButton=document.querySelector('#downloadJson');
  const csvButton=document.querySelector('#downloadCsv');
  if(!form||!output)return;

  let currentRecord=null;

  const trim=v=>String(v??'').trim();
  const compact=v=>trim(v).replace(/[-\s]/g,'');
  const isDate=v=>!v||/^\d{4}-\d{2}-\d{2}$/.test(v);
  const isValidIsbn13=value=>{
    const d=compact(value);
    if(!d)return true;
    if(!/^\d{13}$/.test(d))return false;
    const sum=d.slice(0,12).split('').reduce((acc,n,i)=>acc+Number(n)*(i%2?3:1),0);
    const check=(10-(sum%10))%10;
    return check===Number(d[12]);
  };
  const isValidIsbn10=value=>{
    const d=compact(value).toUpperCase();
    if(!d)return true;
    if(!/^\d{9}[\dX]$/.test(d))return false;
    const sum=d.split('').reduce((acc,ch,i)=>acc+(ch==='X'?10:Number(ch))*(10-i),0);
    return sum%11===0;
  };
  const validIsbn=value=>{
    const d=compact(value);
    if(!d)return true;
    return d.length===13?isValidIsbn13(value):d.length===10?isValidIsbn10(value):false;
  };

  function cleanUrl(value){
    const v=trim(value);
    if(!v)return '';
    if(v.startsWith('https://')||v.startsWith('http://')||v.startsWith('/')||v.startsWith('./')||v.startsWith('../'))return v;
    return '';
  }

  function recordFromForm(){
    const fd=new FormData(form);
    const raw=Object.fromEntries(fd.entries());
    const record={
      id:trim(raw.id), title:trim(raw.title), subtitle:trim(raw.subtitle), isbn:trim(raw.isbn),
      publish_date:trim(raw.publish_date), publisher:trim(raw.publisher), rights:trim(raw.rights),
      category:trim(raw.category), series:trim(raw.series), format:trim(raw.format), language:trim(raw.language),
      author:trim(raw.author), edition:trim(raw.edition), version:trim(raw.version), summary:trim(raw.summary),
      cover:cleanUrl(raw.cover), ebook_url:cleanUrl(raw.ebook_url), preview_url:cleanUrl(raw.preview_url),
      purchase_url:cleanUrl(raw.purchase_url), verification_code_example:trim(raw.verification_code_example),
      featured:fd.get('featured')==='on', new_release:fd.get('new_release')==='on'
    };
    Object.keys(record).forEach(key=>{
      const value=record[key];
      if(value===''||value===false)delete record[key];
    });
    return record;
  }

  function validate(record){
    const errors=[];
    if(!record.id)errors.push('도서 ID를 입력하세요.');
    if(!record.title)errors.push('도서명을 입력하세요.');
    if(record.isbn&&!validIsbn(record.isbn))errors.push('ISBN 체크섬 또는 자릿수를 확인하세요.');
    if(record.publish_date&&!isDate(record.publish_date))errors.push('발행일은 YYYY-MM-DD 형식이어야 합니다.');
    ['cover','ebook_url','preview_url','purchase_url'].forEach(key=>{
      const input=form.elements[key];
      if(input&&trim(input.value)&&!cleanUrl(input.value))errors.push(`${key} 링크 형식을 확인하세요.`);
    });
    return errors;
  }

  function csvEscape(value){
    const s=String(value??'');
    return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s;
  }

  function recordToCsv(record){
    const fields=['id','title','subtitle','isbn','publish_date','publisher','rights','category','series','format','language','author','edition','version','summary','cover','ebook_url','preview_url','purchase_url','verification_code_example','featured','new_release'];
    return `${fields.join(',')}\n${fields.map(f=>csvEscape(record[f]??'')).join(',')}\n`;
  }

  function download(filename,content,type){
    const blob=new Blob([content],{type});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),0);
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const record=recordFromForm();
    const errors=validate(record);
    if(errors.length){currentRecord=null;output.value='';message.className='operations-message error';message.textContent=errors.join(' ');return;}
    currentRecord=record;
    output.value=JSON.stringify(record,null,2);
    message.className='operations-message ok';
    message.textContent='등록자료가 생성되었습니다. 실제 반영 전 기존 ID·ISBN 중복 여부를 반드시 확인하세요.';
  });

  form.addEventListener('reset',()=>{setTimeout(()=>{currentRecord=null;output.value='';message.className='operations-message';message.textContent='';},0);});
  copyButton?.addEventListener('click',async()=>{if(!output.value)return;try{await navigator.clipboard.writeText(output.value);message.className='operations-message ok';message.textContent='JSON을 복사했습니다.';}catch{output.select();document.execCommand('copy');}});
  jsonButton?.addEventListener('click',()=>{if(!currentRecord)return;download(`${currentRecord.id||'publication'}.json`,JSON.stringify(currentRecord,null,2),'application/json;charset=utf-8');});
  csvButton?.addEventListener('click',()=>{if(!currentRecord)return;download(`${currentRecord.id||'publication'}.csv`,recordToCsv(currentRecord),'text/csv;charset=utf-8');});
})();
