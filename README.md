# Library Management System API

### Installation
```
 git clone https://github.com/mirajehossain/library-management.git
 cd library-management
 npm i
```

### Run the project

To run the project `npm start`

url: `http://localhost:8000`


***
     `/api/v1/*` API's are secured, to access those API, uer must have to logged in and  need to add bearer token in authorization header 
### Routes
``` 
- /api/auth
- /api/v1/users
- /api/v1/authors
- /api/v1/books
- /api/v1/book-loans
```

### Endpoints
```
> /api/auth

- [POST] /api/auth/login
- [POST] /api/auth/reister
- [POST] /api/auth/reister-admin

-------------------------------------------------------------
> /api/v1/users

- [GET] /api/v1/users/get-member/{{userId}}
- [POST] /api/v1/users/upload-image/{{userId}}

-------------------------------------------------------------
> /api/v1/authors

- [GET] /api/v1/authors/get-author/{{authorId}}
- [POST] /api/v1/authors/create-author
- [PATCH] /api/v1/authors/update-author/{{authorId}}
- [DELETE] /api/v1/authors/delete-author/{{authorId}}

--------------------------------------------------
> /api/v1/books

- [GET] /api/v1/books
- [GET] /api/v1/books/{{pageNo}}/?authorId={{authorId}}
- [POST] /api/v1/books
- [PATCH] /api/v1/books/{{bookId}}
- [DELETE] /api/v1/books/{{bookId}}


--------------------------------------------------
> /api/v1/book-loans

- [GET] /api/v1/book-loans
- [POST] /api/v1/book-loans/request-book
- [GET] /api/v1/book-loans/request-book/{{userId}}
- [PATCH] /api/v1/book-loans/request-book/{{bookRequestId}}
- [PATCH] /api/v1/book-loans/return-book/{{userId}}/{{bookId}}
- [GET] /api/v1/book-loans/generate-excel
```
```
    Postman link: https://www.getpostman.com/collections/c45e29cb61866252712f
```
##### THANKS
