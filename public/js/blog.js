function addBlog() {
    var response = "";

    var jsonData = new Object();
    jsonData.title = document.getElementById("title").value;
    jsonData.content = document.getElementById("content").value;
    jsonData.author = document.getElementById("author").value;

    if (jsonData.title == "" || jsonData.content == "" || jsonData.author == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();

    request.open("POST", "/add-blog", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response)
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Blog: ' + jsonData.title + ' posted!';
            document.getElementById("message").setAttribute("class", "text-success");

            document.getElementById("title").value = "";
            document.getElementById("content").value = "";
            document.getElementById("author").value = "";

            // Skip redirect during Cypress tests
            if (!window.Cypress) {
                window.location.href = 'index.html';
            }
        }
        else {
            document.getElementById("message").innerHTML = 'Unable to post Blog!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify(jsonData));
}

function viewBlogs() {
    var response = '';
    var request = new XMLHttpRequest();

    request.open('GET', '/view-resources', true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        
        var html = ''
        for (var i = 0; i < response.length; i++)
        {
            html += '<tr>' +
                '<td>' + (i+1) + '</td>' +
                '<td>' + response[i].title + '</td>' +
                '<td>' + response[i].content + '</td>' +
                '<td>' + response[i].author + '</td>' +
            '</tr>'
        }

        document.getElementById('tableContent').innerHTML = html;
    };

    request.send();
}
