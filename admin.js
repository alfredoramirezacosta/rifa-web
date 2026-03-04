const firebaseConfig={
apiKey:"AIzaSyCqVZwBX96EHfl3k__iqyc7rF1MZmSVpRI",
authDomain:"rifa-web-2b2f3.firebaseapp.com",
projectId:"rifa-web-2b2f3"
};

firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();

const tabla=document.getElementById("lista");
const ganadorHTML=document.getElementById("ganador");


// =================
// PARTICIPANTES LIVE
// =================
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
</tr>
`;

});

});


// =================
// ELEGIR GANADOR
// =================
async function elegirGanador(){

let snap=
await db.collection("participantes").get();

if(snap.empty){
alert("No hay participantes");
return;
}

let lista=[];

snap.forEach(doc=>{
lista.push(doc.data());
});

let ganador=
lista[Math.floor(Math.random()*lista.length)];

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


// =================
// RESET RIFA
// =================
async function resetearRifa(){

if(!confirm("⚠️ Se borrará toda la rifa")) return;

let snap=
await db.collection("participantes").get();

let batch=db.batch();

snap.forEach(doc=>{
batch.delete(doc.ref);
});

batch.delete(
db.collection("config").doc("ganador")
);

await batch.commit();

ganadorHTML.innerHTML="";

alert("✅ Rifa reiniciada");

}
