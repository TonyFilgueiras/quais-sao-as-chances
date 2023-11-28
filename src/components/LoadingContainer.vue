<template>
  <div class="loadingContainer">
    <h1>Carregando</h1>
    <div class="loadingBar"></div>
  </div>
</template>


<style scoped>
.loadingContainer {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--brasileiraoBlue);
  color: white;
  padding: 20px 50px;
  overflow: hidden;
  box-shadow: 0px 0px 10px 1px black;
}
.loadingBar{
  background-color: var(--brasileiraoGold);
  margin-top: 20px;
  width: 100%;
  height: 10px;
  border-radius: 53px;
  animation: loadingBar 1s ease-in-out infinite ;
}
@keyframes loadingBar{
  0%{
    transform: translateX(-130%);
  }
  100%{
    transform: translateX(130%);
  }
}
</style>
