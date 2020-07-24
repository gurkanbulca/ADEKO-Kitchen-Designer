import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { parameters } from "./parameters.js"


// export class MyGUI {
//     constructor(urunler, camera, scene, canvas, pickFromMenu,objects) {
//         this.objects=objects
//         this.urunler = urunler
//         this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
//         this.leftContainer = new GUI.StackPanel();
//         this.leftContainer.background = "transparent";
//         this.leftContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
//         this.leftContainer.height = "100%"
//         this.leftContainer.width = "410px"

//         //Ana menü
//         this.panelButtons = []
//         this.panel = new GUI.StackPanel();
//         this.panel.background = "#33334C"
//         this.panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
//         this.panel.height = "100%"
//         this.panel.width = "60px"

//         this.contentPanel = new GUI.StackPanel("contentPanel")
//         this.contentPanel.background = "#e3e3e3"
//         this.contentPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
//         this.contentPanel.height = "100%"
//         this.contentPanel.width = "0px"

//         // Menü Butonları
//         this.genelButton = new GUI.Button.CreateSimpleButton("Genel Menü", "G")
//         this.genelButton.height = "60px"
//         this.genelButton.color = "white"
//         this.genelButton.thickness = 0
//         this.genelButton.background = "#33334C"
//         this.panelButtons.push(this.genelButton)
//         this.genelButton.onPointerDownObservable.add(() => {

//         })

//         this.urunlerButton = new GUI.Button.CreateSimpleButton("Ürünler", "Ü")
//         this.urunlerButton.height = "60px"
//         this.urunlerButton.color = "white"
//         this.urunlerButton.thickness = 0
//         this.panelButtons.push(this.urunlerButton)
//         this.urunlerButton.onPointerDownObservable.add(() => {
//             this.createUrunlerMenu()
//         })

//         this.bilgilerButton = new GUI.Button.CreateSimpleButton("Bilgiler", "İ")
//         this.bilgilerButton.height = "60px"
//         this.bilgilerButton.color = "white"
//         this.bilgilerButton.thickness = 0
//         this.panelButtons.push(this.bilgilerButton)
//         this.bilgilerButton.onPointerDownObservable.add(() => {
//             this.createBilgilerMenu(this.highlightedMesh)
//         })

//         this.gorunumModuButton = new GUI.Button.CreateSimpleButton("gorunumModu", "O")
//         this.gorunumModuButton.height = "60px"
//         this.gorunumModuButton.color = "white"
//         this.gorunumModuButton.thickness = 0
//         this.panelButtons.push(this.gorunumModuButton)
//         this.gorunumModuButton.onPointerDownObservable.add(() => {
//             if (this.gorunumModuButton.children[0].text == "O") {    // ORTHOGRAPHIC MODE
//                 camera.position = new BABYLON.Vector3(0, parameters.floorsize * 2, 0)
//                 camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
//                 this.distance = parameters.floorsize * 2;
//                 this.aspect = scene.getEngine().getRenderingCanvasClientRect().height / scene.getEngine().getRenderingCanvasClientRect().width;
//                 camera.orthoLeft = -this.distance / 2;
//                 camera.orthoRight = this.distance / 2;
//                 camera.orthoBottom = camera.orthoLeft * this.aspect;
//                 camera.orthoTop = camera.orthoRight * this.aspect;
//                 camera.detachControl(canvas)
//                 this.gorunumModuButton.children[0].text = "P"
//             } else {    // PERSPECTIVE MODE 
//                 camera.attachControl(canvas, true);
//                 camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA
//                 this.gorunumModuButton.children[0].text = "O"
//             }
//             this.contentPanel.width = "0px"
//         })

//         // Menü butonları için ortak fonksiyon
//         this.panelButtons.map(button => {
//             button.onPointerDownObservable.add(() => {
//                 console.log(this.panelButtons);
//                 this.panelButtons.map(btn => btn.background = "#33334C")
//                 if (button != this.gorunumModuButton) {
//                     button.background = "#222233"
//                     this.contentPanel.width = "350px"
//                 }

//             })
//         })


