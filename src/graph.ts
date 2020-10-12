import * as fs from 'fs'
import * as readline from 'readline'

export interface IGraph {
  [index: number]: number[]
}

export class Graph {
  // Целый граф
  /*
    const graph = {
      0: [],
      1: []
    }
  */
  public graph: IGraph = []
  // Храним вершины
  private vertices: number[] = []
  // Храним ребра
  private edges: Array<number[]> = []
  constructor() {

  }

  // Создание графа
  public async createGraph(n: number, m: number, oriented: boolean = false) {
    //заполнение списока смежности
    //заполнение вершин
    for(let i = 0; i < n; ++i) {
      this.addVertex(i)
    }

    //заполнение ребер
    //если число ребер превышает допустимое значение - установить максимум
    if(oriented) { //для ориентированного
      if(m > n * (n - 1)) m = n * (n - 1)
    }else { //для неориентированного
      if(m > n * (n - 1) / 2) m = n * (n - 1) / 2
    }


  }

  // Добавить вершину (аргумент - вершина)
  public addVertex(vertex: number) {
    this.graph = Object.assign({}, {
      ...this.graph,
      [vertex]: []
    })
  }

  public defaultGraph(): void {
    this.createGraph(4, 6)
  }

  // Чтение графа
  public async readFromFile(): Promise<void> {
    // Считываем граф построчно
    const rl = readline.createInterface({
      input: fs.createReadStream('./test/graph.txt'),
      output: process.stdout,
      terminal: false
    })
    const lines: any = await this.lineIterator(rl)
    const items = lines.map((line: string) => line.split(' '))

    items.map((item: string[]) => {
      const tmp: number[] = []
      for(let i = 0; i < item.length; ++i) {
        if(i === 0) {
          this.vertices.push(Number(item[i]))
          continue
        }
        tmp.push(Number(item[i]))
      }
      this.edges.push(tmp)
    })
    for(let i = 0; i < this.vertices.length; ++i) {
      this.graph = Object.assign({}, {
        ...this.graph,
        [this.vertices[i]]: this.edges[i]
      })
    }
    // console.log('vertices', this.vertices)
    // console.log('edges', this.edges)
    console.log('graph', this.graph)
  }

  private async lineIterator(rl): Promise<string[]> {
    const lines = []
    return new Promise((resolve) => {
      rl.on('line', line => {
        lines.push(line)
      })
      rl.on('close', () => {
        resolve(lines)
      })
    })
  }
}