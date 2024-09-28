"use strict"

import { Controller } from "../controllers/gameController.js";
import { Model } from "../model/gameModel.js";
// import words from "../../../json/words.json" with { type: 'json' };


export const inputContainer = document.querySelector("#input");
export const keyboardContainer = document.querySelector('#keyboard');

export class View{
  constructor(){
    this.rLrP  = "right";// class for rigt letter right placement
    this.rLwP = "right-L-Wrong-P"//class for rigt letter wrong placement
    this.wL = "wrong" //class for wrong letter
    this.inputContainer = document.querySelector("#input");
    this.keyboardContainer = document.querySelector('#keyboard');
    this.inputCellAmount = 30;
    this.deleteImg = `<img src="../assets/Images/buttons/backspace.png" alt="backspace">`;

    this.victorySound = '../../assets/sounds/Victory_Sound_Effect.mp3';
    this.buttonClickSound = `../../assets/sounds/Button_click_sound.mp3`;

    this.levelContainer = document.querySelector('.level span.num');
    this.keyboardKeys= JSON.parse(localStorage.getItem('keyboardKeys'))||[
        [{key:'q'},{key:'w'},{key:'e'},{key:'r'},{key:'t'},{key:'y'},{key:'u'},{key:'i'},{key:'o'},{key:'p'}],

        [{key:'a'},{key:'s'},{key:'d'},{key:'f'},{key:'g'},{key:'h'},{key:'j'},{key:'k'},{key:'l'}],

        [{key:'z'},{key:'x'},{key:'c'},{key:'v'},{key:'b'},{key:'n'},{key:'m'}, {key:this.deleteImg,data:'backspace'}],
        [{key:'submit', class:"submit", type:"submit"}]
      ];
  }

  inputLevel(level){
    this.levelContainer.innerHTML = level;
  }

  createInputCell(value,rowId,colId,_class,property){
  // creates span elements which houses inputs
    return `<span data-row-id=${rowId} data-col-id=${colId} class="${_class ||''}">${value?value:''}</span>`;

    
  }

  generateKeyboard(){
    // creates the 
    this.keyboardContainer.innerHTML = '';//clears keyboard to avoid duplication where needed;
  
    this.keyboardKeys.forEach((keyRow,rowId)=>{

      let keyboardContainerHTML = '';
      let type = "button";
      let _class;

      let row = document.createElement('div');
      row.classList.add('row');
      // creates row and add class to it

      keyRow.forEach((keys,keyId)=>{
        keyboardContainerHTML += `<button data-row-id = ${rowId} data-col-id = ${keyId} ${keys.class?`class= " ${keys.class||""}"`:""} ${keys.data?`data-data = "${keys.data}"`:''} type="${keys.type||"button"}">${keys.key}</button>`;
      })

      row.innerHTML = keyboardContainerHTML;
      this.keyboardContainer.append(row);
      // adds row with innerHtml to keyboard
      
    })
  }

  addClassToKeys( rowId, keyId, _class){
    this.keyboardKeys[rowId][keyId].class = _class;
  }

  toggleKeyboardKeys(status){
    this.keyboardContainer.querySelectorAll('button').forEach(btn=>{
      btn.classList.toggle('disable');
    });
  }

  saveKeyboard(){
    localStorage.setItem("keyboardKeys",JSON.stringify(this.keyboardKeys));
  }

  clearKeyboard(){
    localStorage.clear('keyboardKeys');
    this.saveKeyboard();
  }

  playSound(sound){
    const clickSound = new Audio();
    clickSound.src = sound;
    clickSound.play();
    clickSound.volume = 1;
  }

  

}

export const wordle = new Controller(new Model(),new View());

wordle.overallUiGeneration();


