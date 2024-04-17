let engine = Matter.Engine.create();

function initializeSimulation(container) {
    let render = Matter.Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.offsetWidth,
            height: container.offsetHeight,
            wireframes: false
        }
    });

    Matter.Runner.run(engine);
    Matter.Render.run(render);
}

function createBall() {
    let ball = Matter.Bodies.circle(Math.random() * 400, 0, 20, {
        restitution: 0.6
    });
    Matter.World.add(engine.world, [ball]);
}

function updatePhysicsSimulation(container, progress) {
    if (!container.initialized) {
        initializeSimulation(container);
        container.style.display = "block";
        container.initialized = true;
    }

    createBall();
}