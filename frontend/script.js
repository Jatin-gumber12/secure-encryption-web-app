const API_URL = "http://localhost:3000";

const plainText = document.getElementById("plainText");
const cipherText = document.getElementById("cipherText");
const keyInput = document.getElementById("key");
const algorithm = document.getElementById("algorithm");

// ================= ENCRYPT =================

async function encrypt() {

    if (!plainText.value || !algorithm.value) {
        alert("Enter text and choose cipher!");
        return;
    }

    const response = await fetch(API_URL + "/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text: plainText.value,
            key: keyInput.value,
            cipherType: algorithm.value
        })
    });

    const data = await response.json();
    cipherText.value = data.cipherText;
}

// ================= DECRYPT =================

async function decrypt() {

    if (!cipherText.value || !algorithm.value) {
        alert("Enter cipher text!");
        return;
    }

    const response = await fetch(API_URL + "/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cipherText: cipherText.value,
            key: keyInput.value,
            cipherType: algorithm.value
        })
    });

    const data = await response.json();
    plainText.value = data.plainText;
}

function visualize() {

    const text = plainText.value.toUpperCase();
    const key = keyInput.value;
    const type = algorithm.value;

    let steps = "";

    if(!text){
        document.getElementById("visualSteps").innerText = "Enter text first!";
        return;
    }

    switch(type){

        case "ADDITIVE": {

            const shift = Number(key);
            let result = "";

            for(let c of text){
                if(/[A-Z]/.test(c)){
                    result += String.fromCharCode((c.charCodeAt(0)-65+shift)%26+65);
                }
            }

            steps = 
`Plain Text : ${text}
Shift : ${shift}

${text}
↓
${result}`;

            break;
        }

        case "VIGENERE": {

            let expandedKey = "";
            for(let i=0;i<text.length;i++){
                expandedKey += key[i % key.length].toUpperCase();
            }

            let result="";

            for(let i=0;i<text.length;i++){
                let v=(text.charCodeAt(i)-65 + expandedKey.charCodeAt(i)-65)%26;
                result+=String.fromCharCode(v+65);
            }

            steps=
`Plain Text : ${text}
Key : ${expandedKey}

Calculation:
${text}
+ ${expandedKey}
= ${result}`;

            break;
        }

        case "HILL": {

            const k = key.split(",").map(Number);

            if(k.length!==4){
                steps="Enter Hill key as: a,b,c,d";
                break;
            }

            let x=text.charCodeAt(0)-65;
            let y=text.charCodeAt(1)-65;

            let c1=(k[0]*x + k[1]*y)%26;
            let c2=(k[2]*x + k[3]*y)%26;

            steps=
`Plain Pair: ${text.slice(0,2)} → [${x} ${y}]

Key Matrix:
[${k[0]} ${k[1]}]
[${k[2]} ${k[3]}]

Multiply:
(${k[0]}×${x}+${k[1]}×${y}) mod 26 = ${c1}
(${k[2]}×${x}+${k[3]}×${y}) mod 26 = ${c2}

Cipher:
${String.fromCharCode(c1+65)}${String.fromCharCode(c2+65)}`;

            break;
        }

        case "KEYLESS": {

            let even="", odd="";

            for(let i=0;i<text.length;i++){
                i%2===0 ? even+=text[i] : odd+=text[i];
            }

            steps=
`Plain Text: ${text}

Even positions: ${even}
Odd positions: ${odd}

Cipher:
${even+odd}`;

            break;
        }

        case "KEYED": {

            steps=
`Text arranged in matrix
Columns reordered by key alphabet
Read column-wise for cipher`;

            break;
        }

        case "PLAYFAIR":

            steps=
`Create 5×5 matrix using key
Split text into digraphs
Apply Playfair rules`;

            break;

        case "MULTIPLICATIVE":

            steps=
`Each letter position multiplied by key mod 26`;

            break;

        case "AFFINE":

            steps=
`Apply (a × x + b) mod 26 per letter`;

            break;

        default:
            steps="Select cipher type";
    }

    document.getElementById("visualSteps").innerText = steps;
}
