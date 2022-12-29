<template>
    <div class="bg-gray-50 min-w-screen flex justify-left items-center">
      <div class="max-w-xs relative space-y-3">
        <label
          for="search"
          class="text-gray-100"
        >
          Type the name of a country to search
        </label>
  
        <input
          type="text"
          id="search"
          v-model="searchTerm"
          placeholder="Type here..."
          class="p-3 mb-0.5 w-full border border-gray-300 rounded"
        >
  
        <ul
          v-if="searchCountries.length"
          class="w-full rounded bg-white border border-gray-300 px-4 py-2 space-y-1 absolute z-10"
        >
          <li class="px-1 pt-1 pb-2 font-bold border-b border-gray-200">
            Showing first {{ searchCountries.length }} results
          </li>
          <li
              v-for="country in searchCountries"
              :key="country.name"
              @click="selectCountry(country.id, country.name)"
              class="cursor-pointer hover:bg-gray-100 p-1"
          >
            {{ country.long_name }}
          </li>
        </ul>
  
        <p
          v-if="selectedCountry"
          class="text-lg pt-2 absolute"
        >
          You have selected: <span class="font-semibold">{{ selectedCountry }}</span>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import {sparql_object_to_geojson} from './sparql_data_to_geojson.js'

  export default {
    props: {
        selectedCountry: String,         
    },
    emits: {
        change: null,
    },
    data() {
        return{   
            searchCountries: [] ,
            currentSearchTerm: ""   
    }},
    methods: {
        selectCountry(value, search_name) {
            console.log(value, search_name)
            //this.$emit('change', value)
            this.searchCountries = []
            //this.selectedCountry = value
            this.currentSearchTerm = search_name
            this.call_the_media_db_sparqle_artist(value)
        },
        call_the_media_db_sparqle_artist(artist_id) {
            axios.get('/wiki-data/sparql', {                    
                params: {
                query: `#All paintings for one particular artist with their location
SELECT
  ?item ?itemLabel
  ?author ?authorLabel
  ?locationLabel  
  (SAMPLE(DISTINCT ?coordinates) as ?coordinates_)
  (SAMPLE(?image) as ?image_)
  (MIN(?height) as ?height_)
  (MIN(?width) as ?width_)
  (GROUP_CONCAT(DISTINCT ?materials) as ?materials_)  
  (GROUP_CONCAT(DISTINCT ?depicts) as ?depicts_)  
  (GROUP_CONCAT(DISTINCT ?genre) as ?genre_)
  (MIN(?year_inception) as ?year_inception_)
  (SAMPLE(?itemDescription) as ?itemDescription_)
  (MAX(?sitelinks) as ?sitelinks_)
WHERE {
    ?item wdt:P31 wd:Q3305213;            # Any instance of a image
          wdt:P276 ?location;            # with a specific location, eg. MOMA wd:Q160236
          wdt:P18 ?image;
          wdt:P170 ?author;  #can be a specific author, eg. Edgar Degas Q46373
          wikibase:sitelinks ?sitelinks.
    OPTIONAL {?location wdt:P31 wd:Q207694 } # art museum
    OPTIONAL { ?location wdt:P31 wd:Q33506 } # museum 
    OPTIONAL { ?location wdt:P31 wd:Q3329412 } # archeological museum 
    OPTIONAL { ?location wdt:P31 wd:Q684740 } # real property     
    OPTIONAL { ?location wdt:P31 wd:Q515 } # city 
    OPTIONAL { ?location wdt:P31 wd:Q5119 } # capital city
    OPTIONAL { ?location wdt:P31 wd:Q1549591 } # big city
    ?location wdt:P625 ?coordinates.
    OPTIONAL {
      ?item wdt:P2048 ?height;
            wdt:P2049 ?width;
    }
    OPTIONAL { ?item wdt:P1071 ?location_of_creation.}
    OPTIONAL { ?item wdt:P180 ?depicts.
               } #?depicts rdfs:label ?depicts_label.}
    OPTIONAL { ?item wdt:P186 ?materials.
               } #?materials rdfs:label ?materials_label.}
    OPTIONAL { ?item wdt:P136 ?genre.}
    OPTIONAL { ?item wdt:P571 ?year_inception. } 
    FILTER(?author = wd:${artist_id})
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
}
GROUP BY ?item ?itemLabel ?author ?authorLabel ?locationLabel
ORDER BY DESC(?sitelinks)`
            }}).then(response => {
                console.log(response.data)
                let geojson = sparql_object_to_geojson(response.data.results.bindings)
                this.$emit('change', [artist_id, geojson])
            })           
        },
        call_the_wiki_search(value) {
            console.log(typeof(value))
            axios.post('/wiki-search/w/api.php', null, {                    
                params: {
                format: 'json',
                origin: '*',  
                action: "wbsearchentities",
                limit: "10", 
                continue: "0",
                language: "en",
                uselang: "en",
                type: "item",
                search: value
            }})
            .then(response => {
                let s_data = response.data.search.map(element => {
                    console.log(`${element.id}, ${element.label}, ${element.description}, ${element.label} (${element.description})`)
                    return {name: element.label,
                                      id: element.id,
                                      description: element.description,
                                    long_name: `${element.label} (${element.description})`}})
                this.searchCountries = s_data
                });                
            }              
    },
    computed: {
        searchTerm: {
            get () {
                return this.currentSearchTerm
            },
            set(value) {
                console.log(value)
                if (value === '') {
                    return []
                }            
                this.call_the_wiki_search(value)
                this.currentSearchTerm = value
                }
        }
    }
  }
  </script>