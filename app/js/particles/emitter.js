
define( function( require, exports, module ) {
    'use strict';

    var Particle = require( 'particles/particle' );

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
        for( var i = 0; i < this.maxParticles; i++ ) {
            p = new this.particle( this.extendParticle );
            this.geometry
                    .vertices
                    .push( p.position );

            this.particles.push( p );

//            this.colors.push( new THREE.Color().setRGB( 1, 1, 0 ) );        // See note about colors
        }

//        this.geometry.colors = this.colors;

        var pMaterial = new THREE.ParticleBasicMaterial( {
            color: 0xFFFFFF,
            size: 8,
            map: THREE.ImageUtils.loadTexture( '../../img/particle8a.png' ),
            blending: THREE.AdditiveBlending,
            transparent: true,
//            vertexColors: true
        } );

        var shaderMaterial = new THREE.ShaderMaterial( {

            uniforms: uniforms,
            attributes: attributes,

            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true

        });

        this.system = new THREE.ParticleSystem( this.geometry, pMaterial );
        this.system.position = this.position;
        this.system.sortParticles = true;
    };

    // Renders all those particles
    ParticleEmitter.prototype.render = function() {
        var self = this;

        this.particles.forEach( function( particle, i ) {
//            self.geometry.colors[ i ].g -= 0.01;                // see notes about colors
            particle.update();
            particle.applyForces( self.forces );
            self.geometry.__dirtyVertices = true;
        });
    };

    // Expose the module
    module.exports = ParticleEmitter;

});