import Vertex from './vertex'
import { IGraph } from './graph'

export default class Edge {
  public from: Vertex //откуда
  public to: Vertex  //куда
  public weight: number = 1  //вес
  constructor(from: Vertex, to: Vertex, weight: number) {
    this.from = from
    this.to = to
    this.weight = weight
  }

  public edge(from: number, to: number, weight: number, vertexWeight: IGraph) {
    let tmpFrom = null
    let tmpTo = null
    for(const [key, value] of Object.entries(vertexWeight)) {
      if(Number(key) === from) tmpFrom = key
      if(Number(key) === to) tmpTo = key
    }
    this.from = tmpFrom
    this.to = tmpTo
    this.weight = weight
  }
}