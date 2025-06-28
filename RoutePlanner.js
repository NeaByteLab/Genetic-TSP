/**
 * Load Location And Distance Data
 */
function loadData() {
  const fs = require('fs')
  const locationArray = JSON.parse(fs.readFileSync('location_array.json', 'utf-8'))
  const distanceMatrix = JSON.parse(fs.readFileSync('location_matrix.json', 'utf-8'))
  return { locationArray, distanceMatrix }
}

/**
 * Generate Initial Population
 * Params: PopulationSize, RouteLength
 */
function generateInitialPopulation(populationSize, routeLength) {
  const populationArray = []
  for (let indexPosition = 0; indexPosition < populationSize; indexPosition++) {
    const routeArray = []
    for (let geneIndex = 0; geneIndex < routeLength; geneIndex++) {
      routeArray.push(geneIndex)
    }
    for (let shuffleIndex = routeArray.length - 1; shuffleIndex > 0; shuffleIndex--) {
      const randomIndex = Math.floor(Math.random() * (shuffleIndex + 1))
      const tempValue = routeArray[shuffleIndex]
      routeArray[shuffleIndex] = routeArray[randomIndex]
      routeArray[randomIndex] = tempValue
    }
    populationArray.push(routeArray)
  }
  return populationArray
}

/**
 * Calculate Route Distance
 * Params: RouteArray, DistanceMatrix
 */
function calculateRouteDistance(routeArray, distanceMatrix) {
  let totalDistance = 0
  for (let positionIndex = 0; positionIndex < routeArray.length; positionIndex++) {
    const fromNode = routeArray[positionIndex]
    const toNode = routeArray[(positionIndex + 1) % routeArray.length]
    totalDistance += distanceMatrix[fromNode][toNode]
  }
  return totalDistance
}

/**
 * Tournament Selection
 * Params: PopulationArray, FitnessArray, TournamentSize
 */
function tournamentSelection(populationArray, fitnessArray, tournamentSize) {
  const contestants = []
  for (let i = 0; i < tournamentSize; i++) {
    const randIndex = Math.floor(Math.random() * populationArray.length)
    contestants.push({ route: populationArray[randIndex], fitness: fitnessArray[randIndex] })
  }
  contestants.sort((a, b) => b.fitness - a.fitness)
  return contestants[0].route
}

/**
 * Order One Crossover
 * Params: ParentOne, ParentTwo
 */
function performOrderOneCrossover(parentOne, parentTwo) {
  const length = parentOne.length
  const offspring = new Array(length).fill(null)
  const start = Math.floor(Math.random() * length)
  const end = Math.floor(Math.random() * length)
  const begin = Math.min(start, end)
  const finish = Math.max(start, end)
  for (let idx = begin; idx <= finish; idx++) {
    offspring[idx] = parentOne[idx]
  }
  let current = finish + 1
  if (current >= length) {
    current = 0
  }
  for (const gene of parentTwo) {
    if (!(offspring.includes(gene))) {
      offspring[current] = gene
      current++
      if (current >= length) {
        current = 0
      }
    }
  }
  return offspring
}

/**
 * Swap Mutation
 * Params: RouteArray, MutationRate
 */
function applySwapMutation(routeArray, mutationRate) {
  for (let indexPosition = 0; indexPosition < routeArray.length; indexPosition++) {
    if (Math.random() < mutationRate) {
      const swapIndex = Math.floor(Math.random() * routeArray.length)
      const tempGene = routeArray[indexPosition]
      routeArray[indexPosition] = routeArray[swapIndex]
      routeArray[swapIndex] = tempGene
    }
  }
  return routeArray
}

/**
 * Evolve Population
 * Params: PopulationArray, DistanceMatrix, MutationRate
 */
function evolvePopulation(populationArray, distanceMatrix, mutationRate) {
  const fitnessArray = populationArray.map(route => 1 / calculateRouteDistance(route, distanceMatrix))
  const newPopulation = []
  const tournamentSize = 5
  for (let i = 0; i < populationArray.length; i++) {
    const parentOne = tournamentSelection(populationArray, fitnessArray, tournamentSize)
    const parentTwo = tournamentSelection(populationArray, fitnessArray, tournamentSize)
    let offspring = performOrderOneCrossover(parentOne, parentTwo)
    offspring = applySwapMutation(offspring, mutationRate)
    newPopulation.push(offspring)
  }
  return newPopulation
}

/**
 * Find Best Route In Population
 * Params: PopulationArray, DistanceMatrix
 */
function findBestRoute(populationArray, distanceMatrix) {
  let bestRoute = null
  let bestDistance = Infinity
  for (const route of populationArray) {
    const dist = calculateRouteDistance(route, distanceMatrix)
    if (dist < bestDistance) {
      bestDistance = dist
      bestRoute = route
    }
  }
  return { bestRoute, bestDistance }
}

/**
 * Find Best Route Across Runs
 * Params: RunCount, PopulationSize, MutationRate, GenerationCount, LocationArray, DistanceMatrix
 */
function findBestAcrossRuns(runCount, populationSize, mutationRate, generationCount, locationArray, distanceMatrix) {
  let globalBestRoute = null
  let globalBestDistance = Infinity
  for (let runIndex = 0; runIndex < runCount; runIndex++) {
    let population = generateInitialPopulation(populationSize, locationArray.length)
    for (let genIndex = 0; genIndex < generationCount; genIndex++) {
      population = evolvePopulation(population, distanceMatrix, mutationRate)
    }
    const { bestRoute, bestDistance } = findBestRoute(population, distanceMatrix)
    if (bestDistance < globalBestDistance) {
      globalBestDistance = bestDistance
      globalBestRoute = bestRoute
    }
  }
  return { globalBestRoute, globalBestDistance }
}

/**
 * Map Route Indices To Location Names
 * Params: RouteArray, LocationArray
 */
function mapRouteToLocationNames(routeArray, locationArray) {
  return routeArray.map(idx => locationArray[idx].locationName)
}

/**
 * Main Execution
 */
function main() {
  const { locationArray, distanceMatrix } = loadData()
  const runCount = 10
  const populationSize = 100
  const mutationRate = 0.02
  const generationCount = 500
  const { globalBestRoute, globalBestDistance } = findBestAcrossRuns(runCount, populationSize, mutationRate, generationCount, locationArray, distanceMatrix)
  const namedRoute = mapRouteToLocationNames(globalBestRoute, locationArray)
  console.log('Best Route Sequence:', namedRoute)
  console.log('Lowest Total Distance (km):', globalBestDistance)
}

main()