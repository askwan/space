import MapControl from './map'
import {Deck,MapController} from '@deck.gl/core'
import {GeoJsonLayer} from '@deck.gl/layers'
const GEOJSON =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson';


const init = ()=>{

  const mapControl = new MapControl({
    container:'map',
    style:'mapbox://styles/mapbox/dark-v9',
    zoom:3,
    bearing:30,
    pitch:30,
    center:[-100,40]
  });
  
  console.log(mapControl,'mm')
  
  const deck = new Deck({
    canvas:'deck-canvas',
    width:'100%',
    height:'100%',
    initialViewState:{
      latitude: 40,
      longitude: -100,
      zoom: 3,
      bearing: 30,
      pitch: 30
    },
    controller:MapController,
    onViewportChange: viewState => {
      mapControl.map.setProps({viewState});
    },
    layers:[
      new GeoJsonLayer({
        data: GEOJSON,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 2,
        opacity: 0.4,
        getLineColor: () => [255, 100, 100],
        getFillColor: () => [200, 160, 0, 180]
      })
    ]
  });
  return deck;

}


export default init;