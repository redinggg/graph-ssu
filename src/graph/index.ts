import * as fs from 'fs'

import Edge from './edge'
import Vertex from './vertex'

import { getRandomInt } from '../utils/random'

export interface IGraph {
  vertex: Vertex
  edges: Edge[]
}

export interface IConstructorGraph {
  filename?: string
  graph?: IGraph[]
  n?: number
  m?: number
  oriented?: boolean
}

export class Graph {
  // Цельный граф
  public graph: IGraph[] = []
  public edges: Edge[] = []

  constructor({
    filename,
    graph,
    n,
    m,
    oriented
  }: IConstructorGraph) {
    if(n && m) this.createGraph(n, m, oriented)
    // конструктор, заполняющий данные графа из файла
    else if(filename) this.readFromFile(filename)
    // конструктор-копия
    else if(graph) this.graph = graph
    // конструктор по умолчанию
    else this.createGraph(4, 6)
  }

  // взвешенный неориентированный граф из N вершин и M ребер
  public createGraph(n: number, m: number, oriented: boolean = false): void {
    //заполнение списока смежности
    //заполнение вершин
    for(let i = 0; i < n; ++i) this.addVertex(i)

    //заполнение ребер
    //если число ребер превышает допустимое значение - установить максимум
    if(oriented) { //для ориентированного
       if (m > n * (n - 1)) m = n * (n - 1);
    }else { //для неориентированного
       if (m > n * (n - 1) / 2) m = n * (n - 1) / 2;
    }

    for(let i = 0; i < m; ++i) {
       // взять 2 несовпадающие вершины
       const r1: number = getRandomInt(n)
       let r2: number = getRandomInt(n)
       // Здесь следить, чтобы R.Next не оказался == предыдущему
       while(r1 === r2) r2 = getRandomInt(n)
       
       let K: IGraph = this.graph[0]
       //Найти такую, чтобы вершина была r1
       this.graph.map((graph: IGraph) => {
         if(graph.vertex.ID === r1) K = graph
       })

       //найти ребро r2
       let exists: boolean = false
       for(const l of K.edges) {
         if(l.to === r2) exists = true
       }
       if(exists) {
         i--
         continue
       }

       //Добавить ребро "туда" и "обратно", если надо
       const weight: number = getRandomInt(10 + 1)
       let edge: Edge = new Edge(r1, r2, weight, this.graph)

       this.addEdge(edge)

       if(!oriented) { //Не ориенированный - значит, и обратное ребро тоже есть
         edge = new Edge(r2, r1, weight, this.graph)
         this.addEdge(edge)
       }
    }
    //заполнить список ребер
    this.vertexWeightToEdge()
    this.save()
  }

  public save(filename: string = 'graph.txt'): void {
    let graphText: string = ''
    this.graph.map((graph: IGraph) => {
      let s: string = `${graph.vertex.ID} `
      graph.edges.map((edge: Edge) => {
        s += `${edge.to} ${edge.weight} `
      })
      graphText += `${s}\n`
    })
    fs.appendFileSync(`./output/${filename}`, `${graphText}\n\n`)
  }

  //конвертация списка смежности в список ребер
  private vertexWeightToEdge(): void {
    this.edges = []
    this.graph.map((graph: IGraph) => {
      this.edges.push(...graph.edges)
    })
  }

  // Удаление ребро
  public removeEdge(from: number, to: number): void {
    //Найти исходящую вершину
    this.graph
      .filter((graph: IGraph) => graph.vertex.ID === from)
      .map((graph: IGraph) => {
        //Найти в ее списке ребер нужное
        graph.edges.map((edge: Edge, idx: number) => {
          if(edge.to === to) {
            //Удалить
            graph.edges.splice(idx, 1)
            return
          }
        })
      })
  }

  // Удаление вершины
  public removeVertex(vertex: number): void {
    //удалить ребра, идущие в вершину
    this.graph.map((graph: IGraph) => {
      graph.edges.map((edge: Edge, idx: number) => {
        if(edge.to === vertex) {
          graph.edges.splice(idx, 1)
          return
        }
      })
    })
    //Найти и удалить саму вершину
    this.graph.map((graph: IGraph, idx: number) => {
      if(graph.vertex.ID === vertex) {
        this.graph.splice(idx, 1)
        return
      }
    })
  }

  // Добавление ребро
  public addEdge(edge: Edge): void {
    //найти по точке from куда добавит ребро
    this.graph.map((graph: IGraph) => {
      if(graph.vertex.ID === edge.from) {
        graph.edges.push(edge)
      }
    })
  }


  // Добавление вершины
  public addVertex(vertex: number): void {
    const newVertex = Object.assign({}, {
      vertex: new Vertex(vertex),
      edges: []
    })
    this.graph.push(
      newVertex
    )
  }

  // Чтение графа
  public readFromFile(filename: string = 'graph.txt'): void {
    // Считываем граф построчно и конвертируем в массив
    const lines: string[] = fs.readFileSync(`./input/${filename}`, 'utf-8').split('\r\n')
    const items: string[][] = lines.map((line: string) => line.split(' '))
    items.map((item: string[]) => {
      // Добавляем ребро
      this.addVertex(Number(item[0]))
    })
    items.map((item: string[]) => {
      // Добавляем вершину
      for(let i = 1; i < item.length; i += 2) {
        const from: number = Number(item[0])
        const to: number = Number(item[i])
        const weight: number = Number(item[i+1])
        const edge: Edge = new Edge(from, to, weight, this.graph)
        this.addEdge(edge)
      }
    })
    // console.log('graph', this.graph)
  }
}