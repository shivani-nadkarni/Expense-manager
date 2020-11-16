const baseUrl = 'http://localhost:8099/expenses';

function getBaseUrl() {
    return baseUrl;
}

// this fetches the expense list using the api call
function getExpList(callBack) {
    fetch(baseUrl)
    .then(response => response.json())
    .then(data => {
        if(data) {
            console.log("Data received: " + JSON.stringify(data));
            callBack(data.expenses);
        } else {
            console.log("No data");
    }
    });
}

function delExp(id, callBack) {
    const body = {
        _id: id
    };
    fetch(baseUrl, {method:'delete', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify(body)})
    .then(response => response.json())
    .then(data => {
        console.log("Data " + JSON.stringify(data));
        callBack();
    })
    .catch(err => {
        console.log("Err " + err);
    });
}

function editExp(id, exp, callBack) {
    fetch(baseUrl+'/'+id, {method:'PUT', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify(exp)})
    .then(response => response.json())
    .then(data => {
        console.log("Data " + JSON.stringify(data));
        callBack();
    })
    .catch(err => {
        console.log("Err " + err);
    });
}


function addExp(data, callBack) {
    $.ajax({
        url:baseUrl,
        method: "POST",
        data: data,
        success: function(res, status) {
            if(status === "success") {
                callBack("Expense Added successfully");
            } else {
                callBack("Expense not added this time.");
            }

        }, 
        error: function(err) {
            callBack("Expense not added " + err);
        }
    });
}