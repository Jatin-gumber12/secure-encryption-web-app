// ====================== HELPERS ======================

const mod = (n, m) => ((n % m) + m) % m;

// ====================== ADDITIVE (CAESAR) ======================

function additiveEncrypt(text, key) {
    return text.toUpperCase().replace(/[A-Z]/g, c =>
        String.fromCharCode((c.charCodeAt(0) - 65 + Number(key)) % 26 + 65)
    );
}

function additiveDecrypt(text, key) {
    return additiveEncrypt(text, 26 - key);
}

// ====================== MULTIPLICATIVE ======================

function multiplicativeEncrypt(text, key) {
    return text.toUpperCase().replace(/[A-Z]/g, c =>
        String.fromCharCode(( (c.charCodeAt(0)-65) * key ) % 26 + 65)
    );
}

function multiplicativeDecrypt(text, key) {
    for(let i=1;i<26;i++){
        if((key*i)%26===1){
            return multiplicativeEncrypt(text, i);
        }
    }
}

// ====================== AFFINE ======================

function affineEncrypt(text, a, b){
    return text.toUpperCase().replace(/[A-Z]/g,c =>
        String.fromCharCode((a*(c.charCodeAt(0)-65)+b)%26+65)
    );
}

function affineDecrypt(text,a,b){
    let a_inv;
    for(let i=1;i<26;i++){
        if((a*i)%26===1) a_inv=i;
    }
    return text.toUpperCase().replace(/[A-Z]/g,c =>
        String.fromCharCode(mod(a_inv*((c.charCodeAt(0)-65)-b),26)+65)
    );
}

// ====================== VIGENERE ======================

function vigenereEncrypt(text,key){
    key=key.toUpperCase();
    let j=0;
    return text.toUpperCase().replace(/[A-Z]/g,c=>{
        let res=(c.charCodeAt(0)-65 + key[j++%key.length].charCodeAt(0)-65)%26;
        return String.fromCharCode(res+65);
    });
}

function vigenereDecrypt(text,key){
    key=key.toUpperCase();
    let j=0;
    return text.toUpperCase().replace(/[A-Z]/g,c=>{
        let res=(c.charCodeAt(0)-65 - (key[j++%key.length].charCodeAt(0)-65) +26)%26;
        return String.fromCharCode(res+65);
    });
}

// ====================== PLAYFAIR ======================

function generatePlayfairMatrix(key){
    key=key.toUpperCase().replace(/J/g,"I");
    let alphabet="ABCDEFGHIKLMNOPQRSTUVWXYZ";
    let seen=new Set();
    let matrix=[];
    for(let ch of key+alphabet){
        if(!seen.has(ch)){
            seen.add(ch);
            matrix.push(ch);
        }
    }
    return matrix;
}

function playfairEncrypt(text,key){
    let m=generatePlayfairMatrix(key);
    text=text.toUpperCase().replace(/J/g,"I").replace(/[^A-Z]/g,"");
    let res="";
    for(let i=0;i<text.length;i+=2){
        let a=text[i], b=text[i+1]||"X";
        if(a===b) b="X";
        let pa=m.indexOf(a), pb=m.indexOf(b);
        let r1=Math.floor(pa/5), c1=pa%5;
        let r2=Math.floor(pb/5), c2=pb%5;

        if(r1===r2){
            res+=m[r1*5+(c1+1)%5]+m[r2*5+(c2+1)%5];
        } else if(c1===c2){
            res+=m[((r1+1)%5)*5+c1]+m[((r2+1)%5)*5+c2];
        } else{
            res+=m[r1*5+c2]+m[r2*5+c1];
        }
    }
    return res;
}

// ====================== HILL (2x2) ======================

function hillEncrypt(text,key){
    text=text.toUpperCase().replace(/[^A-Z]/g,"");
    if(text.length%2!==0) text+="X";

    let k=key.split(",").map(Number); // "3,3,2,5"
    let res="";

    for(let i=0;i<text.length;i+=2){
        let x=text.charCodeAt(i)-65;
        let y=text.charCodeAt(i+1)-65;
        let c1=(k[0]*x+k[1]*y)%26;
        let c2=(k[2]*x+k[3]*y)%26;
        res+=String.fromCharCode(c1+65)+String.fromCharCode(c2+65);
    }
    return res;
}

// ====================== KEYLESS TRANSPOSITION ======================

function keylessEncrypt(text){
    let even="", odd="";
    for(let i=0;i<text.length;i++){
        i%2===0 ? even+=text[i] : odd+=text[i];
    }
    return even+odd;
}

function keylessDecrypt(text){
    let mid=Math.ceil(text.length/2);
    let even=text.slice(0,mid);
    let odd=text.slice(mid);
    let res="";
    for(let i=0;i<mid;i++){
        if(even[i]) res+=even[i];
        if(odd[i]) res+=odd[i];
    }
    return res;
}

// ====================== KEYED TRANSPOSITION ======================

function keyedEncrypt(text,key){
    let cols=key.length;
    let rows=Math.ceil(text.length/cols);
    let matrix=Array.from({length:rows},()=>Array(cols).fill("X"));

    let k=0;
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(k<text.length) matrix[i][j]=text[k++];
        }
    }

    let order=[...key].map((c,i)=>({c,i}))
        .sort((a,b)=>a.c.localeCompare(b.c));

    let res="";
    for(let o of order){
        for(let i=0;i<rows;i++){
            res+=matrix[i][o.i];
        }
    }
    return res;
}

// ====================== MAIN HANDLER ======================

exports.encrypt = (text,key,type)=>{

    switch(type){

        case "ADDITIVE": return additiveEncrypt(text,key);
        case "MULTIPLICATIVE": return multiplicativeEncrypt(text,key);
        case "AFFINE": 
            let [a,b]=key.split(",");
            return affineEncrypt(text,Number(a),Number(b));

        case "VIGENERE": return vigenereEncrypt(text,key);
        case "PLAYFAIR": return playfairEncrypt(text,key);
        case "HILL": return hillEncrypt(text,key);

        case "KEYLESS": return keylessEncrypt(text);
        case "KEYED": return keyedEncrypt(text,key);

        default: return "Invalid cipher type";
    }
};

exports.decrypt = (text,key,type)=>{

    switch(type){

        case "ADDITIVE": return additiveDecrypt(text,key);
        case "MULTIPLICATIVE": return multiplicativeDecrypt(text,key);
        case "AFFINE":
            let [a,b]=key.split(",");
            return affineDecrypt(text,Number(a),Number(b));

        case "VIGENERE": return vigenereDecrypt(text,key);

        case "KEYLESS": return keylessDecrypt(text);

        default: return "Decryption not implemented for this type";
    }
};
