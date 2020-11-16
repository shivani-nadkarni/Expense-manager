// function validateUn() {
//     let isValid = true;
//     var un = document.getElementById("username").value;
//     if(un) {
//         un = un.trim();
//         if(un.length < 5) {
//             isValid = false;
//         } 
//     } else {
//         isValid = false;
//     }
//     if(isValid) {
//         document.getElementById("un_msg").innerText = "";
//     } else {
//         document.getElementById("un_msg").innerText = "**";
//     }
// }

function validateNull(value, callback) {
    let isValid = true;
    if(value === undefined || value === null || value === "") {
        isValid = false;
    } 
    callback(isValid);
}

// function validateEamil(value){
//     let isValid = true;
//     // logic
//     return isValid;
// }
