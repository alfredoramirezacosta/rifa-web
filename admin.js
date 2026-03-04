// ==========================
// FIREBASE CONFIG
// ==========================
const firebaseConfig={
apiKey:"AIzaSyCqVZwBX96EHfl3k__iqyc7rF1MZmSVpRI",
authDomain:"rifa-web-2b2f3.firebaseapp.com",
projectId:"rifa-web-2b2f3",
storageBucket:"rifa-web-2b2f3.firebasestorage.app",
messagingSenderId:"440243321091",
appId:"1:440243321091:web:3a6a0a27e4e418cf6b9136"
};

firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();

const tabla=document.getElementById("lista");
const ganadorHTML=document.getElementById("ganador");


// ==========================
// PARTICIPANTES EN VIVO
// ==========================
db.collection("participantes")
.orderBy("numero")
.onSnapshot(snapshot=>{

tabla.innerHTML="";

snapshot.forEach(doc=>{

let d=doc.data();

tabla.innerHTML+=`
<tr>
<td>${d.nombre}</td>
<td>#${d.numero}</td>
<td>
<button class="eliminar"
onclick="eliminarNumero('${doc.id}')">
❌
</button>
</td>
</tr>
`;

});

});


// ==========================
// ELIMINAR NUMERO
// ==========================
async function eliminarNumero(id){

let ok=confirm("¿Eliminar participante?");
if(!ok) return;

await db.collection("participantes")
.doc(id)
.delete();

}


// ==========================
// ELEGIR GANADOR
// ==========================
async function elegirGanador(){

let snapshot=
await db.collection("participantes").get();

if(snapshot.empty){
alert("No hay participantes");
return;
}

let participantes=[];

snapshot.forEach(doc=>{
participantes.push(doc.data());
});

let ganador=
participantes[
Math.floor(Math.random()*participantes.length)
];

await db.collection("config")
.doc("ganador")
.set({
nombre:ganador.nombre,
numero:ganador.numero,
fecha:new Date()
});

ganadorHTML.innerHTML=
`🏆 ${ganador.nombre} - #${ganador.numero}`;

}


// ==========================
// RESET RIFA
// ==========================
async function resetearRifa(){

let confirmar=
confirm("⚠️ Se borrará TODA la rifa");

if(!confirmar) return;

let snapshot=
await db.collection("participantes").get();

let batch=db.batch();

snapshot.forEach(doc=>{
batch.delete(doc.ref);
});

batch.delete(
db.collection("config").doc("ganador")
);

await batch.commit();

ganadorHTML.innerHTML="";

alert("✅ Rifa reiniciada");

}
