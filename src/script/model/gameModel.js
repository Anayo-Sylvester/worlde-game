export class Model{
  
  constructor(){
    this.wordleArray = JSON.parse(localStorage.getItem('worldeArray')) || [[],[],[],[],[]];
    this.score = JSON.parse(localStorage.getItem('score')) || 0;
    this.highestScore = JSON.parse(localStorage.getItem("highestScore")) || 0;
    this.level = JSON.parse(localStorage.getItem('level')) || 1;
    
  }

  addToArray(input){
    for(let i=0; i < this.wordleArray.length; i++){
      if(this.wordleArray[i].length < 5){
        this.wordleArray[i].push(input);
        break;
      }
    }
  }

  removeFromArray(rowId,colId){
    this.wordleArray[rowId].splice(colId);
  }

  saveArray(){
    localStorage.setItem('worldeArray',JSON.stringify(this.wordleArray));
  }

  clearArray(){
    localStorage.clear('worldeArray');
  }

  increaseScore(){
    this.score++
  }

  saveScore(){
    localStorage.setItem("score",JSON.stringify(score));
  }

  resetScore(){
    localStorage.clear("score");
  }

  setHighScore(){
    if (this.score = this.highestScore){
      this.highestScore = this.score;
    }
  }
  
  async  loadWords(){
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

  
}