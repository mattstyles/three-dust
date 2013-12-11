Scaffolded with `yo threejs` but then changed a little to support additional modules and commonjs style, see `main.js`.


This project looks to port pixi-dust over to threejs to see what differences have to be made and any speed boosts that happen.

So it looks like threejs is quite a bit faster, and, crucially, looks more extensible in terms of using shaders to access the different particles (particularly the vertex shader).  At the moment it is a little hard to tell because the chunky bit in pixi was raising a filter for each element but that constraint should be able to be removed by creating shaders that reference the age of the particle.

Using colors by using the vertexColors:true flag in the particle system geometry array does work but its a little strange to have the particles fairly self constrained but then their colour being dictated by a color array which is outside of their control.  There is a little hit on rendering performance here too.  Offload to the shaders should be the next move.