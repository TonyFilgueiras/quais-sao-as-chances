<template>
  <div :class="['aboutContainer', { containerHidden: !showAboutModel }]">
    <button @click="closeAboutModel">X</button>
    <h1>Sobre a simulação</h1>
    <p>
      A simulação pega os jogos restantes do brasileirão e escolhe aleatóriamente os vencedores de cada jogo restante. Considerando cada vitória sendo
      apenas por 1x0 e empate como 0x0.
    </p>
    <p>Após cada simulação, ela atualiza a tabela e verifica a posição em que cada time finalizou na simulação.</p>
    <p>O processo é repetido 50.000 vezes, e no final conta quantas vezes cada time acabou na situação indicada na tabela ao lado.</p>
    <p>
      O usuário tem a opção também de escolher os vencedores dos confrontos, assim fazendo com que a simulação leve em conta aquele resultado indicado
      pelo usuário
    </p>
    <br />
    <p>
      Site ainda está sobre desenvolvimento. Tendo como objetivo no futuro, implementar a opção do usuário escolher para simular os jogos levando em
      conta a força do time, e tambem disponibilizar outros campeonatos
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    showAboutModel: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  methods: {
    closeAboutModel() {
      this.$emit("close");
    },
  },
});
</script>

<style scoped>
.aboutContainer {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--brasileiraoBlue);
  color: white;
  padding: 10px 20px 20px 20px;
  border-radius: 4px;
  box-shadow: 0px 0px 1000px 100px black;
  transition: 0.3s;
  opacity: 1;
  z-index: 1;
}
.aboutContainer h1 {
  text-align: center;
  padding-bottom: 20px;
}
.aboutContainer p {
  text-indent: 1rem;
  text-align: justify;
}
.containerHidden {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
  transform-origin: center;
  box-shadow: 0px 0px 10px 1px black;
}
button {
  background-color: transparent;
  padding: 5px 10px;
  color: white;
  transition: 0.3s;
  border: 0;
}
button:hover {
  background-color: var(--brasileiraoSilver);
  color: black;
  cursor: pointer;
}
@media (max-width: 768px) {
  .aboutContainer{
    width: 90vw;
    padding: 10px 5px;
  }
  .aboutContainer h1{
    font-size: 1rem;
    padding-bottom: 10px;
  }
  .aboutContainer p {
    text-indent: 0.7rem;
  }

}
</style>
