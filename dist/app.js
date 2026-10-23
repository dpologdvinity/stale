const findings = [
  {kind:'branch',name:'feat/legacy-checkout',detail:'Merged into main · PR #284',touched:'Mar 23, 2026',age:214,owner:'MC',status:'Merged',symbol:'⌁'},
  {kind:'todo',name:'TODO: remove compat shim',detail:'src/payments/adapter.ts:84',touched:'Apr 02, 2025',age:199,owner:'JL',status:'Review',symbol:'☷'},
  {kind:'worktree',name:'checkout-hotfix',detail:'../checkout-hotfix',touched:'Apr 18, 2026',age:188,owner:'AK',status:'Inactive',symbol:'⌂'},
  {kind:'stash',name:'WIP on auth-v2',detail:'stash@{1} · 2 files changed',touched:'May 11, 2025',age:165,owner:'MC',status:'Review',symbol:'▤'},
  {kind:'flag',name:'CHECKOUT_V1_ENABLED',detail:'Referenced in 0 files',touched:'Jun 08, 2025',age:151,owner:'JL',status:'Orphaned',symbol:'⚑'},
  {kind:'branch',name:'fix/old-tax-rounding',detail:'Merged into main · PR #251',touched:'Jun 19, 2026',age:126,owner:'SR',status:'Merged',symbol:'⌁'},
  {kind:'todo',name:'TODO: retry on 502',detail:'src/api/client.ts:122',touched:'Jul 10, 2025',age:112,owner:'AK',status:'Review',symbol:'☷'},
  {kind:'worktree',name:'experiment-receipts',detail:'../experiment-receipts',touched:'Aug 06, 2026',age:95,owner:'SR',status:'Inactive',symbol:'⌂'},
  {kind:'branch',name:'feat/new-receipt-email',detail:'No commits ahead of main',touched:'Aug 16, 2026',age:85,owner:'AK',status:'Inactive',symbol:'⌁'},
  {kind:'todo',name:'TODO: delete after migration',detail:'src/db/migrations.ts:41',touched:'Aug 29, 2025',age:77,owner:'MC',status:'Review',symbol:'☷'},
  {kind:'branch',name:'chore/node-18-pipeline',detail:'Merged into main · PR #302',touched:'Sep 02, 2026',age:68,owner:'JL',status:'Merged',symbol:'⌁'},
  {kind:'stash',name:'WIP on main',detail:'stash@{0} · 1 file changed',touched:'Sep 20, 2025',age:55,owner:'SR',status:'Review',symbol:'▤'},
  {kind:'todo',name:'TODO: revisit timeout',detail:'src/worker/queue.ts:207',touched:'Oct 01, 2025',age:42,owner:'AK',status:'Review',symbol:'☷'},
  {kind:'flag',name:'OLD_SEARCH_EXPERIENCE',detail:'Referenced in 0 files',touched:'Oct 12, 2025',age:31,owner:'MC',status:'Orphaned',symbol:'⚑'},
  {kind:'worktree',name:'spike-fast-search',detail:'../spike-fast-search',touched:'Oct 25, 2026',age:23,owner:'JL',status:'Inactive',symbol:'⌂'},
  {kind:'todo',name:'TODO: add edge case',detail:'src/cart/discount.ts:19',touched:'Nov 02, 2025',age:16,owner:'SR',status:'Review',symbol:'☷'},
  {kind:'branch',name:'feat/cart-cleanup',detail:'2 commits ahead of main',touched:'Nov 11, 2026',age:8,owner:'AK',status:'Review',symbol:'⌁'},
  {kind:'branch',name:'docs/checkout-flow',detail:'No commits ahead of main',touched:'Nov 18, 2026',age:2,owner:'MC',status:'Inactive',symbol:'⌁'}
];
const labels={branch:'Branch',worktree:'Worktree',stash:'Stash',todo:'TODO',flag:'Feature flag'};
const state={filter:'all',query:'',page:0,sort:'desc'};
const tbody=document.querySelector('#finding-rows');
const toast=document.querySelector('#toast');
function render(){
  const matches=findings.map((item,index)=>({...item,index})).filter(x=>(state.filter==='all'||x.kind===state.filter)&&(`${x.name} ${x.detail} ${x.owner}`.toLowerCase().includes(state.query)));
  matches.sort((a,b)=>state.sort==='desc'?b.age-a.age:a.age-b.age);
  const pages=Math.max(1,Math.ceil(matches.length/8));state.page=Math.min(state.page,pages-1);
  const visible=matches.slice(state.page*8,state.page*8+8);
  tbody.innerHTML=visible.map(x=>`<tr><td><input type="checkbox" aria-label="Select ${x.name}" data-index="${x.index}"></td><td><span class="kind-icon">${x.symbol}</span><strong>${escapeHtml(x.name)}</strong><code>${escapeHtml(x.detail)}</code></td><td>${x.touched}</td><td class="age">${x.age} days</td><td><span class="owner"><span class="owner-avatar">${x.owner}</span>${ownerName(x.owner)}</span></td><td><span class="status ${x.status==='Review'?'review':''}">${x.status}</span></td><td><button class="row-more" aria-label="More actions for ${x.name}" data-name="${escapeHtml(x.name)}">···</button></td></tr>`).join('');
  document.querySelector('#empty-state').hidden=matches.length>0;
  document.querySelector('#visible-count').textContent=matches.length;
  document.querySelector('#table-range').textContent=matches.length?`Showing ${state.page*8+1}–${Math.min((state.page+1)*8,matches.length)} of ${matches.length} findings`:'Showing 0 findings';
  document.querySelector('#select-all').checked=false;
  document.querySelector('#next-page').disabled=state.page>=pages-1;
}
function escapeHtml(value){return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function ownerName(code){return ({MC:'Maya',JL:'Jules',AK:'Ari',SR:'Sam'})[code]||code;}
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2400);}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.filter.active').classList.remove('active');button.classList.add('active');state.filter=button.dataset.filter;state.page=0;render();}));
document.querySelector('#search').addEventListener('input',event=>{state.query=event.target.value.trim().toLowerCase();state.page=0;render();});
document.querySelector('#next-page').addEventListener('click',()=>{state.page++;render();});
document.querySelector('#sort').addEventListener('click',()=>{state.sort=state.sort==='desc'?'asc':'desc';document.querySelector('#sort').innerHTML=`${state.sort==='desc'?'Oldest first':'Newest first'} <span>⌄</span>`;state.page=0;render();});
document.querySelector('#select-all').addEventListener('change',event=>document.querySelectorAll('#finding-rows input[type=checkbox]').forEach(box=>box.checked=event.target.checked));
tbody.addEventListener('click',event=>{const button=event.target.closest('.row-more');if(button)showToast(`${button.dataset.name} · Suggested for review`);});
document.querySelector('#repo-menu').addEventListener('click',()=>showToast('Repository settings are managed by your workspace.'));
const dialog=document.querySelector('#report-dialog');
function openReport(){document.querySelector('#report-groups').innerHTML=Object.entries(labels).map(([key,label])=>{const count=findings.filter(x=>x.kind===key).length;return `<div class="report-group"><span>${label}s <span>(${count})</span></span><span>${count?'Review suggested':'Clear'} ${count?'↗':'✓'}</span></div>`}).join('');dialog.showModal();}
document.querySelector('#open-report').addEventListener('click',openReport);
document.querySelector('#rail-report').addEventListener('click',event=>{event.preventDefault();openReport();});
document.querySelector('#close-report').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
const reportText=`# stale cleanup report\n\nRepository: northstar/checkout\nScanned: October 23, 2026\nFindings: ${findings.length}\n\n${Object.entries(labels).map(([key,label])=>`## ${label}s\n${findings.filter(x=>x.kind===key).map(x=>`- ${x.name} — ${x.age} days since activity (${x.detail})`).join('\n')}`).join('\n\n')}\n\nNothing was changed. Review each suggestion in your repository.`;
document.querySelector('#copy-report').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(reportText);showToast('Cleanup report copied.');}catch{showToast('Clipboard unavailable. Use Download Markdown instead.');}});
document.querySelector('#download-report').addEventListener('click',()=>{const blob=new Blob([reportText],{type:'text/markdown'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='stale-cleanup-report.md';link.click();URL.revokeObjectURL(link.href);showToast('Cleanup report downloaded.');});
document.querySelector('#scan').addEventListener('click',event=>{const button=event.currentTarget;button.classList.add('loading');button.querySelector('span').textContent='Scanning…';button.disabled=true;setTimeout(()=>{button.classList.remove('loading');button.querySelector('span').textContent='Run scan';button.disabled=false;showToast('Scan complete. No new dust found.');},1100);});
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();document.querySelector('#search').focus();}});
render();