//         // Ana menü componentlerinin arayüze eklenmesi
//         this.panel.addControl(this.genelButton)
//         this.panel.addControl(this.urunlerButton)
//         this.panel.addControl(this.bilgilerButton)
//         this.panel.addControl(this.gorunumModuButton)
//         this.advancedTexture.addControl(this.leftContainer)
//         this.leftContainer.addControl(this.panel)
//         this.leftContainer.addControl(this.contentPanel)

//         // Ürün listesinin oluşturulması
//         this.buildUrunList = (seciliUrunler, urunList, returnText) => {
//             urunList.clearControls()
//             var returnButton = new GUI.Button.CreateSimpleButton("returnButton", returnText + "  <")
//             returnButton.width = 1
//             returnButton.height = "40px"
//             returnButton.onPointerDownObservable.add(() => {
//                 createUrunlerMenu()

//             })
//             urunList.addControl(returnButton)
//             seciliUrunler.map(seciliUrun => {
//                 var urunBox = new GUI.Rectangle(seciliUrun.name)
//                 urunBox.paddingLeft = "10px"
//                 urunBox.paddingRight = "10px"
//                 urunBox.paddingTop = "10px"
//                 urunBox.width = 1
//                 urunBox.height = "100px"
//                 urunBox.thickness = 2
//                 urunBox.color = "white"

//                 var urunResim = new GUI.Button.CreateImageOnlyButton(seciliUrun.name + "Image", seciliUrun.image)
//                 urunResim.height = "100px"
//                 urunResim.width = "100px"
//                 urunResim.thickness = 0
//                 // urunResim.paddingLeft="10px"
//                 // urunResim.paddingTop="10px"
//                 // urunResim.paddingBottom="10px"
//                 urunResim.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
//                 urunResim.onPointerDownObservable.add(() => {
//                     pickFromMenu(seciliUrun.mesh)
//                     this.contentPanel.width = 0
//                     this.panelButtons.map(btn => btn.background = "#33334C")
//                 })

//                 var urunContent = new GUI.Rectangle(seciliUrun.name + "Content")
//                 urunContent.height = "100%"
//                 urunContent.width = "225px"
//                 urunContent.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT

//                 var urunTitle = new GUI.TextBlock(seciliUrun.name, seciliUrun.name)
//                 urunTitle.height = "20px"
//                 urunTitle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
//                 urunContent.addControl(urunTitle)

//                 urunBox.addControl(urunResim)
//                 urunBox.addControl(urunContent)
//                 urunList.addControl(urunBox)


//             })
//         }

//         this.createHeader = (headerName) => {
//             var header = new GUI.StackPanel("header")
//             header.background = "#303030"
//             header.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
//             header.height = "60px"


//             var headerText = new GUI.TextBlock("headerText", headerName)
//             headerText.color = "white"
//             headerText.width = "150px"

//             var closeButton = new GUI.Button.CreateImageOnlyButton("btn1", "./icons/cross.svg")
//             closeButton.width = "16px"
//             closeButton.height = "20px"
//             closeButton.verticalAlignment = GUI.Control._VERTICAL_ALIGNMENT_BOTTOM
//             closeButton.horizontalAlignment = GUI.Control._HORIZONTAL_ALIGNMENT_RIGHT
//             closeButton.color = "transparent"

//             closeButton.onPointerDownObservable.add(() => {
//                 this.contentPanel.width = "0px"
//                 panelButtons.map(btn => btn.background = "#33334C")
//                 if (highlightedMesh) {
//                     highlightedMesh.material.emissiveColor = new BABYLON.Color3.Black()
//                     highlightedMesh = null
//                 }


//             })
//             header.addControl(headerText)
//             header.addControl(closeButton)
//             this.contentPanel.addControl(header)
//         }

//         // Ürünler ana menüsünün oluşturulması
//         this.createUrunlerMenu = () => {
//             this.contentPanel.clearControls()
//             this.createHeader("Ürünler")
//             // Menü İçeriği

//             // Ürünler
//             function marginBox(height) {
//                 var rect = new GUI.Rectangle("marginBox")
//                 rect.height = height
//                 rect.width = 1
//                 rect.color = "transperent"
//                 rect.thickness = 0
//                 return rect
//             }



