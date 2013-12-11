
define( function( require, exports, module ) {
    'use strict';

    var Extension = function( extensions ) {
        var ext = [];

        if ( typeof extensions === 'object' ) {
            for( var prop in extensions ) {
                if ( typeof extensions[ prop ] === 'function' ) {
                    ext.push( extensions[ prop ] );
                }
            }
        }

        return {
            apply: function( context ) {
                ext.forEach( function( fn ) {
                    fn.apply( context );
                } );
            },
            get: function() {
                return ext;
            }
        };
    };

    var Particle = function( extend ) {

        extend = extend || {};

        this.position = new THREE.Vector3( 0, 0, 0 );
        this.velocity = new THREE.Vector3( 0, 0, 0 );
        this.scale = 10;
        this.color = new THREE.Color( 0xFFFFFF );

        this.initialExtensions = new Extension( extend.initialExtensions );
        this.updateExtensions = new Extension( extend.updateExtensions );
        this.resetExtensions = new Extension( extend.resetExtensions );

        this.currentLife = 0;
        this.maxLife = 50;
        this.age = 0;

        this.init();
    };

    Particle.prototype.init = function() {
        this.initialExtensions.apply( this );
        this.reset();
    };

    Particle.prototype.reset = function() {
        this.resetExtensions.apply( this );
    };

    Particle.prototype.update = function() {
        // Get age
        this.age = this.currentLife / this.maxLife;

        // Fire extension functions
        this.updateExtensions.apply( this );

        // Update age and reset if too old
        this.currentLife += 1;
        if ( this.currentLife >= this.maxLife ) {
            this.currentLife = 0;
            this.reset();
        }
    };

    Particle.prototype.applyForces = function( forces ) {
        this.velocity.add( forces );
    };

    module.exports = Particle;

});