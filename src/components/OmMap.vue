<template>
    <div id = "om-map">
    </div>
</template>
 
<script>
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
 
export default {
    name: 'OmMap',
    mounted() {
        this.map = new Map({
            target: 'om-map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [0, 0],
                zoom: 2
            })
        })
    }
}
</script>