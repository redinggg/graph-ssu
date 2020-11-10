import { Graph } from './graph'

const main = (): void => {
  // const G1 = new Graph({})
  // console.log(G1.graph)

  // const G2 = new Graph({filename: 'graph.txt'})
  // console.log(G2.graph)
  // G2.save('graph.txt')
  // G2.removeVertex(2)
  // G2.save('graph.txt')
  // console.log(G2.graph)

  // const G3 = new Graph(G1)
  // console.log(G3.graph)

  const G4 = new Graph({ n: 4, m: 4, oriented: true })
  // G4.save('graph.txt')
  console.log(G4.adjacentVertices(0))
}

main()