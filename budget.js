const $=id=>document.getElementById(id), get=k=>JSON.parse(localStorage.getItem(k)||'null');
const me=get('session');if(!me)location.href='login.html';
$('logout').onclick=()=>{localStorage.removeItem('session');location.href='login.html'};
const money=n=>'₹'+Number(n).toLocaleString('en-IN',{maximumFractionDigits:0});
const mine=(get('exp')||[]).filter(x=>x.email===me.email);
const sumFor=ym=>mine.filter(x=>x.date.slice(0,7)===ym).reduce((s,x)=>s+x.amount,0);
function show(){
  const budget=get('budget_'+me.email)||0,spent=sumFor(new Date().toISOString().slice(0,7));
  if(budget)$('amount').value=budget;
  const pct=budget?spent/budget*100:0;
  $('status').textContent=budget?`${money(spent)} of ${money(budget)} spent (${Math.round(pct)}%)`:`${money(spent)} spent. Set a budget to track it.`;
  $('bar').className='bar'+(pct>100?' over':pct>=80?' warn':'');
  $('bar').firstChild.style.width=Math.min(pct,100)+'%';
  $('tip').textContent=!budget?'':pct>100?`You are over budget by ${money(spent-budget)}.`:pct>=80?'You have used over 80% of your budget. Slow down on non-essentials.':`You can still spend ${money(budget-spent)} this month.`;
}
$('form').addEventListener('submit',e=>{
  e.preventDefault();
  const v=parseFloat($('amount').value);
  if(!(v>0)){$('msg').className='msg';$('msg').textContent='Enter a budget greater than 0.';return}
  localStorage.setItem('budget_'+me.email,JSON.stringify(v));
  $('msg').className='msg ok';$('msg').textContent='Budget saved.';show();
});
const months=[];for(let i=5;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);months.push([d.toISOString().slice(0,7),d.toLocaleString('en-IN',{month:'short'})])}
const vals=months.map(([ym])=>sumFor(ym)),max=Math.max(...vals,1);
$('trend').innerHTML=months.map(([,l],i)=>`<div><span>${money(vals[i])}</span><i style="height:${vals[i]/max*100*0.75}%"></i><span>${l}</span></div>`).join('');
show();
