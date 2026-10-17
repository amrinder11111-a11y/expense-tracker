const $=id=>document.getElementById(id), get=k=>JSON.parse(localStorage.getItem(k)||'null');
if(get('session'))location.href='dashboard.html';
$('form').addEventListener('submit',e=>{
  e.preventDefault();
  const email=$('email').value.trim().toLowerCase(),pw=$('password').value;
  const user=(get('users')||[]).find(u=>u.email===email&&u.pw===pw);
  if(!user){$('msg').textContent='Email or password is incorrect.';return}
  localStorage.setItem('session',JSON.stringify({name:user.name,email:user.email}));
  location.href='dashboard.html';
});
