const base64url = require("base64url");

class JWT {
  #Euclide_extend = (a, n) => {
    let num = n;
    let d;
    let x = 0n,
      y = 0n;
    let x2 = 1n,
      x1 = 0n,
      y2 = 0n,
      y1 = 1n;
    let q, r;

    while (n > 0) {
      q = a / n;
      r = a % n;
      x = x2 - q * x1;
      y = y2 - q * y1;
      a = n;
      n = r;
      x2 = x1;
      x1 = x;
      y2 = y1;
      y1 = y;
    }

    d = a;
    x = x2;
    y = y2;

    return num + x2;
  };
  #modexp = (a, x, n) => {
    let r = 1n;

    while (x > 0n) {
      if (x % 2n === 1n) {
        // x is odd
        r = (r * a) % n;
        x = x - 1n;
      }

      a = (a * a) % n;
      x = x / 2n;
    }

    return r;
  };
  #stringToBigInt = (str) => {
    let result = BigInt(0);
    for (let i = 0; i < str.length; i++) {
      result = result * BigInt(256) + BigInt(str.charCodeAt(i));
    }
    return result;
  };

  // Hàm chuyển đổi số thành chuỗi
  #bigIntToString = (num) => {
    let result = "";
    while (num > BigInt(0)) {
      result = String.fromCharCode(Number(num % BigInt(256))) + result;
      num = num / BigInt(256);
    }
    return result;
  };

  #encrypt = (message, private_key) => {
    message = this.#stringToBigInt(message);
    // console.log(message);
    const coded = [];
    const n = private_key.p * private_key.q;
    while (message > 0n) {
      const tmp = message % n;
      message = (message - tmp) / n;
      const code = this.#modexp(tmp, private_key.a, n);
      coded.push(code);
    }
    const encryptText = coded.reduce(
      (accumulator, currentValue) => accumulator * n + currentValue,
      0n
    );
    // console.log(encryptText);
    // console.log(this.#stringToBigInt(base64url.decode(base64url.encode(this.#bigIntToString(encryptText)))))
    return base64url.encode(this.#bigIntToString(encryptText));
  };

  #decrypt = (encrpyted_text,public_key) => {
    let num = this.#stringToBigInt(base64url.decode(encrpyted_text));
    const text = [];
    while (num > 0n) {
      const tmp = num % public_key.n;
      num = (num - tmp) / public_key.n;
      const code = this.#modexp(tmp, public_key.b, public_key.n);
      text.push(code);
    }
    const decryptText = text.reduce(
      (accumulator, currentValue) =>
        accumulator * public_key.n + currentValue,
      0n
    );
    return this.#bigIntToString(decryptText);
  };
  #calFi = (privateKey)=>{
    return  (privateKey.p - 1n)* (privateKey.q - 1n);
  }

  calPublicKey = (privateKey) => {  
    const fi = this.#calFi(privateKey);
    const public_key = {
      n: privateKey.p * privateKey.q,
      b: this.#Euclide_extend(privateKey.a,fi)
    }
    return public_key;
  }

  sign = ({ data, exp }, private_key, {algorithm}) => {
    if (typeof data == !"string") {
      data = JSON.stringify(data);
    }
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      data: data,
      exp: exp,
    };

    const header = {
      alg: algorithm,
      typ: "JWT",
    };
    const payload_base64 = base64url.encode(JSON.stringify(payload));
    const header_base64 = base64url.encode(JSON.stringify(header));
    const signature = this.#encrypt([header_base64, payload_base64].join("."), private_key);
    return [header_base64, payload_base64, signature].join(".");
  };
  verify = (token, publicKey, calback) => {
    try {
      const [header_base64,payload_base64, signature] = token.split('.');
      const header = base64url.decode(header_base64);
      const payload = base64url.decode(payload_base64);
      const decrpyted_text = this.#decrypt(signature,publicKey);
      const [header_decrpyted, payload_decrypted] = decrpyted_text.split('.').map((text) => base64url.decode(text));
      
      // console.log(payload_decrypted);

      const payload_object = JSON.parse(payload_decrypted);

      
      if(payload_object.exp < Math.floor(Date.now() / 1000)){
        return calback("Token expired",null);
      }
  
      if(payload_decrypted.localeCompare(payload)!= 0 || header_decrpyted.localeCompare(header)!= 0 ){
        return calback("Token invalid",null);
      }
  
      calback(null,payload_object);
      
    } catch (error) {
      calback(error,null);
    }
  };
}

const main = () => {
  const user = {
    _id: { $oid: "655c253ff5ffabebf1d423e5" },
    username: "usertest",
    email: "usertest@gmail.com",
    password: "$2b$10$tn8xw0IIBLUolV9NYlL5ruWa9VidbhV9W5tiB5MQ7xRP73XhVdFPC",
    type: "user",
    listNote: [],
  };
  const jwt = new JWT();
  const accessPrivateKey = {
    p: 162259276829213363391578010288127n,
      q: 6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057151n,
      a: 460323248667026721879499876121n,
  }
  const accessPublicKey = jwt.calPublicKey(accessPrivateKey);
  // console.log(token);
  const token = jwt.sign(
    
			{
				exp: Math.floor(Date.now() / 1000) + (10), //second
				data: user
			},
			accessPrivateKey,
			{
				algorithm: "RS256"
			}
  )
  jwt.verify(token,accessPublicKey,(err,payload) => {
    if(err)
      console.error(err);
    else
      console.log(payload);
  });
};

// main();
module.exports = new JWT();

