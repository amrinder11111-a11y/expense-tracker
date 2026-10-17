const $=id=>document.getElementById(id), get=k=>JSON.parse(localStorage.getItem(k)||'null');
if(get('session'))location.href='dashboard.html';
$('form').addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('name').value.trim(),email=$('email').value.trim().toLowerCase(),pw=$('password').value;
  const err=m=>{$('msg').textContent=m};
  if(!name||!email||!pw)return err('Fill in every field.');
  if(!/^\S+@\S+\.\S+$/.test(email))return err('Enter a valid email address.');
  if(pw.length<6)return err('Password must be at least 6 characters.');
  if(pw!==$('confirm').value)return err('Passwords do not match.');
  const users=get('users')||[];
  if(users.some(u=>u.email===email))return err('This email is already registered. Log in instead.');
  users.push({name,email,pw});
  localStorage.setItem('users',JSON.stringify(users));
  $('msg').className='msg ok';$('msg').textContent='Account created. Taking you to log in...';
  setTimeout(()=>location.href='login.html',900);
});
