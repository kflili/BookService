﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using BookService.Models;

namespace BookService.Controllers
{
    public class BooksController : ApiController
    {
        private BookServiceContext db = new BookServiceContext();

        // GET: api/Books
        public IQueryable<BookDTO> GetBooks()
        {
            var books = from b in db.Books
                        select new BookDTO
                        {
                            Id = b.Id,
                            Title = b.Title,
                            AuthorName = b.Author.Name
                        };
            return books;
        }

        // GET: api/Books/5
        [ResponseType(typeof(BookDetailDTO))]
        public async Task<IHttpActionResult> GetBook(int id)
        {
            var book = await db.Books//.Include(b => b.Author)  like above GetBooks, even include not use, ef will use join under the hood
                                .Select(b => new BookDetailDTO
                                {
                                    Id = b.Id,
                                    Title = b.Title,
                                    Year = b.Year,
                                    Price = b.Price,
                                    Genre = b.Genre,
                                    AuthorName = b.Author.Name
                                })
                                .SingleAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // PUT: api/Books/5
        [ResponseType(typeof(BookDetailDTO))]
        public async Task<IHttpActionResult> PutBook([FromUri] int id, [FromBody] Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != book.Id)
            {
                return BadRequest();
            }

            db.Entry(book).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            db.Entry(book).Reference(x => x.Author).Load();
            var dto = new BookDetailDTO
            {
                Id = book.Id,
                Title = book.Title,
                Year = book.Year,
                Price = book.Price,
                Genre = book.Genre,
                AuthorName = book.Author.Name
            };

            return CreatedAtRoute("DefaultApi", new { id = book.Id }, dto);

            //return StatusCode(HttpStatusCode.NoContent);

        }

        // POST: api/Books
        [ResponseType(typeof(BookDTO))]
        public async Task<IHttpActionResult> PostBook(Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Books.Add(book);
            await db.SaveChangesAsync();

            // New code:
            // Load author name
            db.Entry(book).Reference(x => x.Author).Load();

            var dto = new BookDTO()
            {
                Id = book.Id,
                Title = book.Title,
                AuthorName = book.Author.Name
            };

            return CreatedAtRoute("DefaultApi", new { id = book.Id }, dto);
        }

        // DELETE: api/Books/5
        [ResponseType(typeof(Book))]
        public async Task<IHttpActionResult> DeleteBook(int id)
        {
            Book book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            db.Books.Remove(book);
            await db.SaveChangesAsync();

            return Ok(book);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BookExists(int id)
        {
            return db.Books.Count(e => e.Id == id) > 0;
        }
    }
}