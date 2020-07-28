import { parameters } from "./parameters"
import * as BABYLON from 'babylonjs';


export class Builder {
    static prepareScene = function (engine) {
        parameters.scene = new BABYLON.Scene(engine);
        parameters.scene.collisionsEnabled = true;
        parameters.scene.useRightHandedSystem = true;
        parameters.scene.clearColor = new BABYLON.Color3(1, 1, 1)

    }

    static preCreatePickedMesh = function () {
        parameters.pickedMesh = new BABYLON.Mesh.CreateBox("box", 1, parameters.scene)
        parameters.pickedMesh.material = new BABYLON.StandardMaterial("", parameters.scene)
        parameters.pickedMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
        parameters.pickedMesh.dispose();

    }

    static setLights = function () {
        parameters.lights = []
        // LIGHT
        // let light1 = new BABYLON.PointLight("point", new BABYLON.Vector3(-10, 10, -10), parameters.scene);
        // let light2 = new BABYLON.PointLight("point", new BABYLON.Vector3(10, 10, 10), parameters.scene);
        // let light3 = new BABYLON.PointLight("point", new BABYLON.Vector3(0, 20, 0), parameters.scene);
        // let light4 = new BABYLON.PointLight("point", new BABYLON.Vector3(60, 0, -60), parameters.scene);
        // let light5 = new BABYLON.PointLight("point", new BABYLON.Vector3(-60, 0, -60), parameters.scene);
        // light1.intensity = 0.4
        // light2.intensity = 0.4
        // light3.intensity = 0.5
        // light4.intensity = 0.7
        // light5.intensity = 0.7
        let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), parameters.scene)
        light.intensity = 1.5
        parameters.lights.push(light)
    }

    static prepareGround = function () {
        let xmin = -parameters.floorSize / 2;
        let zmin = -parameters.floorSize / 2;
        let xmax = parameters.floorSize / 2;
        let zmax = parameters.floorSize / 2;
        let precision = {
            "w": 2,
            "h": 2
        };
        let subdivisions = {
            'h': 2,
            'w': 2
        };
        let ground = new BABYLON.Mesh.CreateTiledGround("Tiled Ground", xmin, zmin, xmax, zmax, subdivisions, precision, parameters.scene);
        ground.material = new BABYLON.StandardMaterial("mat", parameters.scene);
        // ground.material.diffuseColor = new BABYLON.Color3(0.55, 0.55, 0.55)

        ground.material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        ground.material.diffuseTexture = new BABYLON.Texture("./textures/floor3.jpg", parameters.scene)
        ground.material.bumpTexture = new BABYLON.Texture("./textures/floor3normal.jpg", parameters.scene)
        // ground.material.invertNormalMapX = true;
        ground.material.invertNormalMapY = true
        ground.material.useParallax = true;
        ground.material.useParallaxOcclusion = true;
        ground.material.parallaxScaleBias = 0.2;
        ground.material.specularPower = 1000.0;


        parameters.ground=ground
    }

    static prepareCamera = function () {
        let camera = new BABYLON.ArcRotateCamera("arcCam", -Math.PI / 2, BABYLON.Tools.ToRadians(70), parameters.floorSize * 2, parameters.ground, parameters.scene);
        camera.upperBetaLimit = Math.PI / 2.15
        camera.allowUpsideDown = false
        camera.lowerRadiusLimit = parameters.wallSize * 2
        camera.wheelPrecision = 100 / parameters.floorSize
        camera.maxZ = 100000
        // let camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 0, 0), parameters.scene)
        // camera.setTarget(parameters.ground.position)
        camera.attachControl(canvas, true);

        parameters.camera = camera
    }
}