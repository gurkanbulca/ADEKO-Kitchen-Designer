import * as BABYLON from 'babylonjs';
import { parameters } from "./parameters"


export class VertexBody {
    constructor(mesh) {
        this.VECTOR = {
            X: 0,
            Y: 1,
            Z: 2
        }

        this.vertexData = new BABYLON.VertexData()
        this.vertexData.positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)
        this.vertexData.normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind)
        this.vertexData.uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind)
        this.vertexData.indices = mesh.getIndices() // [2,3,1,5,-3]
        this.meshSize = mesh.getBoundingInfo().boundingBox.extendSize

        this.getVertexData = function () {
            return this.vertexData
        }

        this.isZeroOrigin = function (vector) {
            var negativeNumberFlag = false
            for (let i = 0; i < Math.floor(this.vertexData.positions.length / 3); i++) {
                if (this.vertexData.positions[3 * i + vector] < 0) {
                    negativeNumberFlag = true;
                }
            }
            return negativeNumberFlag;
        }

        this.scaleX = function (amount) {
            this.scale(amount, this.VECTOR.X);
        }

        this.scaleY = function (amount) {
            this.scale(amount, this.VECTOR.Y);
        }

        this.scaleZ = function (amount) {
            this.scale(amount, this.VECTOR.Z);
        }

        this.getMeshSizeByVector = function (vector) {
            var meshSize;
            switch (vector) {
                case this.VECTOR.X:
                    meshSize = this.meshSize.x
                    break;
                case this.VECTOR.Y:
                    meshSize = this.meshSize.y
                    break;
                case this.VECTOR.Z:
                    meshSize = this.meshSize.z
                    break;
            }
            return meshSize;
        }

        this.scale = function (amount, vector) {
            var originPoint;
            this.isZeroOrigin(vector) ? originPoint = 0 : originPoint = this.getMeshSizeByVector(vector)
            for (let i = 0; i < Math.floor(this.vertexData.positions.length / 3); i++) {
                if (this.vertexData.positions[3 * i + vector] < originPoint) {
                    this.vertexData.positions[3 * i + vector] -= amount;
                } else if (this.vertexData.positions[3 * i + vector] > originPoint) {
                    this.vertexData.positions[3 * i + vector] += amount;
                }
            }
        }
        this.move = function (vertices, amount, vector) {
            vertices.map(vertexIndex => {
                this.vertexData.positions[3 * vertexIndex + vector] += amount
            })
        }
        this.moveX = function (vertices, amount) {
            this.move(vertices, amount, this.VECTOR.X)
        }
        this.moveY = function (vertices, amount) {
            this.move(vertices, amount, this.VECTOR.Y)
        }
        this.moveZ = function (vertices, amount) {
            this.move(vertices, amount, this.VECTOR.Z)
        }

        this.createMeshFromVertexData = function (name, scene) {
            var mesh = new BABYLON.Mesh(name, scene);
            this.vertexData.applyToMesh(mesh, true);
            return mesh
        }
    }
}

export class MeshGenerator {
    static kapakTipleri = {
        TEK_SOL: "tek_sol",
        TEK_SAG: "tek_sag",
        CIFT_KAPAK: "cift_kapak",
        USTTEN: "ustten",

    }

    static dolapTipleri = {
        CEKMECE: "cekmece",
        ALT_DOLAP: "alt_dolap",
        UST_DOLAP: "ust_dolap"
    }

    //Params
    static debuggingAlpha = 0.0

