export class Model {

  // Constant for the default data structure
  static DEFAULT_DATA = {
    level: 1,
    id:0,
    array: [[], [], [], [], []]
  };

  constructor() { 
    this.wordleData = JSON.parse(localStorage.getItem('wordleData')) || JSON.parse(JSON.stringify(Model.DEFAULT_DATA));
    this.word = null;  // Assuming this is for storing a word, initialized as null
  }

  increaseLevel() {
    console.log('level: ', this.wordleData.level);
    this.wordleData.level++;
    this.saveData();
  }

  addToArray(id, input) {
    this.wordleData.array[id].push({
      key: input,
      class: []
    });
    this.saveData();
  }

  removeFromArray(rowId) {
    this.wordleData.array[rowId].pop();
    this.saveData();
  }

  saveData() {
    localStorage.setItem('wordleData', JSON.stringify(this.wordleData));
  }

  clearArray() {
    // Reset the array to the default empty structure
    this.wordleData.array = [[], [], [], [], []];
    this.saveData();
  }



  async loadWordsData() {
    try {
      const res = await fetch("../../../assets/json/words.json");

      if (res.ok !== true) {
        throw new Error("Bad response");
      }

      const data = await res.json();
      // this.ap = data;
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  resetData() {
    // Reset wordleData to the default structure
    this.wordleData = JSON.parse(JSON.stringify(Model.DEFAULT_DATA));
    this.saveData();  // Ensure the reset data is saved in localStorage
  }
}

