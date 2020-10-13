import { IGraph } from './'

export default class Edge {
  public from: number //откуда
  public to: number  //куда
  public weight: number = 1  //вес

  constructor(from: number, to: number, weight: number, vertexWeight: IGraph[]) {
    let fromTmp: number | null = null
    let toTmp: number | null = null
    vertexWeight.map((graph) => {
      if(graph.vertex.ID === from) fromTmp = graph.vertex.ID
      if(graph.vertex.ID === to) toTmp = graph.vertex.ID
    })
    this.from = fromTmp
    this.to = toTmp
    this.weight = weight
  }
}