    static generateMesh = function (
        params = { // Object
            isim, // String
            en, // Number
            boy, // Number
            derinlik, // Number
            kalinlik, // String
            textureURL, // String
            dolapTipi, // String || Enum
            kapak,
            // { // Object
            //     tip, // String || Enum
            //     textureURL, // String
            //     kulp, // BABYLON.Mesh
            //     kalinlik, // Number
            // },
            raflar, // raf
            // raf={
            // textureURL, // String
            // en // Number
            // boy // Number
            // derinlik // Number
            // yukseklik // Number
            // }
            ayaklar
            //  { // Object
            //     textureURL, // String
            //     yapi // BABYLON.Mesh
            // },

        }
        , scene // BABYLON.Scene
    ) {
        // merkez nokta
        var root = BABYLON.Mesh.CreateSphere(params.isim, 4, 0.1, scene);
        root.material = new BABYLON.StandardMaterial("rootMat", scene);

        //ana yüzeylerin yaratilmasi
        var govde = BABYLON.Mesh.CreateSphere("govde", 4, 0.1, scene);
        govde.material = new BABYLON.StandardMaterial("govdeMat", scene);
        var ust = new BABYLON.MeshBuilder.CreateBox("ust", { width: params.en, height: params.kalinlik, depth: params.derinlik }, scene);
        var alt = new BABYLON.MeshBuilder.CreateBox("alt", { width: params.en, height: params.kalinlik, depth: params.derinlik }, scene);
        var sol = new BABYLON.MeshBuilder.CreateBox("sol", { width: params.kalinlik, height: params.boy, depth: params.derinlik }, scene);
        var sag = new BABYLON.MeshBuilder.CreateBox("sag", { width: params.kalinlik, height: params.boy, depth: params.derinlik }, scene);
        // var on = new BABYLON.MeshBuilder.CreateBox("on", { width: params.en, height: params.boy, depth: params.kalinlik }, scene);
        var arka = new BABYLON.MeshBuilder.CreateBox("arka", { width: params.en, height: params.boy, depth: params.kalinlik }, scene);


        // Parent-Child islemleri
        govde.setParent(root);
        ust.setParent(govde);
        alt.setParent(govde);
        sol.setParent(govde);
        sag.setParent(govde);
        arka.setParent(govde);



        ust.position = new BABYLON.Vector3(0, params.boy - params.kalinlik / 2, 0);
        alt.position = new BABYLON.Vector3(0, params.kalinlik / 2, 0);
        sol.position = new BABYLON.Vector3(params.en / 2 - params.kalinlik / 2, params.boy / 2, 0);
        sag.position = new BABYLON.Vector3(-params.en / 2 + params.kalinlik / 2, params.boy / 2, 0);
        arka.position = new BABYLON.Vector3(0, params.boy / 2, params.derinlik / 2 - params.kalinlik / 2);


        // Ayaklar
        if (params.dolapTipi != this.dolapTipleri.UST_DOLAP) {
            var ayaklar = BABYLON.Mesh.CreateSphere("ayaklar", 4, 0.1, scene);
            ayaklar.material = new BABYLON.StandardMaterial("ayaklarMat", scene);
            var onSolAyak = params.ayaklar.yapi.clone("on sol ayak");
            var onSagAyak = params.ayaklar.yapi.clone("on sag ayak");
            var arkaSolAyak = params.ayaklar.yapi.clone("arka sol ayak");
            var arkaSagAyak = params.ayaklar.yapi.clone("arka sag ayak");

            // Ayaklar için Parent-Child islemleri
            ayaklar.setParent(root);
            onSolAyak.setParent(ayaklar);
            onSagAyak.setParent(ayaklar);
            arkaSolAyak.setParent(ayaklar);
            arkaSagAyak.setParent(ayaklar);

            // ayaklar için materyal islemleri
            var ayakMat = new BABYLON.StandardMaterial("ayakMat", scene);
            ayakMat.diffuseColor = new BABYLON.Color3.FromHexString("#ff8284")
            // ayakMat.diffuseTexture = new BABYLON.Texture(params.ayaklar.textureURL)
            ayaklar.getChildMeshes().map(ayak => {
                ayak.material = ayakMat;
            })


            // ayaklar için pozisyon islemleri
            ayaklar.position = new BABYLON.Vector3(0, ayaklar.getChildMeshes()[0].getBoundingInfo().boundingBox.extendSize.y * 2, 0);
            onSolAyak.position = new BABYLON.Vector3(params.en / 2.25, -onSolAyak.getBoundingInfo().boundingBox.extendSize.y, -params.derinlik / 2.25);
            onSagAyak.position = new BABYLON.Vector3(-params.en / 2.25, -onSagAyak.getBoundingInfo().boundingBox.extendSize.y, -params.derinlik / 2.25);
            arkaSolAyak.position = new BABYLON.Vector3(params.en / 2.25, -arkaSolAyak.getBoundingInfo().boundingBox.extendSize.y, params.derinlik / 2.25);
            arkaSagAyak.position = new BABYLON.Vector3(-params.en / 2.25, -arkaSagAyak.getBoundingInfo().boundingBox.extendSize.y, params.derinlik / 2.25);

        }

        // ana yüzeyler için pozisyon islemleri
        if (ayaklar) {
            govde.position = new BABYLON.Vector3(0, ayaklar.getChildMeshes()[0].getBoundingInfo().boundingBox.extendSize.y * 2, 0);
        } else {
            govde.position = new BABYLON.Vector3.Zero();
        }

        // Kapaklar
        if (params.kapak) {
            switch (params.kapak.tip) {
                case this.kapakTipleri.CIFT_KAPAK:
                    // Menteseler
                    var menteseMat = new BABYLON.StandardMaterial("menteseMat", scene);
                    var menteseSol = BABYLON.Mesh.CreateSphere("menteseSol", 4, 0.1, scene);
                    menteseSol.material = menteseMat;
                    menteseSol.setParent(govde);
                    menteseSol.position = new BABYLON.Vector3(params.en / 2 - params.kalinlik / 2, params.boy / 2, -(params.derinlik / 2 + params.kalinlik / 2));
                    var menteseSag = BABYLON.Mesh.CreateSphere("menteseSol", 4, 0.1, scene);
                    menteseSag.material = menteseMat
                    menteseSag.setParent(govde);
                    menteseSag.position = new BABYLON.Vector3(-(params.en / 2 - params.kalinlik / 2), params.boy / 2, -(params.derinlik / 2 + params.kalinlik / 2));

                    // Sag Kapak
                    var kapakSag = new BABYLON.MeshBuilder.CreateBox("kapakSag", { width: params.en / 2, height: params.boy + 0.0001, depth: params.kapak.kalinlik }, scene);
                    kapakSag.setParent(menteseSag)
                    kapakSag.position = new BABYLON.Vector3((params.en / 4 - params.kalinlik / 2), 0, 0)
                    kapakSag.scaling.x = 0.99
                    kapakSag.material = new BABYLON.StandardMaterial("kapakMat", scene);
                    kapakSag.material.diffuseColor = new BABYLON.Color3.FromHexString("#2c4163");

                    // Sol Kapak
                    var kapakSol = new BABYLON.MeshBuilder.CreateBox("kapakSol", { width: params.en / 2, height: params.boy + 0.0001, depth: params.kapak.kalinlik }, scene);
                    kapakSol.setParent(menteseSol)
                    kapakSol.position = new BABYLON.Vector3(-(params.en / 4 - params.kalinlik / 2), 0, 0)
                    kapakSol.scaling.x = 0.99
                    kapakSol.material = new BABYLON.StandardMaterial("kapakMat", scene);
                    kapakSol.material.diffuseColor = new BABYLON.Color3.FromHexString("#2c4163");

                    // Kulp Sag
                    var kulpSag = params.kapak.kulp.clone("kulpSag")
                    kulpSag.setParent(kapakSag)
                    kulpSag.position = new BABYLON.Vector3(params.en / 5, 0, -(params.kapak.kalinlik / 2 + kulpSag.getBoundingInfo().boundingBox.extendSize.z))
                    kulpSag.isPickable = false;

                    // Kulp Sol
                    var kulpSol = params.kapak.kulp.clone("kulpSol")
                    kulpSol.setParent(kapakSol)
                    kulpSol.position = new BABYLON.Vector3(-params.en / 5, 0, -(params.kapak.kalinlik / 2 + kulpSol.getBoundingInfo().boundingBox.extendSize.z))
                    kulpSol.isPickable = false;

                    //Kapak Açilma Animasyonu
                    [kapakSag, kapakSol].map(kapak => {
                        kapak.actionManager = new BABYLON.ActionManager(scene);
                        kapak.actionManager.registerAction(
                            new BABYLON.InterpolateValueAction(
                                BABYLON.ActionManager.OnLeftPickTrigger,
                                menteseSol.rotation,
                                'y',
                                BABYLON.Tools.ToRadians(-90),
                                1000
                            )
                        ).then(
                            new BABYLON.InterpolateValueAction(
                                BABYLON.ActionManager.OnLeftPickTrigger,
                                menteseSol.rotation,
                                'y',
                                BABYLON.Tools.ToRadians(0),
                                1000
                            )
                        )
                        kapak.actionManager.registerAction(
                            new BABYLON.InterpolateValueAction(
                                BABYLON.ActionManager.OnLeftPickTrigger,
                                menteseSag.rotation,
                                'y',
                                BABYLON.Tools.ToRadians(90),
                                1000
                            )
                        ).then(
                            new BABYLON.InterpolateValueAction(
                                BABYLON.ActionManager.OnLeftPickTrigger,
                                menteseSag.rotation,
                                'y',
                                BABYLON.Tools.ToRadians(0),
                                1000
                            )
                        )
                    })
                    break;
                case this.kapakTipleri.USTTEN:
                    // Mentese
                    var mentese = BABYLON.Mesh.CreateSphere("mentese", 4, 0.1, scene);
                    mentese.material = new BABYLON.StandardMaterial("menteseMat", scene);
                    mentese.setParent(govde);
                    mentese.position = new BABYLON.Vector3(0, (params.boy - params.kalinlik / 2), -(params.derinlik / 2 + params.kalinlik / 2));

                    // Kapak
                    var kapak = new BABYLON.MeshBuilder.CreateBox("kapak", { width: params.en, height: params.boy + 0.0001, depth: params.kapak.kalinlik }, scene);
                    kapak.setParent(mentese)
                    kapak.position = new BABYLON.Vector3(0, -(params.boy / 2 - params.kalinlik / 2), 0)
                    kapak.scaling.x = 0.995
                    kapak.material = new BABYLON.StandardMaterial("kapakMat", scene);
                    kapak.material.diffuseColor = new BABYLON.Color3.FromHexString("#2c4163");

                    // Kulp
                    var kulp = params.kapak.kulp.clone("kulp")
                    kulp.setParent(kapak)
                    kulp.position = new BABYLON.Vector3(0, -(params.boy / 2.35), -(params.kapak.kalinlik / 2 + kulp.getBoundingInfo().boundingBox.extendSize.z))
                    kulp.isPickable = false;

                    //Kapak Açilma Animasyonu
                    kapak.actionManager = new BABYLON.ActionManager(scene);
                    kapak.actionManager.registerAction(
                        new BABYLON.InterpolateValueAction(
                            BABYLON.ActionManager.OnLeftPickTrigger,
                            mentese.rotation,
                            'x',
                            BABYLON.Tools.ToRadians(90),
                            1000
                        )
                    ).then(
                        new BABYLON.InterpolateValueAction(
                            BABYLON.ActionManager.OnLeftPickTrigger,
                            mentese.rotation,
                            'x',
                            BABYLON.Tools.ToRadians(0),
                            1000
                        )
                    )

                    break;
                case this.kapakTipleri.TEK_SAG:
                    // Mentese
                    var mentese = BABYLON.Mesh.CreateSphere("mentese", 4, 0.1, scene);
                    mentese.material = new BABYLON.StandardMaterial("menteseMat", scene);
                    mentese.setParent(govde);
                    mentese.position = new BABYLON.Vector3(-(params.en / 2 - params.kalinlik / 2), params.boy / 2, -(params.derinlik / 2 + params.kalinlik / 2));
                    //Kapak
                    var kapak = new BABYLON.MeshBuilder.CreateBox("kapak", { width: params.en, height: params.boy + 0.0001, depth: params.kapak.kalinlik }, scene);
                    kapak.setParent(mentese)
                    kapak.position = new BABYLON.Vector3((params.en / 2 - params.kalinlik / 2), 0, 0)
                    kapak.scaling.x = 0.995
                    kapak.material = new BABYLON.StandardMaterial("kapakMat", scene);
                    kapak.material.diffuseColor = new BABYLON.Color3.FromHexString("#2c4163");
                    // Kulp
                    var kulp = params.kapak.kulp.clone("kulp")
                    kulp.setParent(kapak)
                    kulp.position = new BABYLON.Vector3(params.en / 2.35, 0, -(params.kapak.kalinlik / 2 + kulp.getBoundingInfo().boundingBox.extendSize.z))
                    kulp.isPickable = false;

                    //Kapak Açilma Animasyonu
                    kapak.actionManager = new BABYLON.ActionManager(scene);
                    kapak.actionManager.registerAction(
                        new BABYLON.InterpolateValueAction(
                            BABYLON.ActionManager.OnLeftPickTrigger,
                            mentese.rotation,
                            'y',
                            BABYLON.Tools.ToRadians(90),
                            1000
                        )
                    ).then(
                        new BABYLON.InterpolateValueAction(
                            BABYLON.ActionManager.OnLeftPickTrigger,
                            mentese.rotation,
                            'y',
                            BABYLON.Tools.ToRadians(0),
                            1000
                        )
                    )
                    break;
                case this.kapakTipleri.TEK_SOL:
                    // Mentese
                    var mentese = BABYLON.Mesh.CreateSphere("mentese", 4, 0.1, scene);
                    mentese.material = new BABYLON.StandardMaterial("menteseMat", scene);
                    mentese.setParent(govde);
                    mentese.position = new BABYLON.Vector3(params.en / 2 - params.kalinlik / 2, params.boy / 2, -(params.derinlik / 2 + params.kalinlik / 2));

                    //Kapak
                    var kapak = new BABYLON.MeshBuilder.CreateBox("kapak", { width: params.en, height: params.boy + 0.0001, depth: params.kapak.kalinlik }, scene);
                    kapak.setParent(mentese)
                    kapak.position = new BABYLON.Vector3(-(params.en / 2 - params.kalinlik / 2), 0, 0)
                    kapak.scaling.x = 0.995
                    kapak.material = new BABYLON.StandardMaterial("kapakMat", scene);
                    kapak.material.diffuseColor = new BABYLON.Color3.FromHexString("#2c4163");

                    // Kulp
                    var kulp = params.kapak.kulp.clone("kulp")
                    kulp.setParent(kapak)
                    kulp.position = new BABYLON.Vector3(-params.en / 2.35, 0, -(params.kapak.kalinlik / 2 + kulp.getBoundingInfo().boundingBox.extendSize.z))
                    kulp.isPickable = false;

                    //Kapak Açilma Animasyonu
                    kapak.actionManager = new BABYLON.ActionManager(scene);
                    kapak.actionManager.registerAction(
                        new BABYLON.InterpolateValueAction(
                            BABYLON.ActionManager.OnLeftPickTrigger,
                            mentese.rotation,
                            'y',
                            BABYLON.Tools.ToRadians(-90),
                            1000
                        )
                    ).then(
                        new BABYLON.InterpolateValueAction(
                            BABYLON.ActionManager.OnLeftPickTrigger,
                            mentese.rotation,
                            'y',
                            BABYLON.Tools.ToRadians(0),
                            1000
                        )
                    )
                    break;
            }
        }

        // Raflar
        if (params.raflar) {
            params.raflar.map(rafInfo => {
                // her bir rafin yaratilmasi
                var raf = new BABYLON.MeshBuilder.CreateBox("raf",
                    {
                        width: rafInfo.en - 0.0001,
                        height: rafInfo.boy,
                        depth: rafInfo.derinlik - 0.0001
                    }, scene);

                // her bir raf için materyal islemleri
                raf.material = new BABYLON.StandardMaterial("rafMat", scene);
                raf.material.diffuseColor = new BABYLON.Color3.FromHexString("#6b8fd1");

                // Her bir raf için pozisyon islemleri
                raf.setParent(govde);
                raf.position = new BABYLON.Vector3(0, rafInfo.yukseklik, params.derinlik / 2 - rafInfo.derinlik / 2 - params.kalinlik)
            })
        }

        //Debugging Tools
        root.material.alpha = this.debuggingAlpha
        if (params.kapak) {
            if (mentese) {
                mentese.material.alpha = this.debuggingAlpha
            } else {
                menteseSag.material.alpha = this.debuggingAlpha
                menteseSol.material.alpha = this.debuggingAlpha

            }
        }
        govde.material.alpha = this.debuggingAlpha
        if (params.dolapTipi != this.dolapTipleri.UST_DOLAP) {
            ayaklar.material.alpha = this.debuggingAlpha
        }

        return root;
    }

