const API_URL = "http://localhost:3000";

// ================= ENCRYPT =================

async function encrypt() {

    const text = document.getElementById("plainText").value;
    const key = document.getElementById("key").value;
    const password = document.getElementById("password").value;
    const algorithm = document.getElementById("algorithm").value;

    if (!text || !key || !password) {
        alert("Please fill all fields!");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/encrypt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                key,
                password,
                algorithm
            })
        });

        const data = await response.json();

        document.getElementById("cipherText").value = data.cipherText;

    } catch (error) {
        alert("Backend not connected!");
        console.error(error);
    }
}

// ================= DECRYPT =================

async function decrypt() {

    const cipherText = document.getElementById("cipherText").value;
    const key = document.getElementById("key").value;
    const password = document.getElementById("password").value;
    const algorithm = document.getElementById("algorithm").value;

    if (!cipherText || !key || !password) {
        alert("Please fill all fields!");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/decrypt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cipherText,
                key,
                password,
                algorithm
            })
        });

        const data = await response.json();

        document.getElementById("plainText").value = data.plainText;

    } catch (error) {
        alert("Backend not connected!");
        console.error(error);
    }
}

// ================= VISUALIZATION =================

function visualize() {

    const algorithm = document.getElementById("algorithm").value;

    let steps = "";

    if (algorithm === "AES") {

        steps = 
`1️⃣ Combine Key + Password
2️⃣ Hash using SHA-256 → Secure Key
3️⃣ Generate Random IV
4️⃣ Encrypt using AES-256-CBC
5️⃣ Output Cipher Text (IV : Encrypted Data)`;

    } 
    else if (algorithm === "PRODUCT") {

        steps = 
`1️⃣ Apply Substitution (Caesar Shift)
2️⃣ Rearrange characters (Transposition)
3️⃣ Produce final Cipher Text`;
    }

    document.getElementById("visualSteps").innerText = steps;
}
