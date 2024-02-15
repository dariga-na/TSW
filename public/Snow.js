let snowContainer = document.querySelector(".snow-container");

let createSnow = () => {
 
  const snow = document.createElement("span");
  snow.className = "snow";
  // 雪の大きさ
  minSize = 5;
  maxSize = 10;
  let snowSize = Math.random() *(maxSize - minSize) + minSize;
  snow.style.width = snowSize + "px";
  snow.style.height = snowSize + "px";
  // 雪の位置
  snow.style.left = Math.random() *100 + "%";

  snowContainer.appendChild(snow);

  // 10秒後に雪を消す
  setTimeout(() => {
    snow.remove();
  },10000);
};

setInterval(createSnow,100);