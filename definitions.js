const fs = require('fs');

var fetchnote = () => {
  try {
    var noteString = fs.readFileSync('categories.json');
    return JSON.parse(noteString);
  } catch (e) {
    return [];
  }
};

var savenote = (notes) => {
  fs.writeFileSync('categories.json', JSON.stringify(notes));
};

var addCategory = (name,product,quantity) => {
  var notes = fetchnote();
  var note = {
    name,
    product,
    quantity
  };

  var duplicate = notes.filter((note) => {
    if(note.name === name)
    {
      return note.product===product
    }
  });
  if (duplicate.length === 0) {
    notes.push(note);
    savenote(notes);
    return note;
  }
};

var getAllCategories = () => {
  return fetchnote();
};

var Removequantity = (name,product,quantity) => {
  var found=false;
  var notes = fetchnote();
  notes.filter((not) => {
    if(not.name === name)
    {
      if(not.product===product)
      {
        not.quantity=not.quantity-quantity;
        found=true;
      }
    }
  });
  savenote(notes);

  return found;
};

var Addquantity = (name,product,quantity) => {
  var found=false;
  var notes = fetchnote();
  notes.filter((not) => {
    if(not.name === name)
    {
      if(not.product===product)
      {
        not.quantity=not.quantity+quantity;
        found=true;
      }
    }
  });
  savenote(notes);
  return found;
};

var logNote = ((note) => {
  console.log('--');
  console.log('Title:' + note.name);
  console.log('Content: ' + note.product);
  console.log('Quantity: ' + note.quantity);
});





module.exports = {
  addCategory,
  getAllCategories,
  Removequantity,
  Addquantity,
  logNote
}
