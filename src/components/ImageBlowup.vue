<template>
    <!--div class=""-->
      <img class="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
          :src="img"
          alt="" width="384" height="512"  @click="showSingle()"> 
      <Teleport to="body"> 
      <vue-easy-lightbox
        :visible="visible"        
        :escDisabled="false"
        :imgs="img"
        :index="index"
        @hide="handleHide"
        :zoomScale="0.48"
      ></vue-easy-lightbox>             
      </Teleport>
    <!--/div-->
  </template>
  
  <script>
    // If VueApp is already registered with VueEasyLightbox, there is no need to register it here.
    import VueEasyLightbox from 'vue-easy-lightbox'
  
    export default {
      components: {
        VueEasyLightbox
      },
      data() {
        return {
          //imgs: '', // Img Url , string or Array of string
          visible: false,
          index: 0 // default: 0
        }
      },
      props: {
        img: String
      },
      emits: {
        change: null,
      },
      methods: {
        showSingle() {
          //this.img = this.img || '/wiki-image/wiki/Special:FilePath/Caravaggio%20-%20Taking%20of%20Christ%20-%20Odessa.jpg'
          this.show()
        },
        show() {
          this.visible = true
          this.$emit('change', true)
        },
        handleHide() {
          this.visible = false
          this.$emit('change', false)
        }
      }
    }
  </script>
  