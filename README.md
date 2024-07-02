This React app runs a simulation where a directed graph behaves like an excitable medium. A few simple rules are used to make this possible.

For each state of the graph some nodes might have the potential to "pop". These nodes are the ones where all of their connected edges point towards them. If a node has any edges pointing away from it then it will not pop when the next step occurs.

Whenever a node pops, all of its connected edges are flipped. This causes it to lose its potential until all of those edges are flipped back.

Graphs evolve through continuous stepping and have vastly different behaviors depending on their design.

https://github.com/Ntropish/excite-graph/assets/7933153/2b8f7f55-309f-49e3-9f17-de6c9a86ee06

