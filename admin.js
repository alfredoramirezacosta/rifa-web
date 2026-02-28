function login(){

 let clave = document.getElementById("clave").value;

 if(clave === "rifa2026"){
     document.getElementById("panel").style.display="block";
 }else{
     alert("Contraseña incorrecta");
 }

}
