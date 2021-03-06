function displayBook(jsonBook){
    var html = htmlifyBook(jsonBook);
    document.getElementById("bookResults").innerHTML = html;
}

function displayAuthorArray(jsonAuthorArray){
    var table = $('#authorTable');

    jsonAuthorArray.forEach((jsonAuthor) => {
        jsonAuthor.numbooks = jsonAuthor.books.length;
    });

    table.DataTable({
        "data": jsonAuthorArray,
        "columns" :[
            {"data" : "id"},
            {"data" : "name"},
            {"data" : "numbooks"}
        ]
    });
}

function submitAuthorId() {
    var authorId = document.forms.authorForm[0].value;
    var url = '/api/authors/' + authorId;
    getJson(url, displayBook);
}

function getBookList(){
    var url = '/api/authors';
    getJson(url, displayAuthorArray);
}

window .onload = () => {
    getBookList();
};

