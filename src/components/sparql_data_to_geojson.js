
export function sparql_object_to_geojson(sparql_data) {
    let fields_to_split = ['depicts_', 'materials_', 'genre_']
    let geojson_data = sparql_data.map(item => {
        // TODO fugly - needs to be done properly
        let [longitude, latitude] = item.coordinates_.value.split("(")[1].split(")")[0].split(" ")
        let properties = {}
        for (const [key, value] of Object.entries(item)) {
            console.log(`${key}: ${value.value}`);
            properties = {...properties, ...{[key]: value}}
        }
        return {type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                properties: properties}
    })    
    return {type: "FeatureCollection",
            features: geojson_data}
}