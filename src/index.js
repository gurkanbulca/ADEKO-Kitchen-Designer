import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-loaders';
import axios from "axios";
import $ from "jquery";
import { VertexBody } from "./meshGenerator"
import { MeshGenerator } from "./meshGenerator"
import { parameters } from "./parameters"
import { SceneBuilder } from "./sceneBuilder"
import { createUrunList } from "./models"
import { Tools } from "./tools"
import { MyGUI } from './gui';




window.addEventListener("DOMContentLoaded", function () {
    parameters.canvas = document.getElementById("canvas")
    let engine = new BABYLON.Engine(parameters.canvas, true);
    
    let createScene = function () {

        SceneBuilder.prepareScene(engine)
        SceneBuilder.preCreatePickedMesh()
        SceneBuilder.setLights()
        SceneBuilder.prepareGround()
        SceneBuilder.prepareCamera()


        //Cursor Pointer
        let origin = MeshGenerator.createPointer()


        //WALL CONFIGS
        let wallMaterial = new BABYLON.StandardMaterial("wallMaterial", parameters.scene)
        wallMaterial.specularColor = new BABYLON.Color3.Black()
        // wallMaterial.diffuseColor = new BABYLON.Color3.FromHexString("#ffe0c9");
        wallMaterial.diffuseTexture = new BABYLON.Texture("./textures/wall1.jpg", parameters.scene)
        parameters.wallMaterial = wallMaterial;


        // let wallCount = 4;
        // for (let i = 0; i < wallCount; i++) {
        //     let wall = SceneBuilder.createWall("wall" + (i + 1), wallMaterial)
        //     parameters.walls.push(wall)
        // }

        parameters.walls.push(SceneBuilder.createWall("wall",wallMaterial,"NORTH"))
        parameters.walls.push(SceneBuilder.createWall("wall",wallMaterial,"WEST"))
        parameters.walls.push(SceneBuilder.createWall("wall",wallMaterial,"EAST"))


        parameters.urunler = createUrunList()

        // KAPI
        // let door = new BABYLON.Mesh("door", parameters.scene);
        // door.position.y = 0
        // door.position.x = -parameters.floorSize / 2 + 20

        // BABYLON.SceneLoader.ImportMesh("", "./meshes/Door/", "Vintage-Door.obj", parameters.scene, function (mesh) {
        //     mesh.map(m => {
        //         // m.position.y = 0
        //         // m.scaling = new BABYLON.Vector3(30, 30, 30)
        //         let vertexData = new BABYLON.VertexData();
        //         vertexData.positions = m.getVerticesData(BABYLON.VertexBuffer.PositionKind)
        //         vertexData.indices = m.getIndices();
        //         vertexData.normals = m.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        //         vertexData.uvs = m.getVerticesData(BABYLON.VertexBuffer.UVKind);
        //         let customMesh = new BABYLON.Mesh("door_part", parameters.scene);
        //         vertexData.applyToMesh(customMesh, true);
        //         m.dispose()
        //         door.addChild(customMesh);
        //         // customMesh.actionManager = new BABYLON.ActionManager(parameters.scene);
        //         // customMesh.actionManager.registerAction(
        //         //     new BABYLON.ExecuteCodeAction(
        //         //         BABYLON.ActionManager.OnLeftPickTrigger,
        //         //         () => {
        //         //             door.getChildMeshes().map(child => {
        //         //                 let test = new VertexBody(child, { left: [0, 2, 3] })
        //         //                 test.left = [0, 2, 4, 6, 7];
        //         //                 test.center = [3, 5, 7];
        //         //                 test.scale(test.center, -30)
        //         //                 test.rotate(left, 30);
        //         //                 test.ref = 30;

        //         //                 test.scaleY(10);
        //         //                 let mesh = new BABYLON.Mesh("door_part", parameters.scene, door);
        //         //                 test.getVertexData().applyToMesh(mesh, true);
        //         //                 mesh.position = new BABYLON.Vector3.Zero()
        //         //                 child.dispose()
        //         //                 // child.scaling.z+=1


        //         //             })


        //         //         }
        //         //     )
        //         // )
        //         customMesh.position = new BABYLON.Vector3.Zero();


        //     })
        //     door.scaling = new BABYLON.Vector3(30, 30, 30)
        //     // parameters.parameters.camera.setTarget(new BABYLON.Vector3(door.position.x,door.position.y+1000,door.position.z))

        //     mesh[1].material = new BABYLON.StandardMaterial("", parameters.scene)
        //     mesh[1].material.diffuseTexture = new BABYLON.Texture("./meshes/Door/Textures/BMAG-m.jpg", parameters.scene)
        //     let pbr = new BABYLON.PBRMaterial("pbr", parameters.scene);
        //     mesh[3].material = pbr;
        //     pbr.albedoTexture = new BABYLON.Texture("./meshes/Door/Textures/Metall-scratch.png");
        //     // pbr.specularColor = new BABYLON.Color3(1.0, 0.766, 0.336);
        //     pbr.metallic = 1.0
        //     pbr.roughness = 0.3
        //     pbr.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./meshes/Door/Textures/environment.dds", parameters.scene);
        //     mesh[5].material = new BABYLON.StandardMaterial("", parameters.scene)
        //     mesh[5].material.diffuseTexture = new BABYLON.Texture("./meshes/Door/Textures/BMAG-m.jpg")

        // })

        parameters.scene.registerBeforeRender(() => {
            // Highlight edilmis meshin parlatılması
            if (parameters.highlightedMesh) {
                parameters.placedMeshes.map(object => {
                    if (parameters.highlightedMesh == object) {
                        object.material.emissiveColor = new BABYLON.Color3.FromHexString("#ff8400")
                    } else {
                        object.material.emissiveColor = new BABYLON.Color3.Black()
                    }
                })
            }


            // seçilmiş meshin hareket mekaniği
            if (parameters.isMeshPicked) { // sadece herhangi bir mesh yerleştirmek için seçildiğinde çalışır
                // mouse konumunun koordinat düzlemine aktarılması <..
                let pickResult = parameters.scene.pick(parameters.scene.pointerX, parameters.scene.pointerY);
                if (pickResult.hit) {
                    // let mousePosition = new BABYLON.Vector3(pickResult.pickedPoint.x, parameters.originHeight, pickResult.pickedPoint.z)
                    // origin.position = mousePosition

                    // if (origin.intersectsMesh(parameters.ground, false)) {
                    parameters.pickedMesh.position.x = origin.position.x
                    parameters.pickedMesh.position.z = origin.position.z
                    // }



                    let leftCollider = parameters.pickedMesh.getChildMeshes().filter(child => child.name == "left")[0]
                    let rightCollider = parameters.pickedMesh.getChildMeshes().filter(child => child.name == "right")[0]
                    let backCollider = parameters.pickedMesh.getChildMeshes().filter(child => child.name == "back")[0]


                    // Duvarlara temas let mı?
                    let backIntersectedWall = null
                    parameters.walls.map(wall => backCollider.intersectsMesh(wall, false) ? backIntersectedWall = wall : "")

                    let rightInersectedWall = null
                    parameters.walls.map(wall => rightCollider.intersectsMesh(wall, false) ? rightInersectedWall = wall : "")

                    let leftIntersectedWall = null
                    parameters.walls.map(wall => leftCollider.intersectsMesh(wall, false) ? leftIntersectedWall = wall : "")


                    // diğer meshlere temas let mı?
                    let rightIntersectedMesh = null
                    parameters.placedMeshes.map(obj => leftCollider.intersectsMesh(obj, false) ? rightIntersectedMesh = obj : "")

                    let leftIntersectedMesh = null
                    parameters.placedMeshes.map(obj => rightCollider.intersectsMesh(obj, false) ? leftIntersectedMesh = obj : "")


                    // arka yüzeyden duvara temas
                    if (backIntersectedWall) {
                        let rotationVector = Tools.rotateVector(new BABYLON.Vector3(0, 0, 1), parameters.rotationAmount)
                        let wallRotationVector = Tools.rotateVector(new BABYLON.Vector3(0, 0, 1), backIntersectedWall.rotation.y)
                        if (rotationVector.x == 1) {
                            parameters.pickedMesh.position.x = (backIntersectedWall.position.x
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }
                        else if (rotationVector.x == -1) {
                            parameters.pickedMesh.position.x = (backIntersectedWall.position.x
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }
                        else if (rotationVector.z == 1) {
                            parameters.pickedMesh.position.z = (backIntersectedWall.position.z
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }
                        else if (rotationVector.z == -1) {
                            parameters.pickedMesh.position.z = (backIntersectedWall.position.z
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }



                    }

                    let collision = false
                    collision = parameters.placedMeshes.filter(obj => obj.getChildMeshes().filter(col => col.name == "front")[0].intersectsMesh(parameters.pickedMesh, false)).length > 0
                    let innerMesh = parameters.pickedMesh.getChildren().filter(child => child.name == "inner")[0]
                    parameters.walls.filter(wall => wall.intersectsMesh(innerMesh, true)).length > 0 ? collision = true : ""
                    parameters.placedMeshes.filter(obj => obj.intersectsMesh(innerMesh, true)).length > 0 ? collision = true : ""
                    // sağ yüzeyden meshe temas
                    if (rightIntersectedMesh && !collision) {

                        let rotationVector = Tools.rotateVector(new BABYLON.Vector3(0, 0, 1), parameters.rotationAmount)
                        if (rotationVector.z == 1) {
                            parameters.pickedMesh.position.x = (rightIntersectedMesh.position.x
                                + rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.z == -1) {
                            parameters.pickedMesh.position.x = (rightIntersectedMesh.position.x
                                - rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.x == 1) {
                            parameters.pickedMesh.position.z = (rightIntersectedMesh.position.z
                                - rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.x == -1) {
                            parameters.pickedMesh.position.z = (rightIntersectedMesh.position.z
                                + rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }


                    }
                    // sol yüzeyden meshe temas
                    else if (leftIntersectedMesh && !collision) {
                        let rotationVector = Tools.rotateVector(new BABYLON.Vector3(0, 0, 1), parameters.rotationAmount)
                        if (rotationVector.z == 1) {
                            parameters.pickedMesh.position.x = (leftIntersectedMesh.position.x
                                - leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x)
                        }
                        else if (rotationVector.z == -1) {
                            parameters.pickedMesh.position.x = (leftIntersectedMesh.position.x
                                + leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x)
                        }
                        else if (rotationVector.x == 1) {
                            parameters.pickedMesh.position.z = (leftIntersectedMesh.position.z
                                + leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.x == -1) {
                            parameters.pickedMesh.position.z = (leftIntersectedMesh.position.z
                                - leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }


                    }
                    // sol kenardan köşe duvara temas
                    else if (backIntersectedWall && leftIntersectedWall) {
                        let rotationVector = Tools.rotateVector(new BABYLON.Vector3(0, 0, 1), parameters.rotationAmount)
                        if (rotationVector.z == 1) {

                            parameters.pickedMesh.position.z = (backIntersectedWall.position.z
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            parameters.pickedMesh.position.x = (leftIntersectedWall.position.x
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x)
                        }
                        else if (rotationVector.z == -1) {
                            parameters.pickedMesh.position.z = (backIntersectedWall.position.z
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            parameters.pickedMesh.position.x = (leftIntersectedWall.position.x
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x)
                        }
                        else if (rotationVector.x == 1) {
                            parameters.pickedMesh.position.x = (backIntersectedWall.position.x
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            parameters.pickedMesh.position.z = (leftIntersectedWall.position.z
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);

                        }
                        else if (rotationVector.x == -1) {
                            parameters.pickedMesh.position.x = (backIntersectedWall.position.x
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            parameters.pickedMesh.position.z = (leftIntersectedWall.position.z
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);

                        }
                    }
                    // sağ kenardan köşe duvara temas
                    else if (backIntersectedWall && rightInersectedWall) {
                        let rotationVector = Tools.rotateVector(new BABYLON.Vector3(0, 0, 1), parameters.rotationAmount)
                        if (rotationVector.z == 1) {
                            parameters.pickedMesh.position.z = (backIntersectedWall.position.z
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            parameters.pickedMesh.position.x = (rightInersectedWall.position.x
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x)

                        }
                        else if (rotationVector.z == -1) {
                            parameters.pickedMesh.position.z = (backIntersectedWall.position.z
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            parameters.pickedMesh.position.x = (rightInersectedWall.position.x
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x)

                        }
                        else if (rotationVector.x == 1) {
                            parameters.pickedMesh.position.x = (backIntersectedWall.position.x
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            parameters.pickedMesh.position.z = (rightInersectedWall.position.z
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.x == -1) {
                            parameters.pickedMesh.position.x = (backIntersectedWall.position.x
                                + parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            parameters.pickedMesh.position.z = (rightInersectedWall.position.z
                                - parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                    }
                    else if (rightInersectedWall) {
                        parameters.pickedMesh.rotation.y += BABYLON.Tools.ToRadians(90)
                        parameters.rotationAmount += BABYLON.Tools.ToRadians(90)
                    }
                    else if (leftIntersectedWall) {
                        parameters.pickedMesh.rotation.y += BABYLON.Tools.ToRadians(-90)
                        parameters.rotationAmount += BABYLON.Tools.ToRadians(-90)
                    }


                    if (Tools.calculateDistance(parameters.pickedMesh.position, origin.position)
                        > parameters.meshMultiplier / 2) {
                        parameters.pickedMesh.position.x = origin.position.x
                        parameters.pickedMesh.position.z = origin.position.z
                    }


                    // seçili meshin gösterilme koşulları

                    parameters.pickedMesh.getChildMeshes().filter(child => child.intersectsMesh(parameters.ground, false)).length == parameters.pickedMesh.getChildMeshes().length ? parameters.showPickedMesh = true : parameters.showPickedMesh = true
                    if (parameters.showPickedMesh) {
                        parameters.pickedMesh.material.alpha = 0.5
                        parameters.pickedMesh.getChildMeshes().map(child => {
                            if (child.name != "inner") {
                                child.material.alpha = 0.5
                            }
                        })
                        // parameters.pickedMesh.isPickable = true
                    } else {
                        parameters.pickedMesh.material.alpha = 0.0
                        parameters.pickedMesh.getChildMeshes().map(child => child.material.alpha = 0.0)
                        // parameters.pickedMesh.isPickable = false

                    }

                    // seçili meshin kırmızıya boyanma koşulları 
                    parameters.paintPickedMesh = false

                    parameters.placedMeshes.map(obj => backCollider.intersectsMesh(obj, false) ? parameters.paintPickedMesh = true : "")

                    //duvarla temas
                    parameters.paintPickedMesh = parameters.walls.filter(wall => backCollider.intersectsMesh(wall, false)).length == 0 && !parameters.pickedMesh.allowNoWall


                    //iç içe geçme
                    if (collision)
                        parameters.paintPickedMesh = true;

                    if (parameters.paintPickedMesh) {
                        parameters.pickedMesh.material.emissiveColor = new BABYLON.Color3(1, 0, 0)
                    } else {
                        parameters.pickedMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                    }

                }


            }
        })

        parameters.scene.actionManager = new BABYLON.ActionManager(parameters.scene);


        // sahne sağ ve sol click işlemleri
        parameters.scene.onPointerObservable.add((pointerInfo) => {
            if (parameters.pickedMesh && !parameters.pickedMesh.isDisposed()) {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERTAP:
                        if (pointerInfo.event.button == 0) { // sol click
                            Tools.putMesh()

                        } else if (pointerInfo.event.button == 2) { // sağ click
                            parameters.pickedMesh.rotation.y += BABYLON.Tools.ToRadians(90)
                            parameters.rotationAmount += BABYLON.Tools.ToRadians(90)
                        }

                        break;
                    case BABYLON.PointerEventTypes.POINTERMOVE:

                        let pickResult = parameters.scene.pick(parameters.scene.pointerX, parameters.scene.pointerY);
                        if (pickResult.hit) {
                            let mousePosition = new BABYLON.Vector3(pickResult.pickedPoint.x, parameters.originHeight, pickResult.pickedPoint.z)
                            origin.position = mousePosition
                        }

                        break;
                }

            }
        });

        parameters.gui = new MyGUI();

        return parameters.scene;
    }

    let scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();


    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

});