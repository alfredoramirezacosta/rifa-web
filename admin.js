// =============================
// LOGIN ADMIN
// =============================
function login(){

 let clave = document.getElementById("clave").value;

 if(clave === "rifa2026"){
     document.getElementById("panel").style.display="block";
     cargarParticipantes();
     escucharEstado();
 }else{
     alert("Contraseña incorrecta");
 }

}


// =============================const firebaseConfig={
apiKey:"AIzaSyCqVZwBX96EHfl3k__iqyc7rF1MZmSVpRI",
authDomain:"rifa-web-2b2f3.firebaseapp.com",
projectId:"rifa-web-2b2f3"
};

firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();

const tabla=document.getElementById("lista");

db.collection("participantes")
.onSnapshot(snapshot=>{

tabla.innerHTML="";

snapshot.forEach(doc=>{

let d=doc.data();

tabla.innerHTML+=`
<tr>
<td>${d.nombre}</td>
<td>#${d.numero}</td>
</tr>`;
});

});

function elegirGanador(){

db.collection("participantes").get()
.then(snapshot=>{

let participantes=[];

snapshot.forEach(doc=>{
participantes.push(doc.data());
});

if(participantes.length===0){
alert("Sin participantes");
return;
}

let ganador=
participantes[Math.floor(Math.random()*participantes.length)];

db.collection("config")
.doc("ganador")
.set(ganador);

document.getElementById("ganador").innerHTML=
`🏆 ${ganador.nombre} - #${ganador.numero}`;

});
}


function resetearRifa(){

if(!confirm("¿Resetear rifa?")) return;

db.collection("participantes")
.get()
.then(snapshot=>{

let batch=db.batch();

snapshot.forEach(doc=>{
batch.delete(doc.ref);
});

return batch.commit();
})
.then(()=>{
return db.collection("config")
.doc("ganador")
.delete();
});

}
// CARGAR PARTICIPANTES EN VIVO
// =============================
function cargarParticipantes(){

 db.collection("participantes")
 .orderBy("numero")
 .onSnapshot((snapshot)=>{

   let tabla = document.getElementById("lista");
   tabla.innerHTML="";

   snapshot.forEach(doc=>{

     let data = doc.data();

     tabla.innerHTML += `
       <tr>
         <td>${data.nombre}</td>
         <td>${data.telefono}</td>
         <td>#${data.numero}</td>
       </tr>
     `;
   });

 });

}


// =============================
// ELEGIR GANADOR 🎰
// =============================
async function elegirGanador(){

 let confirmacion = confirm("¿Elegir ganador?");
 if(!confirmacion) return;

 let snapshot = await db.collection("participantes").get();

 if(snapshot.empty){
     alert("No hay participantes");
     return;
 }

 let participantes=[];

 snapshot.forEach(doc=>{
     participantes.push(doc.data());
 });

 // ganador aleatorio real
 let random =
 participantes[Math.floor(Math.random()*participantes.length)];

 // guardar ganador en Firebase
 await db.collection("config")
 .doc("ganador")
 .set({
     nombre: random.nombre,
     telefono: random.telefono,
     numero: random.numero,
     fecha: new Date()
 });

 alert("✅ Ganador elegido: #" + random.numero);
}


// =============================
// RESET RIFA
// =============================
async function resetearRifa(){

 let ok = confirm("⚠️ Esto borrará TODA la rifa");
 if(!ok) return;

 let snapshot =
 await db.collection("participantes").get();

 let batch = db.batch();

 snapshot.forEach(doc=>{
     batch.delete(doc.ref);
 });

 batch.delete(
   db.collection("config").doc("ganador")
 );

 await batch.commit();

 alert("✅ Rifa reiniciada");
}


// =============================
// BLOQUEAR / DESBLOQUEAR
// =============================
async function toggleRegistro(){

 let ref = db.collection("config")
 .doc("estado");

 let doc = await ref.get();

 let bloqueado=false;

 if(doc.exists){
     bloqueado = doc.data().bloqueado;
 }

 await ref.set({
     bloqueado: !bloqueado
 });

 alert(!bloqueado
   ? "🚫 Registros bloqueados"
   : "✅ Registros abiertos");
}


// =============================
// ESCUCHAR ESTADO EN VIVO
// =============================
function escucharEstado(){

 db.collection("config")
 .doc("estado")
 .onSnapshot((doc)=>{

   if(!doc.exists) return;

   let bloqueado = doc.data().bloqueado;

   let btn=document.getElementById("estadoBtn");

   if(btn){
       btn.innerText =
         bloqueado
         ? "🔓 Abrir registros"
         : "🚫 Bloquear registros";
   }

 });

}
