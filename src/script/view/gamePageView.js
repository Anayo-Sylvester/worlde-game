"use strict";

export class View {
    
    static DEFAULT_KEYBOARD_LAYOUT = [
        [{ key: 'q' }, { key: 'w' }, { key: 'e' }, { key: 'r' }, { key: 't' }, { key: 'y' }, { key: 'u' }, { key: 'i' }, { key: 'o' }, { key: 'p' }],
        [{ key: 'a' }, { key: 's' }, { key: 'd' }, { key: 'f' }, { key: 'g' }, { key: 'h' }, { key: 'j' }, { key: 'k' }, { key: 'l' }],
        [{ key: 'z' }, { key: 'x' }, { key: 'c' }, { key: 'v' }, { key: 'b' }, { key: 'n' }, { key: 'm' }, { key: '<img src="../assets/Images/buttons/backspace.png" alt="backspace">', data: 'backspace' }]
    ];//if editted also edit in resetKeyboard()

    constructor() {
        this.rLrP = "right";  // class for right letter, right placement
        this.rLwP = "right-L-Wrong-P";  // class for right letter, wrong placement
        this.wL = "wrong";  // class for wrong letter
        this.inputContainer = document.querySelector("#input");
        this.keyboardContainer = document.querySelector('#keyboard');
        this.alertContainer = document.querySelector('#alert');
        this.inputCellAmount = 30;
        this.deleteImg = `<img src="../assets/Images/buttons/backspace.png" alt="backspace">`;

        this.victorySound = '../../assets/sounds/Victory_Sound_Effect.mp3';
        this.failSound = '../../assets/sounds/Lose_Sound_Effect.mp3';
        this.buttonClickSound = `../../assets/sounds/Button_click_sound.mp3`;

        this.levelContainer = document.querySelector('.level span.num');

        // Use the DEFAULT_KEYBOARD_LAYOUT variable for initialization
        this.keyboardKeys = JSON.parse(localStorage.getItem('keyboardKeys')) || JSON.parse(JSON.stringify(View.DEFAULT_KEYBOARD_LAYOUT))
    }

    inputLevel(level) {
        this.levelContainer.innerHTML = level;
    }

    createInputCell(value, rowId, colId, _class, property) {
        // creates span elements which houses inputs
        return `<span data-row-id=${rowId} data-col-id=${colId} class="${_class  || ''}">${value ? value : ''}</span>`;
    }

    generateOrDisableKeyboard(shoulDisableKeyboardKeys = false) {

        // Creates the keyboard and optionally disables it

        this.keyboardContainer.innerHTML = '';  // Clears keyboard to avoid duplication

        this.keyboardKeys.forEach((keyRow, rowId) => {
            let keyboardContainerHTML = '';
            let row = document.createElement('div');
            row.classList.add('row');  // Creates row and add class to it

            keyRow.forEach((keys, keyId) => {
                
                keyboardContainerHTML += `
                    <button 
                       ${generateClass(keys.class)}
                       ${generateDataset(keys.data)}
                       ${generateButtonType(keys.type)}     
                       ${genDisabledAtrri(shoulDisableKeyboardKeys)} 
                    >
                        ${keys.key}
                    </button>`;
            });

            row.innerHTML = keyboardContainerHTML;
            this.keyboardContainer.append(row);  // Adds row with innerHtml to keyboard
        });

        function generateClass(_class){
            return `${_class ? `class="${_class || ""}"` : ""}`
        }

        function generateDataset(data){
            return `${data ? `data-data="${data}"` : ''}`;
        }
        function generateButtonType(type){
            return `type="${type || "button"}"`
        }
        function genDisabledAtrri(_shoulDisableKeyboardKeys){
            return `${_shoulDisableKeyboardKeys ? 'disabled' : ''}`
        }

        if(!shoulDisableKeyboardKeys){
            this.saveKeyboard();
        }
    }

    addClassToKeys(rowId, keyId, _class) {
        this.keyboardKeys[rowId][keyId].class = _class;
    }

    toggleKeyboardKeys(status) {
        document.querySelector('#keyboard').innerHTML = "";
    }

    saveKeyboard() {
        localStorage.setItem("keyboardKeys", JSON.stringify(this.keyboardKeys));
    }

    resetKeyboardState() {
        // Reset keyboardKeys to the default layout using DEFAULT_KEYBOARD_LAYOUT
        this.keyboardKeys = JSON.parse(JSON.stringify(View.DEFAULT_KEYBOARD_LAYOUT));
    }

    clearKeyboard() {
        localStorage.removeItem('keyboardKeys');
        this.resetKeyboardState();   // Reset keyboard state to default
        this.saveKeyboard();         // Save default state back to localStorage
    }

    playSound(sound) {
        const clickSound = new Audio();
        clickSound.src = sound;
        clickSound.play();
        clickSound.volume = 1;
    }

    // New function to disable or enable the keyboard
    toggleKeyboardState(disable) {
        // Call generateKeyboard and pass the disable state
        this.generateOrDisableKeyboard(disable);
    }

    generateAlertMessage(enable = false,message = '', status = ''){
        this.alertContainer.querySelector('p').innerText = message;
        if(enable){
            this.alertContainer.classList.add('active');
            if(status === ""){
                this.alertContainer.querySelector('img').src = '';
                this.alertContainer.querySelector('img').alt = '';
            }
            else if(status === 'error'){
                this.alertContainer.querySelector('img').src = '../assets/Images/alert/alert-error-svg.svg';
                this.alertContainer.querySelector('img').alt = 'Error icon';
            }else if(status === 'loading'){
                this.alertContainer.querySelector('img').src = '../assets/Images/alert/loading.gif';
                this.alertContainer.querySelector('img').alt = 'Loading animation';
            }
        }else{
            this.alertContainer.classList.remove('active');            
        }
    }
}