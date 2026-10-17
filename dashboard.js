const $=id=>document.getElementById(id), get=k=>JSON.parse(localStorage.getItem(k)||'null');
const me=get('session');if(!me)location.href='login.html';
$('logout').onclick=()=>{localStorage.removeItem('session');location.href='login.html'};
const money=n=>'₹'+Number(n).toLocaleString('en-IN',{maximumFractionDigits:2});
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const ym=new Date().toISOString().slice(0,7);
const mine=(get('exp')||[]).filter(x=>x.email===me.email);
const cur=mine.filter(x=>x.date.slice(0,7)===ym);
const spent=cur.reduce((s,x)=>s+x.amount,0), budget=get('budget_'+me.email)||0;
$('hello').textContent='Welcome, '+me.name.split(' ')[0];
$('month').textContent=new Date().toLocaleString('en-IN',{month:'long',year:'numeric'})+' overview';
$('spent').textContent=money(spent);$('count').textContent=mine.length;
if(budget){$('budget').textContent=money(budget);const l=budget-spent;$('left').textContent=money(l);$('left').className=l<0?'neg':'pos'}
const by={};cur.forEach(x=>by[x.cat]=(by[x.cat]||0)+x.amount);
const top=Object.entries(by).sort((a,b)=>b[1]-a[1]);
$('cats').innerHTML=top.length?top.map(([c,v])=>`<div class="cat"><span>${esc(c)}</span><div class="bar"><i style="width:${v/top[0][1]*100}%"></i></div><em>${money(v)}</em></div>`).join(''):'<p class="sub">No expenses this month. <a href="add.html">Add one</a>.</p>';
$('recent').innerHTML=mine.sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,5).map(x=>`<tr><td>${esc(x.title)}<br><small>${esc(x.date)}</small></td><td class="amt">${money(x.amount)}</td></tr>`).join('')||'<tr><td>Nothing logged yet.</td></tr>';
