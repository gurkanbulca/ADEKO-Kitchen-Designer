import * as BABYLON from 'babylonjs';
import { MeshGenerator } from "./meshGenerator"


export const createUrunList = function () {
    // BLUE BOX CONFIG
    let blueBox = MeshGenerator.createTestBox("Deneme Dolap",
        { height: 1, depth: 1, width: 1 },
        {
            name: "blueMat",
            specularColor: new BABYLON.Color3.Black(),
            diffuseColor: new BABYLON.Color3(0.3, 0.3, 1),
        })
    blueBox.dispose()

    // RED BOX CONFIG
    let redBox = MeshGenerator.createTestBox("Deneme Uzun Dolap",
        { height: 1, depth: 1, width: 2 },
        {
            name: "redMat",
            specularColor: new BABYLON.Color3.Black(),
            diffuseColor: new BABYLON.Color3(1, 0.3, 0.3),
        })
    redBox.dispose()



    // GREEN BOX CONFIG
    let greenBox = MeshGenerator.createTestBox("Deneme Buzdolabı",
        { height: 2, depth: 1, width: 1 },
        {
            name: "greenMat",
            specularColor: new BABYLON.Color3.Black(),
            diffuseColor: new BABYLON.Color3(0.2, 1, 0.2),
        })
    greenBox.dispose()



    // PURPLE BOX CONFIG
    let purpleBox = MeshGenerator.createTestBox("Deneme Üst Dolap",
        { height: 1, depth: 1, width: 1 },
        {
            name: "greenMat",
            specularColor: new BABYLON.Color3.Black(),
            diffuseColor: new BABYLON.Color3.FromHexString("#7b32a8")
        })
    purpleBox.dispose()


    let urunler = [{
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
    },
    {
        name: "Deneme Uzun Dolap",
        mesh: redBox,
        tags: ["Alt Dolap"],
        image: "https://picsum.photos/100",
    },
    {
        name: "Deneme Üst Dolap",
        mesh: purpleBox,
        tags: ["Üst Dolap"],
        image: "https://picsum.photos/100",
        allowNoGround: true,
        height: 2000
    }
    ]

    return urunler
}


