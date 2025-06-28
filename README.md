# 🚚 Genetic TSP Route Planner

A Node.js implementation of a Genetic Algorithm (GA) for solving the Traveling Salesman Problem (TSP) applied to package delivery routes. Generates random delivery coordinates in a region, computes distances with the Haversine formula, and runs GA across multiple iterations to find the shortest route.

---

## 🔧 Features

- 🗺️ **Location Generation** via `GenerateLocation.js`: Randomly generate delivery points within a bounding box (default Surabaya).
- 📐 **Distance Matrix** saved in `location_matrix.json`: Haversine distances (km) for all point pairs.
- 🧬 **Genetic Algorithm** in `RoutePlanner.js`:
  - Order-1 crossover
  - Random initial population (default size: 100)
  - Tournament selection (contest size: 5)
  - Swap mutation (rate: 0.02)
  - Fitness function = inverse total route distance
- 🔄 **Multiple Runs**: Repeat GA (default 10 runs) to identify the global best route.
- 📈 **Output**: Logs the best route sequence (point names) and its total distance in km.

---

## 🚀 Usage

1. **Generate Data**
   ```bash
   node GenerateLocation.js
   ```
   - Creates `location_array.json` and `location_matrix.json`

2. **Run GA Planner**
   ```bash
   node RoutePlanner.js
   ```
   - Prints:
     - `Best Route Sequence: [PointX, PointY, ...]`
     - `Lowest Total Distance (km): <value>`

---

## ⚙️ Configuration

- **Point Count**: Modify `deliveryPointCount` in `GenerateLocation.js`
- **GA Parameters**: Adjust `runCount`, `populationSize`, `mutationRate`, and `generationCount` in `RoutePlanner.js`

---

## 📝 License

MIT License © 2025 [NeaByteLab](https://github.com/NeaByteLab)