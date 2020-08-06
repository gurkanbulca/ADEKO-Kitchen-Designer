import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { Tools } from "./tools"
import { parameters } from "./parameters.js"
import { SceneBuilder } from './sceneBuilder';


export class MyGUI {
    constructor() {
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
        this.leftContainer = new GUI.StackPanel();
        this.leftContainer.background = "transparent";
        this.leftContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        this.leftContainer.height = "100%"
        this.leftContainer.width = "410px"

        //Ana menü
        this.panelButtons = []
        this.panel = new GUI.StackPanel();
        this.panel.background = "#33334C"
        this.panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        this.panel.height = "100%"
        this.panel.width = "60px"

        this.contentPanel = new GUI.StackPanel("contentPanel")
        this.contentPanel.background = "#e3e3e3"
        this.contentPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        this.contentPanel.height = "100%"
        this.contentPanel.width = "0px"

        // Menü Butonları
        this.genelButton = new GUI.Button.CreateSimpleButton("Genel Menü", "G")
        this.genelButton.height = "60px"
        this.genelButton.color = "white"
        this.genelButton.thickness = 0
        this.genelButton.background = "#33334C"
        this.panelButtons.push(this.genelButton)
        this.genelButton.onPointerDownObservable.add(() => {
            this.createGenelMenu()
        })

        this.urunlerButton = new GUI.Button.CreateSimpleButton("Ürünler", "Ü")
        this.urunlerButton.height = "60px"
        this.urunlerButton.color = "white"
        this.urunlerButton.thickness = 0
        this.panelButtons.push(this.urunlerButton)
        this.urunlerButton.onPointerDownObservable.add(() => {
            this.createUrunlerMenu()
        })

        this.bilgilerButton = new GUI.Button.CreateSimpleButton("Bilgiler", "İ")
        this.bilgilerButton.height = "60px"
        this.bilgilerButton.color = "white"
        this.bilgilerButton.thickness = 0
        this.panelButtons.push(this.bilgilerButton)
        this.bilgilerButton.onPointerDownObservable.add(() => {
            this.createBilgilerMenu(parameters.highlightedMesh)
        })

        this.gorunumModuButton = new GUI.Button.CreateSimpleButton("gorunumModu", "O")
        this.gorunumModuButton.height = "60px"
        this.gorunumModuButton.color = "white"
        this.gorunumModuButton.thickness = 0
        this.panelButtons.push(this.gorunumModuButton)
        this.gorunumModuButton.onPointerDownObservable.add(() => {
            this.changeCameraMode()
        })

        // Menü butonları için ortak fonksiyon
        this.panelButtons.map(button => {
            button.onPointerDownObservable.add(() => {
                this.panelButtons.map(btn => btn.background = "#33334C")
                if (button != this.gorunumModuButton) {
                    button.background = "#222233"
                    this.contentPanel.width = "350px"
                }

            })
        })


        // Ana menü componentlerinin arayüze eklenmesi
        this.panel.addControl(this.genelButton)
        this.panel.addControl(this.urunlerButton)
        this.panel.addControl(this.bilgilerButton)
        this.panel.addControl(this.gorunumModuButton)
        this.advancedTexture.addControl(this.leftContainer)
        this.leftContainer.addControl(this.panel)
        this.leftContainer.addControl(this.contentPanel)

        this.marginBox = (height) => {
            let rect = new GUI.Rectangle("marginBox")
            rect.height = height
            rect.width = 1
            rect.color = "transperent"
            rect.thickness = 0
            return rect
        }

        this.changeCameraMode = () => {
            if (this.gorunumModuButton.children[0].text == "O") {    // ORTHOGRAPHIC MODE
                parameters.camera.position = new BABYLON.Vector3(0, parameters.groundHeigth * 2, 0)
                parameters.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
                // let distance = parameters.groundWidth * 2;
                let distance = parameters.groundWidth > parameters.groundHeigth ? parameters.groundWidth * 2 : parameters.groundHeigth * 2;
                let aspect = parameters.scene.getEngine().getRenderingCanvasClientRect().height / parameters.scene.getEngine().getRenderingCanvasClientRect().width;
                parameters.camera.orthoLeft = distance / 2;
                parameters.camera.orthoRight = -distance / 2;
                parameters.camera.orthoBottom = parameters.camera.orthoLeft * aspect;
                parameters.camera.orthoTop = parameters.camera.orthoRight * aspect;
                parameters.camera.detachControl(parameters.canvas)
                this.gorunumModuButton.children[0].text = "P"
            } else {    // PERSPECTIVE MODE 
                parameters.camera.attachControl(parameters.canvas, true);
                parameters.camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA
                parameters.camera.alpha = -Math.PI / 2
                this.gorunumModuButton.children[0].text = "O"
            }
            this.contentPanel.width = "0px"
        }

        // Ürün listesinin oluşturulması
        this.buildUrunList = (seciliUrunler, urunList, returnText) => {
            urunList.clearControls()
            let returnButton = new GUI.Button.CreateSimpleButton("returnButton", returnText + "  <")
            returnButton.width = 1
            returnButton.height = "40px"
            returnButton.onPointerDownObservable.add(() => {
                this.createUrunlerMenu()

            })
            urunList.addControl(returnButton)
            seciliUrunler.map(seciliUrun => {
                let urunBox = new GUI.Rectangle(seciliUrun.name)
                urunBox.paddingLeft = "10px"
                urunBox.paddingRight = "10px"
                urunBox.paddingTop = "10px"
                urunBox.width = 1
                urunBox.height = "100px"
                urunBox.thickness = 2
                urunBox.color = "white"

                let urunResim = new GUI.Button.CreateImageOnlyButton(seciliUrun.name + "Image", seciliUrun.image)
                urunResim.height = "100px"
                urunResim.width = "100px"
                urunResim.thickness = 0
                // urunResim.paddingLeft="10px"
                // urunResim.paddingTop="10px"
                // urunResim.paddingBottom="10px"
                urunResim.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                urunResim.onPointerDownObservable.add(() => {
                    Tools.pickFromMenu(seciliUrun.mesh)
                    this.contentPanel.width = 0
                    this.panelButtons.map(btn => btn.background = "#33334C")
                })

                let urunContent = new GUI.Rectangle(seciliUrun.name + "Content")
                urunContent.height = "100%"
                urunContent.width = "225px"
                urunContent.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT

                let urunTitle = new GUI.TextBlock(seciliUrun.name, seciliUrun.name)
                urunTitle.height = "20px"
                urunTitle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
                urunContent.addControl(urunTitle)

                urunBox.addControl(urunResim)
                urunBox.addControl(urunContent)
                urunList.addControl(urunBox)


            })
        }

        this.createHeader = (headerName) => {
            let header = new GUI.StackPanel("header")
            header.background = "#303030"
            header.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
            header.height = "60px"


            let headerText = new GUI.TextBlock("headerText", headerName)
            headerText.color = "white"
            headerText.width = "150px"

            let closeButton = new GUI.Button.CreateImageOnlyButton("btn1", "./icons/cross.svg")
            closeButton.width = "16px"
            closeButton.height = "20px"
            closeButton.verticalAlignment = GUI.Control._VERTICAL_ALIGNMENT_BOTTOM
            closeButton.horizontalAlignment = GUI.Control._HORIZONTAL_ALIGNMENT_RIGHT
            closeButton.color = "transparent"

            closeButton.onPointerDownObservable.add(() => {
                this.contentPanel.width = "0px"
                this.panelButtons.map(btn => btn.background = "#33334C")
                if (parameters.highlightedMesh) {
                    parameters.highlightedMesh.material.emissiveColor = new BABYLON.Color3.Black()
                    parameters.highlightedMesh = null
                }


            })
            header.addControl(headerText)
            header.addControl(closeButton)
            this.contentPanel.addControl(header)
        }

        // Ürünler ana menüsünün oluşturulması
        this.createUrunlerMenu = () => {
            this.contentPanel.clearControls()
            this.createHeader("Ürünler")
            // Menü İçeriği

            // Ürünler
            function marginBox(height) {
                let rect = new GUI.Rectangle("marginBox")
                rect.height = height
                rect.width = 1
                rect.color = "transperent"
                rect.thickness = 0
                return rect
            }



            this.contentPanel.addControl(marginBox("10px"))
            let rect = new GUI.Rectangle("rect1")
            rect.width = "80%"
            rect.height = "40px"
            rect.thickness = 2
            rect.color = "white"
            rect.cornerRadius = 10
            this.contentPanel.addControl(rect)


            let searchInput = new GUI.InputText("search")
            searchInput.width = 1
            searchInput.thickness = 0
            searchInput.height = "100%"
            searchInput.color = "white"
            searchInput.onTextChangedObservable.add(() => {
                if (searchInput.text == "") {
                    urunList.clearControls()
                    parameters.categories.map(category => {
                        let button = new GUI.Button.CreateSimpleButton(category, category)
                        button.width = "100%"
                        button.height = "40px"
                        button.onPointerDownObservable.add(() => {

                            let seciliUrunler = []
                            parameters.urunler.map(urun => {
                                if (urun.tags.filter(tag => tag == button.name).length > 0) {
                                    seciliUrunler.push(urun)
                                }
                            })
                            console.log(seciliUrunler)
                            this.buildUrunList(seciliUrunler, urunList, button.name)

                        })
                        urunList.addControl(button)
                    })

                } else {
                    let seciliUrunler = []
                    parameters.urunler.map(urun => {
                        if (urun.name.toLowerCase().search(searchInput.text.toLowerCase()) != -1
                            || urun.tags.filter(tag => tag.toLowerCase().search(searchInput.text.toLowerCase()) != -1).length > 0) {
                            seciliUrunler.push(urun)
                        }
                    })
                    this.buildUrunList(seciliUrunler, urunList, "Arama Sonuçları")
                }
            })

            rect.addControl(searchInput)

            this.contentPanel.addControl(marginBox("10px"))

            let urunList = new GUI.StackPanel("urunList")
            urunList.width = "100%"
            this.contentPanel.addControl(urunList)



            parameters.categories.map(category => {
                let button = new GUI.Button.CreateSimpleButton(category, category)
                button.width = 1
                button.height = "40px"
                button.onPointerDownObservable.add(() => {

                    let seciliUrunler = []
                    parameters.urunler.map(urun => {
                        if (urun.tags.filter(tag => tag == button.name).length > 0) {
                            seciliUrunler.push(urun)
                        }
                    })
                    this.buildUrunList(seciliUrunler, urunList, button.name)
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
        this.createBilgilerMenu = () => {
            this.contentPanel.clearControls()

            // Header Bölümü
            this.createHeader("Ürün Bilgileri")


            // İçerik Bölümü
            let bilgilerStack = new GUI.StackPanel("bilgiler")
            bilgilerStack.width = "100%"
            // bilgilerStack.top=-0.17
            bilgilerStack.height = "100%"
            this.contentPanel.addControl(bilgilerStack)

            if (!parameters.highlightedMesh) {

                let textMessage = new GUI.TextBlock("text", "Bilgilerini görüntülemek için bir ürün seçin.");
                textMessage.color = "#474747"
                textMessage.width = 1


                bilgilerStack.addControl(textMessage)
            }
            else {
                let urunDetayBox = new GUI.StackPanel("Urun Detay")
                urunDetayBox.width = "100%"
                urunDetayBox.height = "200px"
                urunDetayBox.paddingLeft = "10px"
                urunDetayBox.paddingRight = "10px"
                urunDetayBox.paddingTop = "10px"
                bilgilerStack.addControl(urunDetayBox)

                let titleBox = new GUI.Rectangle("titleBox")
                titleBox.height = "30px"
                titleBox.width = 1
                titleBox.paddingBottom = "10px"
                titleBox.thickness = 0
                urunDetayBox.addControl(titleBox)

                // Button Box
                let box = new GUI.Rectangle()
                box.height = "30px"
                box.width = "90px"
                box.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
                titleBox.addControl(box)
                box.thickness = 0

                //Taşıma arayüz üzerinden
                let move = new GUI.Button.CreateSimpleButton("move", "M")
                move.height = "30px"
                move.width = "30px"
                move.color = "black"
                move.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                move.onPointerDownObservable.add(() => {
                    parameters.placedMeshes = parameters.placedMeshes.filter(obj => obj != parameters.highlightedMesh)
                    Tools.pickFromMenu(parameters.highlightedMesh)
                    parameters.highlightedMesh.dispose()
                    parameters.highlightedMesh = null
                    this.contentPanel.width = "0px"
                })
                box.addControl(move)


                //Kopyalama
                let copy = new GUI.Button.CreateSimpleButton("copy", "C")
                copy.height = "30px"
                copy.width = "30px"
                copy.color = "black"
                copy.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
                copy.onPointerDownObservable.add(() => {
                    Tools.pickFromMenu(parameters.highlightedMesh)
                    parameters.highlightedMesh.material.emissiveColor = new BABYLON.Color3.Black()
                    parameters.highlightedMesh = null
                    this.contentPanel.width = "0px"
                })
                box.addControl(copy)

                //Silme
                let del = new GUI.Button.CreateSimpleButton("delete", "X")
                del.height = "30px"
                del.width = "30px"
                del.color = "black"
                del.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
                del.onPointerDownObservable.add(() => {
                    parameters.placedMeshes = parameters.placedMeshes.filter(obj => obj != parameters.highlightedMesh)
                    parameters.highlightedMesh.dispose()
                    parameters.highlightedMesh = null
                    this.createBilgilerMenu()
                })
                box.addControl(del)


                // Ürün adı


                let title = new GUI.TextBlock("title", parameters.highlightedMesh.name)
                title.height = 1
                title.width = "120px"
                title.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                title.onLinesReadyObservable.add(() => {
                    let textWidth = title.lines[0].width;
                    let ratioWidths = title.widthInPixels / textWidth;
                    if (ratioWidths < 1) {
                        title.fontSize = parseFloat(title.fontSizeInPixels) * ratioWidths + "px";
                    }
                })
                titleBox.addControl(title)

                //Ürün Ölçüleri
                let olculer = new GUI.Rectangle("olculer");
                olculer.width = "70px"
                olculer.height = "66px"
                olculer.paddingTop = "20px"
                olculer.thickness = 0
                olculer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
                urunDetayBox.addControl(olculer)

                let width = new GUI.TextBlock("width", "X:" + parameters.highlightedMesh.getBoundingInfo().boundingBox.extendSize.x * 2 / 10 + "cm");
                width.height = "12px";
                width.fontSize = "12px";
                width.width = "70px";
                width.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
                olculer.addControl(width)

                let height = new GUI.TextBlock("height", "Y:" + parameters.highlightedMesh.getBoundingInfo().boundingBox.extendSize.y * 2 / 10 + "cm");
                height.height = "12px";
                height.fontSize = "12px";
                height.width = "70px";
                height.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
                olculer.addControl(height)

                let depth = new GUI.TextBlock("depth", "Z:" + parameters.highlightedMesh.getBoundingInfo().boundingBox.extendSize.z * 2 / 10 + "cm");
                depth.height = "12px";
                depth.fontSize = "12px";
                depth.width = "70px";
                height.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
                olculer.addControl(depth)
            }
        }

        this.createGenelMenu = () => {
            this.contentPanel.clearControls()
            this.createHeader("Genel Menü")
            //Menü içeriği
            this.contentPanel.addControl(this.marginBox("10px"))
            let odaAyarlariBox = new GUI.Rectangle("odaAyarlariBox")
            odaAyarlariBox.width = "80%"
            odaAyarlariBox.height = "140px"
            odaAyarlariBox.thickness = 2
            odaAyarlariBox.color = "white"
            odaAyarlariBox.cornerRadius = 5
            this.contentPanel.addControl(odaAyarlariBox)

            let stackOdaAyarlari = new GUI.StackPanel("stackOdaAyarlari")
            odaAyarlariBox.addControl(stackOdaAyarlari)

            let title = new GUI.TextBlock("odaAyarlariTitle", "Oda ayarları")
            title.fontSize = "18px"
            // title.height="20px"
            // title.width = "150px"
            title.color = "black"
            title.resizeToFit = true
            title.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
            title.verticalAlignment = GUI.Control._VERTICAL_ALIGNMENT_TOP
            stackOdaAyarlari.addControl(title)
            stackOdaAyarlari.addControl(this.marginBox("10px"))



            let stackOdaOlculeri = new GUI.StackPanel("stackOdaOlculeri")
            stackOdaOlculeri.height = "20px"
            stackOdaOlculeri.isVertical = false
            stackOdaAyarlari.addControl(stackOdaOlculeri)
            stackOdaAyarlari.addControl(this.marginBox("10px"))


            let labelOdaOlculeri = new GUI.TextBlock("labelOdaOlculeri", "Oda ölçüleri:")
            labelOdaOlculeri.fontSize = "12px"
            labelOdaOlculeri.color = "black"
            labelOdaOlculeri.resizeToFit = true
            // labelOdaOlculeri.paddingLeft = "10px"
            stackOdaOlculeri.addControl(labelOdaOlculeri)

            let groundWidthInput = new GUI.InputText("groundWidthInput", parameters.groundWidth / 1000)
            groundWidthInput.width = "40px";
            groundWidthInput.height = "18px";
            groundWidthInput.color = "white"
            groundWidthInput.fontSize = "12px"
            groundWidthInput.paddingLeft = "5px"
            groundWidthInput.paddingRight = "5px"
            groundWidthInput.onFocusSelectAll=true
            stackOdaOlculeri.addControl(groundWidthInput)

            let groundHeigthInput = new GUI.InputText("groundHeigthInput", parameters.groundHeigth / 1000)
            groundHeigthInput.width = "40px";
            groundHeigthInput.height = "18px";
            groundHeigthInput.color = "white"
            groundHeigthInput.fontSize = "12px"
            groundHeigthInput.paddingLeft = "5px"
            groundHeigthInput.paddingRight = "5px"
            groundHeigthInput.onFocusSelectAll=true
            stackOdaOlculeri.addControl(groundHeigthInput)

            

            

            let boxWallScheme = new GUI.StackPanel("boxWallScheme")
            boxWallScheme.height = "40px"
            boxWallScheme.isVertical = false
            stackOdaAyarlari.addControl(boxWallScheme)
            stackOdaAyarlari.addControl(this.marginBox("10px"))

            let labelWallScheme = new GUI.TextBlock("labelOdaOlculeri", "Duvar tipi:")
            labelWallScheme.fontSize = "12px"
            labelWallScheme.color = "black"
            labelWallScheme.resizeToFit = true
            // labelOdaOlculeri.paddingLeft = "10px"
            boxWallScheme.addControl(labelWallScheme)

            let groupWallScheme = new GUI.RadioGroup("groupWallScheme");
            // boxWallScheme.addControl(groupWallScheme);

            var addRadio = function (text, parent, wallScheme,isChecked) {

                var button = new GUI.RadioButton();
                button.width = "12px";
                button.height = "12px";
                button.color = "white";
                button.background = "black";
                button.isChecked = isChecked;

                button.onIsCheckedChangedObservable.add(function (state) {
                    if (state) {
                        console.log(text);
                        parameters.selectedWallScheme = wallScheme;
                    }
                });

                var header = GUI.Control.AddHeader(button, text, "30px", { isHorizontal: true, controlFirst: true });
                header.height = "15px";
                header.fontSize = "12px"
                header.paddingLeft = "10px"

                parent.addControl(header);
            }

            addRadio("O", boxWallScheme, ["NORTH", "SOUTH", "WEST", "EAST"],true)
            addRadio("U", boxWallScheme, ["NORTH", "WEST", "EAST"])
            addRadio("L", boxWallScheme, ["NORTH", "EAST"])
            addRadio("J", boxWallScheme, ["NORTH", "WEST"])
            addRadio("_", boxWallScheme, ["NORTH"])



            let buttonSetRoom = new GUI.Button.CreateSimpleButton("buttonSetGroundSize", "KAYDET")
            buttonSetRoom.width = "65px";
            buttonSetRoom.height = "18px";
            buttonSetRoom.paddingLeft = "5px"
            // buttonSetRoom.paddingRight = "5px"
            buttonSetRoom.fontSize = "12px";
            buttonSetRoom.onPointerDownObservable.add(() => {
                parameters.groundWidth = groundWidthInput.text * 1000;
                parameters.groundHeigth = groundHeigthInput.text * 1000;
                parameters.ground.dispose()
                SceneBuilder.prepareGround()
                parameters.walls.map(wall => wall.dispose())
                parameters.walls = []
                parameters.selectedWallScheme.map(position => {
                    let wall = SceneBuilder.createWall(position, parameters.wallMaterial, position);
                    parameters.walls.push(wall);
                })
            })
            stackOdaAyarlari.addControl(buttonSetRoom)


        }


    }
}













