let extent = 20037508.34
let scale = 1 / extent

function fromLL (lon, lat) {
  let position = lonLat2Mercator(lon, lat)
  return {x: (position.x + extent) / (2 * extent),y: 1 - ((position.y + extent) / (2 * extent))}
}

function lonLat2Mercator (lon, lat) {
  let x = lon * extent / 180
  let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)
  y = y * extent / 180
  return {x: x,y: y}
}

export default {fromLL,lonLat2Mercator,scale,extent}
