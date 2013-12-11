// index.js
//
// main entry point
// creates a particle system and makes it go
define( function( require ) {

    var Emitter = require( 'particles/emitter' );

    // Add Stats
    var stats = new Stats();
    stats.setMode( 0 );
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );

    // constants
    var NUM_PARTICLES = 2000,
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

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 500;
        camera.velocity = new THREE.Vector3( 0,0,0 );
        window.camera = camera;

        scene = new THREE.Scene();

        // particle extension functions
        var pExt = {
            initialExtensions: {
                age: function() {
                    this.maxLife = Math.random() * 50 + 10;
                }
            },
            updateExtensions: {
                position: function() {
                    this.position.add( this.velocity );
                },
                scale: function() {
                    // NOTE: size and color should be offloaded to the GPU
//                    this.scale.multiplyScalar( 1.5 );
                }
            },
            resetExtensions: {
                position: function() {
                    this.position.x = Math.random() * 5 - 2.5;
                    this.position.y = Math.random() * 20 - 10;
                    this.position.z = Math.random() * 20 - 10;
                },
                velocity: function() {
                    this.velocity.x = ( Math.random() * 1.5 ) - 0.75;
                    this.velocity.y = ( Math.random() * 4 ) + 2;
                    this.velocity.z = 0;
                },
                scale: function() {
                    this.scale.x = this.scale.y = this.scale.z = Math.random() * 4 + 6;
                }
            }
        };

        // create the particle emitter and add it to the scene
        ps = window.ps = new Emitter( {
            position: new THREE.Vector3( 0, 0, 0 ),
            forces: new THREE.Vector3( 0, 0, 0 ),
            maxParticles: NUM_PARTICLES,
            extendParticle: pExt
        } );
        scene.add( ps.system );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

        registerEvents();
    }

    // The render loop where most of the action happens
    function render() {

        ps.render();

        // Rotate particles
//        ps.system.rotation.y += 0.01;
//        ps.system.rotation.x += 0.0045;
//
//        var pCount = NUM_PARTICLES;
//        while ( pCount-- ) {
//            var particle = ps.geometry.vertices[ pCount ];
//
//            // check for reset
//            if ( particle.y < -200 ) {
//                particle.y = 200;
//                particle.velocity.y = 0;
//                ps.geometry.colors[ pCount ].g = 1;
//            }
//
//            // update velocity
//            particle.velocity.y -= Math.random() * 0.1;
//
//            // update pos
//            particle.add( particle.velocity );
//
//            // update colors
//            ps.geometry.colors[ pCount ].g -= 0.01;     // loses the green to finish as red
//
//            // update the whole system
//            ps.geometry.__dirtyVertices = true;
//        }

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
        }, true );

    }
});