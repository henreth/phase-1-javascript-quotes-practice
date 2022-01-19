const quotesURL = 'http://localhost:3000/quotes?_embed=likes';

document.addEventListener('DOMContentLoaded', ()=>{
    addSort();

    fetchQuotes();
    postQuote();
})

// get quotes from db

function fetchQuotes(){
    return fetch(quotesURL)
    .then( resp => resp.json())
    .then( json => renderQuotes(json))
}

//fetches sorted quotes
function fetchSortedQuotes(){
    const sortedURL = 'http://localhost:3000/quotes?_sort=author?';
    return fetch(sortedURL)
    .then( resp => resp.json())
    .then( json => renderQuotes(json))
}

// returns number of likes a quote has

function fetchQuoteLikes(span,id){
    const newURL= `http://localhost:3000/quotes/${id}?_embed=likes`
    return fetch(newURL)
    .then( resp=>resp.json())
    .then( json=>console.log(getLength(json,span)))}

const getLength = (quote,span) => {
    const quoteLength =quote.likes.length
    // console.log(quote.likes.length)
    span.textContent= quoteLength;
    return quoteLength;
}

//display quotes on the page
function renderQuotes (quotes) {
    const quoteList = document.getElementById('quote-list');
    quotes.forEach(quote=> {
        const li = document.createElement('li');
        li.className='quote-card';
        quoteList.appendChild(li);

        const blockQuote = document.createElement('blockquote');
        blockQuote.className='blockquote';
        li.appendChild(blockQuote);

        const p = document.createElement('p');
        p.className='mb-0'
        p.textContent=quote.quote;
        blockQuote.appendChild(p);

        const footer = document.createElement('footer');
        footer.className='blockquote-footer';
        footer.textContent=quote.author;
        blockQuote.appendChild(footer);

        const likeButton = document.createElement('button');
        likeButton.className='btn-successs';
        likeButton.textContent='Likes: '
        // add event listener for liking quote
        likeButton.addEventListener('click',()=>{
            addNewLike(quote.id);
        });
        blockQuote.appendChild(likeButton);

        const span = document.createElement('span')
        // console.log(quote)
        // span.textContent=quote.likes.length
        // console.log(fetchQuoteLikes(quote.id))
        // span.textContent=fetchQuoteLikes(quote.id)
        fetchQuoteLikes(span,quote.id)
        // console.log(span.textContent)
        likeButton.appendChild(span);

        const editButton = document.createElement('button');
        editButton.className='btn-edit';
        editButton.textContent='Edit';
        //add event listener for editing quotes
        editButton.addEventListener('click', ()=>{
            const editText = document.createElement('input');
            editText.type = 'text';
            editText.id='new-quote';
            editText.placeholder='new quote';
            editText.value=p.textContent;
            // create submit button for input to edit button
            const editSubmit = document.createElement('input');
            editSubmit.type ='submit';
            editSubmit.id='new-submit';
            editSubmit.addEventListener('click',()=>{
                const newText = editText.value;
                updateQuote(quote.id,newText);
                blockQuote.append(likeButton);
                blockQuote.append(editButton);
                blockQuote.append(deleteButton);
                editText.remove();
                editSubmit.remove();
                cancelButton.remove();
            })
            const cancelButton = document.createElement('button');
            cancelButton.className='btn-danger';
            cancelButton.textContent='Cancel';
            // add event listener for cancelling editing 
            cancelButton.addEventListener('click',()=>{
                blockQuote.append(likeButton);
                blockQuote.append(editButton);
                blockQuote.append(deleteButton);
                editText.remove();
                editSubmit.remove();
                cancelButton.remove();
            })
            blockQuote.appendChild(editText);
            blockQuote.appendChild(editSubmit);
            blockQuote.appendChild(cancelButton);
            likeButton.remove()
            editButton.remove()
            deleteButton.remove()
        })
        
        blockQuote.appendChild(editButton)

        const deleteButton = document.createElement('button');
        deleteButton.className='btn-danger';
        deleteButton.textContent='Delete';
        //add event listener for deletion
        deleteButton.addEventListener('click',()=>{
            li.remove();
            deleteQuote(quote.id)
        })
        blockQuote.appendChild(deleteButton);
        

    })
}

// find submit form and add event listener
function postQuote(){
    const form = document.getElementById('new-quote-form');
    form.addEventListener("submit",(event) => {
        event.preventDefault();
        const newText = document.getElementById('new-quote').value;
        const newAuthor=document.getElementById('author').value;
        console.log(newText);
        
        addNewQuote(newText,newAuthor);
    })
    form.reset()
}

// post new quote information to DB
const addNewQuote = (newQuote,newAuthor) => {
    const formData = {
        quote: newQuote,
        author: newAuthor,
      };
      
      const configurationObject = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      };
      
      return fetch(quotesURL, configurationObject)
        .then(function (response) {
          return response.json();
        })
        .then(function (object) {
          console.log('Successfully Added to the Database')
        })
        .catch(function (error) {
            alert("ERROR");
        });
  }



// delete quote
const deleteQuote = (id) => {
    const newURL = `http://localhost:3000/quotes/${id}?_embed=likes`;
    const configurationObject = {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json"
        }
      };

    fetch(newURL,configurationObject)
    .then(res => res.json())
    .then(json =>console.log('Deletion Succesful'))
}


/// liking a quote

const addNewLike = (givenId) => {
    const newURL = 'http://localhost:3000/likes'
    const formData = {
        quoteId: givenId,
        createdAt: Math.floor(Date.now() / 1000),
      };
      
      const configurationObject = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      };
      
      return fetch(newURL, configurationObject)
        .then(function (response) {
          return response.json();
        })
        .then(function (object) {
          console.log('Successfully Added to the Database')
        })
        .catch(function (error) {
            alert("ERROR");
        });
  }

  //// Update Quote:

  const updateQuote = (id,text) =>{
    const newURL = `http://localhost:3000/quotes/${id}`
    const formData = {
        quote: text,
      };
      
      const configurationObject = {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      };
      
      return fetch(newURL, configurationObject)
        .then(function (response) {
          return response.json();
        })
        .then(function (object) {
          console.log('Successfully Updated to the Database')
        })
        .catch(function (error) {
            alert("ERROR");
        });

  }

  /// add sort button
  const addSort = () => {
    const title = document.querySelector('div');
    const quoteList = document.getElementById('quote-list');
    const sortButton = document.createElement('button');
    //add event listener for sorting 
    sortButton.addEventListener('click', sort);
    sortButton.id='sort-btn';
    sortButton.textContent='Sort: Off';
    sortButton.sorted=false;
    title.insertBefore(sortButton,quoteList);
  }

  const sort = (event) => {
    if (event.target.sorted===false){
        event.preventDefault()
        const cards = document.querySelectorAll('.quote-card');
        cards.forEach(card=>card.remove());
        fetchSortedQuotes();
    }
  }