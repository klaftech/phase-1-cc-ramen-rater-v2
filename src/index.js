// index.js

///////////////////////////////////////////
//global consts
///////////////////////////////////////////
const getUrl = "http://localhost:3000/ramens"



///////////////////////////////////////////
// DOM selectors
///////////////////////////////////////////
const ramenMenu = document.querySelector("div#ramen-menu")
const ramenDetail = document.querySelector("div#ramen-detail")
const ramenImg = document.querySelector("img.detail-image")
const ramenName= document.querySelector("h2.name")
const ramenRestaurant = document.querySelector("h3.restaurant")
const ramenRating = document.querySelector("span#rating-display")
const ramenComment = document.querySelector("p#comment-display")
const ramenForm = document.querySelector("form#new-ramen")

///////////////////////////////////////////
// global functions
///////////////////////////////////////////
function getJSON(){
  return fetch(getUrl)
  .then((response) => response.json())
  .then((data) => data)
  //.catch((error) => throw new error)
}

/*
// object shape
{
  "id": "1",
  "name": "Shoyu Ramen",
  "restaurant": "Nonono",
  "image": "./assets/ramen/shoyu.jpg",
  "rating": 7,
  "comment": "Delish. Can't go wrong with a classic!"
},
*/

function renderRamen(ramen){
  ramenImg.src = ramen.image
  ramenImg.alt = `${ramen.name} image`
  ramenName.textContent = ramen.name
  ramenRestaurant.textContent = ramen.restaurant
  ramenRating.textContent = ramen.rating
  ramenComment.textContent = ramen.comment
}

function renderRamenImg(ramen){
  const img = document.createElement("img")
  img.src = ramen.image
  img.alt = `${ramen.name} image`
  img.addEventListener('click', () => handleClick(ramen))
  ramenMenu.append(img)
}

function renderAllRamens(ramensArray){
  ramensArray.forEach((ramen) => {
    renderRamenImg(ramen)
  })
}

function buildRamenObj(e){
  return {
    name: e.target.name.value,
    restaurant: e.target.restaurant.value,
    image: e.target.image.value,
    rating: e.target.rating.value,
    comment: e.target["new-comment"].value,
  }
}

const handleForm = (e) => {
  e.preventDefault()
  console.log("form received")
  renderRamenImg(buildRamenObj(e))
  e.target.reset()
}

// Callbacks
const handleClick = (ramen) => {
  renderRamen(ramen)
};

const addSubmitListener = () => {
  ramenForm.addEventListener('submit', handleForm)
}

const displayRamens = function () {
  getJSON().then((data) => renderAllRamens(data))
};

const main = () => {
  // Invoke displayRamens here
  displayRamens()
  // Invoke addSubmitListener here
  addSubmitListener()
}

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};