export class Model{
  
  constructor(){
    this.wordleArray = JSON.parse(localStorage.getItem('worldeArray')) || [[],[],[],[],[]];
    this.level = JSON.parse(localStorage.getItem('level')) || 0;
    this.highestLevel = JSON.parse(localStorage.getItem("highestLevel")) || 0;
    this.level = JSON.parse(localStorage.getItem('level')) || 1;
    this.word;
  }

  addToArray(id,input){
    this.wordleArray[id].push({
      "key" : input,
      "class": []
    });
    this.saveArray();
  }

  removeFromArray(rowId){
    this.wordleArray[rowId].pop();
    this.saveArray()
  }

  saveArray(){
    localStorage.setItem('worldeArray',JSON.stringify(this.wordleArray));
  }

  clearArray(){
    localStorage.clear('worldeArray');
    this.saveArray();
  }

  increaseLevel(){
    console.log('level: ',this.level);
    this.level++;
    this.saveLevel();
  }

  saveLevel(){
    localStorage.setItem("level",JSON.stringify(this.level));
  }

  resetLevel(){
    localStorage.clear("level");
  }

  setHighLevel(){
    if (this.level = this.highestLevel){
      this.highestLevel = this.level;
    }
  }
  
  async  loadWordsData(){
    try{
      const res = await fetch("../../../assets/json/words.json");
        
      if(res.ok != true){
        throw new Error("Bad response");   
      }

      const data = await res.json();

      return data;
    }
    catch(err){
      console.log(err)
    }

  }
  
  increaseLevel(){
    this.level++;
    this.saveLevel();
  }

  clearLevel(){
    localStorage.clear('level');
  }
}