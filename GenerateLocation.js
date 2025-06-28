/**
 * Generate Random Delivery Points Array
 * Params: TotalPointCount, LatitudeMin, LatitudeMax, LongitudeMin, LongitudeMax
 */
function generateRandomDeliveryPointsArray(totalPointCount, latitudeMin, latitudeMax, longitudeMin, longitudeMax) {
  const deliveryPointsArray = []
  for (let indexPosition = 0; indexPosition < totalPointCount; indexPosition++) {
    const randomLatitude = latitudeMin + Math.random() * (latitudeMax - latitudeMin)
    const randomLongitude = longitudeMin + Math.random() * (longitudeMax - longitudeMin)
    deliveryPointsArray.push({ locationName: 'Point' + (indexPosition + 1), latitudeValue: randomLatitude, longitudeValue: randomLongitude })
  }
  return deliveryPointsArray
}

/**
 * Calculate Distance Matrix Array
 * Params: LocationArray
 */
function calculateDistanceMatrixArray(locationArray) {
  const earthRadiusKilometers = 6371
  const matrixArray = []
  for (let firstIndexPosition = 0; firstIndexPosition < locationArray.length; firstIndexPosition++) {
    const rowArray = []
    for (let secondIndexPosition = 0; secondIndexPosition < locationArray.length; secondIndexPosition++) {
      const firstLocation = locationArray[firstIndexPosition]
      const secondLocation = locationArray[secondIndexPosition]
      const firstLatitudeRadians = firstLocation.latitudeValue * Math.PI / 180
      const firstLongitudeRadians = firstLocation.longitudeValue * Math.PI / 180
      const secondLatitudeRadians = secondLocation.latitudeValue * Math.PI / 180
      const secondLongitudeRadians = secondLocation.longitudeValue * Math.PI / 180
      const deltaLatitude = secondLatitudeRadians - firstLatitudeRadians
      const deltaLongitude = secondLongitudeRadians - firstLongitudeRadians
      const sineLatitude = Math.sin(deltaLatitude / 2)
      const sineLongitude = Math.sin(deltaLongitude / 2)
      const aValue = sineLatitude * sineLatitude + Math.cos(firstLatitudeRadians) * Math.cos(secondLatitudeRadians) * sineLongitude * sineLongitude
      const cValue = 2 * Math.atan2(Math.sqrt(aValue), Math.sqrt(1 - aValue))
      const distanceValue = earthRadiusKilometers * cValue
      rowArray.push(distanceValue)
    }
    matrixArray.push(rowArray)
  }
  return matrixArray
}

/**
 * Save Json To File
 * Params: FileName, DataObject
 */
function saveJsonToFile(fileName, dataObject) {
  const jsonString = JSON.stringify(dataObject, null, 2)
  require('fs').writeFileSync(fileName, jsonString)
}

const regionLatitudeMin = -7.40
const regionLatitudeMax = -7.15
const regionLongitudeMin = 112.64
const regionLongitudeMax = 112.82
const deliveryPointCount = 100
const randomizedDeliveryPointsArray = generateRandomDeliveryPointsArray(deliveryPointCount, regionLatitudeMin, regionLatitudeMax, regionLongitudeMin, regionLongitudeMax)
const distanceMatrixArray = calculateDistanceMatrixArray(randomizedDeliveryPointsArray)
saveJsonToFile('location_array.json', randomizedDeliveryPointsArray)
saveJsonToFile('location_matrix.json', distanceMatrixArray)