//             this.contentPanel.addControl(marginBox("10px"))
//             var rect = new GUI.Rectangle("rect1")
//             rect.width = "80%"
//             rect.height = "40px"
//             rect.thickness = 2
//             rect.color = "white"
//             rect.cornerRadius = 10
//             this.contentPanel.addControl(rect)


//             var searchInput = new GUI.InputText("search")
//             searchInput.width = 1
//             searchInput.thickness = 0
//             searchInput.height = "100%"
//             searchInput.color = "white"
//             searchInput.onTextChangedObservable.add(() => {
//                 if (searchInput.text == "") {
//                     this.urunList.clearControls()
//                     parameters.categories.map(category => {
//                         var button = new GUI.Button.CreateSimpleButton(category, category)
//                         button.width = "100%"
//                         button.height = "40px"
//                         button.onPointerDownObservable.add(() => {

//                             var seciliUrunler = []
//                             this.urunler.map(urun => {
//                                 if (urun.tags.filter(tag => tag == button.name).length > 0) {
//                                     seciliUrunler.push(urun)
//                                 }
//                             })
//                             this.buildUrunList(seciliUrunler, this.urunList, button.name)
//                             // switch (button.name) {
//                             //     case "Alt Dolap":
//                             //         console.log("alt dolap");


//                             //         break;
//                             //     case "Üst Dolap":
//                             //         console.log("üst dolap");
//                             //         break;
//                             //     case "Beyaz Eşya":
//                             //         console.log("Beyaz Eşya");
//                             //         break;

//                             // }

//                         })
//                         urunList.addControl(button)
//                     })

//                 } else {
//                     var seciliUrunler = []
//                     this.urunler.map(urun => {
//                         if (urun.name.toLowerCase().search(searchInput.text.toLowerCase()) != -1
//                             || urun.tags.filter(tag => tag.toLowerCase().search(searchInput.text.toLowerCase()) != -1).length > 0) {
//                             seciliUrunler.push(urun)
//                         }
//                     })
//                     this.buildUrunList(seciliUrunler, urunList, "Arama Sonuçları")
//                 }
//             })

//             rect.addControl(searchInput)

//             this.contentPanel.addControl(marginBox("10px"))

//             var urunList = new GUI.StackPanel("urunList")
//             urunList.width = "100%"
//             this.contentPanel.addControl(urunList)



//             parameters.categories.map(category => {
//                 var button = new GUI.Button.CreateSimpleButton(category, category)
//                 button.width = 1
//                 button.height = "40px"
//                 button.onPointerDownObservable.add(() => {

//                     var seciliUrunler = []
//                     seciliUrunler = []
//                     this.urunler.map(urun => {
//                         if (urun.tags.filter(tag => tag == button.name).length > 0) {
//                             seciliUrunler.push(urun)
//                         }
//                     })
//                     this.buildUrunList(seciliUrunler, urunList, button.name)
//                     // switch (button.name) {
//                     //     case "Alt Dolap":
//                     //         console.log("alt dolap");


//                     //         break;
//                     //     case "Üst Dolap":
//                     //         console.log("üst dolap");
//                     //         break;
//                     //     case "Beyaz Eşya":
//                     //         console.log("Beyaz Eşya");
//                     //         break;

//                     // }

//                 })
//                 urunList.addControl(button)
//             })
//         }
//         // Ürün Bilgileri
//         this.createBilgilerMenu = (highlightedMesh) => {
//             this.contentPanel.clearControls()

//             // Header Bölümü
//             this.createHeader("Ürün Bilgileri")


//             // İçerik Bölümü
//             var bilgilerStack = new GUI.StackPanel("bilgiler")
//             bilgilerStack.width = "100%"
//             // bilgilerStack.top=-0.17
//             bilgilerStack.height = "100%"
//             this.contentPanel.addControl(bilgilerStack)

//             if (!highlightedMesh) {

//                 var textMessage = new GUI.TextBlock("text", "Bilgilerini görüntülemek için bir ürün seçin.");
//                 textMessage.color = "#474747"
//                 textMessage.width = 1


//                 bilgilerStack.addControl(textMessage)
//             }
//             else {
//                 var urunDetayBox = new GUI.StackPanel("Urun Detay")
//                 urunDetayBox.width = "100%"
//                 urunDetayBox.height = "200px"
//                 urunDetayBox.paddingLeft = "10px"
//                 urunDetayBox.paddingRight = "10px"
//                 urunDetayBox.paddingTop = "10px"
//                 bilgilerStack.addControl(urunDetayBox)

