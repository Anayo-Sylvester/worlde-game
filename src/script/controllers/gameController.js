// latter address all * using find
export class Controller{
  #model;
 #view;
  #word;
  #sound;

  constructor(_model,_view){
    this.#model = _model;
    this.#view = _view;
    this.#word;
    this.n0OfColumn = 5;
    this.levelCompletionTimeLine = 5000;
  }

  overallUiGeneration(){
    this.handleLevelGeneration();
    this.handleWordleCellGeneration();
    this.handleKeyboardGeneration();
    this.handleButtonClick(this.#view.buttonClickSound);
  }

  handleWordleCellGeneration(){
    let worlde = this.#model.wordleArray;
    let worldeInputHTML = '';

    worlde.forEach((array,id) => {
      for(let j = 0;j <= 4; j++){
        
        // check if the array isn't empty so its' key can be accessed
        if(array[j]){
          let _array = array[j];
          let _class = '';

          _array.class.forEach(_arrayClass=>{
            _class += `${_arrayClass} `
          })// converts class in array to a single string

          worldeInputHTML += this.#view.createInputCell(_array.key,id,j,_class,_array.property); //(value,rowId,colId,_class,property)  
          
        }
        else{// checks if the array is empty and inputs the empty cell
        worldeInputHTML += this.#view.createInputCell(array[j],id,j); //createInputCell(value,rowId,colId)
        }
      }
    });

    this.#view.inputContainer.innerHTML = worldeInputHTML;
  }

  handleAddToArray(letter){
    const array = this.#model.wordleArray; 
    for(let i=0; i < array.length; i++){

      //checks if array is less than 5 before it adds element to it
      if(array[i].length < this.n0OfColumn){
        this.#model.addToArray(i,letter); //(id ,letter)

          //checks if array length is 5 after adding letter, in other to compare letters in word with letters in array
          if(array[i].length == this.n0OfColumn){
            this.generateAttributesFromWord(array[i]);
            this.addAttributetoKeyboardKeys(array[i]);
            
            let activationThreshold = 0;//var is used to determine if correct word is entered

            array[i].forEach(arr=>{
              if(arr.class[0] === this.#view.rLrP){
                console.log(`array class: ${arr.class[0]} class:${this.#view.rLrP}`)
                activationThreshold++;
              }
              if(activationThreshold === this.n0OfColumn){ //if the correct (rLrP) lettter class is found 5 times then level is completed;
                //this.levelCompleted();
              }
            })
            
          }
        break;
      }
    }
    this.overallUiGeneration();
  }

  handleRemoveFromArray(){
    const array = this.#model.wordleArray;

    array.some((arr,rowId)=>{
      const id = arr.length  -1;
      if(id>=0){//prevents error when array is empty
        if(!arr[id].class[0]){//cheacks if the last value in array has class if not then it means it hasn't been verified then it's removed
          this.#model.removeFromArray(rowId);//(rowId);
          return true;
        }
      }
    })
    this.handleWordleCellGeneration();
  }

  /* * remove all as it is incorporated in model*/handleSaveArray(){
    this.#model.saveArray()
  }

  handleClearArray(){
    this.#model.clearArray();
  }

  handleKeyboardGeneration(){
    this.#view.generateKeyboard();
  }

  handleClearKeyboard(){
    this.#view.clearKeyboard();
  }

  handleSoundGeneration(sound){
    this.#view.playSound(sound)
  }

  handleButtonClick(sound){
    this.#view.keyboardContainer.querySelectorAll('button').forEach(button=>{
      button.addEventListener('click',()=>{
        this.handleSoundGeneration(sound);
        
        if (button.innerText.length == 1){ 
          // ensures only letters are added to array
          this.handleAddToArray(button.innerText);
          console.log(button.type)
        }else if(button.dataset.data == "backspace") {
          this.handleRemoveFromArray();
          this.handleWordleCellGeneration();
        }
      })
    })
  }

  handleLevelGeneration() {
    const { level } = this.#model;
    this.#view.inputLevel(level); // inputs the level in view

    // level word generation
    const getWord = async (id) => {
        try {
            const data = await this.#model.loadWordsData();
            this.#word = data[id].word;

        } catch (err) {
            console.error("Error loading word data:", err); // Provide a meaningful error message *
        }
    };

    getWord(level - 1);
  }

  handleLevelIncrease(){
    this.#model.increaseLevel();
  }

  //used in handleAddToArray() used when the 5 letters are inputed in an array *rename
  generateAttributesFromWord(array){
    const word = this.convertToUpperCase(this.#word);
    console.log(word)
    console.log(array);

    array.forEach((arr,id) =>{
      let key = this.convertToUpperCase(arr.key);

      if(word[id] === key){ //checks if word and key letter is the same it adds class
        console.log(word[id]);
        arr.class.push(this.#view.rLrP); 
      }
      else{
        for(let i = 0; i <= word.length -1;i++){

          if(word[i] === key){//checks if letter in word is found in array but in wLwP placement      
            arr.class.push(this.#view.rLwP);
            break;
          }
          else if(i === word.length - 1){//if letter isn't found in word. 
            arr.class.push(this.#view.wL);
          }
        }
      }
      
      
    })  // loops through array and adds letters to form a word

    


  }

  //used in handleAddToArray()
  addAttributetoKeyboardKeys(array){

    array.some(arr=>{
      const {key} = arr;
      let exitLoop = false;

      this.#view.keyboardKeys.some((keyboardRow,rowId)=>{ //loops through overall keyboard container
        
        if(exitLoop === true){ //triggered when the letter in array has been found in the keyboard array so it moves to the next array letter
          return true;
        } 

        keyboardRow.some((keyObject,keyId)=>{ //loops through keyboard rows

          
          if(this.convertToUpperCase(keyObject.key) === this.convertToUpperCase(key)){ //checks if letter in array is found in keyboard
            
            if(arr.class[0] === this.#view.rLrP || arr.class[0] === this.#view.rLwP){ //if class in letter in array is 'right' then the key in the keyboard is marked as correct;

              if(!keyObject.class){ //checks if keyborad key has been assigned class is not then it assigns one
                this.#view.addClassToKeys(rowId,keyId, this.#view.rLrP); //( rowId, keyId, _class)
                //keyObject.class =  this.#view.rLrp;
              }
              exitLoop = true;
              return true; // breaks loop
            }else{
              if(!keyObject.class){ //checks if keyborad key has been assigned class is not then it assigns one
                this.#view.addClassToKeys(rowId,keyId, this.#view.wL); //( rowId, keyId, _class)
              }
              exitLoop = true;
              return true;//breaks loop
            }
          }
        })

      })

    })

    this.#view.saveKeyboard();
  }

  async levelCompleted(){
    this.#view.toggleKeyboardKeys(true);
    this.#model.increaseLevel()
    this.handleClearArray();
    this.handleClearKeyboard();
    this.#view.playSound(this.#view.victorySound);
    console.log(this.levelCompletionTimeLine)

    setTimeout(()=>{
      console.log('done')
      this.overallUiGeneration();
    },10000/*this.levelCompletionTimeLine*/)
  }

  //utilities
  convertToUpperCase(word){
    return word.toUpperCase();
  }
}