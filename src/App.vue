<template>
  <div class="container mx-auto">
    <div class="fixed bg-gray-50 top-0 left-8 right-8 w-full rounded-lg py-8 shadow-xl opacity-75 ">
      <AutoFillSuggest :selectedCountry="selectedCountry" v-on:change="[selectedCountry ,geojson] = $event"></AutoFillSuggest>
      
    </div>
  </div>
  <div class="flex items-stretch min-h-screen pb-10">
    <div class="flex-2 text-grey-darker text-center bg-blue-100 px-4 py-2 pt-50 m-2">
      You have selected: <span class="font-semibold">{{ selectedCountry }}</span>
    </div>
    <div class="flex-1 text-grey-darker text-center bg-orange-200 px-4 py-2 m-2">
      <MapContainer :geojson="geojson" v-on:select="selected = $event"></MapContainer>
    </div>
</div> 
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AutoFillSuggest from './components/AutoFillSuggest.vue'
import MapContainer from './components/MapContainer.vue'


export default {
  name: 'App',
  components: {
    MapContainer,
    AutoFillSuggest

  },
  data: () => ({
        selected: undefined,
        selectedArtist: "Trnka",
        selectedCountry: "neznam",
        dropdown: "ahoj",
        options: [],
        geojson: {
          type: 'Feature',
          properties: {
            name: 'default object',
            quality: 'top'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  -27.0703125,
                  43.58039085560784
                ],
                [
                  -28.125,
                  23.563987128451217
                ],
                [
                  -10.8984375,
                  32.84267363195431
                ],
                [
                  -27.0703125,
                  43.58039085560784
                ]
              ]
            ]
          }
        }
      })
    }
</script>



