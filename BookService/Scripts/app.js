var ViewModel = function () {
    var self = this;
    self.books = ko.observableArray();
    self.error = ko.observable();
    var booksUri = '/api/books/';

    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });
    }

    function getAllBooks() {
        ajaxHelper(booksUri, 'GET').done(function (data) {
            self.books(data);
        });
    }

    // Fetch the initial data.
    getAllBooks();

    // set detail binding for getBook detail
    self.detail = ko.observable();
    // poll the data for showing detail
    self.getBookDetail = function (item) {
        // close any edit window when show details window
        self.closeEditWindow();
        ajaxHelper(booksUri + item.Id, 'GET').done(function (data) {
            self.detail(data);
        });
    }

    // close detail window
    self.closeDetailWindow = function (item) {
        self.detail('');
    }

    // set edit binding
    self.editableBook = {
        Id: ko.observable(),
        Author: ko.observable(),
        Genre: ko.observable(),
        Price: ko.observable(),
        Title: ko.observable(),
        Year: ko.observable()
    }

    // poll the data for showing in editbook window
    self.editBook = function (item) {
        $('#bookEditModal').modal();
        ajaxHelper(booksUri + item.Id, 'GET').done(function (data) {
            self.editableBook.Id(data.Id);
            self.editableBook.Genre(data.Genre);
            self.editableBook.Price(data.Price);
            self.editableBook.Title(data.Title);
            self.editableBook.Year(data.Year);
            self.editableBook.Author(findAuthorId(data.AuthorName));
        });
    }
    function findAuthorId(authorName) {
        var i;
        for (i = 0; i < self.authors().length; i++) {
            if (self.authors()[i].Name == authorName) {
                return self.authors()[i].Id;
            }
        }
    }
    // save book in database, close editbook window and open bookdetail window
    self.saveUpdate = function (item) {
        var bookId = self.editableBook.Id();
        var bookToSave = {
            Id: self.editableBook.Id(),
            AuthorId: self.editableBook.Author().Id,
            Genre: self.editableBook.Genre(),
            Price: self.editableBook.Price(),
            Title: self.editableBook.Title(),
            Year: self.editableBook.Year()
        };
        ajaxHelper(booksUri + bookId, 'PUT', bookToSave).done(function (data) {
            $('#bookEditModal').modal('hide');
            self.detail(data);
            self.books('');
            getAllBooks();
            $('#alertModal').modal();
        });
    }

    self.editWindow = ko.observable(false);
    // open editbook window
    self.openEditWindow = function (item) {
        self.editWindow(true);
    }
    // close edit window
    self.closeEditWindow = function (item) {
        self.editWindow(false);
    }

    // deleteBook
    self.deleteBook = function (item) {
        ajaxHelper(booksUri + item.Id, 'DELETE').done(function (data) {
            if ((self.detail() != null) && self.detail().Id == item.Id) {
                self.detail('');
                self.closeEditWindow();
            }
            // refresh book list
            self.books('');
            getAllBooks();
        });
    }

    // binding for add new book
    self.authors = ko.observableArray();
    self.newBook = {
        Author: ko.observable(),
        Genre: ko.observable(),
        Price: ko.observable(),
        Title: ko.observable(),
        Year: ko.observable()
    }
    var authorsUri = '/api/authors/';
    function getAuthors() {
        ajaxHelper(authorsUri, 'GET').done(function (data) {
            self.authors(data);
        });
    }
    self.addBook = function (formElement) {
        var book = {
            AuthorId: self.newBook.Author().Id,
            Genre: self.newBook.Genre(),
            Price: self.newBook.Price(),
            Title: self.newBook.Title(),
            Year: self.newBook.Year()
        };
        ajaxHelper(booksUri, 'POST', book).done(function (item) {
            self.books.push(item);
        });
    }
    getAuthors();

    // add author
    self.newAuthor = {
        Name: ko.observable()
    }
    self.addAuthor = function (itme) {
        // open author form
        $('#authorAddingModal').modal();
    }
    self.saveAuthor = function (formElement) {
        var author = {
            Name : self.newAuthor.Name()
        };
        ajaxHelper(authorsUri, 'POST', author).done(function (item) {
            self.authors('');
            getAuthors();
            $('#authorAddingModal').modal('hide');
            $('#alertModal').modal();
            self.newAuthor('');
        });
    }

    // delete author
    self.deleteAuthor = function (item) {
        ajaxHelper(authorsUri + item.Id, 'DELETE').done(function (data) {
            self.authors('');
            getAuthors();
        });
    }

    self.listAuthor = function (itme) {
        // open author form
        $('#authordeletingModal').modal();
    }
};

ko.applyBindings(new ViewModel());