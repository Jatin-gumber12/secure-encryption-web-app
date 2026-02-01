const API="http://localhost:3000";

const plainText=document.getElementById("plainText");
const cipherText=document.getElementById("cipherText");
const keyInput=document.getElementById("key");
const algo=document.getElementById("algorithm");
const visual=document.getElementById("visual");
const theory=document.getElementById("theory");

// ---------------- Tabs ----------------

function openTab(tab){
  document.querySelectorAll(".tab-content").forEach(t=>t.style.display="none");
  document.getElementById(tab).style.display="block";
}

openTab("visual");

// ---------------- Encrypt ----------------

async function encrypt(){
 const res=await fetch(API+"/encrypt",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
   text:plainText.value,
   key:keyInput.value,
   cipherType:algo.value
  })
 });
 const data=await res.json();
 cipherText.value=data.cipherText;
 visualizeEncrypt();
 loadTheory();
}

// ---------------- Decrypt ----------------

async function decrypt(){
 const res=await fetch(API+"/decrypt",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
   cipherText:cipherText.value,
   key:keyInput.value,
   cipherType:algo.value
  })
 });
 const data=await res.json();
 plainText.value=data.plainText;
 visualizeDecrypt();
}

// ---------------- Animated Visualization ----------------

function visualizeEncrypt(){

 let text=plainText.value.toUpperCase();
 let key=keyInput.value;

 let html=`<div class='step'>Plain: <span class='highlight'>${text}</span></div>`;

 if(algo.value==="ADDITIVE"){
   html+=`<div class='step'>Shift by ${key}</div>`;
 }

 if(algo.value==="KEYLESS"){
   let even="",odd="";
   for(let i=0;i<text.length;i++){
    i%2===0?even+=text[i]:odd+=text[i];
   }

   html+=`
   <div class='step'>Even: ${even}</div>
   <div class='step'>Odd: ${odd}</div>
   <div class='step highlight'>Cipher: ${even+odd}</div>`;
 }

 if(algo.value==="KEYED"){
   html+=`
   <div class='step'>Arranged in Matrix:</div>
   <table><tr><td>${text[0]||""}</td><td>${text[1]||""}</td></tr>
   <tr><td>${text[2]||""}</td><td>${text[3]||""}</td></tr></table>`;
 }

 if(algo.value==="VIGENERE"){
   let exp="";
   for(let i=0;i<text.length;i++) exp+=key[i%key.length];
   html+=`
   <div class='step'>Key Expanded: ${exp}</div>`;
 }

 html+=`<div class='step highlight'>Cipher: ${cipherText.value}</div>`;

 visual.innerHTML=html;
}

// ---------------- Decryption Visualization ----------------

function visualizeDecrypt(){
 visual.innerHTML=
 `<div class='step'>Cipher: <span class='highlight'>${cipherText.value}</span></div>
  <div class='step'>Reverse operations applied</div>
  <div class='step highlight'>Plain: ${plainText.value}</div>`;
}

// ---------------- Theory Tab ----------------

function loadTheory(){

 const map={
  ADDITIVE:"Shifts letters by fixed number.",
  MULTIPLICATIVE:"Multiplies letter positions modulo 26.",
  AFFINE:"Uses (a×x + b) mod 26 formula.",
  VIGENERE:"Uses repeating keyword shifts.",
  PLAYFAIR:"Encrypts digraphs using 5x5 matrix.",
  HILL:"Uses matrix multiplication.",
  KEYLESS:"Splits even & odd positions.",
  KEYED:"Columnar transposition with key."
 };

 theory.innerText=map[algo.value];
}