//                 var titleBox = new GUI.Rectangle("titleBox")
//                 titleBox.height = "30px"
//                 titleBox.width = 1
//                 titleBox.paddingBottom = "10px"
//                 titleBox.thickness = 0
//                 urunDetayBox.addControl(titleBox)

//                 // Button Box
//                 var box = new GUI.Rectangle()
//                 box.height = "30px"
//                 box.width = "90px"
//                 box.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
//                 titleBox.addControl(box)
//                 box.thickness = 0

//                 //Taşıma arayüz üzerinden
//                 var move = new GUI.Button.CreateSimpleButton("move", "M")
//                 move.height = "30px"
//                 move.width = "30px"
//                 move.color = "black"
//                 move.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
//                 move.onPointerDownObservable.add(() => {
//                     this.objects = this.objects.filter(obj => obj != highlightedMesh)
//                     pickFromMenu(highlightedMesh)
//                     highlightedMesh.dispose()
//                     highlightedMesh = null
//                     this.contentPanel.width = "0px"
//                 })
//                 box.addControl(move)


//                 //Kopyalama
//                 var copy = new GUI.Button.CreateSimpleButton("copy", "C")
//                 copy.height = "30px"
//                 copy.width = "30px"
//                 copy.color = "black"
//                 copy.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
//                 copy.onPointerDownObservable.add(() => {
//                     pickFromMenu(highlightedMesh)
//                     highlightedMesh.material.emissiveColor = new BABYLON.Color3.Black()
//                     highlightedMesh = null
//                     this.contentPanel.width = "0px"
//                 })
//                 box.addControl(copy)

//                 //Silme
//                 var del = new GUI.Button.CreateSimpleButton("delete", "X")
//                 del.height = "30px"
//                 del.width = "30px"
//                 del.color = "black"
//                 del.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
//                 del.onPointerDownObservable.add(() => {
//                     this.objects = this.objects.filter(obj => obj != highlightedMesh)
//                     highlightedMesh.dispose()
//                     highlightedMesh = null
//                     createBilgilerMenu(this.highlightedMesh)
//                 })
//                 box.addControl(del)


//                 // Ürün adı


//                 var title = new GUI.TextBlock("title", highlightedMesh.name)
//                 title.height = 1
//                 title.width = "120px"
//                 title.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
//                 title.onLinesReadyObservable.add(() => {
//                     var textWidth = title.lines[0].width;
//                     var ratioWidths = title.widthInPixels / textWidth;
//                     if (ratioWidths < 1) {
//                         title.fontSize = parseFloat(title.fontSizeInPixels) * ratioWidths + "px";
//                     }
//                 })
//                 titleBox.addControl(title)

//                 //Ürün Ölçüleri
//                 var olculer = new GUI.Rectangle("olculer");
//                 olculer.width = "70px"
//                 olculer.height = "66px"
//                 olculer.paddingTop = "20px"
//                 olculer.thickness = 0
//                 olculer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
//                 urunDetayBox.addControl(olculer)

//                 var width = new GUI.TextBlock("width", "X:" + highlightedMesh.getBoundingInfo().boundingBox.extendSize.x * 2 / 10 + "cm");
//                 width.height = "12px";
//                 width.fontSize = "12px";
//                 width.width = "70px";
//                 width.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
//                 olculer.addControl(width)

//                 var height = new GUI.TextBlock("height", "Y:" + highlightedMesh.getBoundingInfo().boundingBox.extendSize.y * 2 / 10 + "cm");
//                 height.height = "12px";
//                 height.fontSize = "12px";
//                 height.width = "70px";
//                 height.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
//                 olculer.addControl(height)

//                 var depth = new GUI.TextBlock("depth", "Z:" + highlightedMesh.getBoundingInfo().boundingBox.extendSize.z * 2 / 10 + "cm");
//                 depth.height = "12px";
//                 depth.fontSize = "12px";
//                 depth.width = "70px";
//                 height.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
//                 olculer.addControl(depth)
//             }
//         }
//     }
// }













