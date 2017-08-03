# Tiny Bookshelf

This demo project "Tiny Bookshelf" is a single-page application 
(SPA) created with ASP.NET Web API 2 and Entity Framework 6. 
One can browse the lists of books and authors, check the book 
details, and perform CRUD operation on the books and authors. 
All the operations can be done in a single HTML page and then 
updates the page dynamically, instead of loading new pages. 
After the initial page load, the app talks with the server 
through AJAX and update the UI with the returned JSON data.

### Achievement

- Created the HTML page by using ASP.NET MV
- Designed the responsive UI with Bootstrap and jQuery
- Used Entity Framework to work with SQL server database
- Used ASP.NET Web API to handle the AJAX requests and return JSON data
- Implemented the data-binding by using Knockout.js 

### Technologies

- ASP.NET MVC 5 and Web API 2
- Entity framework 6
- HTML5, CSS3, JavaScript, Bootstrap, Knockout.js
- Version control with Git in development
- Deployment to Azure Web Service

### Tools

- Visual Studio 2017
- SQL Express LocalDB
- IIS express
- NuGet Package Manager
- Windows Azure platform


### Installation instructions

Requirements:

- Visual Studio 2017
- SQL Server Express LocalDB (to run locally)

To run the sample locally from Visual Studio:
- Download the source code and open the solution file in Visual 
Studio
- Build the solution.
- Open the Package Manager Console (Tools > NuGet Package 
Manager > Package Manager Console)
- In the Package Manager Console window, enter the following 
command: Update-Database
- Press F5 to debug

Part of this project was developed by following the [Using Web API 2 with Entity Framework 6](https://docs.microsoft.com/en-us/aspnet/web-api/overview/data/using-web-api-with-entity-framework/) tutorial. The operation for editting/deleting book, and adding/listing/deleting authors are implemented by myself. The tutorial only has instructions for showing book and adding book functions. 
