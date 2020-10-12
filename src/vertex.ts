//Вершина
export default class Vertex {
  public ID: number
  public mark: boolean = false
  public subTree: number = 0
  constructor(id: number) {
    this.ID = id
  }
}