    static createInnerCollider = function (mesh, scene) {
        var innerCollider = new BABYLON.MeshBuilder.CreateBox("inner",
            {
                width: mesh.getBoundingInfo().boundingBox.extendSize.x * 1.99,
                height: mesh.getBoundingInfo().boundingBox.extendSize.y * 1.99,
                depth: mesh.getBoundingInfo().boundingBox.extendSize.z * 1.99
            }, scene);

        innerCollider.material = new BABYLON.StandardMaterial("", scene);
        innerCollider.material.wireframe = true
        innerCollider.setParent(mesh);
        innerCollider.isPickable = false
        innerCollider.position = new BABYLON.Vector3.Zero()

        return innerCollider;

    }

    static createTestBox = function (meshName, size, materialInfo) {
        let box = new BABYLON.MeshBuilder.CreateBox(meshName,
            {
                height: size.height * parameters.meshMultiplier,
                width: size.width * parameters.meshMultiplier,
                depth: size.depth * parameters.meshMultiplier
            },
            parameters.scene);

        let material = new BABYLON.StandardMaterial(materialInfo.name, parameters.scene)
        material.specularColor = materialInfo.specularColor
        material.diffuseColor = materialInfo.diffuseColor
        material.emissiveColor = materialInfo.emissiveColor
        box.material = material;
        box.actionManager = new BABYLON.ActionManager(parameters.scene);

        return box

        // let blueBox = BABYLON.Mesh.CreateBox("Deneme Dolap", 1 * parameters.meshMultiplier, parameters.scene);
        // let blueMat = new BABYLON.StandardMaterial("blueMat", parameters.scene)
        // blueMat.specularColor = new BABYLON.Color3.Black()
        // blueMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 1);
        // // blueMat.emissiveColor = new BABYLON.Color3(0, 0, 0.6);
        // blueBox.material = blueMat;
        // blueBox.actionManager = new BABYLON.ActionManager(parameters.scene);
    }

