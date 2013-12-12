# three-dust

> Particle emitter for [THREEJS](http://threejs.org/)

## Getting Started
It’s not registered with bower or npm yet so only way is to clone this repo:

```shell
git clone git@github.com:mattstyles/three-dust.git
```

and run it:

```shell
grunt
```

## Documentation
It’s pretty simple to use, have a look at the examples.  Preset emitters are coming but for now you’re not restricted to an implementation, the functionality for _your_ particle system comes from the best person to give it functionality: __you__.

## Examples
Have a look in the examples directory.  You’ll need to build the assets to make sure it’s all up to date, do so with:

```shell
grunt examples
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_None_

## License
Copyright (c) 2013 Matt Styles
Licensed under the MIT license.

## Notes
Scaffolded with `yo threejs` but then changed a little to support additional modules and commonjs style, see `main.js`.

It actually started out life as a port of [pixi-dust](https://github.com/mattstyles/pixi-dust) but has already outgrown it’s roots.
