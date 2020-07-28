import * as BABYLON from "babylonjs"

export const parameters = {
    //preDeclarations DON'T CHANGE
    gui:null,
    canvas:null,
    scene: null,
    ground:null,
    camera:null,
    lights:null,
    placedMeshes: [],
    walls: [],
    isMeshPicked: false,
    paintPickedMesh: false,
    showPickedMesh: true,
    highlightedMesh: null,
    pickedMesh: null,
    urunler: null,

    // Parameters
    rotationAmount: 0,
    meshMultiplier: 1000,
    floorSize: 10000,
    wallSize: 3000,
    originHeight: 0.0,
    originAlpha: 0.0,
    categories: ["Alt Dolap", "Üst Dolap", "Beyaz Eşya"],
    
}
