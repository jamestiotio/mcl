function getValue(name) { return document.getElementsByName(name)[0].value }
function setValue(name, val) { document.getElementsByName(name)[0].value = val }
function getText(name) { return document.getElementsByName(name)[0].innerText }
function setText(name, val) { document.getElementsByName(name)[0].innerText = val }

she.init(function() { setText('status', 'ok')})

function putSecretKey(x, msg = "") {
	console.log(msg + ' sk=' + Uint8ArrayToHexString(sheSecretKeySerialize(x)))
}
function putPublicKey(x, msg = "") {
	console.log(msg + ' pk=' + Uint8ArrayToHexString(shePublicKeySerialize(x)))
}
function putCipherTextG1(x, msg = "") {
	console.log(msg + ' ctG1=' + Uint8ArrayToHexString(sheCipherTextG1Serialize(x)))
}
function putCipherTextG2(x, msg = "") {
	console.log(msg + ' ctG2=' + Uint8ArrayToHexString(sheCipherTextG2Serialize(x)))
}
function putCipherTextGT(x, msg = "") {
	console.log(msg + ' ctGT=' + Uint8ArrayToHexString(sheCipherTextGTSerialize(x)))
}

function bench(label, count, func) {
	let start = Date.now()
	for (let i = 0; i < count; i++) {
		func()
	}
	let end = Date.now()
	let t = (end - start) / count
	setText(label, t)
}

function benchPairing() {
//	bench('time_pairing', 50, () => mclBn_pairing(e, P, Q))
}

function onClickBenchmark() {
}

function onClickTestSHE() {
	try {
		let sec = sheSecretKey_malloc()
		let pub = shePublicKey_malloc()
		let c11 = sheCipherTextG1_malloc()
		let c12 = sheCipherTextG1_malloc()
		let c21 = sheCipherTextG2_malloc()
		let c22 = sheCipherTextG2_malloc()
		let ct = sheCipherTextGT_malloc()

		sheSecretKeySetByCSPRNG(sec)
		setText('secretKey', Uint8ArrayToHexString(sheSecretKeySerialize(sec)))
		sheGetPublicKey(pub, sec)
		setText('publicKey', Uint8ArrayToHexString(shePublicKeySerialize(pub)))
		putPublicKey(pub)

		let m1 = getValue('msg1')
		let m2 = getValue('msg2')
		let m3 = getValue('msg3')
		let m4 = getValue('msg4')
		sheEnc32G1(c11, pub, m1)
		sheEnc32G1(c12, pub, m2)
		sheEnc32G2(c21, pub, m3)
		sheEnc32G2(c22, pub, m4)
		setText('encG11', Uint8ArrayToHexString(sheCipherTextG1Serialize(c11)))
		setText('encG12', Uint8ArrayToHexString(sheCipherTextG1Serialize(c12)))
		setText('encG21', Uint8ArrayToHexString(sheCipherTextG2Serialize(c21)))
		setText('encG22', Uint8ArrayToHexString(sheCipherTextG2Serialize(c22)))
		sheAddG1(c11, c11, c12)
		sheAddG2(c21, c21, c22)
		sheMul(ct, c11, c21)
		setText('encGT', Uint8ArrayToHexString(sheCipherTextGTSerialize(ct)))
		let d = sheDecGT(sec, ct)
		setText('decMsg', d)

		she_free(ct)
		she_free(c22)
		she_free(c21)
		she_free(c12)
		she_free(c11)
		she_free(pub)
		she_free(sec)
	} catch (e) {
		console.log('exception ' + e)
	}
}

function Uint8ArrayToHexString(a) {
	let s = ''
	for (let i = 0; i < a.length; i++) {
		s += ('0' + a[i].toString(16)).slice(-2)
	}
	return s
}

function HexStringToUint8Array(s) {
	let a = new Uint8Array(s.length / 2)
	for (let i = 0; i < s.length / 2; i++) {
		a[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16)
	}
	return a
}

