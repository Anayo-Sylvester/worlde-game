// latter address all * using find

export class Controller{
  #model;
  #view;
  #wordId;
  #jsonData;
  #sound;

  constructor(_model,_view){
    this.#model = _model;
    this.#view = _view;
    this.#wordId = JSON.parse(localStorage.getItem('wordId'));
    this.#jsonData;
    this.n0OfColumn = 5;
    this.levelCompletionTimeLine = 5000;//5 sec
    this.isMaxLengthReached = JSON.parse(localStorage.getItem('isMaxLengthReached')) || false;

    this.validateGuessRowArray; // array used in validateGuessRowArray()
  }

  overallUiGeneration(){
    this.handleLevelGeneration();
    this.inputLevelInUi();
    this.checkIfWordLengthIsReached();
    console.log('overallUIGeneration');
    this.handleWordleCellGeneration();
    this.handleKeyboardGeneration();
    this.handleButtonClick(this.#view.buttonClickSound);
  }

  handleWordleCellGeneration(){
    let worldeArray = this.#model.wordleData.array;
    let worldeInputHTML = '';

    worldeArray.forEach((array,id) => {
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
  
  handleSaveKeyboard(){
    this.#view.saveKeyboard();
  }

  async handleAddToArray(letter) {
    const { array } = await this.#model.wordleData;
    this.isMaxLengthReached = false;
    let i;
    const previousLength = array.length
    for (i = 0; i < array.length; i++) {
      console.log({i})
      // Checks if guessed word length is less than the maximum allowed
      if (array[i].length < this.n0OfColumn) {
        // Ensure that i > 0 before accessing array[i - 1]
        const isPreviousArrayComplete = (i > 0 && array[i - 1] && array[i - 1][this.n0OfColumn -1] && array[i - 1][this.n0OfColumn -1].class.length>0);
        
        // adds letter to array if it is the first array or if the previous array is full
        if (i === 0 || isPreviousArrayComplete) {
          this.#model.addToArray(i, letter); // (id, letter)
  
          // Check if guessed word is now at max length
          if (array[i].length === this.n0OfColumn) {
            this.isMaxLengthReached = true;
          }
          break; // Exit the loop after handling one array element
        }
      }
    }
  
    this.overallUiGeneration();
  }
  
  async checkIfWordLengthIsReached() {
    console.log('q');
    const { array } = await this.#model.wordleData;

    // Checks if array length is reached and if it has been validated
    for (let id = 0; id < array.length; id++) {
        const arr = array[id];
        
        // check if word length is reached
        if (arr.length === this.n0OfColumn) {
            const isWordValidated = !!arr[arr.length - 1].class.length; 
            
            if (!isWordValidated) {
                const isGuessValid = await this.validateGuessWithDictionary(arr);
                 console.log({isGuessValid});

                if(isGuessValid){

                  const {noOfRightPlacedLetterInWord,arrayIndex} = await this.addAttributesToWordInArray(array[id],id);
                  this.addAttributetoKeyboardKeys(array[id]);

                  this.handleWordleCellGeneration();
                  this.handleKeyboardGeneration();

                  this.handleButtonClick(this.#view.buttonClickSound);

                  console.log({noOfRightPlacedLetterInWord})

                  if(noOfRightPlacedLetterInWord === this.n0OfColumn){
                    this.levelCompleted(true);
                    return;
                  }else if(arrayIndex + 1 === 5){// checks if the array is full and no more space to add letter
                    this.levelCompleted(false);
                    return;
                  }
                }else{
                  console.log('invalid word');
                  this.handleWordleCellGeneration();
                  this.handleKeyboardGeneration();
                  this.handleButtonClick(this.#view.buttonClickSound);
                }

                // Check if next element is either undefined or doesn't match the expected length
                if (!array[id + 1] || array[id + 1].length !== this.n0OfColumn) {
                  console.log(array.length);
                  if(id + 1 > array.length){
                    this.levelCompleted(false);
                  }
                    break; // Exit the loop
                }
            }else{
              console.log('invalid word');;
            }
        } else {
            console.log('qw');
            break; // Exit the loop for the first non-matching array
        }
    }
}

  async validateGuessWithDictionary(array){
    try{
      console.log('hey');
      this.handleKeyboardGeneration(true);//(shoulDisableKeyboardKeys = false) prevent user from inputing word when checking if word is valid

      this.validateGuessRowArray = await array;

      const word =  this.convertArrayToWord(array); // Convert the array into a word
      console.log({word});
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await res.json();

      if(data[0]){
        return true;
      }else{
        return false;
      }

    }catch(err){
      console.error(`error: `,err);
      return false;
    }
  }
  

  //array being full means the user failed to guess the right word
  checksIfArrayIsFull(array){
    console.log('checking');
    console.log(array);
    let activationThreshold = 0;
    array.some(arr=>{
      if(arr.length === 5){
        activationThreshold++;
      }else{
        return true;
      }
    })

    if(activationThreshold === array.length){
      console.log('full');
      this.levelCompleted(false);
      return true;
    }
  }

  deleteLastLetterFromArray(){
    const {array} = this.#model.wordleData;

    array.some((arr,rowId)=>{
      const id = arr.length  -1;
      if(id>=0){//prevents error when array is empty
        console.log(arr[id].class[0])
        if(!arr[id].class[0]){//cheacks if the last value in array has class if not then it means it hasn't been verified then it's removed
          this.#model.removeFromArray(rowId);//(rowId);
          return true;
        }
      }
    })
    this.handleWordleCellGeneration();
  }

  handleClearArray(){
    this.#model.clearArray();
  }

  handleSaveWordleData(){
    this.#model.saveData();
  }

  handleKeyboardGeneration(shoulDisableKeyboardKeys = false){
    this.#view.generateOrDisableKeyboard(shoulDisableKeyboardKeys);
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
        }else if(button.dataset.data === "backspace") {
          this.deleteLastLetterFromArray();
          this.handleWordleCellGeneration();
        }
      })
    })
  }

  inputLevelInUi() {
    const { level } = this.#model.wordleData;
    this.#view.inputLevel(level); // inputs the level in view
  }
  
  handleLevelGeneration() {
    if (!this.#wordId) {
      const { level } = this.#model.wordleData;
      this.#view.inputLevel(level); // inputs the level in view
      let data;
  
      // level word generation
      const getWord = async () => {
        try {
          await this.loadWordleData();
  
          // Ensures #jsonData is available before proceeding
          if (this.#jsonData && this.#jsonData.length > 0) {
            let max = this.#jsonData.length - 1;
            let min = 0;

            const id = Math.round(Math.random() * (max - min) + min);
            this.#wordId = id;
            this.saveWordId();
  
            console.log(`Word ID selected: ${this.#wordId}`);
            console.log(`json data: ${this.#jsonData}`)
            console.log(`Selected Word: ${this.#jsonData[this.#wordId].word}`);
          } else {
            console.error('No word data available!');
          }
        } catch (err) {
          console.error("Error loading word data:", err);
        }
      };
  
      // Wait for word data to be fetched and assigned
      getWord().then(() => {
        if (this.#jsonData && this.#wordId !== undefined) {
          console.log(`Loaded word: ${this.#jsonData[this.#wordId].word}`);
        } else {
          console.error('Failed to load word data.');
        }
      });
    }
  }

  async loadWordleData(){
    try{
      const data = await this.#model.loadWordsData();
      this.#jsonData = await data;
      this.overallUiGeneration();
    }catch(err){
      console.error(err)
    }
  }
  
  saveWordId(){
    localStorage.setItem('wordId',JSON.stringify(this.#wordId))
  }

  clearWordId(){
    this.#wordId = undefined;
    this.saveWordId();
  }
  
  handleLevelIncrease(){
    console.log('handle');
    this.#model.increaseLevel();
  }

  //used in validateGuessRow() used when the 5 letters are inputed in an array *rename
  async addAttributesToWordInArray(array,index){
    const word = await this.convertToUpperCase(this.#jsonData[this.#wordId].word);
    console.log('json data: ',word);
    //const _word = await this.convertToUpperCase(this.#jsonData[this.#wordId].word)

    let activationThreshold = 0;
    //let arrayClone = JSON.parse(JSON.stringify(array))

    array.forEach((arr,id) =>{
    console.log({index})
    console.log({arr: arr.key})
      let key = this.convertToUpperCase(arr.key);
      console.log({key,wordid : word[id]})
      if(word[id] === key){ //checks if word and key letter is the same it adds class
        arr.class.push(this.#view.rLrP); 
        activationThreshold++;
      }
      else{
        for(let i = 0; i <= word.length -1;i++){

          if(word[i] === key){//checks if letter in word is found in array but in wLwP placement      
            arr.class.push(this.#view.rLwP);
            console.log('rLwP');
            break;
          }
          else if(i === word.length - 1){//if letter isn't found in word. 
            arr.class.push(this.#view.wL);
          }
        }
      }
      
      
    })  // loops through array and adds letters to form a word
    this.replaceArrayinWordleData(array,index);
    return {noOfRightPlacedLetterInWord:activationThreshold,arrayIndex: index};

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
  }

  levelCompleted(status = true){
    console.log(`status: ${status}`);
    this.handleClearKeyboard();
    this.handleKeyboardGeneration(true);//(shoulDisableKeyboardKeys, shouldActivateSubmitBtn)
    this.handleClearArray();
    if(status){
      this.handleLevelIncrease();
      this.handleSoundGeneration(this.#view.victorySound);//plays victory sound
    }else{
      this.handleSoundGeneration(this.#view.failSound);//plays lose sound
    }
    this.handleSaveWordleData();// fixes the issue of the game data reseting in it's empty
    console.log(this.levelCompletionTimeLine)

    setTimeout(()=>{
      this.clearWordId();
      this.overallUiGeneration();
    },this.levelCompletionTimeLine);
  }

  validateGuessRow(array){
    console.log('array: ',array)
    this.addAttributesToWordInArray(array);
    this.addAttributetoKeyboardKeys(array);

    let activationThreshold = 0;
      // Check if any letters are guessed correctly (rLrP)
    array.forEach(arr => {
      if (arr.class[0] === this.#view.rLrP) {
        activationThreshold++;
      }
    });

    // If the correct (rLrP) letter class is found 5 times, level is completed
    if (activationThreshold === this.n0OfColumn) {
      console.log(`activation: ${activationThreshold} step 4`);
      //this.handleWordleCellGeneration();
      this.levelCompleted();
      return; // Exit the handleAddToArray function completely
    } else if(i === array.length - 1) {
      // Set flag to true if array is full but incorrect
      isArrayFullButIncorrect = true;
    }

  }

  replaceArrayinWordleData(array,index){
    this.#model.wordleData.array[index] = array;
    this.handleSaveWordleData();
  }
  
  //utilities
  convertToUpperCase(word){
    return word.toUpperCase();
  }

  convertArrayToWord(array){
    let word = '';
    array.forEach(arr=>{
      word += arr.key;
    })
    return word;
  }
}