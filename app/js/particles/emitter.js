
define( function( require, exports, module ) {
    'use strict';

    var Particle = require( 'particles/particle' );


    function generateSprite() {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 128;
        canvas.height = 128;

        var context = canvas.getContext( '2d' );

        // Just a square, doesnt work too bad with blur pp.
        // context.fillStyle = "white";
        // context.strokeStyle = "white";
        // context.fillRect(0, 0, 63, 63) ;

        // Heart Shapes are not too pretty here
        // var x = 4, y = 0;
        // context.save();
        // context.scale(8, 8); // Scale so canvas render can redraw within bounds
        // context.beginPath();
        // context.bezierCurveTo( x + 2.5, y + 2.5, x + 2.0, y, x, y );
        // context.bezierCurveTo( x - 3.0, y, x - 3.0, y + 3.5,x - 3.0,y + 3.5 );
        // context.bezierCurveTo( x - 3.0, y + 5.5, x - 1.0, y + 7.7, x + 2.5, y + 9.5 );
        // context.bezierCurveTo( x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5 );
        // context.bezierCurveTo( x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y );
        // context.bezierCurveTo( x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5 );

        context.beginPath();
        context.arc( 64, 64, 60, 0, Math.PI * 2, false) ;

        context.lineWidth = 0.5; //0.05
        context.stroke();
        context.restore();

        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );

        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.2, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.4, 'rgba(200,200,200,1)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

        context.fillStyle = gradient;

        context.fill();

        return canvas;
    }


    // Constructor function
    var ParticleEmitter = function( extend ) {

        // Specify the extension object
        extend = extend || {};

        // Privates
        this.position = extend.position || new THREE.Vector3( 0, 0, 0 );
        this.forces = extend.forces || new THREE.Vector3( 0, 0, 0);
        this.maxParticles = extend.maxParticles || 10;
        this.extendParticle = extend.extendParticle || null;
        this.particle = extend.particle || Particle;
        this.particles = [];
        this.geometry = new THREE.Geometry();
        this.system = null;     // Having the actual THREE particle system as a prop is pretty annoying as this object should BE a THREE particle system
        this.colors = [];

        // Set this up
        this.init();
    };

    // Initialises the system
    ParticleEmitter.prototype.init = function() {
        var p;

        // Create material for shader
        var sprite = generateSprite();
        var texture = new THREE.Texture( sprite );
        texture.needsUpdate = true;

        this.attributes = window.attributes = {
            size:  { type: 'f', value: [] },
            pcolor: { type: 'c', value: [] }
        };

        this.uniforms = {
            texture:   { type: 't', value: texture }
        };

        var shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            attributes: this.attributes,

            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true
        });

        var valueSize = attributes.size.value;
        var valueColor = attributes.pcolor.value;

        for( var i = 0; i < this.maxParticles; i++ ) {
            p = new this.particle( this.extendParticle );
            this.geometry
                    .vertices
                    .push( p.position );

            this.particles[ i ] = p;

            this.attributes.size.value[ i ] = this.particles[ i ].scale || 10;
            valueColor[ i ] = this.particles[ i ].color || new THREE.Color( 0xFFFFFF);
        }

        this.system = new THREE.ParticleSystem( this.geometry, shaderMaterial );
        this.system.position = this.position;
        this.system.sortParticles = true;
//        this.system.dynamic = true;
    };

    // Renders all those particles
    ParticleEmitter.prototype.render = function() {
        var self = this;

        this.particles.forEach( function( particle, i ) {
//            self.geometry.colors[ i ].g -= 0.01;                // see notes about colors
            particle.update();
            particle.applyForces( self.forces );

            self.attributes.size.value[ i ] = self.particles[ i ].scale;
        });

//        self.geometry.__dirtyVertices = true;
        this.system.geometry.verticesNeedUpdate = true;

        this.attributes.size.needsUpdate = true;
        this.attributes.pcolor.needsUpdate = true;
    };

    // Expose the module
    module.exports = ParticleEmitter;

});