    static createPointer = function () {
        let pointToIntersect = new BABYLON.Vector3(0, -1000, 0);
        let origin = BABYLON.Mesh.CreateSphere("origin", 4, 0.1, parameters.scene);
        origin.position = pointToIntersect;
        let matPlan = new BABYLON.StandardMaterial("matPlan1", parameters.scene);
        matPlan.backFaceCulling = false;
        matPlan.emissiveColor = new BABYLON.Color3(0.2, 1, 0.2);
        origin.material = matPlan;
        origin.material.alpha = parameters.originAlpha
        origin.isPickable = false
        origin.checkCollisions = true

        return origin
    }

    static createWall = function (name, material) {
        let wall = new BABYLON.MeshBuilder.CreatePlane(name, { height: parameters.wallSize, width: parameters.floorSize }, parameters.scene);
        wall.material = material
        wall.isPickable = false
        return wall
    }
}





// // Deneme Meshin Yaratilmasi
// var ornekKulp = BABYLON.Mesh.CreateBox("kulp", 0.05, scene);
// ornekKulp.material = new BABYLON.StandardMaterial("kulpMat", scene);
// ornekKulp.material.diffuseColor = new BABYLON.Color3.FromHexString("#7bd185");
// var ornekAyak = new BABYLON.MeshBuilder.CreateCylinder("ornekAyak", { height: 0.1, diameter: 0.05 }, scene);
// var dolap = MeshGenerator.generate({
//     isim: "deneme",
//     en: 1,
//     boy: 1,
//     derinlik: 1,
//     kalinlik: 0.05,
//     textureURL: "",
//     dolapTipi: MeshGenerator.dolapTipleri.ALT_DOLAP,
//     kapak: {
//         kulp: ornekKulp,
//         textureURL: "",
//         tip: MeshGenerator.kapakTipleri.CIFT_KAPAK,
//         kalinlik: 0.07
//     },
//     raflar: [
//         {
//             textureURL: "", // String
//             en: 1, // Number
//             boy: 0.03, // Number
//             derinlik: 0.9, // Number
//             yukseklik: 0.33 // Number
//         },
//         {
//             textureURL: "", // String
//             en: 1, // Number
//             boy: 0.03, // Number
//             derinlik: 0.9, // Number
//             yukseklik: 0.66 // Number
//         },
//     ],
//     ayaklar: {
//         textureURL: "",
//         yapi: ornekAyak
//     }
// }, scene);
// ornekAyak.dispose();
// ornekKulp.dispose();
// dolap.position.y = - 0.5;