function login(){

 let clave = document.getElementById("clave").value;

 if(clave === "rifa2026"){
     document.getElementById("panel").style.display="block";
     cargarParticipantes();
 }else{
     alert("Contraseña incorrecta");
 }

}

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

