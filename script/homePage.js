const mainContainer = document.querySelector('main');

addBackground();

window.addEventListener('resize',()=>{
  addBackground(); 
})

function addBackground(){
  // set the height and with of main background
  const height = mainContainer.clientHeight;
  const width = mainContainer.clientWidth;

  mainContainer.style = `--beforeHeight: ${height*2.5}px; --beforeWidth:${width * 2}px`;
  
}