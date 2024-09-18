export class Controller{
  #model;
  #view;

  constructor(_model,_view){
    this.#model = _model;
    this.#view = _view;
  }

  handleWordleCellGeneration(){
    let worlde = this.#model.wordleArray;
    let worldeInputHTML = '';

    worlde.forEach((array,id) => {
      for(let j = 0;j <= 4; j++){
        worldeInputHTML += this.#view.createInputCell(array[j],id,j);
      }
    });

    this.#view.inputContainer.innerHTML = worldeInputHTML;
  }

  handleAddToArray(input){
    this.#model.addToArray(input);
    this.#model.saveArray();
    this.handleWordleCellGeneration();
  }

  handleRemoveFromArray(rowId,colId){
    this.#model.removeFromArray(rowId, colId);
    this.#model.saveArray();
    this.generateWordleCell();
  }

  handleSaveArray(){
    this.#model.saveArray()
  }

  handleClearArray(){
    this.#model.clearArray();
  }

  handleKeyboardGeneration(){
    this.#view.generateKeyboard();
  }

  handleEditKeyboard( rowId, KeyId, _class){
    this.#view.addPropertyToKeys(rowId,KeyId,_class);
    this.#view.saveKeyboard();
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
        }
      })
    })
  }

  async handleDataLoading (){

   let data = await this.#model.loadWords(); //assigns promise received from model to get data
  }
}