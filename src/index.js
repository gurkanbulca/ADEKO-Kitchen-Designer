import * as BABYLON from 'babylonjs';
// import axios from "axios";




window.addEventListener("DOMContentLoaded", function () {



    var canvas = document.getElementById("canvas")
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {

        // PARAMETERS
        var floorSize = 30;
        var wallSize = 8;
        var originHeight = 0.0;
        var originAlpha = 1.0;
        var rotationAmount = 0;
        var objects = [];
        var walls = []
        let meshPicked = false;
        var paintPickedMesh = false

        var createMeshFromMeshInfo = function (meshInfo) {
            var mesh = new BABYLON.MeshBuilder.CreateBox("box", { depth: meshInfo.size.depth, height: meshInfo.size.height, width: meshInfo.size.width }, scene)
            mesh.material = new BABYLON.StandardMaterial("", scene);
            mesh.material.diffuseColor = new BABYLON.Color3(
                meshInfo.material.diffuseColor.r,
                meshInfo.material.diffuseColor.g,
                meshInfo.material.diffuseColor.b,
            )
            mesh.material.emissiveColor = new BABYLON.Color3(
                meshInfo.material.emissiveColor.r,
                meshInfo.material.emissiveColor.g,
                meshInfo.material.emissiveColor.b,
            )
            mesh.position.x = meshInfo.position.x
            mesh.position.y = meshInfo.position.y
            mesh.position.z = meshInfo.position.z

            mesh.rotation.x = meshInfo.rotation.x
            mesh.rotation.y = meshInfo.rotation.y
            mesh.rotation.z = meshInfo.rotation.z
            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, function () {
                mesh.dispose()
                var index = objects.indexOf(mesh)
                objects.splice(index, 1);
                // socket.emit('delete mesh', index)
            }))
            return mesh;
        }



        var isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            }, iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            }, Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            }, Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
        };
        // Sahne
        var scene = new BABYLON.Scene(engine);
        scene.collisionsEnabled = true;
        scene.useRightHandedSystem = false;

        // PREFIX

        let pickedMesh = new BABYLON.Mesh.CreateBox("box", 1, scene)
        pickedMesh.material = new BABYLON.StandardMaterial("", scene)
        pickedMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
        pickedMesh.dispose();
        // axios.get("/meshes")
        //     .then(res => {
        //         res.data.meshArray.map(meshInfo => {
        //             objects.push(createMeshFromMeshInfo(meshInfo));
        //         })

        //     }).catch(err => console.log(err));

        var createInnerCollider = function (mesh) {
            var innerCollider = new BABYLON.MeshBuilder.CreateBox("innerCollider",
                {
                    width: mesh.getBoundingInfo().boundingBox.extendSize.x * 1.9,
                    height: mesh.getBoundingInfo().boundingBox.extendSize.y * 1.9,
                    depth: mesh.getBoundingInfo().boundingBox.extendSize.z * 1.9
                }, scene);

            innerCollider.material = new BABYLON.StandardMaterial("", scene);
            innerCollider.material.wireframe = true
            innerCollider.setParent(mesh);
            innerCollider.parent = mesh;
            mesh.addChild(innerCollider);
            innerCollider.position = new BABYLON.Vector3.Zero()
            innerCollider.rotation = new BABYLON.Vector3.Zero()

        }
        // LIGHT
        var light1 = new BABYLON.PointLight("point", new BABYLON.Vector3(-50, 10, -50), scene);
        var light2 = new BABYLON.PointLight("point", new BABYLON.Vector3(50, 10, -50), scene);
        var light3 = new BABYLON.PointLight("point", new BABYLON.Vector3(0, 50, 0), scene);
        light1.intensity = 0.7
        light2.intensity = 0.5
        light3.intensity = 0.5


        // var ground = BABYLON.MeshBuilder.CreateGround("floor", { width: floorSize, height: floorSize }, scene);
        var ground = BABYLON.MeshBuilder.CreateBox("floor", { width: floorSize, height: 0.001, depth: floorSize }, scene);
        ground.material = new BABYLON.StandardMaterial("mat", scene);
        ground.material.diffuseColor = new BABYLON.Color3.Gray();

        // CAMERA
        var camera = new BABYLON.ArcRotateCamera("arcCam", BABYLON.Tools.ToRadians(-110), BABYLON.Tools.ToRadians(70), 55, ground, scene);
        // var camera = new BABYLON.ArcRotateCamera()
        // camera.noRotationConstraint = true
        camera.setTarget(new BABYLON.Vector3(ground.position.x, ground.position.y, ground.position.z + floorSize / 4))
        // camera.upVector = new BABYLON.Vector3(0, 0, 1)
        // camera.allowUpsideDown = true;

        camera.attachControl(canvas, true);


        // BLUE BOX CONFIG
        var blueBox = BABYLON.Mesh.CreateBox("blueBox", 2, scene);
        blueBox.position.z -= 20;
        blueBox.position.x -= 2;
        var blueMat = new BABYLON.StandardMaterial("blueMat", scene)
        blueMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 1);
        // blueMat.emissiveColor = new BABYLON.Color3(0, 0, 0.6);
        blueBox.material = blueMat;
        blueBox.actionManager = new BABYLON.ActionManager(scene);

        // RED BOX CONFIG
        var redBox = new BABYLON.MeshBuilder.CreateBox("redBox", { depth: 2, height: 2, width: 4 }, scene);
        redBox.position.z -= 20;
        redBox.position.x -= 11;
        var redMat = new BABYLON.StandardMaterial("redMat", scene)
        redMat.diffuseColor = new BABYLON.Color3(1, 0.3, 0.3);
        // redMat.emissiveColor = new BABYLON.Color3(0.6, 0, 0);
        redBox.material = redMat;
        redBox.actionManager = new BABYLON.ActionManager(scene);

        // GREEN BOX CONFIG
        var greenBox = new BABYLON.MeshBuilder.CreateBox("redBox", { height: 4, depth: 2, width: 2 }, scene);
        greenBox.position.z -= 20;
        greenBox.position.x += 8;
        var greenMat = new BABYLON.StandardMaterial("greenMat", scene)
        greenMat.diffuseColor = new BABYLON.Color3(0.2, 1, 0.2);
        // greenMat.emissiveColor = new BABYLON.Color3(0, 0.6, 0);
        greenBox.material = greenMat;
        greenBox.actionManager = new BABYLON.ActionManager(scene);


        //Cursor Pointer
        var pointToIntersect = new BABYLON.Vector3(-1000, -1000, -1000);
        var origin = BABYLON.Mesh.CreateSphere("origin", 4, 0.1, scene);
        origin.position = pointToIntersect;
        var matPlan = new BABYLON.StandardMaterial("matPlan1", scene);
        matPlan.backFaceCulling = false;
        matPlan.emissiveColor = new BABYLON.Color3(0.2, 1, 0.2);
        origin.material = matPlan;
        origin.material.alpha = originAlpha
        origin.isPickable = false
        origin.checkCollisions = true


        //WALL CONFIGS
        var wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene)
        wallMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.6, 0.6);

        var wall1 = new BABYLON.MeshBuilder.CreateBox("wall1", { height: wallSize, width: floorSize, depth: 0.5 }, scene);
        wall1.position = new BABYLON.Vector3(0, wallSize / 2, floorSize / 2 + wall1.getBoundingInfo().boundingBox.extendSize.z)
        wall1.material = wallMaterial
        createInnerCollider(wall1)
        walls.push(wall1)

        var wall2 = new BABYLON.MeshBuilder.CreateBox("wall2", { height: wallSize, width: 0.5, depth: floorSize }, scene);
        wall2.position = new BABYLON.Vector3(floorSize / 2 + wall2.getBoundingInfo().boundingBox.extendSize.x, wallSize / 2, 0)
        wall2.material = wallMaterial
        createInnerCollider(wall2)
        walls.push(wall2)

        var wall3 = new BABYLON.MeshBuilder.CreateBox("wall3", { height: wallSize, width: 0.5, depth: floorSize }, scene);
        wall3.position = new BABYLON.Vector3(-floorSize / 2 - wall3.getBoundingInfo().boundingBox.extendSize.x, wallSize / 2, 0)
        wall3.material = wallMaterial
        createInnerCollider(wall3)
        walls.push(wall3)




        // var intersectToAnyCollider = function (collider) {
        //     let intersectedMesh = null;
        //     objects.map(mesh => {
        //         if (collider.intersectsMesh(mesh, false)) {
        //             intersectedMesh = mesh;
        //         }
        //     })
        //     return intersectedMesh ? intersectedMesh : false
        // }

        function rotateVector(vect, angle) {
            var matr = new BABYLON.Matrix();
            var quat = new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle)
            quat.toRotationMatrix(matr);
            var rotatedvect = BABYLON.Vector3.TransformCoordinates(vect, matr);
            return rotatedvect;
        }

        function calculateDistance(vect1, vect2) {
            return Math.abs(Math.sqrt(
                Math.pow(vect1.x, 2)
                + Math.pow(vect1.y, 2)
                + Math.pow(vect1.z, 2)
            )
                - Math.sqrt(Math.pow(vect2.x, 2)
                    + Math.pow(vect2.y, 2)
                    + Math.pow(vect2.z, 2)
                ));
        }


        scene.registerBeforeRender(() => { // seçilmiş meshin hareket mekaniği
            paintPickedMesh = false
            if (meshPicked) { // sadece herhangi bir mesh yerleştirmek için seçildiğinde çalışır
                // mouse konumunun koordinat düzlemine aktarılması <..
                var pickResult = scene.pick(scene.pointerX, scene.pointerY);
                if (pickResult.hit) {
                    let mousePosition = new BABYLON.Vector3(pickResult.pickedPoint.x, originHeight, pickResult.pickedPoint.z)
                    origin.position = mousePosition

                    if (origin.intersectsMesh(ground, false)) {
                        pickedMesh.position.x = origin.position.x
                        pickedMesh.position.z = origin.position.z
                        pickedMesh.position.y = pickedMesh.getBoundingInfo().boundingBox.extendSize.y;
                    }



                    let leftCollider = pickedMesh.getChildMeshes().filter(child => child.name == "left")[0]
                    let rightCollider = pickedMesh.getChildMeshes().filter(child => child.name == "right")[0]
                    let backCollider = pickedMesh.getChildMeshes().filter(child => child.name == "back")[0]


                    // Duvarlara temas var mı?
                    let backIntersectedWall = null
                    walls.map(wall => backCollider.intersectsMesh(wall) ? backIntersectedWall = wall : "")

                    let rightInersectedWall = null
                    walls.map(wall => rightCollider.intersectsMesh(wall) ? rightInersectedWall = wall : "")

                    let leftIntersectedWall = null
                    walls.map(wall => leftCollider.intersectsMesh(wall) ? leftIntersectedWall = wall : "")


                    // diğer meshlere temas var mı?
                    let rightIntersectedMesh = null
                    objects.map(obj => leftCollider.intersectsMesh(obj) ? rightIntersectedMesh = obj : "")

                    let leftIntersectedMesh = null
                    objects.map(obj => rightCollider.intersectsMesh(obj) ? leftIntersectedMesh = obj : "")


                    // arka yüzeyden duvara temas
                    if (backIntersectedWall) {
                        var rotationVector = rotateVector(new BABYLON.Vector3(0, 0, 1), rotationAmount)
                        if (rotationVector.x == 1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                - backIntersectedWall.getBoundingInfo().boundingBox.extendSize.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }
                        else if (rotationVector.z == 1) {
                            pickedMesh.position.z = (backIntersectedWall.position.z
                                - backIntersectedWall.getBoundingInfo().boundingBox.extendSize.z
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }
                        else if (rotationVector.x == -1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                + backIntersectedWall.getBoundingInfo().boundingBox.extendSize.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }


                    }
                    // sağ yüzeyden meshe temas
                    var collision = false
                    collision = objects.filter(obj => obj.getChildMeshes().filter(col => col.name == "front")[0].intersectsMesh(pickedMesh, false)).length > 0

                    if (rightIntersectedMesh && !collision) {

                        var rotationVector = rotateVector(new BABYLON.Vector3(0, 0, 1), rotationAmount)
                        if (rotationVector.z == 1) {
                            pickedMesh.position.x = (rightIntersectedMesh.position.x
                                + rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.x == 1) {
                            pickedMesh.position.z = (rightIntersectedMesh.position.z
                                - rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.x == -1) {
                            pickedMesh.position.z = (rightIntersectedMesh.position.z
                                + rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }


                    }
                    // sol yüzeyden meshe temas
                    else if (leftIntersectedMesh && !collision) {
                        var rotationVector = rotateVector(new BABYLON.Vector3(0, 0, 1), rotationAmount)
                        if (rotationVector.z == 1) {
                            pickedMesh.position.x = (leftIntersectedMesh.position.x
                                - leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x)
                        }
                        else if (rotationVector.x == 1) {
                            pickedMesh.position.z = (leftIntersectedMesh.position.z
                                + leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.x == -1) {
                            pickedMesh.position.z = (leftIntersectedMesh.position.z
                                - leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }


                    }
                    // sol kenardan köşe duvara temas
                    else if (backIntersectedWall && leftIntersectedWall) {
                        var rotationVector = rotateVector(new BABYLON.Vector3(0, 0, 1), rotationAmount)
                        if (rotationVector.z == 1) {
                            pickedMesh.position.z = (backIntersectedWall.position.z
                                - backIntersectedWall.getBoundingInfo().boundingBox.extendSize.z
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            pickedMesh.position.x = (leftIntersectedWall.position.x
                                + leftIntersectedWall.getBoundingInfo().boundingBox.extendSize.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x)
                        }
                        else if (rotationVector.x == 1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                - backIntersectedWall.getBoundingInfo().boundingBox.extendSize.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            pickedMesh.position.z = (leftIntersectedWall.position.z
                                - leftIntersectedWall.getBoundingInfo().boundingBox.extendSize.z
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x);

                        }
                    }
                    // sağ kenardan köşe duvara temas
                    else if (backIntersectedWall && rightInersectedWall) {
                        var rotationVector = rotateVector(new BABYLON.Vector3(0, 0, 1), rotationAmount)
                        if (rotationVector.z == 1) {
                            pickedMesh.position.z = (backIntersectedWall.position.z
                                - backIntersectedWall.getBoundingInfo().boundingBox.extendSize.z
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            pickedMesh.position.x = (rightInersectedWall.position.x
                                - rightInersectedWall.getBoundingInfo().boundingBox.extendSize.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x)

                        }
                        else if (rotationVector.x == 1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                - backIntersectedWall.getBoundingInfo().boundingBox.extendSize.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            pickedMesh.position.z = (rightInersectedWall.position.z
                                + rightInersectedWall.getBoundingInfo().boundingBox.extendSize.z
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.x == -1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                + backIntersectedWall.getBoundingInfo().boundingBox.extendSize.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            pickedMesh.position.z = (rightInersectedWall.position.z
                                - rightInersectedWall.getBoundingInfo().boundingBox.extendSize.z
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                    }
                    else if (rightInersectedWall) {
                        pickedMesh.rotation.y += BABYLON.Tools.ToRadians(90)
                        rotationAmount += BABYLON.Tools.ToRadians(90)
                    }
                    else if (leftIntersectedWall) {
                        pickedMesh.rotation.y += BABYLON.Tools.ToRadians(-90)
                        rotationAmount += BABYLON.Tools.ToRadians(-90)
                    }


                    if (calculateDistance(pickedMesh.position, origin.position)
                        > pickedMesh.getBoundingInfo().boundingBox.extendSize.x
                        + pickedMesh.getBoundingInfo().boundingBox.extendSize.z) {
                        pickedMesh.position.x = origin.position.x
                        pickedMesh.position.z = origin.position.z
                    }


                    // seçili meshin gösterilme koşulları
                    var showPickedMesh = true
                    pickedMesh.getChildMeshes().map(child => child.intersectsMesh(ground, false) ? "" : showPickedMesh = false)

                    if (showPickedMesh) {
                        pickedMesh.material.alpha = 0.5
                        pickedMesh.getChildMeshes().map(child => child.material.alpha = 0.5)
                        pickedMesh.isPickable = true
                    } else {
                        pickedMesh.material.alpha = 0.0
                        pickedMesh.getChildMeshes().map(child => child.material.alpha = 0.0)
                        pickedMesh.isPickable = false

                    }

                    // seçili meshin kırmızıya boyanma koşulları 


                    objects.map(obj => backCollider.intersectsMesh(obj, false) ? paintPickedMesh = true : "")

                    if (walls.filter(wall => backCollider.intersectsMesh(wall, false) ? true : false).length == 0) {
                        paintPickedMesh = true;
                    }
                    if (collision)
                        paintPickedMesh = true;

                    if (paintPickedMesh) {
                        pickedMesh.material.emissiveColor = new BABYLON.Color3(1, 0, 0)
                    } else {
                        pickedMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                    }

                }


            }
        }

        )

        // Seçili objeyi yerleştiren fonksiyon.
        var putMesh = function () {

            if (pickedMesh.intersectsMesh(ground, false) && !paintPickedMesh) {


                var mesh = new BABYLON.MeshBuilder.CreateBox("box", {
                    width: pickedMesh.getBoundingInfo().boundingBox.extendSize.x * 2,
                    height: pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                    depth: pickedMesh.getBoundingInfo().boundingBox.extendSize.z * 2
                },
                    scene);
                var front = new BABYLON.MeshBuilder.CreateBox("front", {
                    width: mesh.getBoundingInfo().boundingBox.extendSize.x * 2,
                    height: mesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                    depth: 2
                }, scene)
                front.isPickable=false
                front.setParent(mesh),
                    front.parent = mesh
                mesh.addChild(front)
                front.position = new BABYLON.Vector3.Zero()
                front.position.z -= (mesh.getBoundingInfo().boundingBox.extendSize.z + front.getBoundingInfo().boundingBox.extendSize.z + 0.1)
                // front.rotation.y=rotationAmount
                front.material = new BABYLON.StandardMaterial("front", scene)
                front.material.diffuseColor = new BABYLON.Color3(66 / 255, 135 / 255, 245 / 255)
                front.material.wireframe = true

                mesh.rotation.y = rotationAmount

                var material = new BABYLON.StandardMaterial("", scene);
                material.diffuseColor = pickedMesh.material.diffuseColor
                material.emissiveColor = pickedMesh.material.emissiveColor
                mesh.material = material;
                mesh.position.x = pickedMesh.position.x
                mesh.position.y = pickedMesh.position.y
                mesh.position.z = pickedMesh.position.z


                // ön yüzey



                // if (rotationVector.z == 1) {
                //     var front = new BABYLON.MeshBuilder.CreateBox("front", {
                //         width: mesh.getBoundingInfo().boundingBox.extendSize.x * 2,
                //         height: mesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                //         depth: 0.1
                //     }, scene)
                //     front.setParent(mesh),
                //         front.parent = mesh
                //     mesh.addChild(front)
                //     front.position = new BABYLON.Vector3.Zero()
                //     front.position.z -= (mesh.getBoundingInfo().boundingBox.extendSize.z + front.getBoundingInfo().boundingBox.extendSize.z)
                // } else if (rotationVector.x == 1) {
                //     var front = new BABYLON.MeshBuilder.CreateBox("front", {
                //         width: 0.1,
                //         height: mesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                //         depth: mesh.getBoundingInfo().boundingBox.extendSize.x * 2
                //     }, scene)
                //     front.setParent(mesh),
                //         front.parent = mesh
                //     mesh.addChild(front)
                //     front.position = new BABYLON.Vector3.Zero()
                //     front.position.x -= (mesh.getBoundingInfo().boundingBox.extendSize.z + front.getBoundingInfo().boundingBox.extendSize.z)
                // } else if (rotationVector.x == -1) {
                //     var front = new BABYLON.MeshBuilder.CreateBox("front", {
                //         width: 0.1,
                //         height: mesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                //         depth: mesh.getBoundingInfo().boundingBox.extendSize.x * 2
                //     }, scene)
                //     front.setParent(mesh),
                //         front.parent = mesh
                //     mesh.addChild(front)
                //     front.position = new BABYLON.Vector3.Zero()
                //     front.position.x += (mesh.getBoundingInfo().boundingBox.extendSize.z + front.getBoundingInfo().boundingBox.extendSize.z)
                // }
                rotationAmount = 0;





                objects.push(mesh)
                var meshInfo = {
                    position: {
                        x: mesh.position.x,
                        y: mesh.position.y,
                        z: mesh.position.z
                    },
                    size: {
                        width: mesh.getBoundingInfo().boundingBox.extendSize.x * 2,
                        height: mesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                        depth: mesh.getBoundingInfo().boundingBox.extendSize.z * 2
                    },
                    rotation: {
                        x: mesh.rotation.x,
                        y: mesh.rotation.y,
                        z: mesh.rotation.z,
                    },
                    material: {
                        emissiveColor: {
                            r: mesh.material.emissiveColor.r,
                            g: mesh.material.emissiveColor.g,
                            b: mesh.material.emissiveColor.b,
                        },
                        diffuseColor: {
                            r: mesh.material.diffuseColor.r,
                            g: mesh.material.diffuseColor.g,
                            b: mesh.material.diffuseColor.b,
                        },
                    }

                }
                // socket.emit('put mesh', meshInfo)

                mesh.actionManager = new BABYLON.ActionManager(scene);
                // ÜZERİNE SAĞ TIKLANAN OBJENİN SİLİNMESİ
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, function () {
                    mesh.dispose()
                    var index = objects.indexOf(mesh)
                    objects.splice(index, 1);
                    // socket.emit('delete mesh', index)
                }))

                pickedMesh.material.alpha = 0
                meshPicked = false
                pickedMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                pickedMesh.dispose()

                redBox.material.wireframe = false
                blueBox.material.wireframe = false
                greenBox.material.wireframe = false

            }

        }


        scene.actionManager = new BABYLON.ActionManager(scene);
        var rotate = function (mesh) { // oble döndürme fonksiyonu
            scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, mesh, "rotation.y", 0.01));
        }
        rotate(redBox);
        rotate(greenBox);
        rotate(blueBox);

        var makeOverOut = function (mesh) { // üzerine gelinen obje tipinin büyümesi

            mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 100));
            mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 100))
        }

        makeOverOut(redBox);
        makeOverOut(greenBox);
        makeOverOut(blueBox);



        var pickFromMenu = function (mesh) { // obje tipi seçimi
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function () {
                if (meshPicked) {
                    mesh.material.wireframe = false
                    // pickedMesh.dispose()
                } else {
                    mesh.material.wireframe = true;
                }
                // mesh.material.wireframe = !mesh.material.wireframe
            }));
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnLeftPickTrigger }, function (evt) {
                var boxSize = new BABYLON.Vector3(mesh.getBoundingInfo().boundingBox.extendSize.x * 2, mesh.getBoundingInfo().boundingBox.extendSize.y * 2, mesh.getBoundingInfo().boundingBox.extendSize.z * 2)

                if (pickedMesh.material.emissiveColor.equals(new BABYLON.Color3(0, 0, 0))) {
                    if (!pickedMesh.isDisposed()) {
                        pickedMesh.dispose()
                    }
                    pickedMesh = new BABYLON.MeshBuilder.CreateBox("pickedMesh", { width: boxSize.x, height: boxSize.y, depth: boxSize.z }, scene)
                    pickedMesh.position = new BABYLON.Vector3(-1000, -1000, -1000)
                    var material = new BABYLON.StandardMaterial("", scene);
                    material.diffuseColor = mesh.material.diffuseColor
                    // material.emissiveColor = mesh.material.emissiveColor
                    pickedMesh.material = material;
                    pickedMesh.material.alpha = 0.5;
                    pickedMesh.position.y = mesh.getBoundingInfo().boundingBox.extendSize.y
                    pickedMesh.actionManager = new BABYLON.ActionManager(scene)
                    // pickedMesh.isPickable = false
                    meshPicked = true;
                    pickedMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, putMesh))
                    pickedMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, () => {
                        pickedMesh.rotation.y += BABYLON.Tools.ToRadians(90)
                        rotationAmount += BABYLON.Tools.ToRadians(90)
                        // var temp = pickedMesh.getChildMeshes()[0].name;
                        // pickedMesh.getChildMeshes()[0].name = pickedMesh.getChildMeshes()[1].name;
                        // pickedMesh.getChildMeshes()[1].name = temp;
                    }))

                    var wireframe = new BABYLON.StandardMaterial("wireframe", scene)
                    wireframe.wireframe = true;

                    // var xCollider = new BABYLON.MeshBuilder.CreateBox("xCollider", {
                    //     height: pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                    //     width: pickedMesh.getBoundingInfo().boundingBox.extendSize.x * 3,
                    //     depth: pickedMesh.getBoundingInfo().boundingBox.extendSize.z * 1.5
                    // }, scene)
                    // xCollider.material = wireframe
                    // xCollider.isPickable = false
                    // xCollider.setParent(pickedMesh)
                    // xCollider.parent = pickedMesh
                    // pickedMesh.addChild(xCollider)

                    // var zCollider = new BABYLON.MeshBuilder.CreateBox("zCollider", {
                    //     height: pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                    //     width: pickedMesh.getBoundingInfo().boundingBox.extendSize.x * 1.5,
                    //     depth: pickedMesh.getBoundingInfo().boundingBox.extendSize.z * 3
                    // }, scene)
                    // zCollider.material = wireframe
                    // zCollider.isPickable = false
                    // zCollider.setParent(pickedMesh)
                    // zCollider.parent = pickedMesh
                    // pickedMesh.addChild(zCollider)

                    var right = new BABYLON.MeshBuilder.CreateBox("right", {
                        height: pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                        depth: pickedMesh.getBoundingInfo().boundingBox.extendSize.z * 1.5,
                        width: 0.9
                    })

                    right.material = new BABYLON.StandardMaterial("rightMaterial", scene)
                    right.material.diffuseColor = new BABYLON.Color3(1, 0, 0)
                    right.setParent(pickedMesh)
                    right.parent = pickedMesh
                    pickedMesh.addChild(right)
                    right.position = new BABYLON.Vector3.Zero()
                    right.position.x += pickedMesh.getBoundingInfo().boundingBox.extendSize.x + right.getBoundingInfo().boundingBox.extendSize.x;
                    right.isPickable = false

                    var left = new BABYLON.MeshBuilder.CreateBox("left", {
                        height: pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                        depth: pickedMesh.getBoundingInfo().boundingBox.extendSize.z * 1.5,
                        width: 0.9
                    })

                    left.material = new BABYLON.StandardMaterial("leftMaterial", scene)
                    left.material.diffuseColor = new BABYLON.Color3(0, 1, 0)
                    left.setParent(pickedMesh)
                    left.parent = pickedMesh
                    pickedMesh.addChild(left)
                    left.position = new BABYLON.Vector3.Zero()
                    left.position.x -= pickedMesh.getBoundingInfo().boundingBox.extendSize.x + right.getBoundingInfo().boundingBox.extendSize.x;
                    left.isPickable = false

                    var back = new BABYLON.MeshBuilder.CreateBox("back", {
                        height: pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                        depth: 0.9,
                        width: pickedMesh.getBoundingInfo().boundingBox.extendSize.x * 1.5
                    })

                    back.material = new BABYLON.StandardMaterial("backMaterial", scene)
                    back.material.diffuseColor = new BABYLON.Color3(0, 0, 1)
                    back.setParent(pickedMesh)
                    back.parent = pickedMesh
                    pickedMesh.addChild(back)
                    back.position = new BABYLON.Vector3.Zero()
                    back.position.z += pickedMesh.getBoundingInfo().boundingBox.extendSize.z + back.getBoundingInfo().boundingBox.extendSize.z;
                    back.isPickable = false

                    right.material.wireframe = true
                    left.material.wireframe = true
                    back.material.wireframe = true



                    // xCollider.position = new BABYLON.Vector3.Zero()
                    // zCollider.position = new BABYLON.Vector3.Zero()
                }
                else if (pickedMesh.material.diffuseColor.equals(mesh.material.diffuseColor)) {
                    pickedMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                    pickedMesh.dispose()
                    meshPicked = false;
                }
            }))

        }

        pickFromMenu(redBox);
        pickFromMenu(greenBox);
        pickFromMenu(blueBox);

        // SOCKET.IO
        // socket.on('put mesh', meshInfo => {
        //     console.log(meshInfo);
        //     objects.push(createMeshFromMeshInfo(meshInfo));
        // });
        // socket.on('delete mesh', index => {
        //     console.log(index);
        //     objects[index].dispose()
        //     objects.splice(index, 1);
        // })

        return scene;
    }

    var scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
    });


});