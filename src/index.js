// index.js

///////////////////////////////////////////
//global consts
///////////////////////////////////////////
const baseUrl = "http://localhost:3000/ramens"
let selectedRamen


///////////////////////////////////////////
// DOM selectors
///////////////////////////////////////////
const ramenMenu = document.querySelector("div#ramen-menu")
//const ramenDetail = document.querySelector("div#ramen-detail")
const ramenImg = document.querySelector("img.detail-image")
const ramenName= document.querySelector("h2.name")
const ramenRestaurant = document.querySelector("h3.restaurant")
const ramenRating = document.querySelector("span#rating-display")
const ramenComment = document.querySelector("p#comment-display")
const createForm = document.querySelector("form#new-ramen")
const updateForm = document.querySelector("form#edit-ramen")
//const updateRating = document.querySelector("#edit-rating")
//const updateComment = document.querySelector("#edit-comment")
const deleteBtn = document.querySelector("button#delete-ramen")


///////////////////////////////////////////
// object shape
///////////////////////////////////////////
// {
//   "id": "1",
//   "name": "Shoyu Ramen",
//   "restaurant": "Nonono",
//   "image": "./assets/ramen/shoyu.jpg",
//   "rating": 7,
//   "comment": "Delish. Can't go wrong with a classic!"
// },


///////////////////////////////////////////
// global functions
///////////////////////////////////////////
function buildRequestObj(method, payloadObj){
  return {
    method: ""+method+"",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      //"Accept"
    },
    body: JSON.stringify(payloadObj),
  }
}

function getJSON(id){
  let useUrl = baseUrl
  if(id){
    useUrl = baseUrl + "/" + id
  }

  return fetch(useUrl)
  .then((response) => {
    if (!response.ok) {
      // Throw an error if the response status is not OK
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => data)
  .catch((error) => console.error("Error fetching data: ",error))
}

function postJSON(payloadObj){ 
  fetch(baseUrl, buildRequestObj("POST",payloadObj))
  .then((response) => response.json())
  .then((data) => renderRamenNav(data))
  .catch((error) => console.error(error))
}

function patchJSON(ramenId,payloadObj){ 
  fetch(baseUrl+"/"+ramenId, buildRequestObj("PATCH",payloadObj))
  .then((response) => response.json())
  .then((data) => {
    selectedRamen = data
    renderRamenDetails(data)
  })
  .catch((error) => console.error(error))
}

function deleteJSON(ramenId){ 
  fetch(baseUrl+"/"+ramenId,buildRequestObj("DELETE",{}))
  .then((response) => console.log(response))
  //.then((data) => console.log(data))
  .catch((error) => console.error(error))
}

function renderRamenDetails(ramen){
  selectedRamen = ramen
  ramenImg.src = ramen.image
  ramenImg.alt = `${ramen.name} image`
  ramenName.textContent = ramen.name
  ramenRestaurant.textContent = ramen.restaurant
  ramenRating.textContent = ramen.rating
  ramenComment.textContent = ramen.comment
}

function renderRamenNav(ramen){
  const img = document.createElement("img")
  img.src = ramen.image
  img.alt = `${ramen.name} image`
  //img.dataset.id = ramen.id
  img.id = ramen.id 
  img.addEventListener('click', () => handleClick(ramen))
  ramenMenu.append(img)
}

function renderAllRamens(ramensArray){
  //render first ramen
  selectedRamen = ramensArray[0] 
  renderRamenDetails(selectedRamen)
  
  //create ramen list
  ramensArray.forEach((ramen) => {
    renderRamenNav(ramen)
  })
}

///////////////////////////////////////////
// arrow functions
///////////////////////////////////////////

// const initRamen = () => {
//   return {
//     name: "Demo Name",
//     restaurant: "Demo Restaurant",
//     image:  "./assets/image-placeholder.jpg",
//     rating: Math.random(),
//     comment: "No comment",
//   }
// }

const buildRamenObj = (e) => {
  return {
    name: e.target.name.value,
    restaurant: e.target.restaurant.value,
    image: e.target.image.value,
    rating: e.target.rating.value,
    comment: e.target["new-comment"].value,
  }
}

const renderPlaceholder = () => {
  ramenImg.src = "./assets/image-placeholder.jpg"
  ramenImg.alt = "Insert Name Here"
  ramenName.textContent = "Insert Name Here"
  ramenRestaurant.textContent = "Insert Restaurant Here"
  ramenRating.textContent = "Insert rating here"
  ramenComment.textContent = "Insert comment here"
}  

const handleFormCreate = (e) => {
  e.preventDefault()
  postJSON(buildRamenObj(e))
  e.target.reset()
}

const handleFormUpdate = (e) => {
  e.preventDefault()
  const formRating = e.target["edit-rating"].value
  const formComment = e.target["edit-comment"].value
  const patchObj = {}
  if(formRating){
    patchObj.rating = formRating
    selectedRamen.rating = formRating
  }
  if(formComment){
    patchObj.comment = formComment
    selectedRamen.comment = formComment
  }
  patchJSON(selectedRamen.id,patchObj)
  e.target.reset()
}

const handleDelete = (e) => {
  const ramenToDelete = ramenMenu.querySelector("img[id='"+selectedRamen.id+"']")
  
  let prevRamen = ramenToDelete.previousElementSibling
  let nextRamen = ramenToDelete.nextElementSibling
  //console.log(prevRamen)
  //console.log(nextRamen)
  
  deleteJSON(ramenToDelete.id)
  ramenToDelete.remove()
  
  if (prevRamen || nextRamen) {
    let getRamenId

    if(prevRamen){
      getRamenId = prevRamen.id
    } else {
      getRamenId = nextRamen.id
    }
    
    getJSON(getRamenId)
    .then((data) => {
      selectedRamen = data
      renderRamenDetails(data)
    })
  } else {
    renderPlaceholder()
  }
}

const handleClick = (ramen) => {
  renderRamenDetails(ramen)
};

const addSubmitListener = () => {
  document.addEventListener('DOMContentLoaded',function(){
    createForm.addEventListener('submit', handleFormCreate)
    updateForm.addEventListener('submit', handleFormUpdate)
    deleteBtn.addEventListener('click', handleDelete)
  })
}

const displayRamens = function () {
  document.addEventListener('DOMContentLoaded', () => {
    getJSON().then((data) => renderAllRamens(data))
    
    //debugging attempts for the auto-tester
    // //bypass getJSON() and renderAllRamens() function (must still auto-load first ramen to renderRamenDetails())
    // fetch(getUrl)
    // .then((response => response.json()))
    // .then((data) => data.forEach((ramen) => {
    //   console.log("loaded")
    //   //renderRamenNav(ramen)
    //
    //   const img = document.createElement("img")
    //   img.src = ramen.image
    //   img.alt = `${ramen.name} image`
    //   //img.dataset.id = ramen.id
    //   img.id = ramen.id 
    //   img.addEventListener('click', () => handleClick(ramen))
    //   ramenMenu.append(img)
    // }))
    // .catch((error) => console.log(error))

  })
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
