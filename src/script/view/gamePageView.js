"use strict"

import { Controller } from "../controllers/gameController.js";
import { Model } from "../model/gameModel.js";
// import words from "../../../json/words.json" with { type: 'json' };


export const inputContainer = document.querySelector("#input");
export const keyboardContainer = document.querySelector('#keyboard');

export class View{
  constructor(){
    this.inputContainer = document.querySelector("#input");
    this.keyboardContainer = document.querySelector('#keyboard');
    this.inputCellAmount = 30;
    this.deleteImg = `<img src="../assets/Images/buttons/backspace.png" alt="backspace">`;
    this.keyboardKeys= JSON.parse(localStorage.getItem('keyboardKeys'))||[
        [{key:'q'},{key:'w'},{key:'e'},{key:'r'},{key:'t'},{key:'y'},{key:'u'},{key:'i'},{key:'o'},{key:'p'}],

        [{key:'a'},{key:'s'},{key:'d'},{key:'f'},{key:'g'},{key:'h'},{key:'j'},{key:'k'},{key:'l'}],

        [{key:'z'},{key:'x'},{key:'c'},{key:'v'},{key:'b'},{key:'n'},{key:'m'}, {key:this.deleteImg}],
        [{key:'submit', class:"submit", type:"submit"}]
      ];
  }

  createInputCell(value,rowId,colId){
  // creates span elements which houses inputs
    return `<span data-row-id=${rowId} data-col-id=${colId}>${value?value:''}</span>`;
  }

  generateKeyboard(){
    // creates the keyboard
  
    this.keyboardKeys.forEach((keyRow,rowId)=>{

      let keyboardContainerHTML = '';
      let type = "button";
      let _class;

      let row = document.createElement('div');
      row.classList.add('row');
      // creates row and add class to it

      keyRow.forEach((keys,keyId)=>{
        keyboardContainerHTML += `<button data-row-id = ${rowId} data-col-id = ${keyId} ${keys.class?`class= "${keys.class||""}"`:""} type="${keys.type||"button"}">${keys.key}</button>`;
      })

      row.innerHTML = keyboardContainerHTML;
      this.keyboardContainer.append(row);
      // adds row with innerHtml to keyboard
      
    })
  }

  addClassToKeys( rowId, keyId, _class){
    this.keyboardKeys[rowId][keyId].class = _class;
  }

  saveKeyboard(){
    localStorage.setItem("keyboardKeys",JSON.stringify(keyboardKeys));
  }

  clearKeyboard(){
    localStorage.clear("keyboardKeys");
  }

  playSound(sound){
    const clickSound = new Audio();
    clickSound.src = sound;
    clickSound.play();
    clickSound.volume = 1;
  }

}

export const wordle = new Controller(new Model(),new View());

wordle.handleWordleCellGeneration();
wordle.handleKeyboardGeneration();

wordle.handleButtonClick("../../assets/sounds/Button_click_sound.mp3");


