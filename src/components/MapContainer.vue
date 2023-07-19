<template>
    <div ref="map-root" class="z-0"
         style="width: 100%; height: 100%; min-width: 600px; min-height: 100px;">
    </div>
      <figure id="popup" @mouseenter="hoverDetail(true)" @mouseleave="hoverDetail(false)" class="md:flex max-w-lg bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800" v-show="detailVisible">
        <ImageBlowup :img="selectedImage" v-on:change="imageBlownUp = $event"></ImageBlowup>
        <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
          <blockquote>
            <p class="text-lg font-medium" style="white-space: pre-line;">
              {{ description }}
            </p>
          </blockquote>
          <figcaption class="font-medium">
            <div class="text-sky-500 dark:text-sky-400">
              {{ imageName }}
            </div>
            <div class="text-slate-700 dark:text-slate-500">
              {{ institutionName }}
            </div>
          </figcaption>
        </div>
      </figure> 
  </template>
  
<script>
  import View from 'ol/View'
  import Map from 'ol/Map'
  import TileLayer from 'ol/layer/Tile'
  import OSM from 'ol/source/OSM'
  import VectorLayer from 'ol/layer/Vector'
  import VectorSource from 'ol/source/Vector'
  import GeoJSON from 'ol/format/GeoJSON'
  import {Icon, Style} from 'ol/style.js'
  import Overlay from 'ol/Overlay.js'
  import ImageBlowup from './ImageBlowup.vue'
  import Interaction from 'ol/interaction/Interaction.js';

  import 'ol/ol.css'
  import { toStringHDMS } from 'ol/coordinate'

  export default {
    name: 'MapContainer',
    components: {ImageBlowup},
    props: {
      geojson: Object
    },
    data: () => ({
      olMap: null,
      vectorLayer: null,
      selectedFeature: null,
      detailVisible: true,
      imageName: "",
      institutionName: "",
      description: "",
      selectedImage: "",
      mapInFocus: true,
      imageBlownUp: false,
      // TODO - handle the disable of the click while viewing the detail of the image (and possible all the other map interactions)
      // maybe mose over image, blown up image, or something similar
    }),
    mounted() {
      this.vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [],
        }),
      })


      this.olMap = new Map({
        target: this.$refs['map-root'],
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          this.vectorLayer
        ],
        view: new View({
          zoom: 0,
          center: [0, 0],
          constrainResolution: true
        }),
      })

      this.olMap.on('pointermove', (event) => {
        const hovered = this.olMap.forEachFeatureAtPixel(event.pixel, (feature) => feature)
        if (hovered !== this.selectedFeature) {            
          this.selectedFeature = hovered;
        }
      })

      // TODO probably replace this by some VUE machism
      const element = document.getElementById('popup');

      const popup = new Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: false,
      });
      this.olMap.addOverlay(popup);

      this.olMap.on('click', (evt) => {
        if (this.mapInFocus){
          const feature = this.olMap.forEachFeatureAtPixel(evt.pixel, (feature) => feature)
          this.detailVisible = false
          if (!feature) {
            return;
          }
          console.log(feature)
          console.log(feature.getProperties().image_.value)         
          this.selectedImage = feature.getProperties().image_.value
          this.imageName = feature.getProperties().itemLabel.value
          this.institutionName = feature.getProperties().locationLabel.value
          this.description = `This painting was created in ${('year_inception') in feature.getProperties() ? feature.getProperties().year_inception_.value : 'unknown'}
                              it is ${feature.getProperties().materials_.value}
                              it measures ${feature.getProperties().width_.value}x${feature.getProperties().height_.value} (WxH)
                              and depicts ${feature.getProperties().depicts_.value}`
          popup.setPosition(evt.coordinate);
          this.detailVisible = true; 
        }
      });


      this.updateSource(this.geojson)
    },
    watch: {
      geojson(value) {
        this.updateSource(value)
      },
      selectedFeature(value) {
        this.$emit('select', value)
      },
      imageBlownUp(value){
        this.olMap.getInteractions().forEach(function(interaction) {
            interaction.setActive(!value);            
          }, this);
      }
    },
    methods: {
      hoverDetail (is_mouse_in) {
        this.mapInFocus = !is_mouse_in
      },
      updateSource(geojson) {
        const view = this.olMap.getView();
        const source = this.vectorLayer.getSource();        
        const features = new GeoJSON({
          featureProjection: 'EPSG:3857',
        }).readFeatures(geojson);
        const iconStyle = new Style({
                            image: new Icon({
                              anchor: [0.5, 1],
                              anchorXUnits: 'fraction',
                              anchorYUnits: 'fraction',
                              scale: 0.1,
                              src: '/assets/map-pin-icon.webp',
                            }),
                          });

        source.clear();
        features.forEach(function(e) {
            e.setStyle(function(feature, resolution) {
              //iconStyle.getImage().setScale(1/Math.pow(resolution, 1/2.5));
              //iconStyle.getImage().setScale(view.getResolutionForZoom(10) / resolution); 
              if (resolution > 2000) {
                iconStyle.getImage().setScale(0.05);
              } else {
                iconStyle.getImage().setScale(0.1);
              }
              console.log(resolution, view.getResolutionForZoom(10))   
              return iconStyle;
            })})          
        source.addFeatures(features);
        view.fit(source.getExtent())
      }
    }
  }
</script>
  