import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-loaders';
// import axios from "axios";
import $ from "jquery";
import { VertexBody } from "./meshGenerator"





window.addEventListener("DOMContentLoaded", function () {



    var canvas = document.getElementById("canvas")
    var engine = new BABYLON.Engine(canvas, true);



    var createScene = function () {

        // PARAMETERS
        var meshMultiplier = 1000
        var floorSize = 10000;
        var wallSize = 3000;
        var originHeight = 0.0;
        var originAlpha = 0.0;

        // PreDeclares
        var rotationAmount = 0;
        var objects = [];
        var walls = []
        let meshPicked = false;
        var paintPickedMesh = false
        var showPickedMesh = true
        var categories = ["Alt Dolap", "Üst Dolap", "Beyaz Eşya"]
        var highlightedMesh = null



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
        scene.clearColor = new BABYLON.Color3(1, 1, 1)

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
        // var light1 = new BABYLON.PointLight("point", new BABYLON.Vector3(-10, 10, -10), scene);
        // var light2 = new BABYLON.PointLight("point", new BABYLON.Vector3(10, 10, 10), scene);
        // var light3 = new BABYLON.PointLight("point", new BABYLON.Vector3(0, 20, 0), scene);
        // var light4 = new BABYLON.PointLight("point", new BABYLON.Vector3(60, 0, -60), scene);
        // var light5 = new BABYLON.PointLight("point", new BABYLON.Vector3(-60, 0, -60), scene);
        // light1.intensity = 0.4
        // light2.intensity = 0.4
        // light3.intensity = 0.5
        // light4.intensity = 0.7
        // light5.intensity = 0.7
        var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene)
        light.intensity = 1.5


        // var ground = BABYLON.MeshBuilder.CreateGround("floor", { width: floorSize, height: floorSize }, scene);
        var xmin = -floorSize / 2;
        var zmin = -floorSize / 2;
        var xmax = floorSize / 2;
        var zmax = floorSize / 2;
        var precision = {
            "w": 2,
            "h": 2
        };
        var subdivisions = {
            'h': 2,
            'w': 2
        };
        var ground = new BABYLON.Mesh.CreateTiledGround("Tiled Ground", xmin, zmin, xmax, zmax, subdivisions, precision, scene);
        ground.material = new BABYLON.StandardMaterial("mat", scene);
        // ground.material.diffuseColor = new BABYLON.Color3(0.55, 0.55, 0.55)

        ground.material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        ground.material.diffuseTexture = new BABYLON.Texture("./textures/floor3.jpg", scene)
        ground.material.bumpTexture = new BABYLON.Texture("./textures/floor3normal.jpg", scene)
        // ground.material.invertNormalMapX = true;
        ground.material.invertNormalMapY = true
        ground.material.useParallax = true;
        ground.material.useParallaxOcclusion = true;
        ground.material.parallaxScaleBias = 0.2;
        ground.material.specularPower = 1000.0;



        // CAMERA
        var camera = new BABYLON.ArcRotateCamera("arcCam", Math.PI / 2, BABYLON.Tools.ToRadians(70), floorSize * 2, ground, scene);
        camera.upperBetaLimit = Math.PI / 2.15
        camera.allowUpsideDown = false
        camera.lowerRadiusLimit = wallSize * 2
        camera.wheelPrecision = 100 / floorSize
        camera.maxZ = 100000
        // var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 0, 0), scene)
        // camera.setTarget(ground.position)
        camera.attachControl(canvas, true);


        // BLUE BOX CONFIG
        var blueBox = BABYLON.Mesh.CreateBox("Deneme Dolap", 1 * meshMultiplier, scene);
        var blueMat = new BABYLON.StandardMaterial("blueMat", scene)
        blueMat.specularColor = new BABYLON.Color3.Black()
        blueMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 1);
        // blueMat.emissiveColor = new BABYLON.Color3(0, 0, 0.6);
        blueBox.material = blueMat;
        blueBox.actionManager = new BABYLON.ActionManager(scene);
        blueBox.material.alpha = 0

        // RED BOX CONFIG
        var redBox = new BABYLON.MeshBuilder.CreateBox("Deneme Uzun Dolap", { depth: 1 * meshMultiplier, height: 1 * meshMultiplier, width: 2 * meshMultiplier }, scene);
        var redMat = new BABYLON.StandardMaterial("redMat", scene)
        redMat.specularColor = new BABYLON.Color3.Black()
        redMat.diffuseColor = new BABYLON.Color3(1, 0.3, 0.3);
        // redMat.emissiveColor = new BABYLON.Color3(0.6, 0, 0);
        redBox.material = redMat;
        redBox.actionManager = new BABYLON.ActionManager(scene);
        redBox.material.alpha = 0

        // GREEN BOX CONFIG
        var greenBox = new BABYLON.MeshBuilder.CreateBox("Deneme Buzdolabı", { height: 2 * meshMultiplier, depth: 1 * meshMultiplier, width: 1 * meshMultiplier }, scene);
        greenBox.position.z -= 20;
        greenBox.position.x += 8;
        var greenMat = new BABYLON.StandardMaterial("greenMat", scene)
        greenMat.specularColor = new BABYLON.Color3.Black()
        greenMat.diffuseColor = new BABYLON.Color3(0.2, 1, 0.2);
        // greenMat.emissiveColor = new BABYLON.Color3(0, 0.6, 0);
        greenBox.material = greenMat;
        greenBox.actionManager = new BABYLON.ActionManager(scene);
        greenBox.material.alpha = 0


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
        wallMaterial.specularColor = new BABYLON.Color3.Black()
        // wallMaterial.diffuseColor = new BABYLON.Color3.FromHexString("#ffe0c9");
        wallMaterial.diffuseTexture = new BABYLON.Texture("./textures/wall1.jpg", scene)

        var wall1 = new BABYLON.MeshBuilder.CreatePlane("wall1", { height: wallSize, width: floorSize }, scene);
        wall1.position = new BABYLON.Vector3(0, wallSize / 2, floorSize / 2 + wall1.getBoundingInfo().boundingBox.extendSize.z)
        wall1.material = wallMaterial
        wall1.isPickable = false
        walls.push(wall1)

        var wall2 = new BABYLON.MeshBuilder.CreatePlane("wall2", { height: wallSize, width: floorSize }, scene);
        wall2.position = new BABYLON.Vector3(floorSize / 2, wallSize / 2, 0)
        wall2.material = wallMaterial
        wall2.rotation.y += BABYLON.Tools.ToRadians(90)
        wall2.isPickable = false
        walls.push(wall2)

        var wall3 = new BABYLON.MeshBuilder.CreatePlane("wall3", { height: wallSize, width: floorSize }, scene);
        wall3.position = new BABYLON.Vector3(-floorSize / 2, wallSize / 2, 0)
        wall3.material = wallMaterial
        wall3.rotation.y += BABYLON.Tools.ToRadians(-90)
        wall3.isPickable = false
        walls.push(wall3)

        var wall4 = new BABYLON.MeshBuilder.CreatePlane("wall1", { height: wallSize, width: floorSize }, scene);
        wall4.position = new BABYLON.Vector3(0, wallSize / 2, - floorSize / 2)
        wall4.rotation.y += BABYLON.Tools.ToRadians(180)
        wall4.material = wallMaterial
        wall4.isPickable = false
        walls.push(wall4)

        var urunler = [{
            name: "Deneme Dolap",
            mesh: blueBox,
            tags: ["Alt Dolap"],
            image: "https://picsum.photos/100",
            allowNoWall: true
        },
        {
            name: "Deneme Buzdolabı",
            mesh: greenBox,
            tags: ["Beyaz Eşya"],
            image: "https://picsum.photos/100",
            allowNoWall: false
        },
        {
            name: "Deneme Uzun Dolap",
            mesh: redBox,
            tags: ["Alt Dolap"],
            image: "https://picsum.photos/100",
            allowNoWall: false
        }
        ]


        // var intersectToAnyCollider = function (collider) {
        //     let intersectedMesh = null;
        //     objects.map(mesh => {
        //         if (collider.intersectsMesh(mesh, false)) {
        //             intersectedMesh = mesh;
        //         }
        //     })
        //     return intersectedMesh ? intersectedMesh : false
        // }


        // KAPI
        var door = new BABYLON.Mesh("door", scene);

        door.position.y = 0
        door.position.x = -floorSize / 2 + 20
        BABYLON.SceneLoader.ImportMesh("", "./meshes/Door/", "Vintage-Door.obj", scene, function (mesh) {
            mesh.map(m => {
                // m.position.y = 0
                // m.scaling = new BABYLON.Vector3(30, 30, 30)
                var vertexData = new BABYLON.VertexData();
                vertexData.positions = m.getVerticesData(BABYLON.VertexBuffer.PositionKind)
                vertexData.indices = m.getIndices();
                vertexData.normals = m.getVerticesData(BABYLON.VertexBuffer.NormalKind);
                vertexData.uvs = m.getVerticesData(BABYLON.VertexBuffer.UVKind);
                var customMesh = new BABYLON.Mesh("door_part", scene);
                vertexData.applyToMesh(customMesh, true);
                m.dispose()
                door.addChild(customMesh);
                customMesh.actionManager = new BABYLON.ActionManager(scene);
                customMesh.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        BABYLON.ActionManager.OnLeftPickTrigger,
                        () => {
                            door.getChildMeshes().map(child => {
                                var test = new VertexBody(child, { left: [0, 2, 3] })
                                test.left = [0, 2, 4, 6, 7];
                                test.center = [3, 5, 7];
                                test.scale(test.center, -30)
                                test.rotate(left, 30);
                                test.ref = 30;

                                console.log(child.getBoundingInfo().boundingBox.extendSize.z);
                                test.scaleY(10);
                                var mesh = new BABYLON.Mesh("door_part", scene, door);
                                test.getVertexData().applyToMesh(mesh, true);
                                mesh.position = new BABYLON.Vector3.Zero()
                                child.dispose()
                                // child.scaling.z+=1


                            })


                        }
                    )
                )
                customMesh.position = new BABYLON.Vector3.Zero();


            })
            door.scaling = new BABYLON.Vector3(30, 30, 30)
            // camera.setTarget(new BABYLON.Vector3(door.position.x,door.position.y+1000,door.position.z))

            mesh[1].material = new BABYLON.StandardMaterial("", scene)
            mesh[1].material.diffuseTexture = new BABYLON.Texture("./meshes/Door/Textures/BMAG-m.jpg", scene)
            var pbr = new BABYLON.PBRMaterial("pbr", scene);
            mesh[3].material = pbr;
            pbr.albedoTexture = new BABYLON.Texture("./meshes/Door/Textures/Metall-scratch.png");
            // pbr.specularColor = new BABYLON.Color3(1.0, 0.766, 0.336);
            pbr.metallic = 1.0
            pbr.roughness = 0.3
            pbr.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./meshes/Door/Textures/environment.dds", scene);
            mesh[5].material = new BABYLON.StandardMaterial("", scene)
            mesh[5].material.diffuseTexture = new BABYLON.Texture("./meshes/Door/Textures/BMAG-m.jpg")

        })



        // BABYLON.SceneLoader.ImportMesh("", "./meshes/", "test1.babylon", scene, function (meshes) {
        //     camera.setTarget(meshes[0])
        //     console.log(meshes);
        //     var door = new BABYLON.Mesh("door", scene);
        //     meshes.map(mesh=>{
        //         mesh.setParent(door);
        //     })

        //     door.scaling = new BABYLON.Vector3(1000,1000,1000)
        //     door.position.y=2100

        //     door.getChildMeshes()[0].material=new BABYLON.StandardMaterial("",scene);
        //     door.getChildMeshes()[1].material=new BABYLON.StandardMaterial("",scene);
        //     door.getChildMeshes()[2].material=new BABYLON.StandardMaterial("",scene);

        //     door.getChildMeshes()[0].material.diffuseColor= new BABYLON.Color3(.7,.3,.3)
        //     door.getChildMeshes()[1].material.diffuseColor= new BABYLON.Color3(.3,.7,.3)
        //     door.getChildMeshes()[2].material.diffuseColor= new BABYLON.Color3(.3,.3,.7)
            
        //     var a= [];
        //     a.map()
            
        //     // var positions = [-22.5,0,0,-22.5,-2.44921270764475e-014,100,-22.5,-0.800000000000025,100,-22.5,-0.8,-1.9593701661158e-016,22.5,-2.44921270764475e-014,100,22.5,-0.800000000000025,100,22.5,-0.8,-1.9593701661158e-016,22.5,0,0,-21.5,-1.80000000000002,99,-21.5,-1.8,1,21.5,-1.80000000000002,99,21.5,-1.8,1,-16.5,-1.8,6,-16.5,-1.80000000000002,94,16.5,-1.80000000000002,94,16.5,-1.8,6,-15.5,-1.00000000000002,93,-15.5,-1,7,15.5,-1.00000000000002,93,15.5,-1,7,-16.5,-2.00000000000001,36.1666666666667,-16.5,-2.00000000000001,33.6666666666667,16.5,-2.00000000000001,33.6666666666667,16.5,-2.00000000000001,36.1666666666667,-15.5,-1.00000000000001,37.1666666666667,15.5,-1.00000000000001,37.1666666666667,-15.5,-1.00000000000001,32.6666666666667,15.5,-1.00000000000001,32.6666666666667,-16.5,-2.00000000000002,66.3333333333333,-16.5,-2.00000000000002,63.8333333333333,16.5,-2.00000000000002,63.8333333333333,16.5,-2.00000000000002,66.3333333333333,-15.5,-1.00000000000002,67.3333333333333,15.5,-1.00000000000002,67.3333333333333,-15.5,-1.00000000000002,62.8333333333333,15.5,-1.00000000000002,62.8333333333333,1.25,-2.00000000000001,33.6666666666667,-1.25,-2.00000000000001,33.6666666666667,-1.25,-2,6,1.25,-2,6,2.25,-1.00000000000001,32.6666666666667,2.25,-1,7,-2.25,-1.00000000000001,32.6666666666667,-2.25,-1,7,1.25,-2.00000000000002,63.8333333333333,-1.25,-2.00000000000002,63.8333333333333,-1.25,-2.00000000000001,36.1666666666667,1.25,-2.00000000000001,36.1666666666667,2.25,-1.00000000000002,62.8333333333333,2.25,-1.00000000000001,37.1666666666667,-2.25,-1.00000000000002,62.8333333333333,-2.25,-1.00000000000001,37.1666666666667,1.25,-2.00000000000002,94,-1.25,-2.00000000000002,94,-1.25,-2.00000000000002,66.3333333333333,1.25,-2.00000000000002,66.3333333333333,2.25,-1.00000000000002,93,2.25,-1.00000000000002,67.3333333333333,-2.25,-1.00000000000002,93,-2.25,-1.00000000000002,67.3333333333333]
        //     // var indices = [0,1,-3,0,2,-4,1,4,-6,1,5,-3,4,5,-7,4,6,-8,6,7,-1,6,0,-4,3,2,-9,3,8,-10,2,8,-11,2,10,-6,5,10,-12,5,11,-7,11,6,-4,11,3,-10,8,9,-13,8,12,-14,8,13,-15,8,14,-11,11,10,-15,11,14,-16,11,15,-13,11,12,-10,12,13,-17,12,16,-18,13,16,-19,13,18,-15,14,18,-20,14,19,-16,15,19,-18,15,17,-13,20,21,-23,20,22,-24,20,24,-26,20,25,-24,21,26,-28,21,27,-23,28,29,-31,28,30,-32,28,32,-34,28,33,-32,29,34,-36,29,35,-31,36,37,-39,36,38,-40,36,40,-42,36,41,-40,37,42,-44,37,43,-39,44,45,-47,44,46,-48,44,48,-50,44,49,-48,45,50,-52,45,51,-47,52,53,-55,52,54,-56,52,56,-58,52,57,-56,53,58,-60,53,59,-55]
        //     // var normals = [-1,0,0,0,0,1,0,2.44921270764475e-016,-1,-0.707106781186548,-0.707106781186548,-1.73265253647679e-016,0,0.707106781186548,-0.707106781186547,-0.707106781186548,0.707106781186548,1.73265253647679e-016,0,-0.707106781186547,-0.707106781186548,2.22044604925031e-017,1,2.44726580696943e-016,-0,-1,-2.22044604925031e-016,-0,-1,-2.66453525910038e-016,0.624695047554424,-0.78086880944303,-1.91324365562546e-016,0,0.78086880944303,0.624695047554424,0.624695047554424,0.78086880944303,1.91324365562546e-016,0,0.78086880944303,-0.624695047554424,0,1,1.77635683940025e-016,0,-0.707106781186548,0.707106781186547,0,0.707106781186547,0.707106781186548,0,1,3.5527136788005e-016,0,0.707106781186547,0.707106781186548,0,1,2.5682267557594e-016,0.707106781186547,-0.707106781186547,-1.76635401601925e-016,0.707106781186547,0.707106781186547,1.76635401601925e-016,0,1,2.40771258352444e-016,0.707106781186547,-0.707106781186547,-1.70747554881861e-016,0.707106781186547,0.707106781186547,1.70747554881861e-016,0,1,2.40771258352444e-016,0.707106781186548,-0.707106781186548,-1.73691478241893e-016,0.707106781186548,0.707106781186548,1.73691478241893e-016]
            


        // })


        // var customMesh = new BABYLON.Mesh("test", scene);
        // $.getJSON("./meshes/test.babylon").then(data => {
        //     console.log(data);


        //     var positions = data.meshes[0].positions;
        //     var indices = data.meshes[0].indices;
        //     var normals = data.meshes[0].normals;
        //     // var normals = []
        // BABYLON.VertexD./meshes/Door/Textures/BMAG-m.jpgata.ComputeNormals(positions, indices, normals);
        //     console.log(normals);
        //     var uvs = data.meshes[0].uvs;
        //     // var uvs = [];


        //     var vertexData = new BABYLON.VertexData();
        //     vertexData.positions = positions;
        //     vertexData.indices = indices;
        //     vertexData.normals = normals;
        //     vertexData.uvs = uvs;



        //     vertexData.applyToMesh(customMesh, true);

        //     customMesh.scaling = new BABYLON.Vector3(50, 50, 50);
        //     // customMesh.position.y = 500;
        //     customMesh.material = new BABYLON.StandardMaterial("mat",scene);
        //     // customMesh.material.diffuseColor = new BABYLON.Color3(1,0,0)
        //     // customMesh.material.diffuseTexture = new BABYLON.Texture("./meshes/Door/Textures/BMAG-m.jpg")
        //     customMesh.material.diffuseTexture = new BABYLON.Texture("./meshes/Door/Textures/BMAG-m.jpg")

        //     console.log(customMesh.material);
        // })





        // BABYLON.SceneLoader.ImportMesh("", "./meshes/", "door1.stl", scene, function (mesh) {
        //     console.log(mesh);
        //     mesh[0].material = new BABYLON.StandardMaterial("",scene)
        //     mesh[0].material.diffuseTexture = new BABYLON.Texture("./meshes/Door/Textures/BMAG-m.jpg")
        //     // mesh[0].material.diffuseColor=new BABYLON.Color3.Black()
        //     mesh[0].position.y= mesh[0].getBoundingInfo().boundingBox.extendSize.y
        //     console.log(mesh[0].getBoundingInfo().boundingBox);
        //     mesh[0].scaling = new BABYLON.Vector3(.04,.04,.04)
        //     mesh[0].rotation.x +=Math.PI/2
        // })



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


        scene.registerBeforeRender(() => {
            // Highlight edilmis meshin parlatılması
            if (highlightedMesh) {
                objects.map(object => {
                    if (highlightedMesh == object) {
                        object.material.emissiveColor = new BABYLON.Color3.FromHexString("#ff8400")
                    } else {
                        object.material.emissiveColor = new BABYLON.Color3.Black()
                    }
                })
            }


            // seçilmiş meshin hareket mekaniği
            paintPickedMesh = false
            if (meshPicked) { // sadece herhangi bir mesh yerleştirmek için seçildiğinde çalışır
                // mouse konumunun koordinat düzlemine aktarılması <..
                var pickResult = scene.pick(scene.pointerX, scene.pointerY);
                if (pickResult.hit) {
                    // let mousePosition = new BABYLON.Vector3(pickResult.pickedPoint.x, originHeight, pickResult.pickedPoint.z)
                    // origin.position = mousePosition

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
                        var wallRotationVector = rotateVector(new BABYLON.Vector3(0, 0, 1), backIntersectedWall.rotation.y)
                        if (rotationVector.x == 1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }
                        else if (rotationVector.x == -1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }
                        else if (rotationVector.z == 1) {
                            pickedMesh.position.z = (backIntersectedWall.position.z
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }
                        else if (rotationVector.z == -1) {
                            pickedMesh.position.z = (backIntersectedWall.position.z
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                        }



                    }

                    var collision = false
                    collision = objects.filter(obj => obj.getChildMeshes().filter(col => col.name == "front")[0].intersectsMesh(pickedMesh, false)).length > 0
                    // sağ yüzeyden meshe temas
                    if (rightIntersectedMesh && !collision) {

                        var rotationVector = rotateVector(new BABYLON.Vector3(0, 0, 1), rotationAmount)
                        if (rotationVector.z == 1) {
                            pickedMesh.position.x = (rightIntersectedMesh.position.x
                                + rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.z == -1) {
                            pickedMesh.position.x = (rightIntersectedMesh.position.x
                                - rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
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
                        else if (rotationVector.z == -1) {
                            pickedMesh.position.x = (leftIntersectedMesh.position.x
                                + leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x)
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
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            pickedMesh.position.x = (leftIntersectedWall.position.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x)
                        }
                        else if (rotationVector.z == -1) {
                            pickedMesh.position.z = (backIntersectedWall.position.z
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            pickedMesh.position.x = (leftIntersectedWall.position.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x)
                        }
                        else if (rotationVector.x == 1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            pickedMesh.position.z = (leftIntersectedWall.position.z
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x);

                        }
                        else if (rotationVector.x == -1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            pickedMesh.position.z = (leftIntersectedWall.position.z
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x);

                        }
                    }
                    // sağ kenardan köşe duvara temas
                    else if (backIntersectedWall && rightInersectedWall) {
                        var rotationVector = rotateVector(new BABYLON.Vector3(0, 0, 1), rotationAmount)
                        if (rotationVector.z == 1) {
                            pickedMesh.position.z = (backIntersectedWall.position.z
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            pickedMesh.position.x = (rightInersectedWall.position.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.x)

                        }
                        else if (rotationVector.z == -1) {
                            pickedMesh.position.z = (backIntersectedWall.position.z
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.z)
                            pickedMesh.position.x = (rightInersectedWall.position.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x)

                        }
                        else if (rotationVector.x == 1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                - pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            pickedMesh.position.z = (rightInersectedWall.position.z
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.x);
                        }
                        else if (rotationVector.x == -1) {
                            pickedMesh.position.x = (backIntersectedWall.position.x
                                + pickedMesh.getBoundingInfo().boundingBox.extendSize.z);
                            pickedMesh.position.z = (rightInersectedWall.position.z
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
                        > meshMultiplier / 2) {
                        pickedMesh.position.x = origin.position.x
                        pickedMesh.position.z = origin.position.z
                    }


                    // seçili meshin gösterilme koşulları

                    pickedMesh.getChildMeshes().filter(child => child.intersectsMesh(ground, false)).length == pickedMesh.getChildMeshes().length ? showPickedMesh = true : showPickedMesh = false
                    console.log(showPickedMesh);
                    if (showPickedMesh) {
                        pickedMesh.material.alpha = 0.5
                        pickedMesh.getChildMeshes().map(child => child.material.alpha = 0.5)
                        // pickedMesh.isPickable = true
                    } else {
                        pickedMesh.material.alpha = 0.0
                        pickedMesh.getChildMeshes().map(child => child.material.alpha = 0.0)
                        // pickedMesh.isPickable = false

                    }

                    // seçili meshin kırmızıya boyanma koşulları 


                    objects.map(obj => backCollider.intersectsMesh(obj, false) ? paintPickedMesh = true : "")

                    //duvarla temas
                    if (walls.filter(wall => backCollider.intersectsMesh(wall, false) ? true : false).length == 0 && !pickedMesh.allowNoWall) {
                        paintPickedMesh = true;
                    }
                    //iç içe geçme
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

        // sahne sağ ve sol click işlemleri
        scene.onPointerObservable.add((pointerInfo) => {
            if (pickedMesh && !pickedMesh.isDisposed()) {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERTAP:
                        if (pointerInfo.event.button == 0) { // sol click
                            putMesh()

                        } else if (pointerInfo.event.button == 2) { // sağ click
                            pickedMesh.rotation.y += BABYLON.Tools.ToRadians(90)
                            rotationAmount += BABYLON.Tools.ToRadians(90)
                        }

                        break;
                    case BABYLON.PointerEventTypes.POINTERMOVE:

                        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
                        if (pickResult.hit) {
                            let mousePosition = new BABYLON.Vector3(pickResult.pickedPoint.x, originHeight, pickResult.pickedPoint.z)
                            origin.position = mousePosition
                        }

                        break;
                }

            }
        });



        var pickFromMenu = function (mesh) { // obje tipi seçimi
            var boxSize = new BABYLON.Vector3(mesh.getBoundingInfo().boundingBox.extendSize.x * 2, mesh.getBoundingInfo().boundingBox.extendSize.y * 2, mesh.getBoundingInfo().boundingBox.extendSize.z * 2)
            console.log("t2");
            if (pickedMesh.material.emissiveColor.equals(new BABYLON.Color3(0, 0, 0))) {
                if (!pickedMesh.isDisposed()) {
                    pickedMesh.dispose()
                }
                pickedMesh = new BABYLON.MeshBuilder.CreateBox(mesh.name, { width: boxSize.x, height: boxSize.y, depth: boxSize.z }, scene)
                pickedMesh.position = new BABYLON.Vector3(-1000, -1000, -1000)
                var material = new BABYLON.StandardMaterial("", scene);
                material.diffuseColor = mesh.material.diffuseColor
                // material.emissiveColor = mesh.material.emissiveColor
                pickedMesh.material = material;
                pickedMesh.material.alpha = 0.5;
                pickedMesh.position.y = boxSize.y
                pickedMesh.actionManager = new BABYLON.ActionManager(scene)
                pickedMesh.isPickable = false
                pickedMesh.allowNoWall = urunler.filter(urun => urun.mesh.name == pickedMesh.name)[0].allowNoWall
                // console.log(urunler.filter(urun=>urun.mesh.name==pickedMesh.name)[0]);
                meshPicked = true;
                console.log(pickedMesh.allowNoWall);
                camera.upperBetaLimit = Math.PI / 3
                camera.lowerRadiusLimit = wallSize * 5





                // pickedMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, putMesh))

                // pickedMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, () => {
                //     pickedMesh.rotation.y += BABYLON.Tools.ToRadians(90)
                //     rotationAmount += BABYLON.Tools.ToRadians(90)
                // }))

                var wireframe = new BABYLON.StandardMaterial("wireframe", scene)
                wireframe.wireframe = true;


                var right = new BABYLON.MeshBuilder.CreateBox("right", {
                    height: pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                    depth: pickedMesh.getBoundingInfo().boundingBox.extendSize.z * 1.5,
                    width: meshMultiplier / 2
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
                    width: meshMultiplier / 2
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
                    depth: meshMultiplier / 2,
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

                right.material.alpha = 1.0
                left.material.alpha = 1.0
                back.material.alpha = 1.0



            }
            else if (pickedMesh.material.diffuseColor.equals(mesh.material.diffuseColor)) {
                pickedMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                pickedMesh.dispose()
                meshPicked = false;
            }

        }

        var putMesh = function () {
            pickedMesh.getChildMeshes().filter(child => child.intersectsMesh(ground, false)).length == pickedMesh.getChildMeshes().length ? showPickedMesh = true : showPickedMesh = false
            if (pickedMesh.intersectsMesh(ground, false) && !paintPickedMesh && showPickedMesh) {

                var mesh = new BABYLON.MeshBuilder.CreateBox(pickedMesh.name, {
                    width: pickedMesh.getBoundingInfo().boundingBox.extendSize.x * 2,
                    height: pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                    depth: pickedMesh.getBoundingInfo().boundingBox.extendSize.z * 2
                },
                    scene);
                var front = new BABYLON.MeshBuilder.CreateBox("front", {
                    width: mesh.getBoundingInfo().boundingBox.extendSize.x * 1.9,
                    height: mesh.getBoundingInfo().boundingBox.extendSize.y * 2,
                    depth: mesh.getBoundingInfo().boundingBox.extendSize.z
                }, scene)


                front.isPickable = false
                front.setParent(mesh),
                    front.parent = mesh
                mesh.addChild(front)
                front.position = new BABYLON.Vector3.Zero()
                front.position.z -= (mesh.getBoundingInfo().boundingBox.extendSize.z + front.getBoundingInfo().boundingBox.extendSize.z + 0.1)
                // front.rotation.y=rotationAmount
                front.material = new BABYLON.StandardMaterial("front", scene)
                front.material.diffuseColor = new BABYLON.Color3(66 / 255, 135 / 255, 245 / 255)
                front.material.wireframe = true
                front.material.alpha = 0.0

                mesh.rotation.y = rotationAmount

                var material = new BABYLON.StandardMaterial("", scene);
                // material.diffuseColor = pickedMesh.material.diffuseColor
                var myTexture = new BABYLON.Texture("./textures/floor1.jpg");
                myTexture.uScale = 2.0
                material.diffuseTexture = myTexture
                material.emissiveColor = pickedMesh.material.emissiveColor
                material.specularColor = new BABYLON.Color3.Black()
                mesh.material = material;
                mesh.position.x = pickedMesh.position.x
                mesh.position.y = pickedMesh.position.y
                mesh.position.z = pickedMesh.position.z

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

                mesh.actionManager = mesh.actionManager == null ? new BABYLON.ActionManager(scene) : mesh.actionManager;
                // Üzerine sol tıklandığında obje özelliklerinin menüde görüntülenmesi
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function () {
                    highlightedMesh = mesh
                    highlightedMesh.actionManager = highlightedMesh.actionManager == null ? new BABYLON.ActionManager(scene) : highlightedMesh.actionManager;
                    // Taşıma sağ tıklama ile
                    highlightedMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, () => {
                        if (highlightedMesh) {
                            objects = objects.filter(obj => obj != highlightedMesh)
                            pickFromMenu(highlightedMesh)
                            highlightedMesh.dispose()
                            highlightedMesh = null
                            contentPanel.width = "0px"
                        }


                    }))
                    contentPanel.width = "350px"
                    createBilgilerMenu()
                }))

                pickedMesh.material.alpha = 0
                meshPicked = false
                pickedMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                pickedMesh.dispose()

                redBox.material.wireframe = false
                blueBox.material.wireframe = false
                greenBox.material.wireframe = false

                front.alpha = 0.0

                camera.upperBetaLimit = Math.PI / 2.15
                camera.lowerRadiusLimit = wallSize * 2


            }

        }



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


        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")


        var leftContainer = new GUI.StackPanel();
        leftContainer.background = "transparent";
        leftContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        leftContainer.height = "100%"
        leftContainer.width = "410px"


        //Ana menü
        var panelButtons = []
        var panel = new GUI.StackPanel();
        panel.background = "#33334C"
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        panel.height = "100%"
        panel.width = "60px"

        var contentPanel = new GUI.StackPanel("contentPanel")
        contentPanel.background = "#e3e3e3"
        contentPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        contentPanel.height = "100%"
        contentPanel.width = "0px"


        // Menü Butonları
        var genelButton = new GUI.Button.CreateSimpleButton("Genel Menü", "G")
        genelButton.height = "60px"
        genelButton.color = "white"
        genelButton.thickness = 0
        genelButton.background = "#33334C"
        panelButtons.push(genelButton)
        genelButton.onPointerDownObservable.add(function () {
            // headerText.text = "Genel Menü"

        })

        var urunlerButton = new GUI.Button.CreateSimpleButton("Ürünler", "Ü")
        urunlerButton.height = "60px"
        urunlerButton.color = "white"
        urunlerButton.thickness = 0
        panelButtons.push(urunlerButton)
        urunlerButton.onPointerDownObservable.add(function () {
            createUrunlerMenu()
        })

        var bilgilerButton = new GUI.Button.CreateSimpleButton("Bilgiler", "İ")
        bilgilerButton.height = "60px"
        bilgilerButton.color = "white"
        bilgilerButton.thickness = 0
        panelButtons.push(bilgilerButton)
        bilgilerButton.onPointerDownObservable.add(function () {
            createBilgilerMenu()
        })

        var gorunumModuButton = new GUI.Button.CreateSimpleButton("gorunumModu", "O")
        gorunumModuButton.height = "60px"
        gorunumModuButton.color = "white"
        gorunumModuButton.thickness = 0
        panelButtons.push(gorunumModuButton)
        gorunumModuButton.onPointerDownObservable.add(function () {
            if (gorunumModuButton.children[0].text == "O") {    // ORTHOGRAPHIC MODE
                camera.position = new BABYLON.Vector3(0, floorSize * 2, 0)
                camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
                var distance = floorSize * 2;
                var aspect = scene.getEngine().getRenderingCanvasClientRect().height / scene.getEngine().getRenderingCanvasClientRect().width;
                camera.orthoLeft = -distance / 2;
                camera.orthoRight = distance / 2;
                camera.orthoBottom = camera.orthoLeft * aspect;
                camera.orthoTop = camera.orthoRight * aspect;
                camera.detachControl(canvas)
                gorunumModuButton.children[0].text = "P"
            } else {    // PERSPECTIVE MODE 
                camera.attachControl(canvas, true);
                camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA
                gorunumModuButton.children[0].text = "O"
            }
            contentPanel.width = "0px"
        })


        // Menü butonları için ortak fonksiyon
        panelButtons.map(button => {
            button.onPointerDownObservable.add(function () {
                panelButtons.map(btn => btn.background = "#33334C")
                if (button != gorunumModuButton) {
                    button.background = "#222233"
                    contentPanel.width = "350px"
                }

            })
        })


        // Ana menü componentlerinin arayüze eklenmesi
        panel.addControl(genelButton)
        panel.addControl(urunlerButton)
        panel.addControl(bilgilerButton)
        panel.addControl(gorunumModuButton)
        advancedTexture.addControl(leftContainer)
        leftContainer.addControl(panel)
        leftContainer.addControl(contentPanel)

        // Ürün listesinin oluşturulması
        function buildUrunList(seciliUrunler, urunList, returnText) {
            urunList.clearControls()
            var returnButton = new GUI.Button.CreateSimpleButton("returnButton", returnText + "  <")
            returnButton.width = 1
            returnButton.height = "40px"
            returnButton.onPointerDownObservable.add(() => {
                createUrunlerMenu()

            })
            urunList.addControl(returnButton)
            seciliUrunler.map(seciliUrun => {
                var urunBox = new GUI.Rectangle(seciliUrun.name)
                urunBox.paddingLeft = "10px"
                urunBox.paddingRight = "10px"
                urunBox.paddingTop = "10px"
                urunBox.width = 1
                urunBox.height = "100px"
                urunBox.thickness = 2
                urunBox.color = "white"

                var urunResim = new GUI.Button.CreateImageOnlyButton(seciliUrun.name + "Image", seciliUrun.image)
                urunResim.height = "100px"
                urunResim.width = "100px"
                urunResim.thickness = 0
                // urunResim.paddingLeft="10px"
                // urunResim.paddingTop="10px"
                // urunResim.paddingBottom="10px"
                urunResim.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                urunResim.onPointerDownObservable.add(() => {
                    pickFromMenu(seciliUrun.mesh)
                    contentPanel.width = 0
                    panelButtons.map(btn => btn.background = "#33334C")
                })

                var urunContent = new GUI.Rectangle(seciliUrun.name + "Content")
                urunContent.height = "100%"
                urunContent.width = "225px"
                urunContent.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT

                var urunTitle = new GUI.TextBlock(seciliUrun.name, seciliUrun.name)
                urunTitle.height = "20px"
                urunTitle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
                urunContent.addControl(urunTitle)

                urunBox.addControl(urunResim)
                urunBox.addControl(urunContent)
                urunList.addControl(urunBox)


            })
        }

        function createHeader(headerName) {
            var header = new GUI.StackPanel("header")
            header.background = "#303030"
            header.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
            header.height = "60px"


            var headerText = new GUI.TextBlock("headerText", headerName)
            headerText.color = "white"
            headerText.width = "150px"

            var closeButton = new GUI.Button.CreateImageOnlyButton("btn1", "./icons/cross.svg")
            closeButton.width = "16px"
            closeButton.height = "20px"
            closeButton.verticalAlignment = GUI.Control._VERTICAL_ALIGNMENT_BOTTOM
            closeButton.horizontalAlignment = GUI.Control._HORIZONTAL_ALIGNMENT_RIGHT
            closeButton.color = "transparent"

            closeButton.onPointerDownObservable.add(function () {
                contentPanel.width = "0px"
                panelButtons.map(btn => btn.background = "#33334C")
                if (highlightedMesh) {
                    highlightedMesh.material.emissiveColor = new BABYLON.Color3.Black()
                    highlightedMesh = null
                }


            })
            header.addControl(headerText)
            header.addControl(closeButton)
            contentPanel.addControl(header)
        }

        // Ürünler ana menüsünün oluşturulması
        function createUrunlerMenu() {
            contentPanel.clearControls()
            createHeader("Ürünler")
            // Menü İçeriği









            // Ürünler
            function marginBox(height) {
                var rect = new GUI.Rectangle("marginBox")
                rect.height = height
                rect.width = 1
                rect.color = "transperent"
                rect.thickness = 0
                return rect
            }



            contentPanel.addControl(marginBox("10px"))
            var rect = new GUI.Rectangle("rect1")
            rect.width = "80%"
            rect.height = "40px"
            rect.thickness = 2
            rect.color = "white"
            rect.cornerRadius = 10
            contentPanel.addControl(rect)


            var searchInput = new GUI.InputText("search")
            searchInput.width = 1
            searchInput.thickness = 0
            searchInput.height = "100%"
            searchInput.color = "white"
            searchInput.onTextChangedObservable.add(() => {
                if (searchInput.text == "") {
                    urunList.clearControls()
                    categories.map(category => {
                        var button = new GUI.Button.CreateSimpleButton(category, category)
                        button.width = "100%"
                        button.height = "40px"
                        button.onPointerDownObservable.add(() => {

                            var seciliUrunler = []
                            urunler.map(urun => {
                                if (urun.tags.filter(tag => tag == button.name).length > 0) {
                                    seciliUrunler.push(urun)
                                }
                            })
                            buildUrunList(seciliUrunler, urunList, button.name)
                            // switch (button.name) {
                            //     case "Alt Dolap":
                            //         console.log("alt dolap");


                            //         break;
                            //     case "Üst Dolap":
                            //         console.log("üst dolap");
                            //         break;
                            //     case "Beyaz Eşya":
                            //         console.log("Beyaz Eşya");
                            //         break;

                            // }

                        })
                        urunList.addControl(button)
                    })

                } else {
                    var seciliUrunler = []
                    urunler.map(urun => {
                        if (urun.name.toLowerCase().search(searchInput.text.toLowerCase()) != -1
                            || urun.tags.filter(tag => tag.toLowerCase().search(searchInput.text.toLowerCase()) != -1).length > 0) {
                            seciliUrunler.push(urun)
                        }
                    })
                    buildUrunList(seciliUrunler, urunList, "Arama Sonuçları")
                }
            })

            rect.addControl(searchInput)

            contentPanel.addControl(marginBox("10px"))

            var urunList = new GUI.StackPanel("urunList")
            urunList.width = "100%"
            contentPanel.addControl(urunList)



            categories.map(category => {
                var button = new GUI.Button.CreateSimpleButton(category, category)
                button.width = 1
                button.height = "40px"
                button.onPointerDownObservable.add(() => {

                    var seciliUrunler = []
                    seciliUrunler = []
                    urunler.map(urun => {
                        if (urun.tags.filter(tag => tag == button.name).length > 0) {
                            seciliUrunler.push(urun)
                        }
                    })
                    buildUrunList(seciliUrunler, urunList, button.name)
                    // switch (button.name) {
                    //     case "Alt Dolap":
                    //         console.log("alt dolap");


                    //         break;
                    //     case "Üst Dolap":
                    //         console.log("üst dolap");
                    //         break;
                    //     case "Beyaz Eşya":
                    //         console.log("Beyaz Eşya");
                    //         break;

                    // }

                })
                urunList.addControl(button)
            })
        }
        // Ürün Bilgileri
        function createBilgilerMenu() {
            contentPanel.clearControls()

            // Header Bölümü
            createHeader("Ürün Bilgileri")


            // İçerik Bölümü
            var bilgilerStack = new GUI.StackPanel("bilgiler")
            bilgilerStack.width = "100%"
            // bilgilerStack.top=-0.17
            bilgilerStack.height = "100%"
            contentPanel.addControl(bilgilerStack)

            if (!highlightedMesh) {

                var textMessage = new GUI.TextBlock("text", "Bilgilerini görüntülemek için bir ürün seçin.");
                textMessage.color = "#474747"
                textMessage.width = 1


                bilgilerStack.addControl(textMessage)
            }
            else {
                var urunDetayBox = new GUI.StackPanel("Urun Detay")
                urunDetayBox.width = "100%"
                urunDetayBox.height = "200px"
                urunDetayBox.paddingLeft = "10px"
                urunDetayBox.paddingRight = "10px"
                urunDetayBox.paddingTop = "10px"
                bilgilerStack.addControl(urunDetayBox)

                var titleBox = new GUI.Rectangle("titleBox")
                titleBox.height = "30px"
                titleBox.width = 1
                titleBox.paddingBottom = "10px"
                titleBox.thickness = 0
                urunDetayBox.addControl(titleBox)

                // Button Box
                var box = new GUI.Rectangle()
                box.height = "30px"
                box.width = "90px"
                box.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
                titleBox.addControl(box)
                box.thickness = 0

                //Taşıma arayüz üzerinden
                var move = new GUI.Button.CreateSimpleButton("move", "M")
                move.height = "30px"
                move.width = "30px"
                move.color = "black"
                move.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                move.onPointerDownObservable.add(() => {
                    objects = objects.filter(obj => obj != highlightedMesh)
                    pickFromMenu(highlightedMesh)
                    highlightedMesh.dispose()
                    highlightedMesh = null
                    contentPanel.width = "0px"
                })
                box.addControl(move)


                //Kopyalama
                var copy = new GUI.Button.CreateSimpleButton("copy", "C")
                copy.height = "30px"
                copy.width = "30px"
                copy.color = "black"
                copy.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
                copy.onPointerDownObservable.add(() => {
                    pickFromMenu(highlightedMesh)
                    highlightedMesh.material.emissiveColor = new BABYLON.Color3.Black()
                    highlightedMesh = null
                    contentPanel.width = "0px"
                })
                box.addControl(copy)

                //Silme
                var del = new GUI.Button.CreateSimpleButton("delete", "X")
                del.height = "30px"
                del.width = "30px"
                del.color = "black"
                del.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
                del.onPointerDownObservable.add(() => {
                    objects = objects.filter(obj => obj != highlightedMesh)
                    highlightedMesh.dispose()
                    highlightedMesh = null
                    createBilgilerMenu()
                })
                box.addControl(del)


                // Ürün adı


                var title = new GUI.TextBlock("title", highlightedMesh.name)
                title.height = 1
                title.width = "120px"
                title.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                title.onLinesReadyObservable.add(() => {
                    var textWidth = title.lines[0].width;
                    var ratioWidths = title.widthInPixels / textWidth;
                    if (ratioWidths < 1) {
                        title.fontSize = parseFloat(title.fontSizeInPixels) * ratioWidths + "px";
                    }
                })
                titleBox.addControl(title)

                //Ürün Ölçüleri
                var olculer = new GUI.Rectangle("olculer");
                olculer.width = "70px"
                olculer.height = "66px"
                olculer.paddingTop = "20px"
                olculer.thickness = 0
                olculer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
                urunDetayBox.addControl(olculer)

                var width = new GUI.TextBlock("width", "X:" + highlightedMesh.getBoundingInfo().boundingBox.extendSize.x * 2 / 10 + "cm");
                width.height = "12px";
                width.fontSize = "12px";
                width.width = "70px";
                width.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
                olculer.addControl(width)

                var height = new GUI.TextBlock("height", "Y:" + highlightedMesh.getBoundingInfo().boundingBox.extendSize.y * 2 / 10 + "cm");
                height.height = "12px";
                height.fontSize = "12px";
                height.width = "70px";
                height.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
                olculer.addControl(height)

                var depth = new GUI.TextBlock("depth", "Z:" + highlightedMesh.getBoundingInfo().boundingBox.extendSize.z * 2 / 10 + "cm");
                depth.height = "12px";
                depth.fontSize = "12px";
                depth.width = "70px";
                height.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
                olculer.addControl(depth)
            }
        }

        return scene;
    }

    var scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();


    });

    window.addEventListener("resize", function () {
        engine.resize();
    });




});