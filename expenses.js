const $=id=>document.getElementById(id), get=k=>JSON.parse(localStorage.getItem(k)||'null');
const me=get('session');if(!me)location.href='login.html';
$('logout').onclick=()=>{localStorage.removeItem('session');location.href='login.html'};
const money=n=>'₹'+Number(n).toLocaleString('en-IN',{maximumFractionDigits:2});
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
['Food','Travel','Bills','Shopping','Health','Education','Entertainment','Other'].forEach(c=>$('cat').add(new Option(c,c)));
const all=()=>(get('exp')||[]).filter(x=>x.email===me.email);
function list(){
  const q=$('q').value.trim().toLowerCase(),c=$('cat').value,m=$('month').value;
  return all().filter(x=>(!c||x.cat===c)&&(!m||x.date.slice(0,7)===m)&&(!q||(x.title+' '+x.note).toLowerCase().includes(q)))
    .sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
}
function render(){
  const l=list();
  $('total').textContent=`${l.length} expense${l.length===1?'':'s'}, total ${money(l.reduce((s,x)=>s+x.amount,0))}`;
  $('rows').innerHTML=l.length?l.map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.title)}${x.note?'<br><small>'+esc(x.note)+'</small>':''}</td><td>${esc(x.cat)}</td><td class="amt">${money(x.amount)}</td><td><button class="del" data-id="${x.id}">Delete</button></td></tr>`).join(''):'<tr><td colspan="5" class="empty">No expenses match. Add one or change the filters.</td></tr>';
}
['q','cat','month'].forEach(id=>$(id).addEventListener('input',render));
$('rows').onclick=e=>{
  const id=e.target.dataset.id;if(!id||!confirm('Delete this expense?'))return;
  localStorage.setItem('exp',JSON.stringify((get('exp')||[]).filter(x=>x.id!=id)));render();
};
$('csv').onclick=()=>{
  const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const rows=[['Date','Title','Category','Amount','Note'],...list().map(x=>[x.date,x.title,x.cat,x.amount,x.note])];
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(q).join(',')).join('\n')],{type:'text/csv'}));
  a.download='expenses.csv';a.click();
};
render();
