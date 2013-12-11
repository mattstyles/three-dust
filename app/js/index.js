// index.js
//
// main entry point
// creates a particle system and makes it go
define( function( require ) {

    var Emitter = require( 'particles/emitter' ),
        Particle = require( 'particles/particle' );

    // Add Stats
    var stats = new Stats();
    stats.setMode( 0 );
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );

    // constants
    var NUM_PARTICLES = 200,
        CAM_MAX_SPEED = 10,
        CAM_ACCEL = 2,
        CAM_INERTIA = 0.1;

    // stuff - kind of global
    var camera, scene, renderer;
    var ps;

    // Fire into it
    init();
    render();

    // Set stuff up, innit?
    function init() {

        camera = window.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 10, 1000 );
        camera.position.z = 500;
        camera.velocity = new THREE.Vector3( 0,0,0 );

        scene = new THREE.Scene();

        // particle extension functions
        var pExt = window.pExt = {
            initialExtensions: {
                age: function() {
                    this.maxLife = Math.random() * 60 + 60;
                }
            },
            updateExtensions: {
                position: function() {
                    this.position.add( this.velocity );
                },
                scale: function() {
                    this.scale *= 0.99;
                },
                color: function() {
                    this.color.r = this.age;
                    this.color.g = 1;
                    this.color.b = 0;
                }
            },
            resetExtensions: {
                position: function() {
                    this.position.x = Math.random() * 1.5 - 0.75;
                    this.position.y = Math.random() * 1.5 - 0.75;
                    this.position.z = 0;
                },
                velocity: function() {
                    this.velocity.x = ( Math.random() * 2 ) - 1;
                    this.velocity.y = ( Math.random() * 2 ) - 1;
                    this.velocity.z = 0;
                },
                scale: function() {
                    this.scale = Math.random() * 10 + 150;
                },
                color: function() {
                    this.color.r = 0;
                    this.color.g = 1;
                    this.color.b = 0;
                }
            }
        };

        // create the particle emitter and add it to the scene
        ps = window.ps = new Emitter( {
            position: new THREE.Vector3( 0, 0, 0 ),
            forces: new THREE.Vector3( 0, 0, 0 ),
            maxParticles: NUM_PARTICLES,
            particle: Particle,
            extendParticle: pExt
        } );
        scene.add( ps.system );

        renderer = window.renderer = new THREE.WebGLRenderer( {
            alpha: true
        } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0x000000, 0 );

        document.body.appendChild( renderer.domElement );

        registerEvents();
    }

    // The render loop where most of the action happens
    function render() {

        // render particle system
        if ( ps ) {
            ps.render();
        }


        // update camera
        camera.position.add( camera.velocity );
        if ( camera.velocity.z > 0 ) {
            camera.velocity.z -= CAM_INERTIA;
        } else if ( camera.velocity.z < 0 ) {
            camera.velocity.z += CAM_INERTIA;
        }

        // render the scene using the camera
        renderer.render(scene, camera);

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( render );

        stats.update();
    }


    // Catch events and respond
    function registerEvents() {

        document.addEventListener( 'keydown', function( event ) {
            // Up arrow
            if ( event.keyCode === 38 ) {
                if ( camera.velocity.z > -CAM_MAX_SPEED ) {
                    camera.velocity.z -= CAM_ACCEL;
                }
            }

            // Down
            if ( event.keyCode === 40 ) {
                if ( camera.velocity.z < CAM_MAX_SPEED ) {
                    camera.velocity.z += CAM_ACCEL;
                }
            }

            // space
            if ( event.keyCode === 32 ) {
                scene.remove( ps.system );
                ps = window.ps = new Emitter( {
                    position: new THREE.Vector3( Math.random() * 300 - 150, Math.random() * 300 - 150, 0 ),
                    forces: new THREE.Vector3( Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1, 0 ),
                    maxParticles: NUM_PARTICLES,
                    particle: Particle,
                    extendParticle: window.pExt
                } );
                scene.add( ps.system );
            }
        }, true );

    }
});